"use client";

/* eslint-disable @next/next/no-img-element */
import { Check, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { ShippingMethod, WhatsNextStep } from "@/lib/checkoutDefaults";
import { getLastOrder, money, type PlacedOrder } from "@/lib/cart";

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";
const cardCls = "flex flex-col gap-4 rounded-lg border border-charcoal-300 p-6";

function deliveryWindow() {
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const start = new Date();
  start.setDate(start.getDate() + 5);
  const end = new Date();
  end.setDate(end.getDate() + 12);
  return `${fmt(start)} – ${fmt(end)}, ${end.getFullYear()}`.toUpperCase();
}

export function OrderConfirmedClient({
  whatsNext,
  shippingMethods,
  supportPhone,
  supportEmail,
}: {
  whatsNext: WhatsNextStep[];
  shippingMethods: ShippingMethod[];
  supportPhone: string;
  supportEmail: string;
}) {
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [mounted, setMounted] = useState(false);
  const [accountMsg, setAccountMsg] = useState("");
  const [trackMsg, setTrackMsg] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const o = getLastOrder();
    // Reading the just-placed order from storage after mount is the intent here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(o);
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-[420px]" />;

  if (!order) {
    return (
      <section className="bg-background">
        <div className={`${wrap} py-20 text-center`}>
          <h1 className="font-heading text-[32px] font-extrabold text-charcoal-800">No recent order</h1>
          <p className="mt-3 text-[15px] text-charcoal-500">Looks like you haven&rsquo;t placed an order in this session.</p>
          <Link href="/shop" className="mt-6 inline-block rounded bg-copper-500 px-7 py-3 text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">Browse the Shop</Link>
        </div>
      </section>
    );
  }

  const shipDesc = shippingMethods.find((m) => m.name === order.shippingMethod.name)?.description ?? "";

  return (
    <section className="bg-background">
      <div className={`${wrap} py-12`}>
        {/* Heading */}
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-copper-500 text-white"><Check size={22} strokeWidth={3} /></span>
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-[32px] font-extrabold leading-[1.1] text-charcoal-800 md:text-[36px]">Order Confirmed!</h1>
            <p className="text-[15px] text-charcoal-500">Thank you for your order. A confirmation email has been sent to {order.email || "your inbox"}.</p>
          </div>
        </div>

        {/* Order id banner */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-charcoal-300 px-6 py-4">
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal-500">Your Order ID</span>
            <span className="text-[18px] font-bold text-charcoal-800">Order #{order.orderNo}</span>
          </div>
          <div className="flex flex-col text-right text-[13px] text-charcoal-500">
            <span>Order Date: {order.date}</span>
            <span className="font-bold text-charcoal-800">Status: Processing</span>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Left */}
          <div className="flex flex-col gap-8">
            <div className={cardCls}>
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">Order Details</h2>
              <div className="flex flex-col gap-4">
                {order.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-4">
                    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-charcoal-300 bg-white">
                      {it.image ? <img src={it.image} alt={it.name} className="h-full w-full object-contain p-1" /> : <ImageIcon size={22} className="text-charcoal-400" />}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-[15px] font-bold text-charcoal-800">{it.name}</span>
                      {it.desc && <span className="line-clamp-1 text-[13px] text-charcoal-500">{it.desc}</span>}
                      <span className="text-[13px] text-charcoal-500">Qty: {it.qty}</span>
                    </div>
                    <span className="shrink-0 font-heading text-[18px] font-extrabold text-charcoal-800">{money(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={cardCls}>
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">Shipping &amp; Delivery Details</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal-500">Delivery Address</span>
                  <span className="text-[14px] font-bold text-charcoal-800">{order.name || "—"}</span>
                  <span className="text-[14px] text-charcoal-500">{order.address.line1}</span>
                  {order.address.line2 && <span className="text-[14px] text-charcoal-500">{order.address.line2}</span>}
                  <span className="text-[14px] text-charcoal-500">{order.address.city}, {order.address.state} {order.address.zip}</span>
                  <span className="text-[14px] text-charcoal-500">{order.address.country}</span>
                  {order.address.phone && <span className="text-[14px] text-charcoal-500">Phone: {order.address.phone}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal-500">Shipping Method</span>
                  <span className="text-[14px] font-bold text-charcoal-800">{order.shippingMethod.name}</span>
                  {shipDesc && <span className="text-[14px] text-charcoal-500">{shipDesc}</span>}
                  <div className="mt-2 w-fit rounded border border-charcoal-300 px-3 py-2">
                    <span className="block text-[11px] text-charcoal-500">Estimated Delivery Window:</span>
                    <span className="text-[13px] font-bold text-charcoal-800">{deliveryWindow()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-8">
            <div className={cardCls}>
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">Order Summary</h2>
              <div className="flex items-center justify-between text-[14px]"><span className="text-charcoal-500">Subtotal</span><span className="text-charcoal-800">{money(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex items-center justify-between text-[14px]"><span className="text-charcoal-500">Discount</span><span className="text-[#2f7d4f]">−{money(order.discount)}</span></div>}
              <div className="flex items-center justify-between text-[14px]"><span className="text-charcoal-500">Shipping</span><span className="font-bold text-charcoal-800">{order.shippingCost === 0 ? "FREE" : money(order.shippingCost)}</span></div>
              <div className="flex items-center justify-between text-[14px]"><span className="text-charcoal-500">Estimated Tax</span><span className="text-charcoal-800">{money(order.tax)}</span></div>
              <div className="flex items-center justify-between border-t border-[#edf2f7] pt-4">
                <span className="font-heading text-[18px] font-extrabold text-charcoal-800">Total Paid</span>
                <span className="font-heading text-[26px] font-extrabold text-charcoal-800">{money(order.total)}</span>
              </div>
            </div>

            <div className={cardCls}>
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">What&rsquo;s Next?</h2>
              <div className="flex flex-col gap-4">
                {whatsNext.map((s, i) => (
                  <div key={s.title} className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-copper-500 text-[12px] font-bold text-white">{i + 1}</span>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-charcoal-800">{s.title}</span>
                      <span className="text-[13px] leading-[1.45] text-charcoal-500">{s.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={cardCls}>
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">Need Assistance?</h2>
              <div className="flex flex-col gap-1 text-[14px] text-charcoal-600">
                <span>Call: <span className="font-bold text-charcoal-800">{supportPhone}</span></span>
                <span>Email: <span className="font-bold text-charcoal-800">{supportEmail}</span></span>
              </div>
              <button onClick={() => setTrackMsg("Tracking opens once your oven ships — we'll email your freight tracking number.")} className="rounded bg-copper-500 py-3 text-center text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">Track Your Order</button>
              {trackMsg && <span className="text-[13px] text-charcoal-500">{trackMsg}</span>}
            </div>
          </div>
        </div>

        {/* Create account */}
        <div className="mx-auto mt-10 flex max-w-[560px] flex-col items-center gap-4 rounded-lg border border-charcoal-300 p-8 text-center">
          <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">Create an Account to Track Orders</h2>
          <p className="text-[14px] text-charcoal-500">Save your details, access warranty coverage, and monitor shipment status in real-time.</p>
          {accountMsg ? (
            <p className="flex items-center gap-2 text-[14px] font-semibold text-[#2f7d4f]"><Check size={16} /> {accountMsg}</p>
          ) : (
            <div className="flex w-full items-center gap-2">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" className="flex-1 rounded border border-charcoal-300 px-3 py-2.5 text-[14px] text-charcoal-800" />
              <button onClick={() => setAccountMsg(password ? "Account created — check your inbox to verify." : "Enter a password to continue.")} className="rounded bg-copper-500 px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">Create Account</button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/shop" className="text-[14px] text-charcoal-500 transition-colors hover:text-copper-600">Continue Shopping</Link>
        </div>
      </div>
    </section>
  );
}
