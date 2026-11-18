"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

import { I18nLink } from "@/components/I18nLink";
import { useLocale } from "@/components/LocaleProvider";
import { shopUI } from "@/i18n/shop";

export type ShowcaseProduct = {
  name: string;
  slug: string;
  price: string;
  image: string;
  /** Large image shown in the hero when this product is selected. */
  featured: string;
};

/**
 * Home "Collection" block.
 * Clicking a thumbnail swaps the large hero image above it to that product's
 * featured image (no navigation).
 * The hero image itself is the link to the selected product's page.
 */
export function CollectionShowcase({ products }: { products: ShowcaseProduct[] }) {
  const locale = useLocale();
  const t = shopUI[locale];
  const [selected, setSelected] = useState(0);
  const active = products[selected] ?? products[0];

  if (!active) return null;

  return (
    <>
      {/* Hero — shows the selected model and links to its product page */}
      <I18nLink
        href={`/shop/${active.slug}`}
        aria-label={t.viewBrasa(active.name)}
        className="group mt-12 block overflow-hidden rounded-xl border border-[#e7e2d7] bg-white"
      >
        <img
          key={active.featured}
          src={active.featured}
          alt={t.ovenAlt(active.name)}
          className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </I18nLink>

      {/* Thumbnails — click to change the hero (they do not link) */}
      <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3">
        {products.map((p, i) => {
          const isActive = i === selected;
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => setSelected(i)}
              aria-pressed={isActive}
              className="group flex flex-col gap-4 text-left"
            >
              <div
                className={`overflow-hidden rounded-lg border bg-white transition-colors ${
                  isActive ? "border-copper-500 ring-1 ring-copper-500" : "border-[#e7e2d7] hover:border-copper-300"
                }`}
              >
                <img
                  src={p.image}
                  alt={t.ovenAlt(p.name)}
                  className="aspect-square w-full object-contain transition-transform group-hover:scale-[1.02]"
                />
              </div>
              {/* Stack name over price on narrow cards (2-col mobile / 3-col
                  tablet) so they never collide; switch to a single row only
                  once the cards are wide enough (lg). Price stays on one line. */}
              <div className="flex flex-col gap-0.5 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
                <h3 className={`text-[20px] font-extrabold transition-colors lg:min-w-0 lg:truncate ${isActive ? "text-copper-600" : "text-charcoal-800"}`}>{p.name}</h3>
                <span className="whitespace-nowrap text-[18px] font-bold tracking-[0.02em] text-charcoal-800">{p.price}</span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
