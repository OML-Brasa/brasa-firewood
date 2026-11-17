import type { Metadata } from "next";

import { LegalArticle } from "@/components/LegalArticle";
import { getLocale } from "@/lib/getLocale";
import { getPrivacyPlaceholder } from "@/lib/legalContent";
import { client } from "@/sanity/lib/client";
import { localeDoc } from "@/sanity/lib/locale";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Privacy Policy — Brasa",
  description: "How Brasa collects, uses, and protects your information.",
};

const query = `${localeDoc("legalPage")}{ privacyTitle, privacyUpdated, privacyBody }`;

export default async function PrivacyPage() {
  const locale = await getLocale();
  const doc = await client.fetch(query, { lang: locale }).catch(() => null);
  const placeholder = getPrivacyPlaceholder(locale);
  return (
    <LegalArticle
      title={doc?.privacyTitle ?? placeholder.title}
      updated={doc?.privacyUpdated ?? placeholder.updated}
      intro={placeholder.intro}
      sections={placeholder.sections}
      body={doc?.privacyBody ?? null}
    />
  );
}
