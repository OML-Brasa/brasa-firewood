import data from "@/content/care.json";
import type { Locale } from "@/lib/i18n";

export type FirewoodRow = { wood: string; where: string; characteristics: string };
export type DryingCycleRow = { cycle: string; when: string; temperature: string; duration: string };
export type FiringStepRow = { step: string; action: string; temperature: string };

export type CareContent = {
  metaTitle: string;
  metaDescription: string;
  heroBadge: string;
  heroTitle: string;
  heroIntro: string;
  downloadLabel: string;
  /** Guide PDF URL — a Sanity file asset, or the bundled /public file. */
  pdf: string;
  objectiveTitle: string;
  objectiveBody: string;
  beforeTitle: string;
  beforeItems: string[];
  firewoodTitle: string;
  firewoodIntro: string;
  firewoodHeaders: [string, string, string];
  firewood: FirewoodRow[];
  avoidTitle: string;
  avoid: string[];
  dryingTitle: string;
  dryingIntro: string;
  dryingHeaders: [string, string, string, string];
  dryingCycles: DryingCycleRow[];
  whyTitle: string;
  whyBody: string;
  cracksTitle: string;
  cracksBody: string;
  firingTitle: string;
  firingIntro: string;
  firingHeaders: [string, string, string];
  firingSteps: FiringStepRow[];
  firingOutro: string;
  summaryTitle: string;
  summary: string[];
};

/** Bundled guide PDF, used when no PDF has been uploaded in Sanity. */
export const CARE_PDF_FALLBACK = "/care/brasa-oven-curing-guide.pdf";

/**
 * Fallback copy for the Care page, used only when Sanity has no carePage
 * document at all. Once a document exists, its empty fields are hidden rather
 * than filled from here. Both languages are bundled so Spanish never falls back
 * to English text.
 */
export const careDefaults: Record<Locale, CareContent> = {
  en: { ...(data.en as Omit<CareContent, "pdf">), pdf: CARE_PDF_FALLBACK },
  es: { ...(data.es as Omit<CareContent, "pdf">), pdf: CARE_PDF_FALLBACK },
};
