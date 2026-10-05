"use client";

/* eslint-disable @next/next/no-img-element */
import {
  Blocks,
  Box,
  ExternalLink,
  Flame,
  Heart,
  Image as ImageIcon,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Thermometer,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { addToCart, money, priceToNumber } from "@/lib/cart";
import type { Accessory } from "@/lib/checkoutDefaults";
import { useRecentlyViewed } from "@/lib/recentlyViewed";

export type ProductData = {
  slug: string;
  name: string;
  tagline: string;
  price: string;
  priceSymbol: string;
  shortDescription: string;
  gallery: string[];
  sizes: { model: string; dims: string }[];
  insulation: string[];
  domeColors: { name: string; color: string }[];
  archFinishes: string[];
  bases: string[];
  financeNote: string;
  features: { title: string; copy: string }[];
  specs: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
};

type CompareData = { models: string[]; rows: { feature: string; values: string[] }[] };

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";
const label = "font-sans text-[15px] font-bold uppercase leading-none tracking-[0.5px] text-charcoal-800";
const sectionTitle = "font-heading text-[28px] md:text-[36px] font-extrabold leading-[1.14] tracking-[-0.015em] text-charcoal-800";

const featureIcons = [ShieldCheck, Flame, Thermometer, Sparkles, Blocks, Box];

function OutlineStars() {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} strokeWidth={1.5} className="fill-white text-charcoal-800" />
      ))}
    </div>
  );
}

