import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { QBO_STATE_COOKIE } from "../connect/route";

export const runtime = "nodejs";

/**
 * OAuth2 callback for connecting a QuickBooks company.
 *
 * Used for the production "Connect to QuickBooks" flow: Intuit redirects here
 * with `code` and `realmId`. We exchange the code for tokens and show the
 * refresh token + realm id once so they can be stored as env vars
 * (QBO_REFRESH_TOKEN, QBO_REALM_ID). For sandbox testing you can instead grab
 * these from Intuit's OAuth 2.0 Playground.
 *
 * For a fully automated production setup, persist the refresh token to durable
 * storage here instead of displaying it.
 */
const TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const realmId = searchParams.get("realmId");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
  if (!code || !realmId) {
    return NextResponse.json({ ok: false, error: "Missing code or realmId" }, { status: 400 });
  }

  // CSRF protection: the returned `state` must match the cookie set in /connect.
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(QBO_STATE_COOKIE)?.value;
  if (!state || !expectedState || state !== expectedState) {
    return NextResponse.json({ ok: false, error: "Invalid state (possible CSRF)" }, { status: 400 });
  }

  const clientId = process.env.QBO_CLIENT_ID ?? "";
  const clientSecret = process.env.QBO_CLIENT_SECRET ?? "";
  const redirectUri = process.env.QBO_REDIRECT_URI ?? "";
  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { ok: false, error: "Server missing QBO_CLIENT_ID / QBO_CLIENT_SECRET / QBO_REDIRECT_URI" },
      { status: 500 }
    );
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: await res.text() }, { status: 502 });
  }

  const tokens = (await res.json()) as { refresh_token: string; access_token: string };

  // One-time display so the operator can copy them into env. Do NOT log tokens
  // in production; swap this for durable storage of the refresh token.
  const response = NextResponse.json({
    ok: true,
    message: "Connected. Copy these into your environment, then remove this display.",
    QBO_REALM_ID: realmId,
    QBO_REFRESH_TOKEN: tokens.refresh_token,
  });
  response.cookies.delete(QBO_STATE_COOKIE);
  return response;
}
