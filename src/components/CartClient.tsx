"use client";

/* eslint-disable @next/next/no-img-element */
import { CreditCard, Gift, Image as ImageIcon, Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Accessory, TrustBadge } from "@/lib/checkoutDefaults";
import { addToCart, getPromo, money, PROMO_CODES, removeFromCart, setPromo, updateQty, useCart } from "@/lib/cart";

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";
const sectionTitle = "font-heading text-[28px] md:text-[36px] font-extrabold leading-[1.14] tracking-[-0.015em] text-charcoal-800";

function QtyStepper({ qty, onChange }: { qty: number; onChange: (q: number) => void }) {
  return (
    <div className="flex items-center rounded border border-charcoal-300">
      <button onClick={() => onChange(qty - 1)} aria-label="Decrease quantity" className="flex size-9 items-center justify-center text-charcoal-700 transition-colors hover:bg-[#f8fafc]"><Minus size={14} /></button>
      <span className="w-8 text-center text-[14px] font-semibold text-charcoal-800">{qty}</span>
      <button onClick={() => onChange(qty + 1)} aria-label="Increase quantity" className="flex size-9 items-center justify-center text-charcoal-700 transition-colors hover:bg-[#f8fafc]"><Plus size={14} /></button>
    </div>
  );
}

export function CartClient({
  accessories,
  trustBadges,
  financeText,
}: {
  accessories: Accessory[];
  trustBadges: TrustBadge[];
  financeText: string;
}) {
  const { items, subtotal, count } = useCart();
  const [promo, setPromoState] = useState<{ code: string; rate: number } | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftMsg, setGiftMsg] = useState("");
  const [zip, setZip] = useState("");
  const [deliveryShown, setDeliveryShown] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPromoState(getPromo());
  }, []);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code] != null) {
      setPromo(code);
      setPromoState({ code, rate: PROMO_CODES[code] });
      setPromoError("");
    } else {
      setPromoError("That code isn't valid. Try BRASA10.");
    }
  };

  const clearPromo = () => {
    setPromo(null);
    setPromoState(null);
    setPromoInput("");
  };

  const discount = promo ? subtotal * promo.rate : 0;
  const total = subtotal - discount;

  const accessoriesBlock = (
    <section className="bg-background">
      <div className={`${wrap} border-t border-[#edf2f7] py-12`}>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-[28px] font-extrabold text-charcoal-800">Complete Your Setup</h2>
          <Link href="/shop" className="text-[14px] text-copper-600 hover:text-copper-700">View All Accessories</Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {accessories.map((a) => (
            <div key={a.name} className="flex flex-col gap-3 rounded-lg border border-charcoal-300 p-4">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-[#dedddd]">
                {a.image ? <img src={a.image} alt={a.name} className="h-full w-full object-cover" /> : <ImageIcon size={28} className="text-charcoal-400" />}
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-charcoal-800">{a.name}</span>
                <span className="text-[13px] text-charcoal-500">{a.description}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[15px] font-bold text-charcoal-800">{money(a.price)}</span>
                <button
                  onClick={() => addToCart({ id: `acc:${a.name}`, name: a.name, desc: a.description, price: a.price, image: a.image ?? "" })}
                  className="rounded bg-copper-500 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.02em] text-white transition-colors hover:bg-copper-600"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (count === 0) {
    return (
      <>
        <section className="bg-background">
          <div className={`${wrap} py-16`}>
            <h1 className={sectionTitle}>Your Cart</h1>
            <div className="mt-8 flex flex-col items-center gap-3 rounded-lg border border-dashed border-charcoal-300 py-20 text-center">
              <ImageIcon size={32} className="text-charcoal-400" />
              <span className="text-[18px] font-semibold text-charcoal-700">Your cart is empty</span>
              <span className="text-[14px] text-charcoal-500">Add an oven or accessory to get started.</span>
              <Link href="/shop" className="mt-2 rounded bg-copper-500 px-7 py-3 text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">Browse the Shop</Link>
            </div>
          </div>
        </section>
        {accessoriesBlock}
      </>
    );
  }

  return (
    <>
      <section className="bg-background">
        <div className={`${wrap} py-12`}>
          <h1 className="flex items-baseline gap-3">
            <span className={sectionTitle}>Your Cart</span>
            <span className="text-[16px] text-charcoal-500">({count} {count === 1 ? "item" : "items"})</span>
          </h1>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
            {/* Items column */}
            <div className="flex flex-col gap-5">
              {items.map((it) => (
                <div key={it.id} className="flex gap-4 rounded-lg border border-charcoal-300 p-4">
                  <div className="flex size-[92px] shrink-0 items-center justify-center overflow-hidden rounded-md border border-charcoal-300 bg-white">
                    {it.image ? <img src={it.image} alt={it.name} className="h-full w-full object-contain p-1" /> : <ImageIcon size={24} className="text-charcoal-400" />}
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[16px] font-bold text-charcoal-800">{it.name}</span>
                        {it.desc && <span className="max-w-md text-[13px] leading-[1.4] text-charcoal-500">{it.desc}</span>}
                      </div>
                      <span className="shrink-0 text-[16px] font-bold text-charcoal-800">{money(it.price * it.qty)}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <QtyStepper qty={it.qty} onChange={(q) => updateQty(it.id, q)} />
                      <div className="flex items-center gap-3 text-[13px] text-charcoal-500">
                        {it.slug && <Link href={`/shop/${it.slug}`} className="transition-colors hover:text-copper-600">Edit</Link>}
                        {it.slug && <span className="text-charcoal-300">|</span>}
                        <button onClick={() => removeFromCart(it.id)} className="flex items-center gap-1 transition-colors hover:text-copper-600"><Trash2 size={13} /> Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Gift + promo */}
              <div className="flex flex-wrap items-start gap-3">
                <button onClick={() => setGiftOpen((v) => !v)} className="flex items-center gap-2 rounded border border-charcoal-300 px-4 py-2.5 text-[14px] text-charcoal-800 transition-colors hover:bg-[#f8fafc]">
                  <Gift size={16} /> Add Gift Message <Plus size={14} className={giftOpen ? "rotate-45 transition-transform" : "transition-transform"} />
                </button>
                <div className="flex items-center gap-2">
                  <input value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Promo Code" className="w-40 rounded border border-charcoal-300 px-3 py-2.5 text-[14px] text-charcoal-800" />
                  <button onClick={applyPromo} className="rounded bg-copper-500 px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.02em] text-white transition-colors hover:bg-copper-600">Apply</button>
                </div>
              </div>
              {giftOpen && (
                <textarea value={giftMsg} onChange={(e) => setGiftMsg(e.target.value)} rows={3} placeholder="Write a gift message…" className="w-full max-w-lg rounded border border-charcoal-300 px-3 py-2 text-[14px] text-charcoal-800" />
              )}
              {promoError && <span className="text-[13px] text-copper-700">{promoError}</span>}
              {promo && <span className="text-[13px] font-semibold text-[#2f7d4f]">Code {promo.code} applied — {Math.round(promo.rate * 100)}% off. <button onClick={clearPromo} className="font-normal text-charcoal-500 underline">remove</button></span>}

              <Link href="/shop" className="text-[14px] text-charcoal-500 transition-colors hover:text-copper-600">← Continue Shopping</Link>
            </div>

            {/* Order summary */}
            <aside className="flex h-fit flex-col gap-5 rounded-lg border border-charcoal-300 p-6">
              <h2 className="font-heading text-[22px] font-extrabold text-charcoal-800">Order Summary</h2>
              <div className="flex items-center justify-between text-[15px]">
                <span className="text-charcoal-500">Subtotal</span>
                <span className="font-bold text-charcoal-800">{money(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-[15px]">
                  <span className="text-charcoal-500">Promo ({promo?.code})</span>
                  <span className="font-bold text-[#2f7d4f]">−{money(discount)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 rounded bg-[#f8fafc] px-3 py-2.5 text-[13px] text-charcoal-600">
                <CreditCard size={15} className="text-charcoal-500" /> {financeText}
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[13px] font-bold uppercase tracking-[0.06em] text-charcoal-800">Shipping Estimate</span>
                <div className="flex items-center gap-2">
                  <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="Enter Zip Code" className="flex-1 rounded border border-charcoal-300 px-3 py-2 text-[14px] text-charcoal-800" />
                  <button onClick={() => setDeliveryShown(true)} className="rounded border border-copper-500 px-4 py-2 text-[13px] font-semibold text-copper-600 transition-colors hover:bg-[#f8fafc]">Calculate</button>
                </div>
              </div>
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-charcoal-500">Estimated Delivery</span>
                <span className="font-semibold text-charcoal-800">{deliveryShown ? "Arrives in 2–3 weeks" : "—"}</span>
              </div>
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-charcoal-500">Estimated Tax</span>
                <span className="text-charcoal-500">Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#edf2f7] pt-4">
                <span className="font-heading text-[20px] font-extrabold text-charcoal-800">Total</span>
                <span className="font-heading text-[24px] font-extrabold text-charcoal-800">{money(total)}</span>
              </div>
              <Link href="/checkout" className="rounded bg-copper-500 py-4 text-center text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">Proceed to Checkout</Link>
              <div className="flex flex-col gap-3 border-t border-[#edf2f7] pt-4">
                {trustBadges.map((b) => (
                  <div key={b.title} className="flex items-start gap-2.5">
                    <ShieldCheck size={18} className="mt-0.5 shrink-0 text-charcoal-500" />
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-charcoal-800">{b.title}</span>
                      <span className="text-[13px] text-charcoal-500">{b.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
      {accessoriesBlock}
    </>
  );
}
