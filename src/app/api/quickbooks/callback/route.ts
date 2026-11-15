import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { isKvConfigured, saveConnection } from "@/lib/quickbooksStore";

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

  // Persist the connection (refresh token + realm). No token is ever shown to
  // the user. If KV isn't configured, saveConnection warns and the token is not
  // persisted — so Vercel KV must be provisioned before connecting in production.
  await saveConnection({ refreshToken: tokens.refresh_token, realmId });

  const persisted = isKvConfigured();
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>QuickBooks Connected — Brasa</title>
<style>
  body { font-family: -apple-system, "Helvetica Neue", Arial, sans-serif; background:#f7f4ed; color:#211f1d; margin:0; display:flex; min-height:100vh; align-items:center; justify-content:center; }
  .card { background:#fff; border:1px solid #e4dccd; border-radius:12px; padding:40px 36px; max-width:460px; text-align:center; box-shadow:0 8px 30px rgba(33,31,29,.06); }
  .mark { width:56px; height:56px; border-radius:50%; background:#e7f5ec; color:#2f7d4f; display:flex; align-items:center; justify-content:center; margin:0 auto 18px; font-size:30px; }
  h1 { font-size:22px; margin:0 0 8px; }
  p { color:#55514c; line-height:1.55; font-size:15px; margin:0; }
  .warn { margin-top:16px; color:#934628; font-size:13px; }
</style></head>
<body><div class="card">
  <div class="mark">&#10003;</div>
  <h1>QuickBooks connected</h1>
  <p>Your Brasa website is now linked to QuickBooks Online. New quote requests from the site will create an estimate in your account automatically. You can close this page.</p>
  ${persisted ? "" : '<p class="warn">Note: token storage is not configured, so this connection may not persist. Contact your developer.</p>'}
</div></body></html>`;

  const response = new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
  response.cookies.delete(QBO_STATE_COOKIE);
  return response;
}
