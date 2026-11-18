"use client";

import { useState } from "react";

import { useLocale } from "@/components/LocaleProvider";
import { formsUI } from "@/i18n/forms";

const SALES_EMAIL = "sales@brasaoven.com";

export function Newsletter() {
  const locale = useLocale();
  const t = formsUI[locale];
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const body = `${t.newsletterBodyPrefix}${email}`;
    window.location.href = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(
      t.newsletterSubject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section id="newsletter" className="bg-copper-100">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-6 px-6 py-20 text-center md:px-20 md:py-24">
        <h2 className="font-heading text-[28px] font-extrabold leading-[1.14] tracking-[-0.015em] text-charcoal-800 md:text-[36px]">
          {t.newsletterTitle}
        </h2>
        <p className="max-w-xl text-[18px] leading-[1.4] text-charcoal-800">
          {t.newsletterCopy}
        </p>
        {sent ? (
          <p className="mt-2 text-[16px] font-semibold text-charcoal-800">
            {t.newsletterThanks}
          </p>
        ) : (
          <form onSubmit={subscribe} className="mt-2 flex w-full max-w-lg flex-col gap-4 sm:flex-row sm:justify-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.newsletterPlaceholder}
              className="flex-1 rounded border border-charcoal-300 bg-background px-4 py-3.5 text-[15px] text-charcoal-800 outline-none placeholder:text-charcoal-500 focus:border-copper-500"
            />
            <button
              type="submit"
              className="rounded bg-copper-500 px-7 py-3.5 text-[14px] font-bold uppercase tracking-[0.03em] text-sand transition-colors hover:bg-copper-600"
            >
              {t.subscribe}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
