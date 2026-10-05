"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useMemo, useState } from "react";

import { useRecentlyViewed } from "@/lib/recentlyViewed";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Image as ImageIcon,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  X,
  Zap,
} from "lucide-react";

export type ShopProduct = { slug: string; name: string; price: string; desc: string; image: string };

const categories = ["All Models", "Residential", "Commercial", "Accessories"];

// Facets beyond model/price are visual filters (our product data doesn't carry
// these attributes yet) — they toggle but don't narrow the 4 current items.
const facetGroups = [
  { h: "Size", opts: ["80cm (4–6 persons)", "90cm (8–10 persons)", "95cm (10–12 persons)", "100cm (>12 persons)", "110cm (Large reunions)"] },
  { h: "Premium Insulation", opts: ["Yes (Multi-layer)", "No (Standard)"] },
  { h: "Dome Finish", opts: ["White Marble Tile", "Black Marble Tile", "Red Tile", "White Single-coat Mortar", "Classic Single-coat Mortar", "Terracotta Brick", "Black Brick", "Kaolin Brick"] },
  { h: "Arch Finish", opts: ["Black Brick/White Border", "Black Brick/Black Border", "Terracotta Brick", "Black Brick", "Faux Wood", "Faux Stone"] },
  { h: "Base", opts: ["No Base", "Concrete Base", "Metal Base"] },
];

const accessories = [
  { name: "Cast Iron Door", note: "w/ Glass" },
  { name: "Thermometer", note: "Per Chamber" },
  { name: "Chimney Cap", note: "Included" },
  { name: "Flue Dampers", note: "Included" },
];

const bundleIncludes = [
  "Dolce 90cm Traditional Oven",
  "Concrete Base",
  "Premium Multi-Layer Insulation",
  "White Marble Tile Dome Finish",
];

const delivery = [
  { Icon: Truck, name: "Standard Freight", price: "FREE", desc: "Curbside delivery included on all ovens within mainland shipping zones. Typical transit 5–10 business days." },
  { Icon: Zap, name: "Express Delivery", price: "$149", desc: "Expedited freight with lift-gate delivery. Oven placed at your property entrance. 3–5 business days." },
  { Icon: Sparkles, name: "White Glove Setup", price: "$349", desc: "Professional team delivers, positions, and levels your oven on site. Includes removal of all packaging." },
];

