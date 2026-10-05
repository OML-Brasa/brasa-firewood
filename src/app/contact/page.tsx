import { ContactClient } from "@/components/ContactClient";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { contactDefaults, type ContactContent } from "@/lib/contactContent";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

const query = `*[_type == "contactPage"][0]{
  heroTitle, heroSubtitle, heroImage, formTitle, subjects,
  detailsTitle, detailsIntro, email, phone, businessHours,
  consultationTitle, consultationBody, faqTitle, faqIntro,
  faqs[]{ question, answer }
}`;

export default async function ContactPage() {
  const doc = await client.fetch(query).catch(() => null);
  const content: ContactContent = {
    heroTitle: doc?.heroTitle ?? contactDefaults.heroTitle,
    heroSubtitle: doc?.heroSubtitle ?? contactDefaults.heroSubtitle,
    formTitle: doc?.formTitle ?? contactDefaults.formTitle,
    subjects: doc?.subjects?.length ? doc.subjects : contactDefaults.subjects,
    detailsTitle: doc?.detailsTitle ?? contactDefaults.detailsTitle,
    detailsIntro: doc?.detailsIntro ?? contactDefaults.detailsIntro,
    email: doc?.email ?? contactDefaults.email,
    phone: doc?.phone ?? contactDefaults.phone,
    businessHours: doc?.businessHours ?? contactDefaults.businessHours,
    consultationTitle: doc?.consultationTitle ?? contactDefaults.consultationTitle,
    consultationBody: doc?.consultationBody ?? contactDefaults.consultationBody,
    faqTitle: doc?.faqTitle ?? contactDefaults.faqTitle,
    faqIntro: doc?.faqIntro ?? contactDefaults.faqIntro,
    faqs: doc?.faqs?.length ? doc.faqs : contactDefaults.faqs,
  };
  const heroImage = doc?.heroImage ? urlFor(doc.heroImage).width(1920).auto("format").url() : null;
  return (
    <div className="flex flex-col bg-background">
      <Navbar />
      <ContactClient content={content} heroImage={heroImage} />
      <Newsletter />
      <Footer />
    </div>
  );
}
