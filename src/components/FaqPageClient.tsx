"use client";

import { Minus, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { FaqContent } from "@/lib/faqContent";

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";
const sectionTitle = "font-heading text-[32px] md:text-[40px] font-extrabold leading-[1.1] tracking-[-0.015em] text-charcoal-800";

export function FaqPageClient({ content }: { content: FaqContent }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const categories = useMemo(() => {
    if (!q) return content.categories;
    return content.categories
      .map((c) => ({ ...c, items: c.items.filter((i) => (i.question + " " + i.answer).toLowerCase().includes(q)) }))
      .filter((c) => c.items.length > 0);
  }, [content.categories, q]);

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-sand">
        <div className={wrap}>
          <nav className="flex items-center gap-2 py-4 text-[13px] text-charcoal-500">
            <Link href="/" className="transition-colors hover:text-copper-600">Home</Link>
            <span>/</span>
            <span className="text-charcoal-800">FAQ</span>
          </nav>
        </div>
      </div>

      {/* Header + search */}
      <section className="bg-background">
        <div className={`${wrap} flex flex-col items-center gap-5 pt-12 pb-6 text-center`}>
          <div className="flex flex-col items-center gap-3">
            <h1 className={sectionTitle}>{content.heroTitle}</h1>
            <p className="text-[16px] text-charcoal-500">{content.heroSubtitle}</p>
          </div>
          <div className="relative w-full max-w-[600px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={content.searchPlaceholder}
              className="w-full rounded-lg border border-charcoal-300 py-3 pl-11 pr-4 text-[15px] text-charcoal-800 placeholder:text-charcoal-400 focus:border-copper-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="bg-background">
        <div className={`${wrap} pb-16`}>
          {categories.length === 0 ? (
            <div className="rounded-lg border border-dashed border-charcoal-300 py-16 text-center text-[15px] text-charcoal-500">
              No answers match &ldquo;{query}&rdquo;. Try a different search.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {categories.map((cat, ci) => (
                <div key={cat.title} className="h-fit overflow-hidden rounded-lg border border-charcoal-300">
                  <div className="border-b border-charcoal-300 bg-sand px-6 py-4">
                    <h2 className="font-heading text-[18px] font-extrabold text-charcoal-800">{cat.title}</h2>
                  </div>
                  <div className="flex flex-col">
                    {cat.items.map((item, ii) => {
                      const id = `${ci}-${ii}-${item.question}`;
                      const isOpen = open === id;
                      return (
                        <div key={id} className="border-b border-[#edf2f7] last:border-b-0">
                          <button onClick={() => setOpen(isOpen ? null : id)} className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left">
                            <span className="text-[15px] text-charcoal-700">{item.question}</span>
                            {isOpen ? <Minus size={16} className="shrink-0 text-charcoal-500" /> : <Plus size={16} className="shrink-0 text-charcoal-500" />}
                          </button>
                          {isOpen && <p className="px-6 pb-4 text-[14px] leading-[1.6] text-charcoal-500">{item.answer}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still have questions CTA */}
      <section className="bg-sand">
        <div className={`${wrap} flex flex-col items-center gap-5 py-16 text-center`}>
          <div className="flex flex-col items-center gap-2">
            <h2 className={sectionTitle}>{content.ctaTitle}</h2>
            <p className="text-[16px] text-charcoal-500">{content.ctaSubtitle}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="rounded bg-copper-500 px-7 py-3 text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">Contact Us</Link>
            <Link href="/contact" className="rounded border border-charcoal-300 bg-background px-7 py-3 text-[14px] font-bold uppercase tracking-[0.03em] text-charcoal-800 transition-colors hover:border-copper-500">Request a Quote</Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[14px] text-charcoal-700">
            <span className="font-semibold">{content.ctaPhone}</span>
            <span>{content.ctaEmail}</span>
          </div>
        </div>
      </section>
    </>
  );
}
