import type { Metadata } from "next";

import { LegalArticle } from "@/components/LegalArticle";
import { termsPlaceholder } from "@/lib/legalContent";
import { client } from "@/sanity/lib/client";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Terms of Use — Brasa",
  description: "The terms that govern your use of the Brasa website and products.",
};

const query = `*[_type == "legalPage"][0]{ termsTitle, termsUpdated, termsBody }`;

export default async function TermsPage() {
  const doc = await client.fetch(query).catch(() => null);
  return (
    <LegalArticle
      title={doc?.termsTitle ?? termsPlaceholder.title}
      updated={doc?.termsUpdated ?? termsPlaceholder.updated}
      intro={termsPlaceholder.intro}
      sections={termsPlaceholder.sections}
      body={doc?.termsBody ?? null}
    />
  );
}
