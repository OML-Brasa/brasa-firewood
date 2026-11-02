import { NextResponse } from "next/server";

/**
 * Receives a shipping-quote request from checkout.
 *
 * TODO (Part 3): create the customer + estimate in QuickBooks Online here.
 *   - Find/create Customer (by email) via the QBO API
 *   - Create an Estimate with the cart line items, discount, and shipping note
 *   - Needs: QBO client id/secret, realm id, OAuth2 refresh token (env vars)
 *
 * For now it validates the payload and acknowledges, so the checkout flow works
 * end-to-end. The front end still shows the confirmation if this returns ok.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const order = body as {
    orderNo?: string;
    email?: string;
    name?: string;
    items?: { name: string; qty: number; price: number }[];
  };

  if (!order?.email || !order?.name || !order?.items?.length) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  // Placeholder: log the request. Replace with the QuickBooks estimate call.
  console.log("[quote] request received", {
    orderNo: order.orderNo,
    name: order.name,
    email: order.email,
    items: order.items.length,
  });

  return NextResponse.json({ ok: true, quoteNo: order.orderNo });
}
