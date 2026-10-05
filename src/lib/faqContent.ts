import data from "@/content/faq.json";

export type FaqItem = { question: string; answer: string };
export type FaqCategory = { title: string; items: FaqItem[] };
export type FaqContent = {
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  categories: FaqCategory[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPhone: string;
  ctaEmail: string;
};

export const faqDefaults = data as FaqContent;
