"use client";

/* eslint-disable @next/next/no-img-element */
import { Blocks, Box, Flame, Image as ImageIcon, Minus, Plus, ShieldCheck, Sparkles, Thermometer, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { addToCart, money } from "@/lib/cart";
import { ovens as collection, type AccessoryProduct, type Oven } from "@/lib/productDefaults";
import { useRecentlyViewed } from "@/lib/recentlyViewed";

import { CompareTable } from "./CompareTable";

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";
const label = "font-sans text-[15px] font-bold uppercase leading-none tracking-[0.5px] text-charcoal-800";
const sectionTitle = "font-heading text-[28px] md:text-[36px] font-extrabold leading-[1.14] tracking-[-0.015em] text-charcoal-800";
const featureIcons = [ShieldCheck, Flame, Thermometer, Sparkles, Blocks, Box];

// Representative swatch colors for the finish selector (matches the Figma's
// color swatches). Compound finishes use their dominant tone; anything not
// listed falls back to a neutral stone.
const FINISH_COLORS: Record<string, string> = {
  "Red Brick": "#a8503a",
  "Black Brick / White Joint": "#2c2a28",
  "Iberian Stone": "#d8c6a0",
  Wood: "#9a6a3d",
  Marble: "#e7e4df",
  "Imitation Stone": "#c7b58f",
  "Terracota Brick": "#c56b45",
  "Terra Brick": "#b5572f",
  "Marble & Black Brick": "#6f6a63",
  "Exterior Red Brick": "#a8503a",
  "White Mortar & Premium Black Brick": "#3a3836",
  Standard: "#c9bfa8",
};
const finishColor = (finish: string) => FINISH_COLORS[finish] ?? "#c9bfa8";

type Feature = { title: string; copy: string };
type Faq = { question: string; answer: string };

export function ProductClient({
  oven,
  accessories,
  features,
  faqs,
}: {
  oven: Oven;
  accessories: AccessoryProduct[];
  features: Feature[];
  faqs: Faq[];
}) {
  const router = useRouter();

  const sizes = useMemo(() => [...new Set(oven.variants.map((v) => v.size))], [oven.variants]);
  const [size, setSize] = useState(sizes[0]);
  const finishes = useMemo(() => oven.variants.filter((v) => v.size === size).map((v) => v.finish), [oven.variants, size]);
  const [finish, setFinish] = useState(finishes[0]);

  // Resolve the selected variant; fall back to the first for the chosen size.
  const variant =
    oven.variants.find((v) => v.size === size && v.finish === finish) ??
    oven.variants.find((v) => v.size === size) ??
    oven.variants[0];

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const minPrice = Math.min(...oven.variants.map((v) => v.price));

  // Comparison across the whole collection (static code catalog, prices rounded).
  const compare = useMemo(
    () => ({
      models: collection.map((c) => c.name),
      rows: [
        { feature: "Style", values: collection.map((c) => c.style) },
        { feature: "Sizes", values: collection.map((c) => [...new Set(c.variants.map((v) => v.size))].join(", ")) },
        { feature: "Upper doors", values: collection.map((c) => (c.doors === 2 ? "2 doors" : "1 door")) },
        { feature: "Finish options", values: collection.map((c) => String([...new Set(c.variants.map((v) => v.finish))].filter((f) => f !== "Standard").length || 1)) },
        { feature: "Starting price", values: collection.map((c) => `From ${money(Math.min(...c.variants.map((v) => v.price)))}`) },
      ],
    }),
    []
  );

  const recent = useRecentlyViewed(
    useMemo(
      () => ({ slug: oven.slug, name: oven.name, price: `From ${money(minPrice)}`, image: oven.variants[0]?.image ?? "" }),
      [oven.slug, oven.name, oven.variants, minPrice]
    )
  );

  const pickSize = (s: string) => {
    setSize(s);
    const first = oven.variants.find((v) => v.size === s);
    if (first) setFinish(first.finish);
  };

  const finishVariants = oven.variants.filter((v) => v.size === size);
  const showFinishes = finishVariants.length > 1;

  // Per-variant image gallery (angles of the selected unit); reset to the first
  // shot whenever the chosen size/finish changes (render-time reset pattern).
  const galleryImages = variant.gallery.length ? variant.gallery : variant.image ? [variant.image] : [];
  const [activeImg, setActiveImg] = useState(0);
  const [imgKey, setImgKey] = useState(`${size}:${finish}`);
  if (imgKey !== `${size}:${finish}`) {
    setImgKey(`${size}:${finish}`);
    setActiveImg(0);
  }
  const heroImage = galleryImages[activeImg] ?? galleryImages[0] ?? variant.image;

  const specs: { label: string; value: string }[] = [
    { label: "Size", value: variant.size },
    { label: "Style", value: oven.style },
    { label: "Finish", value: variant.finish },
    ...(oven.style.includes("Enclosing") ? [{ label: "Firebox", value: "Round firebox / burner" }] : []),
    { label: "Upper door", value: oven.doors === 2 ? "2 cast iron doors with glass" : "Glass door" },
    { label: "Thermometer", value: oven.doors === 2 ? "2 included" : "Included" },
    { label: "Insulation", value: "Premium" },
    ...(variant.base ? [{ label: "Base", value: variant.base }] : []),
    ...(oven.style === "Complete Lot" ? [{ label: "Includes", value: "Oven, door, spatula kit, thermometer" }] : []),
  ];

  const addOven = () => {
    addToCart({
      id: `${oven.slug}:${variant.size}:${variant.finish}`,
      slug: oven.slug,
      name: `${oven.name} ${variant.size} — ${variant.finish}`,
      desc: `${variant.size} · ${variant.finish}${variant.base ? ` · ${variant.base}` : ""}`,
      price: variant.price,
      image: variant.image ?? "",
    });
    router.push("/cart");
  };

  const addAccessory = (a: AccessoryProduct) => {
    addToCart({ id: `acc:${a.slug}`, slug: a.slug, name: a.name, desc: a.shortDescription, price: a.price, image: a.image ?? "" });
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
            <span className="text-charcoal-800">{oven.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-background">
        <div className={`${wrap} flex flex-wrap items-start gap-x-16 gap-y-10 pb-12 pt-16`}>
          {/* Gallery */}
          <div className="flex min-w-[320px] flex-[1_0_0] flex-col gap-4">
            <div className="flex h-[480px] w-full items-center justify-center overflow-hidden rounded-[2px] border border-charcoal-300 bg-white">
              {heroImage ? (
                <img src={heroImage} alt={`${oven.name} ${variant.size} — ${variant.finish}`} className="h-full w-full object-contain" />
              ) : (
                <ImageIcon size={40} className="text-charcoal-300" />
              )}
            </div>
            {galleryImages.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {galleryImages.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActiveImg(i)}
                    className={`flex h-[96px] w-[112px] items-center justify-center overflow-hidden rounded-[2px] bg-white ${i === activeImg ? "border-2 border-copper-500" : "border border-charcoal-300"}`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={src} alt={`${oven.name} ${variant.size} view ${i + 1}`} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info / configurator */}
          <div className="flex min-w-[320px] flex-[1_0_0] flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="w-fit rounded-full bg-[#eef6f0] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2f7d4f]">In stock</span>
              <h1 className="font-heading text-[48px] font-extrabold leading-[1.1] tracking-[-0.56px] text-charcoal-800 md:text-[56px]">{oven.name}</h1>
              <p className="text-[18px] font-bold leading-[1.55] tracking-[0.36px] text-charcoal-500">{oven.tagline}</p>
              <p className="font-heading text-[32px] font-extrabold leading-[1.15] tracking-[-0.48px] text-charcoal-800">{money(variant.price)}</p>
            </div>

            <div className="flex flex-col gap-8">
              {/* Size */}
              {sizes.length > 1 && (
                <div className="flex flex-col gap-2">
                  <span className={label}>Oven Size</span>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => pickSize(s)}
                        className={`rounded-[4px] px-5 py-3 text-[14px] font-semibold text-charcoal-800 transition-colors ${s === size ? "border-2 border-charcoal-300 bg-[#f8fafc]" : "border border-charcoal-300 bg-white hover:bg-[#f8fafc]"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Finish */}
              {showFinishes && (
                <div className="flex flex-col gap-2">
                  <span className={label}>Finish</span>
                  <div className="flex flex-wrap gap-2">
                    {finishVariants.map((v) => (
                      <button
                        key={v.finish}
                        onClick={() => setFinish(v.finish)}
                        className={`flex items-center gap-2 rounded-[4px] px-4 py-3 text-left text-[14px] font-semibold text-charcoal-800 transition-colors ${v.finish === finish ? "border-2 border-copper-500 bg-[#f8fafc]" : "border border-charcoal-300 bg-white hover:bg-[#f8fafc]"}`}
                      >
                        <span className="size-4 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: finishColor(v.finish) }} aria-hidden />
                        {v.finish}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[15px] leading-[1.6] text-charcoal-500">{variant.description}</p>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <button onClick={addOven} className="rounded-[4px] bg-copper-500 px-6 py-4 text-[14px] font-bold uppercase tracking-[0.28px] text-white transition-colors hover:bg-copper-600">
                Add to Cart
              </button>
              <div className="flex items-center gap-2 text-[13px] text-charcoal-500">
                <Truck size={15} className="text-charcoal-400" />
                Shipping is quoted per location · apply your discount code at checkout
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="bg-background">
        <div className={`${wrap} py-16`}>
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className={sectionTitle}>Features &amp; Benefits</h2>
            <p className="max-w-2xl text-[18px] leading-[1.5] text-charcoal-500">{oven.shortDescription}</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((f, i) => {
              const Icon = featureIcons[i % featureIcons.length];
              return (
                <div key={f.title} className="flex flex-col gap-3 rounded-lg border border-[#edf2f7] p-6">
                  <span className="flex size-10 items-center justify-center rounded-full bg-copper-100 text-charcoal-800"><Icon size={18} /></span>
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
            <p className="text-[16px] leading-[1.5] text-charcoal-500">Details for the selected configuration — {oven.name} {variant.size} · {variant.finish}.</p>
          </div>
          <div className="mt-8 overflow-hidden rounded-lg border border-[#e7e2d7]">
            <table className="w-full border-collapse text-left">
              <tbody>
                {specs.map((s, i) => (
                  <tr key={s.label} className={`border-t border-[#edf2f7] first:border-t-0 ${i % 2 ? "bg-[#f8fafc]" : "bg-background"}`}>
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
      {accessories.length > 0 && (
        <section className="bg-background">
          <div className={`${wrap} pb-16`}>
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-[24px] font-extrabold text-charcoal-800">Complete Your Setup</h2>
              <Link href="/shop#accessories" className="text-[14px] text-copper-600 hover:text-copper-700">View All Accessories</Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {accessories.slice(0, 4).map((a) => (
                <div key={a.slug} className="flex flex-col gap-3 rounded-lg border border-charcoal-300 p-4">
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-[#dedddd]">
                    {a.image ? <img src={a.image} alt={a.name} className="h-full w-full object-cover" /> : <ImageIcon size={28} className="text-charcoal-400" />}
                  </div>
                  <div className="flex flex-col">
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

      {/* FAQ */}
      <section className="bg-background">
        <div className={`${wrap} pb-16`}>
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className={sectionTitle}>Frequently Asked Questions</h2>
            <p className="text-[16px] text-charcoal-500">Everything you need to know about owning and operating a Brasa oven.</p>
          </div>
          <div className="mx-auto mt-8 max-w-[1000px]">
            {faqs.map((f, i) => {
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

      {/* Compare the Collection */}
      <section className="bg-background">
        <div className={`${wrap} pb-16`}>
          <div className="flex flex-col gap-2">
            <h2 className={sectionTitle}>Compare the Collection</h2>
            <p className="text-[16px] text-charcoal-500">How {oven.name} stacks up against the rest of the range.</p>
          </div>
          <CompareTable models={compare.models} rows={compare.rows} />
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
