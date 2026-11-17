"use client";

/* eslint-disable @next/next/no-img-element */
import { Check, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { I18nLink } from "@/components/I18nLink";
import { useLocale } from "@/components/LocaleProvider";
import { getLastOrder, money, type PlacedOrder } from "@/lib/cart";
import type { WhatsNextStep } from "@/lib/checkoutDefaults";
import { checkoutUI } from "@/i18n/checkout";

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";
const cardCls = "flex flex-col gap-4 rounded-lg border border-charcoal-300 p-6";

export function OrderConfirmedClient({
  whatsNext,
  supportPhone,
  supportEmail,
}: {
  whatsNext: WhatsNextStep[];
  supportPhone: string;
  supportEmail: string;
}) {
  const locale = useLocale();
  const t = checkoutUI[locale];
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const o = getLastOrder();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(o);
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-[420px]" />;

  if (!order) {
    return (
      <section className="bg-background">
        <div className={`${wrap} py-20 text-center`}>
          <h1 className="font-heading text-[32px] font-extrabold text-charcoal-800">{t.noRecentRequest}</h1>
          <p className="mt-3 text-[15px] text-charcoal-500">{t.noRecentHint}</p>
          <I18nLink href="/shop" className="mt-6 inline-block rounded bg-copper-500 px-7 py-3 text-[14px] font-bold uppercase tracking-[0.03em] text-white transition-colors hover:bg-copper-600">{t.browseShop}</I18nLink>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background">
      <div className={`${wrap} py-12`}>
        {/* Heading */}
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-copper-500 text-white"><Check size={22} strokeWidth={3} /></span>
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-[32px] font-extrabold leading-[1.1] text-charcoal-800 md:text-[36px]">{t.quoteRequested}</h1>
            <p className="text-[15px] text-charcoal-500">{t.thanksPrefix}{order.name ? `, ${order.name.split(" ")[0]}` : ""}{t.thanksBody}{order.email || t.yourInbox}.</p>
          </div>
        </div>

        {/* Reference banner */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-charcoal-300 px-6 py-4">
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal-500">{t.yourRequestId}</span>
            <span className="text-[18px] font-bold text-charcoal-800">{t.requestNo}{order.orderNo}</span>
          </div>
          <div className="flex flex-col text-right text-[13px] text-charcoal-500">
            <span>{t.dateLabel} {order.date}</span>
            <span className="font-bold text-charcoal-800">{t.statusLabel} {t.statusPending}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Left */}
          <div className="flex flex-col gap-8">
            <div className={cardCls}>
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">{t.requestedItems}</h2>
              <div className="flex flex-col gap-4">
                {order.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-4">
                    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-charcoal-300 bg-white">
                      {it.image ? <img src={it.image} alt={it.name} className="h-full w-full object-cover" /> : <ImageIcon size={22} className="text-charcoal-400" />}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-[15px] font-bold text-charcoal-800">{it.name}</span>
                      {it.desc && <span className="line-clamp-1 text-[13px] text-charcoal-500">{it.desc}</span>}
                      <span className="text-[13px] text-charcoal-500">{t.qty} {it.qty}</span>
                    </div>
                    <span className="shrink-0 font-heading text-[18px] font-extrabold text-charcoal-800">{money(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={cardCls}>
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">{t.deliveryAddress}</h2>
              <div className="flex flex-col gap-1">
                <span className="text-[14px] font-bold text-charcoal-800">{order.name || "—"}</span>
                <span className="text-[14px] text-charcoal-500">{order.address.line1}</span>
                {order.address.line2 && <span className="text-[14px] text-charcoal-500">{order.address.line2}</span>}
                <span className="text-[14px] text-charcoal-500">{order.address.city}, {order.address.state} {order.address.zip}</span>
                <span className="text-[14px] text-charcoal-500">{order.address.country}</span>
                {order.address.phone && <span className="text-[14px] text-charcoal-500">{t.phoneLabel} {order.address.phone}</span>}
              </div>
              <p className="rounded bg-[#f8fafc] px-3 py-2.5 text-[13px] text-charcoal-600">{t.addressNote}</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-8">
            <div className={cardCls}>
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">{t.estimate}</h2>
              <div className="flex items-center justify-between text-[14px]"><span className="text-charcoal-500">{t.subtotal}</span><span className="text-charcoal-800">{money(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex items-center justify-between text-[14px]"><span className="text-charcoal-500">{t.discount}{order.promoCode ? ` (${order.promoCode})` : ""}</span><span className="text-[#2f7d4f]">−{money(order.discount)}</span></div>}
              <div className="flex items-center justify-between text-[14px]"><span className="text-charcoal-500">{t.shipping}</span><span className="text-charcoal-500">{t.quotedSeparately}</span></div>
              <div className="flex items-center justify-between border-t border-[#edf2f7] pt-4">
                <span className="font-heading text-[18px] font-extrabold text-charcoal-800">{t.estimatedSubtotal}</span>
                <span className="font-heading text-[26px] font-extrabold text-charcoal-800">{money(order.total)}</span>
              </div>
              <p className="text-[12px] text-charcoal-500">{t.estimateNote}</p>
            </div>

            <div className={cardCls}>
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">{t.whatsNext}</h2>
              <div className="flex flex-col gap-4">
                {whatsNext.map((s, i) => (
                  <div key={s.title} className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-copper-500 text-[12px] font-bold text-white">{i + 1}</span>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-charcoal-800">{s.title}</span>
                      <span className="text-[13px] leading-[1.45] text-charcoal-500">{s.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={cardCls}>
              <h2 className="font-heading text-[20px] font-extrabold text-charcoal-800">{t.needAssistance}</h2>
              <div className="flex flex-col gap-1 text-[14px] text-charcoal-600">
                {supportPhone && <span>{t.callLabel} <span className="font-bold text-charcoal-800">{supportPhone}</span></span>}
                <span>{t.emailLabel} <span className="font-bold text-charcoal-800">{supportEmail}</span></span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <I18nLink href="/shop" className="text-[14px] text-charcoal-500 transition-colors hover:text-copper-600">{t.continueShopping}</I18nLink>
        </div>
      </div>
    </section>
  );
}
