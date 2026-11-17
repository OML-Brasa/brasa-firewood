"use client";

import { usePathname } from "next/navigation";

import { basePath, locales, localeLabels, localizedPath } from "@/lib/i18n";

import { useLocale } from "./LocaleProvider";

/**
 * EN | ES toggle. Keeps the visitor on the same page in the other language.
 *
 * Uses a plain anchor (full-page navigation) on purpose — NOT `next/link`.
 * The active locale is carried by a request header (`x-locale`) set in
 * `src/proxy.ts`, and `/es/*` rewrites to the same underlying route as the
 * English page. Next's client-side Router Cache keys content by route path, so
 * a soft navigation between the two languages would reuse the cached tree and
 * never re-fetch with the new header — the URL would change but the content
 * would stay in the old language. A full reload re-runs the proxy server-side
 * and renders the correct language every time.
 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  const current = useLocale();
  const base = basePath(pathname);

  return (
    <div className={`flex items-center gap-1 text-[12px] font-semibold tracking-[0.08em] ${className}`}>
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-white/30">/</span>}
          <a
            href={localizedPath(locale, base)}
            aria-current={locale === current ? "true" : undefined}
            className={
              locale === current
                ? "text-copper-300"
                : "text-white/60 transition-colors hover:text-white"
            }
          >
            {localeLabels[locale]}
          </a>
        </span>
      ))}
    </div>
  );
}
