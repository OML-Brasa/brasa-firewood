import { NextResponse } from "next/server";

import { clearConnection, getStoredConnection } from "@/lib/quickbooksStore";

export const runtime = "nodejs";

/**
 * Disconnect / revoke the QuickBooks connection.
 *
 * Revokes the stored refresh token with Intuit. Used as the app's Disconnect
 * URL in the Intuit Developer portal. After revoking, the integration stops
 * creating estimates until it is reconnected (/api/quickbooks/connect).
 */
const REVOKE_URL = "https://developer.api.intuit.com/v2/oauth2/tokens/revoke";

export async function GET() {
  const clientId = process.env.QBO_CLIENT_ID ?? "";
  const clientSecret = process.env.QBO_CLIENT_SECRET ?? "";
  const conn = await getStoredConnection();

  if (!clientId || !clientSecret || !conn) {
    return NextResponse.json(
      { ok: false, error: "QuickBooks is not connected" },
      { status: 400 }
    );
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(REVOKE_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ token: conn.refreshToken }),
  });

  if (!res.ok && res.status !== 200) {
    return NextResponse.json({ ok: false, error: await res.text() }, { status: 502 });
  }

  await clearConnection();
  return NextResponse.json({ ok: true, message: "QuickBooks disconnected." });
}
