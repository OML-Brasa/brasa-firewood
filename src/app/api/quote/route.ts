import { NextResponse } from "next/server";

import { createEstimateForOrder, isQboConfigured, type QboOrder } from "@/lib/quickbooks";

export const runtime = "nodejs";

/**
 * Receives a shipping-quote request from checkout and, when QuickBooks is
 * configured, creates a Customer + Estimate in QuickBooks Online.
 *
 * Until QBO env vars are set (QBO_CLIENT_ID/SECRET/REFRESH_TOKEN/REALM_ID), it
 * just validates and acknowledges so the checkout flow works end-to-end.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const order = body as Partial<QboOrder>;

  if (!order?.email || !order?.name || !order?.items?.length) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  if (!isQboConfigured()) {
    console.log("[quote] received (QBO not configured — acknowledging only)", {
      orderNo: order.orderNo,
      email: order.email,
      items: order.items.length,
    });
    return NextResponse.json({ ok: true, quoteNo: order.orderNo });
  }

  try {
    const { estimateId, docNumber } = await createEstimateForOrder(order as QboOrder);
    console.log("[quote] QBO estimate created", { orderNo: order.orderNo, estimateId, docNumber });
    return NextResponse.json({ ok: true, quoteNo: order.orderNo, estimateId, docNumber });
  } catch (err) {
    // Never block checkout on a bookkeeping error — the order is still captured
    // client-side for manual follow-up.
    console.error("[quote] QBO estimate failed", err);
    return NextResponse.json({ ok: true, quoteNo: order.orderNo, qboError: true });
  }
}
