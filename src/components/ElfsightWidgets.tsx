"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * Elfsight widgets, rendered on every site page (mounted in the root layout).
 * One platform.js script serves all of them — add new widgets as another div,
 * not another script. Skipped inside Sanity Studio, which shares the root layout.
 */
const WIDGETS = [
  "f2ee035f-a6a2-4e16-9486-9473db05728b", // Brasa Popup
  "ab133a1c-93f4-4b2a-9b07-63243267e8c0", // WhatsApp Chat | BRASA
];

export function ElfsightWidgets() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;

  return (
    <>
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      {WIDGETS.map((id) => (
        <div key={id} className={`elfsight-app-${id}`} data-elfsight-app-lazy />
      ))}
    </>
  );
}
