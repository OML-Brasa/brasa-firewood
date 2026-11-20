import { NextResponse } from "next/server";

import { isHubspotReady, submitContactForm } from "@/lib/hubspot";

export const runtime = "nodejs";

/**
 * Receives a contact-form submission and forwards it to HubSpot (Forms API).
 *
 * Responses:
 *   { ok: true, delivered: "hubspot" }  — sent to HubSpot
 *   { ok: true, delivered: "none" }     — HubSpot not configured yet; the
 *                                         client falls back to email so the
 *                                         message still reaches the team
 *   { ok: false, ... } (502)            — HubSpot configured but failed; the
 *                                         client also falls back to email
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const { firstName, lastName, email, phone, subject, message, pageUri } = (body ?? {}) as Record<
    string,
    string | undefined
  >;

  if (!firstName || !lastName || !email || !email.includes("@") || !message) {
    return NextResponse.json({ ok: false, error: "missing-fields" }, { status: 400 });
  }

  if (!isHubspotReady()) {
    console.log("[contact] received (HubSpot not configured — client falls back to email)", { email });
    return NextResponse.json({ ok: true, delivered: "none" });
  }

  const result = await submitContactForm({ firstName, lastName, email, phone, subject, message, pageUri });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: "hubspot" });
}
