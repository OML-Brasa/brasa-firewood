"use client";

/* eslint-disable @next/next/no-img-element */
import { CreditCard, Image as ImageIcon, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { ShippingMethod, TrustBadge } from "@/lib/checkoutDefaults";
import { generateOrderNo, getPromo, money, placeOrder, useCart } from "@/lib/cart";

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

const fieldCls = "rounded border border-charcoal-300 px-3 py-2.5 text-[14px] text-charcoal-800 placeholder:text-charcoal-400 focus:border-copper-500 focus:outline-none";
const labelCls = "text-[13px] font-semibold text-charcoal-800";
const cardCls = "flex flex-col gap-4 rounded-lg border border-charcoal-300 p-6";

export function CheckoutClient({
  shippingMethods,
  trustBadges,
  financeText,
  taxRate,
}: {
  shippingMethods: ShippingMethod[];
  trustBadges: TrustBadge[];
  financeText: string;
  taxRate: number;
}) {
  const router = useRouter();
  const { items, subtotal, count } = useCart();
  const [promoRate, setPromoRate] = useState(0);
  const [shipIdx, setShipIdx] = useState(0);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "", optIn: true, firstName: "", lastName: "", street: "", apt: "",
    city: "", state: "", zip: "", country: "United States", phone: "", save: false,
  });

  useEffect(() => {
    const p = getPromo();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (p) setPromoRate(p.rate);
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target instanceof HTMLInputElement && e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const discount = subtotal * promoRate;
  const shippingCost = shippingMethods[shipIdx]?.price ?? 0;
  const total = subtotal - discount + shippingCost;

  const submit = () => {
    if (!form.email || !form.firstName || !form.lastName || !form.street || !form.city || !form.state || !form.zip) {
      setError("Please fill in your email and full shipping address.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const sm = shippingMethods[shipIdx];
    const taxable = subtotal - discount;
    const tax = taxable * taxRate;
    placeOrder({
      orderNo: generateOrderNo(),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      email: form.email,
      name: `${form.firstName} ${form.lastName}`.trim(),
      address: { line1: form.street, line2: form.apt, city: form.city, state: form.state, zip: form.zip, country: form.country, phone: form.phone },
      shippingMethod: { name: sm.name, price: sm.price },
      items,
      subtotal,
      discount,
      shippingCost: sm.price,
      tax,
      total: taxable + sm.price + tax,
    });
    router.push("/order-confirmed");
  };

  if (count === 0) {
    return (
      <section className="bg-background">
        <div className={`${wrap} py-16`}>
          <h1 className="font-heading text-[36px] font-extrabold text-charcoal-800">Checkout</h1>
          <div className="mt-8 flex flex-col items-center gap-3 rounded-lg border border-dashed border-charcoal-300 py-20 text-center">
            <ImageIcon size={32} className="text-charcoal-400" />
            <span className="text-[18px] font-semibold text-charcoal-700">Your cart is empty</span>
            <Link href="/shop" className="mt-2 rounded bg-copper-500 px-7 py-3 text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">Browse the Shop</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background">
      <div className={`${wrap} py-12`}>
        <h1 className="flex items-baseline gap-3">
          <span className="font-heading text-[36px] font-extrabold text-charcoal-800">Checkout</span>
          <span className="text-[15px] text-charcoal-500">Secure Order Processing</span>
        </h1>

        {error && <p className="mt-4 rounded border border-copper-300 bg-copper-50 px-4 py-2.5 text-[14px] text-copper-700">{error}</p>}

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Forms */}
          <div className="flex flex-col gap-6">
            {/* Contact */}
            <div className={cardCls}>
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">Contact Information</h2>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Email Address</label>
                <input type="email" value={form.email} onChange={set("email")} placeholder="yourname@example.com" className={fieldCls} />
              </div>
              <label className="flex items-center gap-2.5 text-[14px] text-charcoal-600">
                <input type="checkbox" checked={form.optIn} onChange={set("optIn")} className="size-4 accent-copper-500" />
                Email me with exclusive news, refractory care tips, and offers
              </label>
            </div>

            {/* Shipping address */}
            <div className={cardCls}>
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">Shipping Address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5"><label className={labelCls}>First Name</label><input value={form.firstName} onChange={set("firstName")} placeholder="John" className={fieldCls} /></div>
                <div className="flex flex-col gap-1.5"><label className={labelCls}>Last Name</label><input value={form.lastName} onChange={set("lastName")} placeholder="Doe" className={fieldCls} /></div>
              </div>
              <div className="flex flex-col gap-1.5"><label className={labelCls}>Street Address</label><input value={form.street} onChange={set("street")} placeholder="123 Woodfired Way" className={fieldCls} /></div>
              <div className="flex flex-col gap-1.5"><label className={labelCls}>Apartment, suite, unit, etc. (optional)</label><input value={form.apt} onChange={set("apt")} placeholder="Suite 4B" className={fieldCls} /></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5"><label className={labelCls}>City</label><input value={form.city} onChange={set("city")} placeholder="San Francisco" className={fieldCls} /></div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>State</label>
                  <select value={form.state} onChange={set("state")} className={fieldCls}>
                    <option value="">Select…</option>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5"><label className={labelCls}>ZIP Code</label><input value={form.zip} onChange={set("zip")} placeholder="94107" className={fieldCls} /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Country/Region</label>
                  <select value={form.country} onChange={set("country")} className={fieldCls}><option>United States</option></select>
                </div>
                <div className="flex flex-col gap-1.5"><label className={labelCls}>Phone Number</label><input value={form.phone} onChange={set("phone")} placeholder="(555) 000-0000" className={fieldCls} /></div>
              </div>
              <label className="flex items-center gap-2.5 text-[14px] text-charcoal-600">
                <input type="checkbox" checked={form.save} onChange={set("save")} className="size-4 accent-copper-500" />
                Save this address to my Brasa profile
              </label>
            </div>

            {/* Shipping method */}
            <div className={cardCls}>
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">Shipping Method</h2>
              <div className="flex flex-col gap-3">
                {shippingMethods.map((m, i) => (
                  <button key={m.name} onClick={() => setShipIdx(i)} className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${i === shipIdx ? "border-2 border-charcoal-800 bg-[#f8fafc]" : "border border-charcoal-300 hover:bg-[#f8fafc]"}`}>
                    <span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${i === shipIdx ? "border-copper-500" : "border-charcoal-300"}`}>
                      {i === shipIdx && <span className="size-2 rounded-full bg-copper-500" />}
                    </span>
                    <span className="flex flex-1 flex-col">
                      <span className="text-[15px] font-bold text-charcoal-800">{m.name}</span>
                      <span className="text-[13px] text-charcoal-500">{m.description}</span>
                    </span>
                    <span className="shrink-0 text-[14px] font-bold text-charcoal-800">{m.price === 0 ? "FREE" : money(m.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <aside className="flex h-fit flex-col gap-5 rounded-lg border border-charcoal-300 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">Order Summary</h2>
              <Link href="/cart" className="text-[13px] text-copper-600 hover:text-copper-700">Edit Cart</Link>
            </div>
            <div className="flex flex-col gap-3">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded border border-charcoal-300 bg-white">
                    {it.image ? <img src={it.image} alt={it.name} className="h-full w-full object-contain p-0.5" /> : <ImageIcon size={18} className="text-charcoal-400" />}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-[14px] font-bold text-charcoal-800">{it.name}{it.qty > 1 ? ` × ${it.qty}` : ""}</span>
                    {it.desc && <span className="line-clamp-1 text-[12px] text-charcoal-500">{it.desc}</span>}
                  </div>
                  <span className="shrink-0 text-[14px] font-semibold text-charcoal-800">{money(it.price * it.qty)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-[#edf2f7] pt-4 text-[14px]">
              <span className="text-charcoal-500">Subtotal</span>
              <span className="font-bold text-charcoal-800">{money(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-[14px]"><span className="text-charcoal-500">Discount</span><span className="font-bold text-[#2f7d4f]">−{money(discount)}</span></div>
            )}
            <div className="flex items-center gap-2 rounded bg-[#f8fafc] px-3 py-2.5 text-[13px] text-charcoal-600"><CreditCard size={15} className="text-charcoal-500" /> {financeText}</div>
            <div className="flex items-center justify-between text-[14px]"><span className="text-charcoal-500">Shipping</span><span className="font-bold text-charcoal-800">{shippingCost === 0 ? "FREE" : money(shippingCost)}</span></div>
            <div className="flex items-center justify-between text-[14px]"><span className="text-charcoal-500">Estimated Tax</span><span className="text-charcoal-500">Calculated next step</span></div>
            <div className="flex items-center justify-between border-t border-[#edf2f7] pt-4">
              <span className="font-heading text-[20px] font-extrabold text-charcoal-800">Total</span>
              <span className="font-heading text-[24px] font-extrabold text-charcoal-800">{money(total)}</span>
            </div>
            <button onClick={submit} className="rounded bg-copper-500 py-4 text-center text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">Submit</button>
            <div className="flex flex-col gap-3 border-t border-[#edf2f7] pt-4">
              {trustBadges.map((b) => (
                <div key={b.title} className="flex items-start gap-2.5">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 text-charcoal-500" />
                  <div className="flex flex-col"><span className="text-[14px] font-bold text-charcoal-800">{b.title}</span><span className="text-[13px] text-charcoal-500">{b.description}</span></div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
