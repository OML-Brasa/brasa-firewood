import { Download, Flame, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { careDefaults, type CareContent } from "@/lib/careContent";
import { getLocale } from "@/lib/getLocale";
import { client } from "@/sanity/lib/client";
import { localeDoc } from "@/sanity/lib/locale";

export const revalidate = 60;

const query = `${localeDoc("carePage")}{
  metaTitle, metaDescription, heroBadge, heroTitle, heroIntro, downloadLabel, "pdf": pdf.asset->url,
  objectiveTitle, objectiveBody, beforeTitle, beforeItems,
  firewoodTitle, firewoodIntro, firewoodHeaders, firewood[]{ wood, where, characteristics },
  avoidTitle, avoid,
  dryingTitle, dryingIntro, dryingHeaders, dryingCycles[]{ cycle, when, temperature, duration },
  whyTitle, whyBody, cracksTitle, cracksBody,
  firingTitle, firingIntro, firingHeaders, firingSteps[]{ step, action, temperature }, firingOutro,
  summaryTitle, summary
}`;

const wrap = "mx-auto w-full max-w-[880px] px-6 md:px-10";

type Doc = Record<string, unknown> & {
  firewoodHeaders?: { wood?: unknown; where?: unknown; characteristics?: unknown } | null;
  dryingHeaders?: { cycle?: unknown; when?: unknown; temperature?: unknown; duration?: unknown } | null;
  firingHeaders?: { step?: unknown; action?: unknown; temperature?: unknown } | null;
};

/** Trimmed string, or "" for anything empty / missing / not a string. */
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
/** Non-empty strings only. */
const strings = (v: unknown) => (Array.isArray(v) ? v.map(str).filter(Boolean) : []);
/** Table rows with every cell trimmed; rows whose cells are all empty are dropped. */
function rows<K extends string>(v: unknown, keys: readonly K[]): Record<K, string>[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((r) => Object.fromEntries(keys.map((k) => [k, str((r as Record<string, unknown> | null)?.[k])])) as Record<K, string>)
    .filter((r) => keys.some((k) => r[k]));
}

/**
 * Load the Care page for the request locale.
 *
 * Once a carePage document exists in Sanity it is the only source: any field
 * left empty there is simply not rendered. The bundled copy (src/content/care.json)
 * is used only when no carePage document exists at all, so the page isn't blank
 * before the content has been seeded.
 */
async function getCareContent(): Promise<CareContent> {
  const locale = await getLocale();
  const doc: Doc | null = await client.fetch(query, { lang: locale }).catch(() => null);
  if (!doc) return careDefaults[locale];

  const fh = doc.firewoodHeaders ?? {};
  const dh = doc.dryingHeaders ?? {};
  const ph = doc.firingHeaders ?? {};
  return {
    metaTitle: str(doc.metaTitle),
    metaDescription: str(doc.metaDescription),
    heroBadge: str(doc.heroBadge),
    heroTitle: str(doc.heroTitle),
    heroIntro: str(doc.heroIntro),
    downloadLabel: str(doc.downloadLabel),
    pdf: str(doc.pdf),
    objectiveTitle: str(doc.objectiveTitle),
    objectiveBody: str(doc.objectiveBody),
    beforeTitle: str(doc.beforeTitle),
    beforeItems: strings(doc.beforeItems),
    firewoodTitle: str(doc.firewoodTitle),
    firewoodIntro: str(doc.firewoodIntro),
    firewoodHeaders: [str(fh.wood), str(fh.where), str(fh.characteristics)],
    firewood: rows(doc.firewood, ["wood", "where", "characteristics"] as const),
    avoidTitle: str(doc.avoidTitle),
    avoid: strings(doc.avoid),
    dryingTitle: str(doc.dryingTitle),
    dryingIntro: str(doc.dryingIntro),
    dryingHeaders: [str(dh.cycle), str(dh.when), str(dh.temperature), str(dh.duration)],
    dryingCycles: rows(doc.dryingCycles, ["cycle", "when", "temperature", "duration"] as const),
    whyTitle: str(doc.whyTitle),
    whyBody: str(doc.whyBody),
    cracksTitle: str(doc.cracksTitle),
    cracksBody: str(doc.cracksBody),
    firingTitle: str(doc.firingTitle),
    firingIntro: str(doc.firingIntro),
    firingHeaders: [str(ph.step), str(ph.action), str(ph.temperature)],
    firingSteps: rows(doc.firingSteps, ["step", "action", "temperature"] as const),
    firingOutro: str(doc.firingOutro),
    summaryTitle: str(doc.summaryTitle),
    summary: strings(doc.summary),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getCareContent();
  // metaTitle is the full page title (it already includes "| Brasa"), so use it
  // verbatim via `absolute` to bypass the root "%s | Brasa" template and avoid a
  // doubled suffix. Empty → omit, so the site-wide default title/description applies.
  return {
    ...(t.metaTitle && { title: { absolute: t.metaTitle } }),
    ...(t.metaDescription && { description: t.metaDescription }),
  };
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <h2 className="font-heading text-[24px] md:text-[28px] font-extrabold tracking-[-0.01em] text-charcoal-800">{children}</h2>;
}

function BoxTitle({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <h3 className="font-heading text-[18px] font-extrabold text-charcoal-800">{children}</h3>;
}

function Paragraph({ children, className = "leading-[1.7]" }: { children: string; className?: string }) {
  if (!children) return null;
  return <p className={`text-[15px] text-charcoal-600 ${className}`}>{children}</p>;
}

function Bullets({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-col gap-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2 text-[15px] leading-[1.6] text-charcoal-600">
          <span className="mt-[2px] text-copper-600">•</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * A data table. Hidden when it has no rows; the header row is hidden when every
 * header is empty. Columns stay aligned, so an empty cell renders as a blank cell.
 */
function Table({ headers, rows, nowrapLast = false }: { headers: string[]; rows: string[][]; nowrapLast?: boolean }) {
  if (!rows.length) return null;
  const last = headers.length - 1;
  return (
    <div className="overflow-x-auto rounded-lg border border-charcoal-200">
      <table className="w-full border-collapse text-left text-[14px]">
        {headers.some(Boolean) && (
          <thead>
            <tr className="bg-sand text-charcoal-800">
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((cells, r) => (
            <tr key={r} className={`${r > 0 || headers.some(Boolean) ? "border-t" : ""} border-charcoal-200 align-top text-charcoal-600`}>
              {cells.map((c, i) => (
                <td key={i} className={`px-4 py-3 ${i === 0 ? "font-semibold text-charcoal-800" : ""} ${nowrapLast && i === last ? "whitespace-nowrap" : ""}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function CarePage() {
  const t = await getCareContent();

  const hasHero = Boolean(t.heroBadge || t.heroTitle || t.heroIntro || (t.pdf && t.downloadLabel));
  const hasObjective = Boolean(t.objectiveTitle || t.objectiveBody);
  const hasBefore = Boolean(t.beforeTitle || t.beforeItems.length);
  const hasFirewood = Boolean(t.firewoodTitle || t.firewoodIntro || t.firewood.length);
  const hasAvoid = Boolean(t.avoidTitle || t.avoid.length);
  const hasDrying = Boolean(t.dryingTitle || t.dryingIntro || t.dryingCycles.length);
  const hasWhy = Boolean(t.whyTitle || t.whyBody);
  const hasCracks = Boolean(t.cracksTitle || t.cracksBody);
  const hasFiring = Boolean(t.firingTitle || t.firingIntro || t.firingSteps.length || t.firingOutro);
  const hasSummary = Boolean(t.summaryTitle || t.summary.length);
  const hasBody = hasObjective || hasBefore || hasFirewood || hasAvoid || hasDrying || hasWhy || hasCracks || hasFiring || hasSummary;

  return (
    <div className="flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      {hasHero && (
        <section className="bg-sand">
          <div className={`${wrap} flex flex-col items-start gap-5 py-16`}>
            {t.heroBadge && (
              <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-copper-600">
                <Flame size={14} /> {t.heroBadge}
              </span>
            )}
            {t.heroTitle && (
              <h1 className="font-heading text-[36px] md:text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-charcoal-800">
                {t.heroTitle}
              </h1>
            )}
            {t.heroIntro && <p className="max-w-2xl text-[16px] leading-[1.6] text-charcoal-600">{t.heroIntro}</p>}
            {t.pdf && t.downloadLabel && (
              <a
                href={t.pdf}
                download
                className="inline-flex items-center justify-center gap-2 rounded-md bg-copper-600 px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-copper-700"
              >
                <Download size={16} /> {t.downloadLabel}
              </a>
            )}
          </div>
        </section>
      )}

      {/* Body */}
      {hasBody && (
        <section className={`${wrap} flex flex-col gap-12 py-16`}>
          {hasObjective && (
            <div className="flex flex-col gap-3">
              <SectionTitle>{t.objectiveTitle}</SectionTitle>
              <Paragraph>{t.objectiveBody}</Paragraph>
            </div>
          )}

          {hasBefore && (
            <div className="flex flex-col gap-3">
              <SectionTitle>{t.beforeTitle}</SectionTitle>
              <Bullets items={t.beforeItems} />
            </div>
          )}

          {hasFirewood && (
            <div className="flex flex-col gap-4">
              <SectionTitle>{t.firewoodTitle}</SectionTitle>
              <Paragraph>{t.firewoodIntro}</Paragraph>
              <Table headers={t.firewoodHeaders} rows={t.firewood.map((r) => [r.wood, r.where, r.characteristics])} />
            </div>
          )}

          {hasAvoid && (
            <div className="flex flex-col gap-3 rounded-lg border border-[#e8b4a0] bg-[#fdf3ef] p-5">
              {t.avoidTitle && (
                <h3 className="flex items-center gap-2 font-heading text-[18px] font-extrabold text-charcoal-800">
                  <TriangleAlert size={18} className="text-copper-600" /> {t.avoidTitle}
                </h3>
              )}
              <Bullets items={t.avoid} />
            </div>
          )}

          {hasDrying && (
            <div className="flex flex-col gap-4">
              <SectionTitle>{t.dryingTitle}</SectionTitle>
              <Paragraph>{t.dryingIntro}</Paragraph>
              <Table headers={t.dryingHeaders} rows={t.dryingCycles.map((r) => [r.cycle, r.when, r.temperature, r.duration])} />
            </div>
          )}

          {(hasWhy || hasCracks) && (
            <div className={`grid gap-6 ${hasWhy && hasCracks ? "md:grid-cols-2" : ""}`}>
              {hasWhy && (
                <div className="flex flex-col gap-2 rounded-lg bg-sand p-5">
                  <BoxTitle>{t.whyTitle}</BoxTitle>
                  <Paragraph className="leading-[1.6]">{t.whyBody}</Paragraph>
                </div>
              )}
              {hasCracks && (
                <div className="flex flex-col gap-2 rounded-lg bg-sand p-5">
                  <BoxTitle>{t.cracksTitle}</BoxTitle>
                  <Paragraph className="leading-[1.6]">{t.cracksBody}</Paragraph>
                </div>
              )}
            </div>
          )}

          {hasFiring && (
            <div className="flex flex-col gap-4">
              <SectionTitle>{t.firingTitle}</SectionTitle>
              <Paragraph>{t.firingIntro}</Paragraph>
              <Table headers={t.firingHeaders} rows={t.firingSteps.map((r) => [r.step, r.action, r.temperature])} nowrapLast />
              <Paragraph className="leading-[1.6]">{t.firingOutro}</Paragraph>
            </div>
          )}

          {hasSummary && (
            <div className="flex flex-col gap-3 rounded-lg border border-charcoal-200 p-6">
              <SectionTitle>{t.summaryTitle}</SectionTitle>
              <Bullets items={t.summary} />
            </div>
          )}
        </section>
      )}

      <Newsletter />
      <Footer />
    </div>
  );
}