const financing = [
  { mo: "$99/mo", term: "for 48 months" },
  { mo: "$199/mo", term: "for 24 months" },
  { mo: "$405/mo", term: "for 12 months" },
];

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";
const sectionTitle = "font-heading text-[24px] md:text-[36px] font-extrabold leading-[1.14] tracking-[-0.015em] text-charcoal-800";
const PAGE_SIZE = 6;
const priceNum = (p: string) => parseInt(p.replace(/[^0-9]/g, ""), 10) || 0;

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className="fill-copper-500 text-copper-500" />
      ))}
    </div>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] ${
        checked ? "border-copper-500 bg-copper-500 text-white" : "border-charcoal-300"
      }`}
    >
      {checked && <Check size={11} strokeWidth={3} />}
    </span>
  );
}

export function ShopClient({
  pageTitle,
  pageIntro,
  products,
  bundle,
}: {
  pageTitle: string;
  pageIntro: string;
  products: ShopProduct[];
  bundle: { title: string; description: string; price: string; image: string | null };
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [category, setCategory] = useState("All Models");
  const [models, setModels] = useState<string[]>([]);
  const [facets, setFacets] = useState<string[]>([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(8000);
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [page, setPage] = useState(1);
  const recent = useRecentlyViewed();

  const toggle = (v: string, arr: string[], set: (a: string[]) => void) => {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    setPage(1);
  };

  const filtered = useMemo(() => {
    const showsOvens = category === "All Models" || category === "Residential";
    if (!showsOvens) return [];
    return products.filter((p) => {
      if (models.length && !models.includes(p.name)) return false;
      const n = priceNum(p.price);
      return n >= min && n <= max;
    });
  }, [products, category, models, min, max]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const compareProducts = products.filter((p) => compare.includes(p.name));
  const activeFilterCount = models.length + facets.length + (min !== 0 || max !== 8000 ? 1 : 0);

  const clearAll = () => {
    setModels([]);
    setFacets([]);
    setMin(0);
    setMax(8000);
    setPage(1);
  };

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

      {/* Header + category pills (white) */}
      <div className="bg-background">
        <div className={wrap}>
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <h1 className="font-heading text-[40px] font-extrabold leading-[1.05] tracking-[-0.01em] text-charcoal-800 md:text-[56px]">
              {pageTitle}
            </h1>
            <p className="max-w-3xl text-[18px] leading-[1.6] text-charcoal-500 md:text-[20px]">{pageIntro}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pb-6">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => { setCategory(c); setPage(1); }}
                className={`rounded-full px-5 py-2 text-[14px] font-medium transition-colors ${
                  category === c ? "bg-copper-500 text-white" : "border border-charcoal-300 text-charcoal-700 hover:border-copper-500 hover:text-copper-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar + filter drawer (light grey) */}
      <div className="bg-[#f8fafc]">
        <div className={wrap}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e7e2d7] py-4">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center gap-2 rounded border px-4 py-2 text-[14px] font-semibold transition-colors ${
                filtersOpen ? "border-copper-500 bg-background text-charcoal-800" : "border-charcoal-300 bg-background text-charcoal-800"
              }`}
            >
              <SlidersHorizontal size={16} />
              Filter
              {activeFilterCount > 0 && (
                <span className="ml-1 rounded-full bg-copper-500 px-2 py-0.5 text-[11px] font-bold text-white">{activeFilterCount}</span>
              )}
              <ChevronDown size={15} className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
            </button>
            <div className="flex items-center gap-5">
              <span className="hidden text-[13px] text-charcoal-500 sm:block">{filtered.length} results</span>
              <button className="flex items-center gap-1.5 text-[14px] text-charcoal-700">
                Sort by: <span className="font-semibold">Featured</span>
                <ChevronDown size={15} />
              </button>
              <button
                onClick={() => setShowCompare((v) => !v)}
                disabled={compare.length < 2}
                className="text-[14px] font-medium text-charcoal-700 transition-colors enabled:hover:text-copper-700 disabled:cursor-not-allowed disabled:text-charcoal-300"
              >
                Compare Products{compare.length > 0 ? ` (${compare.length})` : ""}
              </button>
              <div className="flex items-center gap-1">
                <span className="flex h-8 w-8 items-center justify-center rounded bg-charcoal-800 text-white"><LayoutGrid size={16} /></span>
                <span className="flex h-8 w-8 items-center justify-center rounded text-charcoal-400"><List size={16} /></span>
              </div>
            </div>
          </div>

          {filtersOpen && (
            <div className="border-t border-[#e7e2d7] py-6">
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-3">
                  <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-charcoal-800">Price Range</span>
                  <div className="flex items-center gap-2">
                    <input value={`$${min.toLocaleString()}`} onChange={(e) => { setMin(priceNum(e.target.value)); setPage(1); }} className="w-20 rounded border border-charcoal-300 bg-background px-2 py-1.5 text-[13px] text-charcoal-800" />
                    <span className="text-[13px] text-charcoal-500">to</span>
                    <input value={`$${max.toLocaleString()}`} onChange={(e) => { setMax(priceNum(e.target.value) || 8000); setPage(1); }} className="w-24 rounded border border-charcoal-300 bg-background px-2 py-1.5 text-[13px] text-charcoal-800" />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-charcoal-800">Oven Model</span>
                  <div className="flex flex-col gap-2">
                    {products.map((p) => (
                      <button key={p.name} onClick={() => toggle(p.name, models, setModels)} className="flex items-center gap-2 text-left text-[13px] text-charcoal-600">
                        <Checkbox checked={models.includes(p.name)} /> {p.name}
                      </button>
                    ))}
                  </div>
                </div>
                {facetGroups.map((f) => (
                  <div key={f.h} className="flex flex-col gap-3">
                    <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-charcoal-800">{f.h}</span>
                    <div className="flex flex-col gap-2">
                      {f.opts.map((o) => (
                        <button key={o} onClick={() => toggle(o, facets, setFacets)} className="flex items-center gap-2 text-left text-[13px] text-charcoal-600">
                          <Checkbox checked={facets.includes(o)} /> {o}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {activeFilterCount > 0 && (
                <button onClick={clearAll} className="mt-6 text-[13px] font-semibold text-copper-600 hover:text-copper-700">
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Compare panel */}
      {showCompare && compareProducts.length >= 2 && (
        <div className="bg-sand">
          <div className={`${wrap} py-8`}>
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">Comparing {compareProducts.length} models</h2>
              <button onClick={() => setShowCompare(false)} className="flex items-center gap-1 text-[13px] text-charcoal-500 hover:text-charcoal-800"><X size={14} /> Close</button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {compareProducts.map((p) => (
                <div key={p.name} className="flex flex-col gap-2 rounded-lg border border-charcoal-300 bg-background p-4">
                  <div className="aspect-[588/360] overflow-hidden rounded-md"><img src={p.image} alt={p.name} className="h-full w-full object-cover" /></div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-heading text-[18px] font-extrabold text-charcoal-800">{p.name}</span>
                    <span className="text-[15px] text-charcoal-800">{p.price}</span>
                  </div>
                  <p className="text-[13px] leading-[1.4] text-charcoal-500">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product grid */}
      <section className="bg-background">
        <div className={`${wrap} py-12`}>
          {pageItems.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-charcoal-300 py-20 text-center">
              <span className="text-[18px] font-semibold text-charcoal-700">No models match your filters</span>
              <span className="text-[14px] text-charcoal-500">Try a different category or clear your filters.</span>
              {(category !== "All Models" || activeFilterCount > 0) && (
                <button onClick={() => { setCategory("All Models"); clearAll(); }} className="mt-2 text-[14px] font-semibold text-copper-600 hover:text-copper-700">Reset</button>
              )}
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2">
              {pageItems.map((p) => (
                <article key={p.name} className="flex flex-col gap-4 rounded-lg border border-charcoal-300 bg-background p-4">
                  <Link href={`/shop/${p.slug}`} className="aspect-[588/360] overflow-hidden rounded-md"><img src={p.image} alt={`Brasa ${p.name} oven`} className="h-full w-full object-cover transition-transform hover:scale-[1.02]" /></Link>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-1.5"><Stars /><span className="text-[13px] text-charcoal-500">(48 reviews)</span></div>
                    <div className="flex items-baseline justify-between gap-2">
                      <Link href={`/shop/${p.slug}`} className="font-heading text-[20px] font-extrabold text-charcoal-800 transition-colors hover:text-copper-600">{p.name}</Link>
                      <span className="text-[20px] text-charcoal-800">{p.price}</span>
                    </div>
                    <p className="text-[15px] leading-[1.4] text-charcoal-500">{p.desc}</p>
                    <button onClick={() => toggle(p.name, compare, setCompare)} className="flex w-fit items-center gap-2 text-[15px] text-charcoal-500">
                      <Checkbox checked={compare.includes(p.name)} /> Compare Model
                    </button>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <Link href={`/shop/${p.slug}`} className="inline-flex items-center gap-1.5 text-[15px] font-bold text-charcoal-800 transition-colors hover:text-copper-600">View Details <ArrowRight size={14} /></Link>
                      <Link href={`/shop/${p.slug}`} className="rounded bg-copper-500 px-6 py-2.5 text-[14px] font-bold uppercase tracking-[0.02em] text-white transition-colors hover:bg-copper-600">Customize</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={current <= 1}
                className="flex h-9 w-9 items-center justify-center rounded border border-charcoal-300 text-charcoal-700 transition-colors enabled:hover:border-copper-500 disabled:opacity-40"
              >
                <ArrowRight size={15} className="rotate-180" />
              </button>
              <span className="text-[14px] text-charcoal-600">Page {current} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={current >= totalPages}
                className="flex h-9 w-9 items-center justify-center rounded border border-charcoal-300 text-charcoal-700 transition-colors enabled:hover:border-copper-500 disabled:opacity-40"
              >
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Included With Every Oven */}
      <section className="bg-background">
        <div className={`${wrap} py-12`}>
          <h2 className={`${sectionTitle} text-center`}>Included With Every Oven</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {accessories.map((a) => (
              <div key={a.name} className="flex flex-col gap-3 rounded-lg border border-charcoal-300 p-4">
                <div className="flex aspect-[4/3] items-center justify-center rounded-md bg-[#dedddd]"><ImageIcon size={28} className="text-charcoal-400" /></div>
                <div className="flex flex-col">
                  <span className="font-heading text-[18px] font-extrabold text-charcoal-800">{a.name}</span>
                  <span className="text-[13px] text-charcoal-500">{a.note}</span>
                </div>
                <button className="mt-1 rounded bg-copper-500 py-2.5 text-[13px] font-bold uppercase tracking-[0.02em] text-white transition-colors hover:bg-copper-600">Add to cart</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Essentials Package */}
      <section className="bg-background">
        <div className={`${wrap} pb-12`}>
          <div className="grid gap-8 overflow-hidden rounded-2xl border border-[#e7e2d7] bg-sand p-8 md:grid-cols-2 md:p-12">
            <div className="flex flex-col gap-5">
              <span className="w-fit rounded-full bg-copper-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white">Most Popular Combo</span>
              <h2 className="font-heading text-[28px] font-extrabold text-charcoal-800">{bundle.title}</h2>
              <p className="text-[15px] leading-[1.5] text-charcoal-600">{bundle.description}</p>
              <div className="flex flex-col gap-2">
                <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-charcoal-800">Package Includes:</span>
                {bundleIncludes.map((b) => (
                  <span key={b} className="flex items-center gap-2 text-[15px] text-charcoal-600"><Check size={16} className="text-copper-600" /> {b}</span>
                ))}
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-[36px] font-extrabold text-charcoal-800">{bundle.price}</span>
                <span className="text-[14px] text-charcoal-500 line-through">$255 Individual Price</span>
              </div>
              <button className="w-fit rounded bg-copper-500 px-7 py-3 text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">Shop Bundle</button>
            </div>
            <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl bg-[#dedddd]">
              {bundle.image ? (
                <img src={bundle.image} alt={bundle.title} className="h-full w-full object-cover" />
              ) : (
                <ImageIcon size={32} className="text-charcoal-400" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed — empty state */}
      <section className="bg-background">
        <div className={`${wrap} py-12`}>
          <h2 className="font-heading text-[24px] font-extrabold text-charcoal-800">Recently Viewed</h2>
          {recent.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-lg border border-dashed border-charcoal-300 py-12 text-center">
              <ImageIcon size={28} className="text-charcoal-400" />
              <span className="text-[15px] font-semibold text-charcoal-700">You haven&rsquo;t viewed any products yet</span>
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

      {/* Delivery & Installation */}
      <section className="bg-background">
        <div className={`${wrap} py-12`}>
          <h2 className="font-heading text-[24px] font-extrabold text-charcoal-800">Delivery &amp; Installation Options</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {delivery.map(({ Icon, name, price, desc }) => (
              <div key={name} className="flex flex-col gap-3 rounded-lg border border-charcoal-300 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[15px] font-bold text-charcoal-800"><Icon size={18} className="text-copper-600" /> {name}</span>
                  <span className="text-[16px] font-bold text-copper-700">{price}</span>
                </div>
                <p className="text-[14px] leading-[1.45] text-charcoal-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing */}
      <section className="bg-sand">
        <div className={`${wrap} flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between`}>
          <div className="flex max-w-xl flex-col gap-3">
            <h2 className="font-heading text-[24px] font-extrabold text-charcoal-800">Flexible Financing Available</h2>
            <p className="text-[15px] leading-[1.5] text-charcoal-600">Split your purchase into easy monthly payments. Finance any oven or bundle with 0% APR for qualifying buyers.</p>
            <div className="flex flex-col gap-1">
              <button className="w-fit rounded bg-copper-500 px-7 py-3 text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">Pre-Qualify Now</button>
              <span className="text-[12px] text-charcoal-500">No impact to your credit score</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {financing.map((f) => (
              <div key={f.mo} className="flex flex-col items-center gap-1 rounded-lg border border-charcoal-300 bg-background px-5 py-4 text-center">
                <span className="font-heading text-[18px] font-extrabold text-charcoal-800">{f.mo}</span>
                <span className="text-[12px] text-charcoal-500">{f.term}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
