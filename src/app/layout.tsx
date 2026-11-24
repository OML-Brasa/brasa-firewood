import type { Metadata } from "next";
import { Archivo, Manrope, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { ElfsightWidgets } from "@/components/ElfsightWidgets";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getLocale } from "@/lib/getLocale";

// Google Tag Manager container (set up by the marketing team). The container
// ID is public — it appears in the page source on every site that uses GTM —
// so it is safe to hardcode here.
const GTM_ID = "GTM-P7R6VGPT";

// Archivo — headings and display type.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

// Manrope — body and all UI/text styles.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

// Instrument Serif — italic serif accent, used for pull quotes.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brasaoven.com"),
  // Per-page titles flow through this template (e.g. "The Models" → "The
  // Models | Brasa"); the home page and any page without its own title use
  // the default. A page's SEO meta title in Sanity overrides the template.
  title: {
    default: "Brasa",
    template: "%s | Brasa",
  },
  description:
    "Handcrafted wood-fired ovens in refractory clay — engineered for the cook who takes fire seriously.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${archivo.variable} ${manrope.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-base" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
        <ElfsightWidgets />
      </body>
    </html>
  );
}
