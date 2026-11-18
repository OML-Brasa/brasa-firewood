"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { localizedPath } from "@/lib/i18n";

import { useLocale } from "./LocaleProvider";

/**
 * Drop-in replacement for next/link that prefixes string hrefs with the current
 * locale (`/es/...` when Spanish, unchanged when English). Non-string hrefs and
 * external/anchor/mailto links are passed through untouched.
 */
export function I18nLink({ href, ...props }: ComponentProps<typeof Link>) {
  const locale = useLocale();
  const localized =
    typeof href === "string" && href.startsWith("/") ? localizedPath(locale, href) : href;
  return <Link href={localized} {...props} />;
}
