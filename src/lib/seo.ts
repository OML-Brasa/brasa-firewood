import "server-only";
import type { Metadata } from "next";

import type { Locale } from "@/lib/i18n";
import { client } from "@/sanity/lib/client";
import { localeDoc } from "@/sanity/lib/locale";

/** The SEO object stored on each page document (see schemaTypes/objects/seo.ts). */
export type Seo = { metaTitle?: string; metaDescription?: string } | null;

/**
 * Fetch the SEO block for a single document, locale-aware (falls back to the
 * English document via `localeDoc`). `field` lets one document expose more than
 * one SEO block (e.g. legalPage has `privacySeo` and `termsSeo`); `filter` and
 * `params` support parameterized lookups (e.g. a product by slug).
 */
export async function fetchSeo(
  type: string,
  params: { lang: Locale } & Record<string, unknown>,
  { field = "seo", filter = "" }: { field?: string; filter?: string } = {},
): Promise<Seo> {
  const query = `${localeDoc(type, filter)}{ "seo": ${field}{ metaTitle, metaDescription } }`;
  const doc = await client.fetch(query, params).catch(() => null);
  return doc?.seo ?? null;
}

/**
 * Build Next.js metadata from a fetched SEO block and per-page fallbacks.
 * - An editor-authored meta title is used verbatim (bypasses the `%s | Brasa`
 *   template); otherwise the fallback title flows through that template, and a
 *   missing fallback title leaves the site default ("Brasa").
 * - The description falls back to the page's built-in copy.
 */
export function seoMetadata(
  seo: Seo,
  fallback: { title?: string; description: string },
): Metadata {
  const metaTitle = seo?.metaTitle?.trim();
  const description = seo?.metaDescription?.trim() || fallback.description;
  const title = metaTitle ? { absolute: metaTitle } : fallback.title;
  return { ...(title ? { title } : {}), description };
}
