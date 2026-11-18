import type { Metadata } from "next";

import { LegalArticle } from "@/components/LegalArticle";
import { getLocale } from "@/lib/getLocale";
import { getTermsPlaceholder } from "@/lib/legalContent";
import { fetchSeo, seoMetadata } from "@/lib/seo";
import { client } from "@/sanity/lib/client";
import { localeDoc } from "@/sanity/lib/locale";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const seo = await fetchSeo("legalPage", { lang: locale }, { field: "termsSeo" });
  return seoMetadata(seo, {
    title: locale === "es" ? "Términos de Uso" : "Terms of Use",
    description: "The terms that govern your use of the Brasa website and products.",
  });
}

const query = `${localeDoc("legalPage")}{ termsTitle, termsUpdated, termsBody }`;

export default async function TermsPage() {
  const locale = await getLocale();
  const doc = await client.fetch(query, { lang: locale }).catch(() => null);
  const placeholder = getTermsPlaceholder(locale);
  return (
    <LegalArticle
      title={doc?.termsTitle ?? placeholder.title}
      updated={doc?.termsUpdated ?? placeholder.updated}
      intro={placeholder.intro}
      sections={placeholder.sections}
      body={doc?.termsBody ?? null}
    />
  );
}
