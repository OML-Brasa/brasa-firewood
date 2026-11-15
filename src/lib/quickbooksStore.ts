import { Redis } from "@upstash/redis";

/**
 * Durable storage for the QuickBooks connection (the rotating refresh token +
 * the company realm id).
 *
 * Uses Upstash Redis / Vercel KV when its env vars are present; otherwise falls
 * back to the QBO_REFRESH_TOKEN / QBO_REALM_ID env vars (fine for local and
 * sandbox testing — production provisions KV so the rotating token persists).
 */

export type QboConnection = { refreshToken: string; realmId: string };

const KEY = "qbo:connection";

const kvUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
const kvToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

export const isKvConfigured = () => Boolean(kvUrl && kvToken);

let client: Redis | null = null;
function redis(): Redis {
  if (!client) client = new Redis({ url: kvUrl, token: kvToken });
  return client;
}

/** Read the current connection (KV first, then env fallback). */
export async function getStoredConnection(): Promise<QboConnection | null> {
  if (isKvConfigured()) {
    try {
      const conn = await redis().get<QboConnection>(KEY);
      if (conn?.refreshToken && conn?.realmId) return conn;
    } catch (err) {
      console.error("[qbo] KV read failed", err);
    }
  }
  const refreshToken = process.env.QBO_REFRESH_TOKEN ?? "";
  const realmId = process.env.QBO_REALM_ID ?? "";
  if (refreshToken && realmId) return { refreshToken, realmId };
  return null;
}

/** Persist the full connection (on connect/reconnect). */
export async function saveConnection(conn: QboConnection): Promise<void> {
  if (!isKvConfigured()) {
    console.warn("[qbo] KV not configured — connection not persisted");
    return;
  }
  await redis().set(KEY, conn);
}

/** Persist just a rotated refresh token, keeping the existing realm id. */
export async function saveRefreshToken(refreshToken: string): Promise<void> {
  if (!isKvConfigured()) return;
  const current = await getStoredConnection();
  if (current) await redis().set(KEY, { ...current, refreshToken });
}

/** Remove the stored connection (on disconnect). */
export async function clearConnection(): Promise<void> {
  if (!isKvConfigured()) return;
  await redis().del(KEY);
}
