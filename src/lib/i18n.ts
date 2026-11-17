/**
 * Core i18n helpers. English is the default locale and lives at the site root
 * (unprefixed). Spanish lives under `/es`. The locale is resolved per-request by
 * `src/proxy.ts`, which rewrites `/es/*` to the underlying route and tags the
 * request with an `x-locale` header.
 */

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/**
 * Turn a base (English) path into the path for a given locale.
 * en → unchanged; es → prefixed with `/es`.
 */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return clean;
  return clean === "/" ? "/es" : `/es${clean}`;
}

/** Strip any locale prefix from a browser path to get the base (English) path. */
export function basePath(path: string): string {
  if (path === "/es") return "/";
  if (path.startsWith("/es/")) return path.slice(3);
  return path;
}

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};
