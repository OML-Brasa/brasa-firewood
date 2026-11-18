/* eslint-disable @next/next/no-img-element */
import { FaFacebookF, FaInstagram } from "react-icons/fa6";

import { I18nLink } from "@/components/I18nLink";
import { ui } from "@/i18n/ui";
import { getLocale } from "@/lib/getLocale";

const social = [
  { label: "Instagram", href: "https://www.instagram.com/brasaoven", Icon: FaInstagram },
  { label: "Facebook", href: "https://www.facebook.com/brasaoven", Icon: FaFacebookF },
];

export async function Footer() {
  const locale = await getLocale();
  const t = ui[locale].footer;

  const columns = [
    {
      h: t.collection,
      items: [
        { label: "Dolce", href: "/shop/dolce" },
        { label: "Ravvivata", href: "/shop/ravvivata" },
        { label: "Ardente", href: "/shop/ardente" },
      ],
    },
    {
      h: t.company,
      items: [
        { label: t.ourStory, href: "/about" },
        { label: t.shop, href: "/shop" },
        { label: t.contact, href: "/contact" },
      ],
    },
    {
      h: t.learn,
      items: [
        { label: t.refractoryCare, href: "/care" },
        { label: t.recipes, href: "/recipes" },
        { label: t.faq, href: "/faq" },
      ],
    },
  ];

  const legal = [
    { label: t.privacy, href: "/privacy" },
    { label: t.terms, href: "/terms" },
  ];

  return (
    <footer className="bg-charcoal-800 text-sand">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-10 pt-20 md:px-20">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr_1.4fr] md:gap-10">
          <div className="flex flex-col gap-4">
            <img src="/images/logo.png" alt="Brasa" className="h-12 w-auto object-contain object-left" />
            <p className="max-w-xs text-[15px] leading-[1.4] text-sand/70">
              {t.tagline}
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.h} className="flex flex-col gap-4">
              <span className="text-[15px] font-bold uppercase tracking-[0.04em] text-sand">{col.h}</span>
              <div className="flex flex-col gap-3">
                {col.items.map((it) => (
                  <I18nLink key={it.label} href={it.href} className="text-[15px] text-sand/70 transition-colors hover:text-copper-300">
                    {it.label}
                  </I18nLink>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-4">
            <span className="text-[15px] font-bold uppercase tracking-[0.04em] text-sand">{t.followTitle}</span>
            <p className="text-[15px] leading-[1.4] text-sand/70">
              {t.followCopy}
            </p>
            <div className="flex gap-3">
              {social.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sand transition-colors hover:bg-copper-500 hover:text-white"
                >
                  <Icon size={16} aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-[#cbd5e0]/30 pt-5">
          <div className="flex flex-col justify-between gap-3 text-[13px] text-sand/70 sm:flex-row">
            <span>
              © {new Date().getFullYear()} Brasa by OML Imports. {t.rights} {t.designedBy}{" "}
              <a
                href="https://www.depictbrands.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 transition-colors hover:text-copper-300 hover:underline"
              >
                Depict Brands
              </a>
              .
            </span>
            <div className="flex gap-6">
              {legal.map((l) => (
                <I18nLink key={l.label} href={l.href} className="transition-colors hover:text-copper-300">
                  {l.label}
                </I18nLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
