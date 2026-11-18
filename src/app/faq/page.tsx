import type { Metadata } from "next";

import { FaqPageClient } from "@/components/FaqPageClient";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { getLocale } from "@/lib/getLocale";
import { faqDefaults, type FaqContent } from "@/lib/faqContent";
import { fetchSeo, seoMetadata } from "@/lib/seo";
import { client } from "@/sanity/lib/client";
import { localeDoc } from "@/sanity/lib/locale";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const seo = await fetchSeo("faqPage", { lang: locale });
  return seoMetadata(seo, {
    title: locale === "es" ? "Preguntas Frecuentes" : "FAQ",
    description:
      "Answers to common questions about owning and operating a Brasa wood-fired oven — sizing, finishes, shipping, installation, curing, and care.",
  });
}

const query = `${localeDoc("faqPage")}{
  heroTitle, heroSubtitle, searchPlaceholder,
  categories[]{ title, items[]{ question, answer } },
  ctaTitle, ctaSubtitle, ctaPhone, ctaEmail
}`;

export default async function FaqPage() {
  const locale = await getLocale();
  const doc = await client.fetch(query, { lang: locale }).catch(() => null);
  const content: FaqContent = {
    heroTitle: doc?.heroTitle ?? faqDefaults.heroTitle,
    heroSubtitle: doc?.heroSubtitle ?? faqDefaults.heroSubtitle,
    searchPlaceholder: doc?.searchPlaceholder ?? faqDefaults.searchPlaceholder,
    categories: doc?.categories?.length ? doc.categories : faqDefaults.categories,
    ctaTitle: doc?.ctaTitle ?? faqDefaults.ctaTitle,
    ctaSubtitle: doc?.ctaSubtitle ?? faqDefaults.ctaSubtitle,
    ctaPhone: doc?.ctaPhone ?? faqDefaults.ctaPhone,
    ctaEmail: doc?.ctaEmail ?? faqDefaults.ctaEmail,
  };
  return (
    <div className="flex flex-col bg-background">
      <Navbar />
      <FaqPageClient content={content} />
      <Newsletter />
      <Footer />
    </div>
  );
}
