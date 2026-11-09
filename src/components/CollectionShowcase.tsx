"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";

export type ShowcaseProduct = {
  name: string;
  slug: string;
  price: string;
  image: string;
};

/**
 * Home "Collection" block.
 * Clicking a thumbnail swaps the large hero image above it (no navigation).
 * The hero image itself is the link to the selected product's page.
 */
export function CollectionShowcase({ products }: { products: ShowcaseProduct[] }) {
  const [selected, setSelected] = useState(0);
  const active = products[selected] ?? products[0];

  if (!active) return null;

  return (
    <>
      {/* Hero — shows the selected model and links to its product page */}
      <Link
        href={`/shop/${active.slug}`}
        aria-label={`View the Brasa ${active.name}`}
        className="group mt-12 block overflow-hidden rounded-xl border border-[#e7e2d7] bg-white"
      >
        <img
          src={active.image}
          alt={`Brasa ${active.name} oven`}
          className="aspect-[16/9] w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>

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
                  alt={`Brasa ${p.name} oven`}
                  className="aspect-square w-full object-contain transition-transform group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex items-center justify-between">
                <h3 className={`text-[20px] font-extrabold transition-colors ${isActive ? "text-copper-600" : "text-charcoal-800"}`}>{p.name}</h3>
                <span className="text-[18px] font-bold tracking-[0.02em] text-charcoal-800">{p.price}</span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
