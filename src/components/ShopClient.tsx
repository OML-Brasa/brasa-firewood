"use client";

/* eslint-disable @next/next/no-img-element */
import { ArrowRight, Check, Image as ImageIcon, Plus, SlidersHorizontal, Truck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { addToCart, money } from "@/lib/cart";
import type { AccessoryProduct, Oven } from "@/lib/productDefaults";
import { useRecentlyViewed } from "@/lib/recentlyViewed";

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";
const sectionTitle = "font-heading text-[24px] md:text-[36px] font-extrabold leading-[1.14] tracking-[-0.015em] text-charcoal-800";

type Tab = "All" | "Ovens" | "Accessories";
type Sort = "featured" | "price-asc" | "price-desc";

const SORT_LABELS: Record<Sort, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

// The flue pieces that fit together as a venting kit — a real, sensible bundle.
const BUNDLE_SLUGS = ["exhaust-tube", "exhaust-hood", "exhaust-elbow"];

export function ShopClient({
  ovens,
  accessories,
  pageTitle,
  pageIntro,
}: {
  ovens: Oven[];
  accessories: AccessoryProduct[];
  pageTitle: string;
  pageIntro: string;
}) {
  const [tab, setTab] = useState<Tab>("All");
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("featured");
  const recent = useRecentlyViewed();

  const showOvens = tab === "All" || tab === "Ovens";
  const showAccessories = tab === "All" || tab === "Accessories";

  const allSizes = useMemo(
    () => [...new Set(ovens.flatMap((o) => o.variants.map((v) => v.size)))].sort((a, b) => parseInt(a) - parseInt(b)),
    [ovens]
  );

  const visibleOvens = useMemo(() => {
    let list = sizeFilter ? ovens.filter((o) => o.variants.some((v) => v.size === sizeFilter)) : ovens;
    const withMin = list.map((o) => ({ o, min: Math.min(...o.variants.map((v) => v.price)) }));
    if (sort === "price-asc") withMin.sort((a, b) => a.min - b.min);
    else if (sort === "price-desc") withMin.sort((a, b) => b.min - a.min);
    list = withMin.map((x) => x.o);
    return list;
  }, [ovens, sizeFilter, sort]);

  const addAccessory = (a: AccessoryProduct) =>
    addToCart({ id: `acc:${a.slug}`, slug: a.slug, name: a.name, desc: a.shortDescription, price: a.price, image: a.image ?? "" });

  const bundle = useMemo(
    () => BUNDLE_SLUGS.map((s) => accessories.find((a) => a.slug === s)).filter((a): a is AccessoryProduct => !!a),
    [accessories]
  );
  const bundlePrice = bundle.reduce((sum, a) => sum + a.price, 0);
  const addBundle = () => bundle.forEach(addAccessory);

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-sand">
        <div className={wrap}>
          <nav className="flex items-center gap-2 py-4 text-[13px] text-charcoal-500">
            <Link href="/" className="transition-colors hover:text-copper-600">Home</Link>
            <span>/</span>
            <span className="text-charcoal-800">Shop</span>
          </nav>
        </div>
      </div>

      {/* Header + tabs */}
      <div className="bg-background">
        <div className={wrap}>
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <h1 className="font-heading text-[40px] font-extrabold leading-[1.05] tracking-[-0.01em] text-charcoal-800 md:text-[56px]">{pageTitle}</h1>
            <p className="max-w-3xl text-[18px] leading-[1.6] text-charcoal-500 md:text-[20px]">{pageIntro}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pb-6">
            {(["All", "Ovens", "Accessories"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-5 py-2 text-[14px] font-medium transition-colors ${tab === t ? "bg-copper-500 text-white" : "border border-charcoal-300 text-charcoal-700 hover:border-copper-500 hover:text-copper-700"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ovens */}
      {showOvens && (
        <section className="bg-background">
          <div className={`${wrap} py-12`}>
            <div className="mb-8 flex flex-col gap-4">
              <h2 className={sectionTitle}>The Collection</h2>
              {/* Filter / sort toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-charcoal-300 bg-sand/60 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.06em] text-charcoal-500">
                    <SlidersHorizontal size={14} /> Size
                  </span>
                  <button
                    onClick={() => setSizeFilter(null)}
                    className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${sizeFilter === null ? "bg-copper-500 text-white" : "border border-charcoal-300 bg-background text-charcoal-700 hover:border-copper-500"}`}
                  >
                    All
                  </button>
                  {allSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSizeFilter(s)}
                      className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${sizeFilter === s ? "bg-copper-500 text-white" : "border border-charcoal-300 bg-background text-charcoal-700 hover:border-copper-500"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-[13px] text-charcoal-600">
                  <span className="font-semibold uppercase tracking-[0.06em] text-charcoal-500">Sort by</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                    className="rounded border border-charcoal-300 bg-background px-3 py-1.5 text-[13px] font-semibold text-charcoal-800 focus:border-copper-500 focus:outline-none"
                  >
                    {(Object.keys(SORT_LABELS) as Sort[]).map((s) => (
                      <option key={s} value={s}>{SORT_LABELS[s]}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {visibleOvens.length === 0 ? (
              <p className="rounded-lg border border-dashed border-charcoal-300 py-12 text-center text-[15px] text-charcoal-500">No ovens in that size. <button onClick={() => setSizeFilter(null)} className="font-semibold text-copper-600 underline">Clear filter</button></p>
            ) : (
              <div className="grid gap-10 md:grid-cols-2">
                {visibleOvens.map((o) => {
                  const minPrice = Math.min(...o.variants.map((v) => v.price));
                  const sizes = [...new Set(o.variants.map((v) => v.size))];
                  const finishes = [...new Set(o.variants.map((v) => v.finish))].filter((f) => f !== "Standard");
                  // Prefer a variant that has a polished render (multi-image gallery) as the card cover.
                  const cover = (o.variants.find((v) => v.gallery.length > 1) ?? o.variants[0])?.image;
                  return (
                    <article key={o.slug} className="group flex flex-col overflow-hidden rounded-lg border border-charcoal-300 bg-background transition-shadow hover:shadow-[0_8px_30px_rgba(33,31,29,0.08)]">
                      <Link href={`/shop/${o.slug}`} className="aspect-[588/360] overflow-hidden bg-white">
                        {cover ? <img src={cover} alt={o.name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" /> : <div className="flex h-full items-center justify-center"><ImageIcon size={32} className="text-charcoal-300" /></div>}
                      </Link>
                      <div className="flex flex-1 flex-col gap-2.5 p-5">
                        <div className="flex items-baseline justify-between gap-2">
                          <Link href={`/shop/${o.slug}`} className="font-heading text-[22px] font-extrabold text-charcoal-800 transition-colors hover:text-copper-600">{o.name}</Link>
                          <span className="shrink-0 font-heading text-[18px] font-extrabold text-charcoal-800">From {money(minPrice)}</span>
                        </div>
                        <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-charcoal-500">{o.tagline}</span>
                        <p className="text-[15px] leading-[1.4] text-charcoal-500">{o.shortDescription}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-charcoal-500">
                          <span>{sizes.length} {sizes.length === 1 ? "size" : "sizes"}: {sizes.join(", ")}</span>
                          {finishes.length > 0 && <span>{finishes.length} {finishes.length === 1 ? "finish" : "finishes"}</span>}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <Link href={`/shop/${o.slug}`} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded bg-copper-500 px-5 py-3 text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">
                            View &amp; Configure <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Essentials Package bundle */}
      {showOvens && bundle.length === BUNDLE_SLUGS.length && (
        <section className="bg-background">
          <div className={`${wrap} pb-12`}>
            <div className="grid items-stretch gap-0 overflow-hidden rounded-xl border border-charcoal-300 md:grid-cols-[1.2fr_1fr]">
              <div className="flex flex-col gap-4 p-8">
                <span className="w-fit rounded-full bg-copper-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-copper-700">Best Value</span>
                <h3 className="font-heading text-[28px] font-extrabold leading-[1.12] text-charcoal-800">The Essentials Package</h3>
                <p className="text-[15px] leading-[1.5] text-charcoal-500">Everything you need to vent your oven, bundled together — the 1 m exhaust tube, hood, and 45° elbow.</p>
                <ul className="flex flex-col gap-2">
                  {bundle.map((a) => (
                    <li key={a.slug} className="flex items-center gap-2 text-[14px] text-charcoal-700">
                      <Check size={15} className="shrink-0 text-copper-600" /> {a.name}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <span className="font-heading text-[26px] font-extrabold text-charcoal-800">{money(bundlePrice)}</span>
                  <button onClick={addBundle} className="inline-flex items-center gap-1.5 rounded bg-copper-500 px-6 py-3 text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">
                    <Plus size={15} /> Add Kit to Cart
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center bg-sand p-6">
                {bundle[0]?.image ? (
                  <img src={bundle[0].image} alt="Exhaust kit" className="h-full max-h-[220px] w-full rounded-lg object-cover" />
                ) : (
                  <ImageIcon size={40} className="text-charcoal-300" />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Accessories */}
      {showAccessories && (
        <section id="accessories" className="scroll-mt-24 bg-background">
          <div className={`${wrap} ${showOvens ? "border-t border-[#edf2f7] pt-12" : "pt-12"} pb-12`}>
            <h2 className={`${sectionTitle} mb-8`}>Accessories</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {accessories.map((a) => (
                <div key={a.slug} className="flex flex-col gap-3 rounded-lg border border-charcoal-300 p-4 transition-shadow hover:shadow-[0_6px_20px_rgba(33,31,29,0.06)]">
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-[#dedddd]">
                    {a.image ? <img src={a.image} alt={a.name} className="h-full w-full object-cover" /> : <ImageIcon size={28} className="text-charcoal-400" />}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-[15px] font-bold text-charcoal-800">{a.name}</span>
                    <span className="text-[13px] text-charcoal-500">{a.shortDescription}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[15px] font-bold text-charcoal-800">{money(a.price)}</span>
                    <button onClick={() => addAccessory(a)} className="rounded bg-copper-500 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.02em] text-white transition-colors hover:bg-copper-600">Add</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shipping note */}
      <section className="bg-sand">
        <div className={`${wrap} flex flex-wrap items-center gap-4 py-10`}>
          <span className="flex size-11 items-center justify-center rounded-full bg-copper-100 text-copper-700"><Truck size={20} /></span>
          <div className="flex flex-col">
            <span className="font-heading text-[18px] font-extrabold text-charcoal-800">Shipping is quoted per location</span>
            <span className="text-[14px] text-charcoal-600">These ovens ship by freight, so cost depends on your area. Add what you want to your cart and request a shipping quote — we&rsquo;ll follow up with the total.</span>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="bg-background">
        <div className={`${wrap} py-12`}>
          <h2 className="font-heading text-[24px] font-extrabold text-charcoal-800">Recently Viewed</h2>
          {recent.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-lg border border-dashed border-charcoal-300 py-12 text-center">
              <ImageIcon size={28} className="text-charcoal-400" />
              <span className="text-[15px] font-semibold text-charcoal-700">You haven&rsquo;t viewed any ovens yet</span>
              <span className="text-[13px] text-charcoal-500">Models you look at will show up here.</span>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((r) => (
                <Link key={r.slug} href={`/shop/${r.slug}`} className="flex items-center gap-4 rounded-lg border border-charcoal-300 p-3 transition-colors hover:border-copper-500">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-sand">
                    {r.image ? <img src={r.image} alt={r.name} className="h-full w-full object-cover" /> : <ImageIcon size={20} className="text-charcoal-400" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-charcoal-800">{r.name}</span>
                    <span className="text-[14px] text-charcoal-500">{r.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
