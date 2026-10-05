"use client";

import { Check, Mail, Minus, Phone, Plus, Clock } from "lucide-react";
import { useState } from "react";

import type { ContactContent } from "@/lib/contactContent";

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";
const sectionTitle = "font-heading text-[28px] md:text-[36px] font-extrabold leading-[1.14] tracking-[-0.015em] text-charcoal-800";
const fieldCls = "rounded border border-charcoal-300 px-3 py-2.5 text-[14px] text-charcoal-800 placeholder:text-charcoal-400 focus:border-copper-500 focus:outline-none";
const labelCls = "text-[13px] font-semibold text-charcoal-800";

export function ContactClient({ content, heroImage }: { content: ContactContent; heroImage?: string | null }) {
  const [form, setForm] = useState({ first: "", last: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.first || !form.last || !form.email || !form.subject || !form.message) {
      setError("Please fill in your name, email, subject, and message.");
      return;
    }
    setError("");
    setSent(true);
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
                <span className="flex items-center gap-2 text-[16px] font-bold text-[#2f7d4f]"><Check size={18} /> Message sent</span>
                <span className="text-[14px] text-charcoal-600">Thanks, {form.first}. Our team will get back to you at {form.email} shortly.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {error && <p className="rounded border border-copper-300 bg-copper-50 px-4 py-2.5 text-[14px] text-copper-700">{error}</p>}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5"><label className={labelCls}>First Name</label><input value={form.first} onChange={set("first")} placeholder="e.g. John" className={fieldCls} /></div>
                  <div className="flex flex-col gap-1.5"><label className={labelCls}>Last Name</label><input value={form.last} onChange={set("last")} placeholder="e.g. Smith" className={fieldCls} /></div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5"><label className={labelCls}>Email Address</label><input type="email" value={form.email} onChange={set("email")} placeholder="e.g. john@example.com" className={fieldCls} /></div>
                  <div className="flex flex-col gap-1.5"><label className={labelCls}>Phone Number (Optional)</label><input value={form.phone} onChange={set("phone")} placeholder="e.g. (555) 000-0000" className={fieldCls} /></div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Subject</label>
                  <select value={form.subject} onChange={set("subject")} className={fieldCls}>
                    <option value="">Select a subject...</option>
                    {content.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Your Message</label>
                  <textarea value={form.message} onChange={set("message")} rows={5} placeholder="Tell us about your project, culinary needs, or ask a question..." className={fieldCls} />
                </div>
                <button onClick={submit} className="w-fit rounded bg-copper-500 px-7 py-3 text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">Send Message</button>
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
                <div className="flex flex-col"><span className="text-[12px] font-bold uppercase tracking-[0.1em] text-charcoal-500">Email Address</span><span className="text-[15px] text-charcoal-800">{content.email}</span></div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-copper-600" />
                <div className="flex flex-col"><span className="text-[12px] font-bold uppercase tracking-[0.1em] text-charcoal-500">Phone Number</span><span className="text-[15px] text-charcoal-800">{content.phone}</span></div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 text-copper-600" />
                <div className="flex flex-col"><span className="text-[12px] font-bold uppercase tracking-[0.1em] text-charcoal-500">Business Hours</span><span className="whitespace-pre-line text-[15px] leading-[1.6] text-charcoal-800">{content.businessHours}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation */}
      <section className="bg-background">
        <div className={`${wrap} pb-16`}>
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-[#e7e2d7] bg-sand p-8 md:p-10">
            <div className="flex max-w-2xl flex-col gap-2">
              <h2 className="font-heading text-[24px] font-extrabold text-charcoal-800">{content.consultationTitle}</h2>
              <p className="text-[15px] leading-[1.5] text-charcoal-600">{content.consultationBody}</p>
            </div>
            <a href="#" className="w-fit rounded bg-copper-500 px-7 py-3 text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">Schedule a Call</a>
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
                  {isOpen && <p className="pb-5 text-[15px] leading-[1.6] text-charcoal-500">{f.answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
