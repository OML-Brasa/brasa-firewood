import type { Metadata } from "next";

import { LegalArticle } from "@/components/LegalArticle";
import { privacyPlaceholder } from "@/lib/legalContent";
import { client } from "@/sanity/lib/client";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Privacy Policy — Brasa",
  description: "How Brasa collects, uses, and protects your information.",
};

const query = `*[_type == "legalPage"][0]{ privacyTitle, privacyUpdated, privacyBody }`;

export default async function PrivacyPage() {
  const doc = await client.fetch(query).catch(() => null);
  return (
    <LegalArticle
      title={doc?.privacyTitle ?? privacyPlaceholder.title}
      updated={doc?.privacyUpdated ?? privacyPlaceholder.updated}
      intro={privacyPlaceholder.intro}
      sections={privacyPlaceholder.sections}
      body={doc?.privacyBody ?? null}
    />
  );
}
