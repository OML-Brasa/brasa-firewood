"use client";

/* eslint-disable @next/next/no-img-element */
import { ChefHat, Minus, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { RecipesContent } from "@/lib/recipesContent";

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";
const sectionTitle = "font-heading text-[32px] md:text-[40px] font-extrabold leading-[1.1] tracking-[-0.015em] text-charcoal-800";

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[12px] uppercase tracking-[0.06em] text-charcoal-500">{label}</span>
      <span className="text-[14px] font-semibold text-charcoal-800">{value}</span>
    </div>
  );
}

export function RecipesClient({ content }: { content: RecipesContent }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<number | null>(0);

  const q = query.trim().toLowerCase();
  const recipes = useMemo(
    () =>
      content.recipes
        .map((r, i) => ({ r, i }))
        .filter(({ r }) => (cat === "All" || r.category === cat) && (!q || r.title.toLowerCase().includes(q))),
    [content.recipes, cat, q]
  );

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-sand">
        <div className={wrap}>
          <nav className="flex items-center gap-2 py-4 text-[13px] text-charcoal-500">
            <Link href="/" className="transition-colors hover:text-copper-600">Home</Link>
            <span>/</span>
            <span className="text-charcoal-800">Recipes</span>
          </nav>
        </div>
      </div>

      {/* Header + search + tabs */}
      <section className="bg-background">
        <div className={`${wrap} flex flex-col items-center gap-6 pt-12 pb-8 text-center`}>
          <div className="flex flex-col items-center gap-3">
            <h1 className={sectionTitle}>{content.heroTitle}</h1>
            <p className="text-[16px] text-charcoal-500">{content.heroSubtitle}</p>
          </div>
          <div className="relative w-full max-w-[600px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={content.searchPlaceholder} className="w-full rounded-lg border border-charcoal-300 py-3 pl-11 pr-4 text-[15px] text-charcoal-800 placeholder:text-charcoal-400 focus:border-copper-500 focus:outline-none" />
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {content.categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-5 py-2 text-[14px] font-medium transition-colors ${cat === c ? "bg-copper-500 text-white" : "border border-charcoal-300 text-charcoal-700 hover:border-copper-500 hover:text-copper-700"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recipe grid */}
      <section className="bg-background">
        <div className={`${wrap} pb-16`}>
          {recipes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-charcoal-300 py-16 text-center text-[15px] text-charcoal-500">No recipes match your search.</div>
          ) : (
            <div className="grid items-start gap-8 md:grid-cols-2">
              {recipes.map(({ r, i }) => {
                const isOpen = open === i;
                return (
                  <article key={r.title} className="overflow-hidden rounded-lg border border-charcoal-300 bg-background p-6">
                    <div className="flex aspect-[580/320] items-center justify-center overflow-hidden rounded-md bg-[#dedddd]">
                      {r.image ? <img src={r.image} alt={r.title} className="h-full w-full object-cover" /> : <ChefHat size={32} className="text-charcoal-400" />}
                    </div>
                    <button onClick={() => setOpen(isOpen ? null : i)} className="mt-5 flex w-full items-start justify-between gap-4 text-left">
                      <div className="flex flex-col gap-1">
                        <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-copper-600">{r.category}</span>
                        <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">{r.title}</h2>
                      </div>
                      {isOpen ? <Minus size={20} className="mt-1 shrink-0 text-charcoal-500" /> : <Plus size={20} className="mt-1 shrink-0 text-charcoal-500" />}
                    </button>
                    {isOpen && (
                      <div className="mt-4 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                          <Meta label="Prep Time" value={r.prepTime} />
                          <Meta label="Cook Time" value={r.cookTime} />
                          <Meta label="Oven Temp" value={r.ovenTemp} />
                          <Meta label="Difficulty" value={r.difficulty} />
                        </div>
                        <div className="h-px w-full bg-[#edf2f7]" />
                        <div className="flex flex-col gap-2">
                          <h3 className="font-heading text-[16px] font-extrabold text-charcoal-800">Ingredients</h3>
                          <ul className="flex flex-col gap-1">
                            {r.ingredients.map((ing) => (
                              <li key={ing} className="text-[14px] leading-[1.5] text-charcoal-500">• {ing}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="h-px w-full bg-[#edf2f7]" />
                        <div className="flex flex-col gap-2">
                          <h3 className="font-heading text-[16px] font-extrabold text-charcoal-800">Directions</h3>
                          <p className="text-[14px] leading-[1.6] text-charcoal-500">{r.directions}</p>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Submit CTA */}
      <section className="bg-sand">
        <div className={`${wrap} flex flex-col items-center gap-4 py-16 text-center`}>
          <div className="flex flex-col items-center gap-2">
            <h2 className={sectionTitle}>{content.submitTitle}</h2>
            <p className="max-w-2xl text-[16px] text-charcoal-500">{content.submitSubtitle}</p>
          </div>
          <a href="#" className="rounded bg-copper-500 px-7 py-3 text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">Submit Recipe</a>
        </div>
      </section>
    </>
  );
}
