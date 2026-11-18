"use client";

import { useState } from "react";

import { I18nLink } from "@/components/I18nLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/components/LocaleProvider";
import { ui } from "@/i18n/ui";
import { useCart } from "@/lib/cart";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const locale = useLocale();
  const t = ui[locale].nav;

  const links = [
    { label: t.story, href: "/about" },
    { label: t.shop, href: "/shop" },
    { label: t.faq, href: "/faq" },
    { label: t.recipes, href: "/recipes" },
    { label: t.care, href: "/care" },
    { label: t.contact, href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-charcoal-800/95 text-white backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-20">
        <I18nLink href="/" aria-label="Brasa — home" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="Brasa" className="h-10 w-auto" />
        </I18nLink>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <I18nLink
                href={l.href}
                className="text-[15px] uppercase tracking-[0.08em] text-white/90 transition-colors hover:text-copper-300"
              >
                {l.label}
              </I18nLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          <LanguageSwitcher className="hidden sm:flex" />
          <I18nLink
            href="/cart"
            aria-label={t.cart}
            className="flex items-center gap-1.5 text-white/80 transition-colors hover:text-copper-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M2 3h3l2.2 11.3a1.6 1.6 0 0 0 1.6 1.3h8.2a1.6 1.6 0 0 0 1.6-1.3L22 7H6" />
            </svg>
            <span className="text-[13px] text-white/60">({count})</span>
          </I18nLink>
          <button
            aria-label={t.menu}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center md:hidden"
          >
            <span className="relative block h-3 w-6">
              <span
                className={`absolute left-0 block h-0.5 w-6 bg-white transition-transform ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-6 bg-white transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-6 bg-white transition-transform ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-white/10 px-6 pb-6 pt-2 md:hidden">
          {links.map((l) => (
            <li key={l.label}>
              <I18nLink
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-h6 text-white"
              >
                {l.label}
              </I18nLink>
            </li>
          ))}
          <li className="pt-2">
            <LanguageSwitcher className="text-[14px]" />
          </li>
        </ul>
      )}
    </header>
  );
}
