import { FaqPageClient } from "@/components/FaqPageClient";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { faqDefaults, type FaqContent } from "@/lib/faqContent";
import { client } from "@/sanity/lib/client";

export const revalidate = 60;

const query = `*[_type == "faqPage"][0]{
  heroTitle, heroSubtitle, searchPlaceholder,
  categories[]{ title, items[]{ question, answer } },
  ctaTitle, ctaSubtitle, ctaPhone, ctaEmail
}`;

export default async function FaqPage() {
  const doc = await client.fetch(query).catch(() => null);
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
