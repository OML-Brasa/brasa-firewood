"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { basePath, locales, localeLabels, localizedPath } from "@/lib/i18n";

import { useLocale } from "./LocaleProvider";

/** EN | ES toggle. Keeps the visitor on the same page in the other language. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  const current = useLocale();
  const base = basePath(pathname);

  return (
    <div className={`flex items-center gap-1 text-[12px] font-semibold tracking-[0.08em] ${className}`}>
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-white/30">/</span>}
          <Link
            href={localizedPath(locale, base)}
            aria-current={locale === current ? "true" : undefined}
            className={
              locale === current
                ? "text-copper-300"
                : "text-white/60 transition-colors hover:text-white"
            }
          >
            {localeLabels[locale]}
          </Link>
        </span>
      ))}
    </div>
  );
}
