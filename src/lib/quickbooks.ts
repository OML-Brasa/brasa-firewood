/**
 * QuickBooks Online (Accounting API) helper.
 *
 * Flow: the website checkout posts an order to /api/quote, which calls
 * `createEstimateForOrder` here to create (or reuse) a Customer and create an
 * Estimate in QuickBooks.
 *
 * Auth: OAuth2. We hold a long-lived refresh token (from the OAuth Playground
 * for sandbox, or the /api/quickbooks/connect flow for production) and exchange
 * it for a short-lived access token on each server call.
 *
 * Env vars (server-only — never NEXT_PUBLIC):
 *   QBO_CLIENT_ID, QBO_CLIENT_SECRET, QBO_REFRESH_TOKEN, QBO_REALM_ID,
 *   QBO_ENVIRONMENT = "sandbox" | "production"
 *
 * NOTE ON REFRESH-TOKEN ROTATION: Intuit returns a new refresh token on each
 * refresh (the old one keeps working for 24h) and the token expires after ~100
 * days of inactivity. For production we must persist the latest refresh token
 * (see `persistRefreshToken` below) rather than relying only on the env var.
 */

const TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";

export type QboOrder = {
  orderNo?: string;
  email: string;
  name: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phone?: string;
  };
  promoCode?: string;
  items: { name: string; qty: number; price: number }[];
  subtotal?: number;
  discount?: number;
  total?: number;
};

const env = {
  clientId: process.env.QBO_CLIENT_ID ?? "",
  clientSecret: process.env.QBO_CLIENT_SECRET ?? "",
  refreshToken: process.env.QBO_REFRESH_TOKEN ?? "",
  realmId: process.env.QBO_REALM_ID ?? "",
  environment: (process.env.QBO_ENVIRONMENT ?? "sandbox").toLowerCase(),
};

export const isQboConfigured = () =>
  Boolean(env.clientId && env.clientSecret && env.refreshToken && env.realmId);

const apiBase = () =>
  env.environment === "production"
    ? "https://quickbooks.api.intuit.com"
    : "https://sandbox-quickbooks.api.intuit.com";

/**
 * Hook for persisting a rotated refresh token. For sandbox/testing this is a
 * no-op (we keep using the env var). For production, implement storage here
 * (e.g. a Sanity doc or Vercel KV) so the connection survives rotation.
 */
async function persistRefreshToken(_newRefreshToken: string): Promise<void> {
  // TODO(production): persist `_newRefreshToken` to durable storage.
}

/** Exchange the refresh token for a fresh access token. */
async function getAccessToken(): Promise<string> {
  const basic = Buffer.from(`${env.clientId}:${env.clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: env.refreshToken,
    }),
  });
  if (!res.ok) {
    throw new Error(`QBO token refresh failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { access_token: string; refresh_token?: string };
  if (json.refresh_token && json.refresh_token !== env.refreshToken) {
    await persistRefreshToken(json.refresh_token);
  }
  return json.access_token;
}

/** Low-level call to the QBO company endpoint. */
async function qboFetch<T>(
  accessToken: string,
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${apiBase()}/v3/company/${env.realmId}/${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`QBO ${path} failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as T;
}

/** Escape a value for use inside a GROQ-like QBO query string literal. */
const q = (s: string) => s.replace(/'/g, "\\'");

/** Find a customer by email, or create one. Returns the QBO Customer id. */
async function findOrCreateCustomer(accessToken: string, order: QboOrder): Promise<string> {
  const query = `select Id from Customer where PrimaryEmailAddr = '${q(order.email)}'`;
  const found = await qboFetch<{ QueryResponse?: { Customer?: { Id: string }[] } }>(
    accessToken,
    `query?query=${encodeURIComponent(query)}&minorversion=73`
  );
  const existing = found.QueryResponse?.Customer?.[0]?.Id;
  if (existing) return existing;

  const a = order.address ?? {};
  const body = {
    DisplayName: order.name || order.email,
    PrimaryEmailAddr: { Address: order.email },
    ...(a.phone ? { PrimaryPhone: { FreeFormNumber: a.phone } } : {}),
    ...(a.line1
      ? {
          BillAddr: {
            Line1: a.line1,
            ...(a.line2 ? { Line2: a.line2 } : {}),
            City: a.city,
            CountrySubDivisionCode: a.state,
            PostalCode: a.zip,
            // NOTE: QBO rejects `Country` on PhysicalAddress here (error 2010),
            // so it is intentionally omitted.
          },
        }
      : {}),
  };
  const created = await qboFetch<{ Customer: { Id: string } }>(accessToken, "customer?minorversion=73", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return created.Customer.Id;
}

/**
 * Create an Estimate for the order. Line items are recorded as description-only
 * lines (no Item mapping required), so this works without pre-seeding a QBO item
 * list. If/when the client wants real SKUs, swap these for SalesItemLineDetail
 * with an ItemRef.
 */
export async function createEstimateForOrder(
  order: QboOrder
): Promise<{ estimateId: string; docNumber?: string }> {
  if (!isQboConfigured()) throw new Error("QuickBooks is not configured");
  const accessToken = await getAccessToken();
  const customerId = await findOrCreateCustomer(accessToken, order);

  const lines: Record<string, unknown>[] = order.items.map((it) => ({
    DetailType: "SalesItemLineDetail",
    Amount: Number((it.price * it.qty).toFixed(2)),
    Description: `${it.name}${it.qty > 1 ? ` (x${it.qty})` : ""}`,
    SalesItemLineDetail: {
      Qty: it.qty,
      UnitPrice: it.price,
    },
  }));

  if (order.discount && order.discount > 0) {
    lines.push({
      DetailType: "DiscountLineDetail",
      Amount: Number(order.discount.toFixed(2)),
      Description: order.promoCode ? `Discount (${order.promoCode})` : "Discount",
      DiscountLineDetail: { PercentBased: false },
    });
  }

  const memoParts = [
    order.orderNo ? `Website order ${order.orderNo}` : "Website order",
    "Shipping quoted separately.",
  ];

  const body = {
    CustomerRef: { value: customerId },
    Line: lines,
    CustomerMemo: { value: memoParts.join(" — ") },
  };

  const created = await qboFetch<{ Estimate: { Id: string; DocNumber?: string } }>(
    accessToken,
    "estimate?minorversion=73",
    { method: "POST", body: JSON.stringify(body) }
  );
  return { estimateId: created.Estimate.Id, docNumber: created.Estimate.DocNumber };
}
