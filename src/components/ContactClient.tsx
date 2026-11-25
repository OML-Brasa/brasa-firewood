"use client";

import { Mail, Minus, Plus, Clock } from "lucide-react";
import { useState } from "react";

import { useLocale } from "@/components/LocaleProvider";
import { formsUI } from "@/i18n/forms";
import type { ContactContent } from "@/lib/contactContent";

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";
const sectionTitle = "font-heading text-[28px] md:text-[36px] font-extrabold leading-[1.14] tracking-[-0.015em] text-charcoal-800";

// Elfsight Contact Form | Brasa Contact Form
const CONTACT_FORM_WIDGET = "a07088e2-f157-4b92-b31c-f8d3f82fdb59";

export function ContactClient({ content, heroImage }: { content: ContactContent; heroImage?: string | null }) {
  const locale = useLocale();
  const t = formsUI[locale];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className={`relative overflow-hidden ${heroImage ? "bg-charcoal-800" : "bg-sand"}`}>
        {heroImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/45" />
          </>
        )}
        <div className={`${wrap} relative flex flex-col items-center gap-3 py-20 text-center`}>
          <h1 className={`font-heading text-[40px] font-extrabold leading-[1.05] tracking-[-0.01em] md:text-[56px] ${heroImage ? "text-sand" : "text-charcoal-800"}`}>{content.heroTitle}</h1>
          <p className={`max-w-3xl text-[16px] leading-[1.6] md:text-[18px] ${heroImage ? "text-sand/85" : "text-charcoal-500"}`}>{content.heroSubtitle}</p>
        </div>
      </section>

      {/* Form + details */}
      <section className="bg-background">
        <div className={`${wrap} grid gap-12 py-16 lg:grid-cols-2`}>
          {/* Form */}
          <div className="flex flex-col gap-6">
            {/* Elfsight "Brasa Contact Form" widget — it renders its own title, so
                there's no heading here. platform.js is loaded site-wide by
                ElfsightWidgets (root layout), so only the container is needed. */}
            <div className={`elfsight-app-${CONTACT_FORM_WIDGET}`} data-elfsight-app-lazy />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-[22px] font-extrabold text-charcoal-800">{content.detailsTitle}</h2>
              <p className="text-[15px] leading-[1.6] text-charcoal-500">{content.detailsIntro}</p>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 text-copper-600" />
                <div className="flex flex-col"><span className="text-[12px] font-bold uppercase tracking-[0.1em] text-charcoal-500">{t.emailAddress}</span><span className="text-[15px] text-charcoal-800">{content.email}</span></div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 text-copper-600" />
                <div className="flex flex-col"><span className="text-[12px] font-bold uppercase tracking-[0.1em] text-charcoal-500">{t.businessHours}</span><span className="whitespace-pre-line text-[15px] leading-[1.6] text-charcoal-800">{content.businessHours}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common questions */}
      <section className="bg-background">
        <div className={`${wrap} pb-16`}>
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className={sectionTitle}>{content.faqTitle}</h2>
            <p className="max-w-3xl text-[15px] leading-[1.5] text-charcoal-500">{content.faqIntro}</p>
          </div>
          <div className="mx-auto mt-8 max-w-[1000px]">
            {content.faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border-b border-[#edf2f7]">
                  <button onClick={() => setOpenFaq(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                    <span className="text-[16px] font-semibold text-charcoal-800">{f.question}</span>
                    {isOpen ? <Minus size={18} className="shrink-0 text-charcoal-500" /> : <Plus size={18} className="shrink-0 text-charcoal-500" />}
                  </button>
                  <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="pb-5 text-[15px] leading-[1.6] text-charcoal-500">{f.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
