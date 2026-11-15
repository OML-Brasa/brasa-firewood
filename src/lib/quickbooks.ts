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
 * days of inactivity. The connection (refresh token + realm id) is persisted via
 * `quickbooksStore` (Vercel KV in production), so a rotated token is saved and
 * the connection survives.
 */

import { getStoredConnection, saveRefreshToken } from "@/lib/quickbooksStore";

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
  environment: (process.env.QBO_ENVIRONMENT ?? "sandbox").toLowerCase(),
};

/** True when the app has API credentials AND a stored company connection. */
export async function isQboReady(): Promise<boolean> {
  if (!env.clientId || !env.clientSecret) return false;
  return (await getStoredConnection()) !== null;
}

const apiBase = () =>
  env.environment === "production"
    ? "https://quickbooks.api.intuit.com"
    : "https://sandbox-quickbooks.api.intuit.com";

/** Exchange a refresh token for a fresh access token, persisting rotation. */
async function getAccessToken(refreshToken: string): Promise<string> {
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
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) {
    throw new Error(`QBO token refresh failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { access_token: string; refresh_token?: string };
  if (json.refresh_token && json.refresh_token !== refreshToken) {
    await saveRefreshToken(json.refresh_token);
  }
  return json.access_token;
}

/** Low-level call to the QBO company endpoint. */
async function qboFetch<T>(
  accessToken: string,
  realmId: string,
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${apiBase()}/v3/company/${realmId}/${path}`;
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
    // Capture intuit_tid (transaction id) from the response headers — Intuit
    // support uses it to trace a failed request.
    const tid = res.headers.get("intuit_tid") ?? "n/a";
    throw new Error(`QBO ${path} failed: ${res.status} (intuit_tid: ${tid}) ${await res.text()}`);
  }
  return (await res.json()) as T;
}

/** Escape a value for use inside a GROQ-like QBO query string literal. */
const q = (s: string) => s.replace(/'/g, "\\'");

/** Find a customer by email, or create one. Returns the QBO Customer id. */
async function findOrCreateCustomer(accessToken: string, realmId: string, order: QboOrder): Promise<string> {
  const query = `select Id from Customer where PrimaryEmailAddr = '${q(order.email)}'`;
  const found = await qboFetch<{ QueryResponse?: { Customer?: { Id: string }[] } }>(
    accessToken,
    realmId,
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
  const created = await qboFetch<{ Customer: { Id: string } }>(accessToken, realmId, "customer?minorversion=73", {
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
  if (!env.clientId || !env.clientSecret) throw new Error("QuickBooks is not configured");
  const conn = await getStoredConnection();
  if (!conn) throw new Error("QuickBooks is not connected");
  const accessToken = await getAccessToken(conn.refreshToken);
  const { realmId } = conn;
  const customerId = await findOrCreateCustomer(accessToken, realmId, order);

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
    realmId,
    "estimate?minorversion=73",
    { method: "POST", body: JSON.stringify(body) }
  );
  return { estimateId: created.Estimate.Id, docNumber: created.Estimate.DocNumber };
}
