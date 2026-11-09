import { PortableText, type PortableTextComponents } from "next-sanity";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import type { LegalSection } from "@/lib/legalContent";

type PortableBlock = Parameters<typeof PortableText>[0]["value"];

const wrap = "mx-auto w-full max-w-[820px] px-6 md:px-10";

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-4 text-[16px] leading-[1.7] text-charcoal-600">{children}</p>,
    h2: ({ children }) => <h2 className="mt-10 font-heading text-[22px] font-extrabold text-charcoal-800 md:text-[26px]">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-6 text-[18px] font-bold text-charcoal-800">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="mt-4 border-l-2 border-copper-400 pl-4 text-[16px] italic text-charcoal-600">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-[16px] leading-[1.7] text-charcoal-600">{children}</ul>,
    number: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-[16px] leading-[1.7] text-charcoal-600">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-charcoal-800">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a href={(value as { href?: string })?.href} className="text-copper-600 underline hover:text-copper-700" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

export function LegalArticle({
  title,
  updated,
  intro,
  sections,
  body,
}: {
  title: string;
  updated: string;
  intro?: string;
  sections?: LegalSection[];
  body?: PortableBlock | null;
}) {
  const hasBody = Array.isArray(body) && body.length > 0;
  return (
    <div className="flex flex-col bg-background">
      <Navbar />
      <section className="bg-sand">
        <div className={`${wrap} py-14 md:py-20`}>
          <h1 className="font-heading text-[36px] font-extrabold leading-[1.08] tracking-[-0.01em] text-charcoal-800 md:text-[48px]">{title}</h1>
          {updated && <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-charcoal-500">Last updated: {updated}</p>}
        </div>
      </section>

      <article className="bg-background">
        <div className={`${wrap} py-12 md:py-16`}>
          {hasBody ? (
            <PortableText value={body} components={ptComponents} />
          ) : (
            <>
              {intro && <p className="text-[16px] leading-[1.7] text-charcoal-600">{intro}</p>}
              {sections?.map((s) => (
                <section key={s.heading}>
                  <h2 className="mt-10 font-heading text-[22px] font-extrabold text-charcoal-800 md:text-[26px]">{s.heading}</h2>
                  {s.paras.map((p, i) => (
                    <p key={i} className="mt-4 text-[16px] leading-[1.7] text-charcoal-600">{p}</p>
                  ))}
                </section>
              ))}
            </>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}
