import crypto from "node:crypto";

/**
 * Minimal Mailchimp Marketing API helper for the newsletter signup.
 *
 * Configure with env vars (see .env.local / Vercel):
 *   MAILCHIMP_API_KEY       e.g. "abc123...-us21"  (server prefix is the part after the dash)
 *   MAILCHIMP_AUDIENCE_ID   the Audience/List ID (Audience → Settings → "Audience ID")
 *   MAILCHIMP_DOUBLE_OPTIN  optional; "true" sends a confirmation email (double opt-in)
 *
 * Until the first two are set, isMailchimpReady() is false and the API route
 * falls back gracefully so the form still works.
 */

const API_KEY = process.env.MAILCHIMP_API_KEY ?? "";
const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID ?? "";
const DOUBLE_OPTIN = process.env.MAILCHIMP_DOUBLE_OPTIN === "true";

/** The data-center prefix (e.g. "us21") lives after the dash in the API key. */
function serverPrefix(): string {
  return API_KEY.split("-")[1] ?? "";
}

export function isMailchimpReady(): boolean {
  return Boolean(API_KEY && AUDIENCE_ID && serverPrefix());
}

export type SubscribeResult =
  | { ok: true; status: "subscribed" | "pending" | "existing" }
  | { ok: false; error: string };

/**
 * Add (or upsert) an email into the configured Mailchimp audience.
 *
 * Uses PUT with `status_if_new` so re-submitting an existing address is a
 * harmless no-op and never flips an unsubscribed contact back on.
 */
export async function subscribeToAudience(
  email: string,
  locale?: string,
): Promise<SubscribeResult> {
  const address = email.trim().toLowerCase();
  if (!address || !address.includes("@")) {
    return { ok: false, error: "invalid-email" };
  }

  const subscriberHash = crypto.createHash("md5").update(address).digest("hex");
  const url = `https://${serverPrefix()}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/${subscriberHash}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: address,
      status_if_new: DOUBLE_OPTIN ? "pending" : "subscribed",
      ...(locale ? { language: locale } : {}),
    }),
  });

  if (res.ok) {
    const data = (await res.json()) as { status?: string };
    const status =
      data.status === "pending"
        ? "pending"
        : data.status === "subscribed"
          ? "subscribed"
          : "existing";
    return { ok: true, status };
  }

  // Mailchimp returns 400 with title "Member Exists" when a known contact is
  // re-submitted via POST; with PUT this shouldn't happen, but treat it as success.
  const detail = (await res.json().catch(() => ({}))) as { title?: string };
  if (detail.title === "Member Exists") {
    return { ok: true, status: "existing" };
  }

  console.error("[mailchimp] subscribe failed", res.status, detail.title);
  return { ok: false, error: detail.title ?? `http-${res.status}` };
}
