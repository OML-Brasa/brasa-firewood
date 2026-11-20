"use client";

import { Check, Mail, Minus, Plus, Clock } from "lucide-react";
import { useState } from "react";

import { useLocale } from "@/components/LocaleProvider";
import { formsUI } from "@/i18n/forms";
import type { ContactContent } from "@/lib/contactContent";

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";
const sectionTitle = "font-heading text-[28px] md:text-[36px] font-extrabold leading-[1.14] tracking-[-0.015em] text-charcoal-800";
const fieldCls = "rounded border border-charcoal-300 px-3 py-2.5 text-[14px] text-charcoal-800 placeholder:text-charcoal-400 focus:border-copper-500 focus:outline-none";
const labelCls = "text-[13px] font-semibold text-charcoal-800";

export function ContactClient({ content, heroImage }: { content: ContactContent; heroImage?: string | null }) {
  const locale = useLocale();
  const t = formsUI[locale];
  const [form, setForm] = useState({ first: "", last: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // Fallback used until HubSpot is configured (or if a submission fails): open
  // the visitor's email app addressed to the sales inbox, so no message is lost.
  const openMailto = () => {
    const body = [
      `${t.bodyName}: ${form.first} ${form.last}`,
      `${t.bodyEmail}: ${form.email}`,
      form.phone ? `${t.bodyPhone}: ${form.phone}` : "",
      "",
      form.message,
    ]
      .filter((l) => l !== "")
      .join("\n");
    window.location.href = `mailto:${content.email}?subject=${encodeURIComponent(
      form.subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const submit = async () => {
    if (!form.first || !form.last || !form.email || !form.subject || !form.message) {
      setError(t.contactError);
      return;
    }
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.first,
          lastName: form.last,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
          pageUri: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { delivered?: string };
      // Went to HubSpot → done. Otherwise (not configured yet, or an error) fall
      // back to email so the message still reaches the team.
      if (!(res.ok && data.delivered === "hubspot")) openMailto();
      setSent(true);
    } catch {
      openMailto();
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

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
            <h2 className={sectionTitle}>{content.formTitle}</h2>
            {sent ? (
              <div className="flex flex-col items-start gap-2 rounded-lg border border-[#cbe0cf] bg-[#f1f7f2] p-6">
                <span className="flex items-center gap-2 text-[16px] font-bold text-[#2f7d4f]"><Check size={18} /> {t.contactSentTitle}</span>
                <span className="text-[14px] text-charcoal-600">{t.contactSentThanksPrefix}{form.first}{t.contactSentMid}{form.email}{t.contactSentSuffix}</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {error && <p className="rounded border border-copper-300 bg-copper-50 px-4 py-2.5 text-[14px] text-copper-700">{error}</p>}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5"><label className={labelCls}>{t.firstName}</label><input value={form.first} onChange={set("first")} placeholder={t.firstNamePlaceholder} className={fieldCls} /></div>
                  <div className="flex flex-col gap-1.5"><label className={labelCls}>{t.lastName}</label><input value={form.last} onChange={set("last")} placeholder={t.lastNamePlaceholder} className={fieldCls} /></div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5"><label className={labelCls}>{t.emailAddress}</label><input type="email" value={form.email} onChange={set("email")} placeholder={t.emailPlaceholder} className={fieldCls} /></div>
                  <div className="flex flex-col gap-1.5"><label className={labelCls}>{t.phoneOptional}</label><input value={form.phone} onChange={set("phone")} placeholder={t.phonePlaceholder} className={fieldCls} /></div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>{t.subject}</label>
                  <select value={form.subject} onChange={set("subject")} className={fieldCls}>
                    <option value="">{t.subjectSelect}</option>
                    {content.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>{t.yourMessage}</label>
                  <textarea value={form.message} onChange={set("message")} rows={5} placeholder={t.messagePlaceholder} className={fieldCls} />
                </div>
                <button onClick={submit} disabled={submitting} className="w-fit rounded bg-copper-500 px-7 py-3 text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600 disabled:opacity-60">{t.sendMessage}</button>
              </div>
            )}
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
