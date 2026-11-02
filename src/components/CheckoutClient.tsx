"use client";

/* eslint-disable @next/next/no-img-element */
import { Image as ImageIcon, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { generateOrderNo, getPromo, money, placeOrder, useCart } from "@/lib/cart";
import type { TrustBadge } from "@/lib/checkoutDefaults";

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];
const COUNTRIES = ["United States", "Puerto Rico", "Dominican Republic"];

const fieldCls = "rounded border border-charcoal-300 px-3 py-2.5 text-[14px] text-charcoal-800 placeholder:text-charcoal-400 focus:border-copper-500 focus:outline-none";
const labelCls = "text-[13px] font-semibold text-charcoal-800";
const cardCls = "flex flex-col gap-4 rounded-lg border border-charcoal-300 p-6";

export function CheckoutClient({ trustBadges }: { trustBadges: TrustBadge[] }) {
  const router = useRouter();
  const { items, subtotal, count } = useCart();
  const [promo, setPromo] = useState<{ code: string; rate: number } | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "", optIn: true, firstName: "", lastName: "", street: "", apt: "",
    city: "", state: "", zip: "", country: "United States", phone: "",
  });

  useEffect(() => {
    const p = getPromo();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (p) setPromo(p);
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target instanceof HTMLInputElement && e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const discount = promo ? subtotal * promo.rate : 0;
  const total = subtotal - discount;

  const submit = async () => {
    if (!form.email || !form.firstName || !form.lastName || !form.street || !form.city || !form.state || !form.zip || !form.phone) {
      setError("Please fill in your email, phone, and full shipping address so we can quote freight.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitting(true);
    const order = {
      orderNo: generateOrderNo(),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      email: form.email,
      name: `${form.firstName} ${form.lastName}`.trim(),
      address: { line1: form.street, line2: form.apt, city: form.city, state: form.state, zip: form.zip, country: form.country, phone: form.phone },
      promoCode: promo?.code,
      items,
      subtotal,
      discount,
      total,
    };
    try {
      await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...order, items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })) }),
      });
    } catch {
      /* best-effort — the request is still captured locally for follow-up */
    }
    placeOrder(order);
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
        <h1 className="flex flex-wrap items-baseline gap-3">
          <span className="font-heading text-[36px] font-extrabold text-charcoal-800">Request a Shipping Quote</span>
          <span className="text-[15px] text-charcoal-500">No payment today — we&rsquo;ll quote freight to your area and follow up.</span>
        </h1>

        {error && <p className="mt-4 rounded border border-copper-300 bg-copper-50 px-4 py-2.5 text-[14px] text-copper-700">{error}</p>}

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Forms */}
          <div className="flex flex-col gap-6">
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

            <div className={cardCls}>
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">Delivery Address</h2>
              <p className="-mt-1 text-[13px] text-charcoal-500">We use this to calculate your freight quote.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5"><label className={labelCls}>First Name</label><input value={form.firstName} onChange={set("firstName")} placeholder="John" className={fieldCls} /></div>
                <div className="flex flex-col gap-1.5"><label className={labelCls}>Last Name</label><input value={form.lastName} onChange={set("lastName")} placeholder="Doe" className={fieldCls} /></div>
              </div>
              <div className="flex flex-col gap-1.5"><label className={labelCls}>Street Address</label><input value={form.street} onChange={set("street")} placeholder="123 Woodfired Way" className={fieldCls} /></div>
              <div className="flex flex-col gap-1.5"><label className={labelCls}>Apartment, suite, unit, etc. (optional)</label><input value={form.apt} onChange={set("apt")} placeholder="Suite 4B" className={fieldCls} /></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5"><label className={labelCls}>City</label><input value={form.city} onChange={set("city")} placeholder="San Juan" className={fieldCls} /></div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>State / Region</label>
                  {form.country === "United States" ? (
                    <select value={form.state} onChange={set("state")} className={fieldCls}>
                      <option value="">Select…</option>
                      {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input value={form.state} onChange={set("state")} placeholder="Region" className={fieldCls} />
                  )}
                </div>
                <div className="flex flex-col gap-1.5"><label className={labelCls}>ZIP / Postal</label><input value={form.zip} onChange={set("zip")} placeholder="00907" className={fieldCls} /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Country/Region</label>
                  <select value={form.country} onChange={set("country")} className={fieldCls}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select>
                </div>
                <div className="flex flex-col gap-1.5"><label className={labelCls}>Phone Number</label><input value={form.phone} onChange={set("phone")} placeholder="(555) 000-0000" className={fieldCls} /></div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <aside className="flex h-fit flex-col gap-5 rounded-lg border border-charcoal-300 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">Your Request</h2>
              <Link href="/cart" className="text-[13px] text-copper-600 hover:text-copper-700">Edit Cart</Link>
            </div>
            <div className="flex flex-col gap-3">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded border border-charcoal-300 bg-white">
                    {it.image ? <img src={it.image} alt={it.name} className="h-full w-full object-cover" /> : <ImageIcon size={18} className="text-charcoal-400" />}
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
              <div className="flex items-center justify-between text-[14px]"><span className="text-charcoal-500">Discount ({promo?.code})</span><span className="font-bold text-[#2f7d4f]">−{money(discount)}</span></div>
            )}
            <div className="flex items-center justify-between text-[14px]"><span className="text-charcoal-500">Shipping</span><span className="text-charcoal-500">Quoted after request</span></div>
            <div className="flex items-center justify-between border-t border-[#edf2f7] pt-4">
              <span className="font-heading text-[18px] font-extrabold text-charcoal-800">Estimated Subtotal</span>
              <span className="font-heading text-[24px] font-extrabold text-charcoal-800">{money(total)}</span>
            </div>
            <button onClick={submit} disabled={submitting} className="rounded bg-copper-500 py-4 text-center text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600 disabled:opacity-60">
              {submitting ? "Sending…" : "Request Shipping Quote"}
            </button>
            <div className="flex items-start gap-2 text-[12px] text-charcoal-500">
              <Truck size={14} className="mt-0.5 shrink-0" />
              You won&rsquo;t be charged now. We&rsquo;ll review your request and reply with a freight quote for your area.
            </div>
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
