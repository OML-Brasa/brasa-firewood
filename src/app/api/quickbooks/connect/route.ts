import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Starts the "Connect to QuickBooks" OAuth2 flow.
 *
 * Redirects the browser to Intuit's authorization screen and sets a signed,
 * httpOnly `state` cookie. The callback verifies the returned `state` against
 * this cookie to protect against CSRF. After the user authorizes a company,
 * Intuit redirects back to QBO_REDIRECT_URI (/api/quickbooks/callback) with a
 * code + realmId.
 *
 * Used as the app's Connect/Reconnect URL in the Intuit Developer portal.
 */
const AUTH_URL = "https://appcenter.intuit.com/connect/oauth2";
const SCOPE = "com.intuit.quickbooks.accounting";
export const QBO_STATE_COOKIE = "qbo_oauth_state";

export async function GET() {
  const clientId = process.env.QBO_CLIENT_ID ?? "";
  const redirectUri = process.env.QBO_REDIRECT_URI ?? "";
  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { ok: false, error: "Server missing QBO_CLIENT_ID / QBO_REDIRECT_URI" },
      { status: 500 }
    );
  }

  const state = randomUUID();
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    scope: SCOPE,
    redirect_uri: redirectUri,
    state,
  });

  const res = NextResponse.redirect(`${AUTH_URL}?${params.toString()}`);
  res.cookies.set(QBO_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes to complete the flow
  });
  return res;
}