/** Selectable pill used for size / insulation / arch / base options. */
function Pill({
  active,
  onClick,
  children,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[4px] px-4 py-3 text-[14px] font-semibold leading-[1.5] tracking-[0.28px] text-charcoal-800 transition-colors ${
        active ? "border-2 border-charcoal-300 bg-[#f8fafc]" : "border border-charcoal-300 bg-white hover:bg-[#f8fafc]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function ProductClient({
  product,
  compare,
  accessories,
}: {
  product: ProductData;
  compare: CompareData;
  accessories: Accessory[];
}) {
  const router = useRouter();
  const [gallery, setGallery] = useState(0);
  // Default to "model 90" where it exists (matches the Figma frames), else first.
  const defaultSize = Math.max(0, product.sizes.findIndex((s) => s.model === "model 90"));
  const [size, setSize] = useState(defaultSize);
  const [insulation, setInsulation] = useState(0);
  const [dome, setDome] = useState(0);
  const [arch, setArch] = useState(0);
  const [base, setBase] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Record this product as viewed, and read the shared recently-viewed list.
  const recent = useRecentlyViewed(
    useMemo(
      () => ({ slug: product.slug, name: product.name, price: product.price, image: product.gallery[0] ?? "" }),
      [product.slug, product.name, product.price, product.gallery]
    )
  );

  const mainImage = product.gallery[gallery] ?? product.gallery[0];

  const addOven = () => {
    const s = product.sizes[size];
    const parts = [
      s ? `${s.model} ${s.dims}`.trim() : null,
      product.insulation[insulation],
      product.domeColors[dome]?.name,
      product.archFinishes[arch],
      product.bases[base],
    ].filter(Boolean);
    addToCart({
      id: `${product.slug}|${size}-${insulation}-${dome}-${arch}-${base}`,
      slug: product.slug,
      name: product.name,
      desc: parts.join(" · "),
      price: priceToNumber(product.price),
      image: product.gallery[0] ?? "",
    });
    router.push("/cart");
  };

  const addAccessory = (a: Accessory) => {
    addToCart({ id: `acc:${a.name}`, name: a.name, desc: a.description, price: a.price, image: a.image ?? "" });
    router.push("/cart");
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-sand">
        <div className={wrap}>
          <nav className="flex items-center gap-2 py-4 text-[13px] text-charcoal-500">
            <Link href="/" className="transition-colors hover:text-copper-600">Home</Link>
            <span>/</span>
            <Link href="/shop" className="transition-colors hover:text-copper-600">Shop</Link>
            <span>/</span>
            <span className="text-charcoal-800">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero: gallery + configurator */}
      <section className="bg-background">
        <div className={`${wrap} flex flex-wrap items-start gap-x-16 gap-y-10 pb-12 pt-16`}>
          {/* Gallery */}
          <div className="flex min-w-[380px] flex-[1_0_0] flex-col gap-4">
            <div className="flex h-[480px] w-full items-center justify-center overflow-hidden rounded-[2px] border border-charcoal-300 bg-white">
              {mainImage ? (
                <img src={mainImage} alt={product.name} className="h-full w-full object-contain p-4" />
              ) : (
                <ImageIcon size={40} className="text-charcoal-300" />
              )}
            </div>
            {product.gallery.length > 1 && (
              <div className="flex gap-3">
                {product.gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setGallery(i)}
                    className={`flex h-[120px] flex-1 items-center justify-center overflow-hidden rounded-[2px] bg-white ${
                      i === gallery ? "border-2 border-copper-500" : "border border-charcoal-300"
                    }`}
                  >
                    <img src={src} alt={`${product.name} view ${i + 1}`} className="h-full w-full object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Configurator */}
          <div className="flex min-w-[380px] flex-[1_0_0] flex-col gap-8">
            {/* Title block */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <OutlineStars />
                <span className="text-[15px] leading-[1.4] tracking-[0.3px] text-charcoal-800/60">(48 reviews)</span>
              </div>
              <h1 className="font-heading text-[48px] font-extrabold leading-[1.1] tracking-[-0.56px] text-charcoal-800 md:text-[56px]">
                {product.name}
              </h1>
              <p className="text-[18px] font-bold leading-[1.55] tracking-[0.36px] text-charcoal-500">{product.tagline}</p>
              <p className="font-heading text-[32px] font-extrabold leading-[1.15] tracking-[-0.48px] text-charcoal-800">
                {product.priceSymbol}
              </p>
            </div>

            {/* Configurator groups */}
            <div className="flex flex-col gap-8">
              {/* Size */}
              <div className="flex flex-col gap-2">
                <span className={label}>Oven Size</span>
                <div className="flex max-w-[520px] flex-wrap gap-2">
                  {product.sizes.map((s, i) => (
                    <Pill key={s.model} active={i === size} onClick={() => setSize(i)} className="flex flex-col items-center !py-[10px] text-[15px] font-normal tracking-[0.3px]">
                      <span>{s.model}</span>
                      <span>{s.dims}</span>
                    </Pill>
                  ))}
                </div>
              </div>

              {/* Insulation */}
              {product.insulation.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className={label}>Premium Insulation</span>
                  <div className="flex gap-3">
                    {product.insulation.map((opt, i) => (
                      <Pill key={opt} active={i === insulation} onClick={() => setInsulation(i)} className="flex-1 text-center">
                        {opt}
                      </Pill>
                    ))}
                  </div>
                </div>
              )}

              {/* Dome color */}
              <div className="flex flex-col gap-2">
                <span className={label}>Dome Color</span>
                <div className="flex items-start gap-6">
                  {product.domeColors.map((c, i) => (
                    <button key={c.name} onClick={() => setDome(i)} className="flex flex-col items-center gap-1.5">
                      <span
                        className={`size-9 rounded-full border border-black/10 transition-shadow ${
                          i === dome ? "ring-1 ring-charcoal-800 ring-offset-2" : ""
                        }`}
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="max-w-[80px] text-center text-[13px] leading-[1.2] tracking-[0.26px] text-charcoal-800">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Arch finish */}
              <div className="flex flex-col gap-2">
                <span className={label}>Arch Finish</span>
                <div className="flex flex-wrap gap-2">
                  {product.archFinishes.map((opt, i) => (
                    <Pill key={opt} active={i === arch} onClick={() => setArch(i)}>
                      {opt}
                    </Pill>
                  ))}
                </div>
              </div>

              {/* Base */}
              <div className="flex flex-col gap-2">
                <span className={label}>Base</span>
                <div className="flex gap-3">
                  {product.bases.map((opt, i) => (
                    <Pill key={opt} active={i === base} onClick={() => setBase(i)} className="flex-1 text-center">
                      {opt}
                    </Pill>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <button onClick={addOven} className="flex-1 rounded-[4px] bg-copper-500 px-6 py-4 text-[14px] font-bold uppercase tracking-[0.28px] text-white transition-colors hover:bg-copper-600">
                  Add to Cart
                </button>
                <button aria-label="Add to wishlist" className="flex size-[52px] items-center justify-center rounded-[4px] border border-[#cbd5e0] text-charcoal-800 transition-colors hover:bg-[#f8fafc]">
                  <Heart size={20} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <a href="#" className="flex items-center gap-1.5 text-[13px] font-bold capitalize leading-[1.5] tracking-[0.26px] text-charcoal-800 transition-colors hover:text-copper-600">
                  Request a Custom Quote <ExternalLink size={14} />
                </a>
                <span className="text-[13px] leading-[1.2] tracking-[0.26px] text-charcoal-800/60">Free shipping · Delivery 4–6 weeks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financing callout */}
      <section className="bg-sand">
        <div className={`${wrap} py-8`}>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#e7e2d7] bg-background px-6 py-5">
            <div className="flex items-center gap-4">
              <span className="flex size-9 items-center justify-center rounded-md border border-charcoal-300 text-charcoal-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
              </span>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-charcoal-800">Finance Your Oven</span>
                <span className="text-[14px] text-charcoal-500">{product.financeNote}</span>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <a href="#" className="text-[14px] font-bold text-copper-600 hover:text-copper-700">Pre-Qualify Now</a>
              <a href="#" className="text-[14px] text-charcoal-500 hover:text-charcoal-800">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="bg-background">
        <div className={`${wrap} py-16`}>
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className={sectionTitle}>Features &amp; Benefits</h2>
            <p className="max-w-2xl text-[18px] leading-[1.5] text-charcoal-500">{product.shortDescription}</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {product.features.map((f, i) => {
              const Icon = featureIcons[i % featureIcons.length];
              return (
                <div key={f.title} className="flex flex-col gap-3 rounded-lg border border-[#edf2f7] p-6">
                  <span className="flex size-10 items-center justify-center rounded-full bg-copper-100 text-charcoal-800">
                    <Icon size={18} />
                  </span>
                  <h3 className="font-heading text-[18px] font-extrabold text-charcoal-800">{f.title}</h3>
                  <p className="text-[14px] leading-[1.45] text-charcoal-500">{f.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="bg-background">
        <div className={`${wrap} pb-16`}>
          <div className="flex flex-col gap-2">
            <h2 className={sectionTitle}>Technical Specifications</h2>
            <p className="text-[16px] leading-[1.5] text-charcoal-500">Detailed dimensions, materials, and capabilities of the {product.name} line.</p>
          </div>
          <div className="mt-8 overflow-hidden rounded-lg border border-[#e7e2d7]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-copper-500 text-white">
                  <th className="px-5 py-4 text-[13px] font-bold uppercase tracking-[0.06em]">{product.name}</th>
                  <th className="px-5 py-4 text-[13px] font-bold uppercase tracking-[0.06em]">{product.name}</th>
                </tr>
              </thead>
              <tbody>
                {product.specs.map((s, i) => (
                  <tr key={s.label} className={`border-t border-[#edf2f7] ${i % 2 ? "bg-[#f8fafc]" : "bg-background"}`}>
                    <td className="px-5 py-3.5 text-[14px] font-bold text-charcoal-800">{s.label}</td>
                    <td className="px-5 py-3.5 text-[14px] text-charcoal-500">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Complete Your Setup */}
      <section className="bg-background">
        <div className={`${wrap} pb-16`}>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-[24px] font-extrabold text-charcoal-800">Complete Your Setup</h2>
            <a href="#" className="text-[14px] text-copper-600 hover:text-copper-700">View All Accessories</a>
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
                  <button onClick={() => addAccessory(a)} className="rounded bg-copper-500 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.02em] text-white transition-colors hover:bg-copper-600">Add to cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background">
        <div className={`${wrap} pb-16`}>
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className={sectionTitle}>Frequently Asked Questions</h2>
            <p className="text-[16px] text-charcoal-500">Everything you need to know about owning and operating a Brasa oven.</p>
          </div>
          <div className="mx-auto mt-8 max-w-[1000px]">
            {product.faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className="border-b border-[#edf2f7]">
                  <button onClick={() => setOpenFaq(open ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                    <span className="text-[16px] font-semibold text-charcoal-800">{f.question}</span>
                    {open ? <Minus size={18} className="shrink-0 text-charcoal-500" /> : <Plus size={18} className="shrink-0 text-charcoal-500" />}
                  </button>
                  {open && <p className="pb-5 text-[15px] leading-[1.6] text-charcoal-500">{f.answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compare Our Ovens */}
      <section className="bg-sand">
        <div className={`${wrap} py-16`}>
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className={sectionTitle}>Compare Our Ovens</h2>
            <p className="max-w-2xl text-[16px] leading-[1.4] text-charcoal-500">Side-by-side specifications for all assembled oven lines.</p>
          </div>
          <div className="mt-10 overflow-x-auto rounded border border-charcoal-500">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="bg-copper-500 text-sand">
                  <th className="px-4 py-4 text-[15px] font-bold uppercase tracking-[0.04em]">Features</th>
                  {compare.models.map((m) => (
                    <th key={m} className="px-4 py-4 text-[15px] font-bold uppercase tracking-[0.04em]">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compare.rows.map((r, i) => (
                  <tr key={r.feature} className={`border-t border-charcoal-100 ${i % 2 ? "bg-[#f8fafc]" : "bg-background"}`}>
                    <td className="px-4 py-4 text-[15px] text-charcoal-500">{r.feature}</td>
                    {r.values.map((v, j) => (
                      <td key={j} className="px-4 py-4 text-[15px] text-charcoal-500">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
              <span className="text-[15px] font-semibold text-charcoal-700">You haven&rsquo;t viewed any products yet</span>
              <span className="text-[13px] text-charcoal-500">Models you look at will show up here.</span>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((r) => (
                <Link key={r.slug} href={`/shop/${r.slug}`} className="flex items-center gap-4 rounded-lg border border-charcoal-300 p-3 transition-colors hover:border-copper-500">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-sand">
                    {r.image ? <img src={r.image} alt={r.name} className="h-full w-full object-contain p-1" /> : <ImageIcon size={20} className="text-charcoal-400" />}
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
