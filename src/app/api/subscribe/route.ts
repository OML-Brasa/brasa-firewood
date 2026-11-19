import { NextResponse } from "next/server";

import { isMailchimpReady, subscribeToAudience } from "@/lib/mailchimp";

export const runtime = "nodejs";

/**
 * Receives a newsletter signup from the Newsletter component and adds the
 * address to the Mailchimp audience. Until MAILCHIMP_API_KEY / _AUDIENCE_ID are
 * set, it just acknowledges so the form keeps working.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const { email, locale } = (body ?? {}) as { email?: string; locale?: string };

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "invalid-email" }, { status: 400 });
  }

  if (!isMailchimpReady()) {
    console.log("[subscribe] received (Mailchimp not configured — acknowledging only)", { email });
    return NextResponse.json({ ok: true, status: "acknowledged" });
  }

  const result = await subscribeToAudience(email, locale);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, status: result.status });
}
