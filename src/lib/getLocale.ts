import "server-only";
import { headers } from "next/headers";

import { isLocale, type Locale } from "./i18n";

/** Resolve the current request locale (set by `src/proxy.ts`). Server-only. */
export async function getLocale(): Promise<Locale> {
  const value = (await headers()).get("x-locale");
  return isLocale(value) ? value : "en";
}
