import data from "@/content/contact.json";

export type ContactFaq = { question: string; answer: string };
export type ContactContent = {
  heroTitle: string;
  heroSubtitle: string;
  formTitle: string;
  subjects: string[];
  detailsTitle: string;
  detailsIntro: string;
  email: string;
  phone: string;
  businessHours: string;
  consultationTitle: string;
  consultationBody: string;
  faqTitle: string;
  faqIntro: string;
  faqs: ContactFaq[];
};

export const contactDefaults = data as ContactContent;
