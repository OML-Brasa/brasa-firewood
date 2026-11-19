"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * Elfsight "Brasa Popup" widget, rendered on every site page (mounted in the
 * root layout). Skipped inside Sanity Studio, which shares the root layout.
 */
export function ElfsightPopup() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;

  return (
    <>
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      <div className="elfsight-app-f2ee035f-a6a2-4e16-9486-9473db05728b" data-elfsight-app-lazy />
    </>
  );
}
