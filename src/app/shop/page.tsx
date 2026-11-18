import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { ShopClient } from "@/components/ShopClient";
import { getLocale } from "@/lib/getLocale";
import { getAccessories, getOvens } from "@/lib/getProducts";
import { fetchSeo, seoMetadata } from "@/lib/seo";
import { client } from "@/sanity/lib/client";
import { localeDoc } from "@/sanity/lib/locale";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const seo = await fetchSeo("shopPage", { lang: locale });
  return seoMetadata(seo, {
    title: locale === "es" ? "Los Modelos" : "The Models",
    description:
      "Shop Brasa's handcrafted European wood-fired ovens — Dolce, Ravvivata, and Ardente. Each is a one-of-a-kind, in-stock build. Pick a size and finish.",
  });
}

const shopQuery = `${localeDoc("shopPage")}{ pageTitle, pageIntro }`;

export default async function ShopPage() {
  const locale = await getLocale();
  const [doc, ovens, accessories] = await Promise.all([
    client.fetch(shopQuery, { lang: locale }).catch(() => null),
    getOvens(locale),
    getAccessories(locale),
  ]);

  return (
    <div className="flex flex-col bg-background">
      <Navbar />
      <ShopClient
        ovens={ovens}
        accessories={accessories}
        pageTitle={doc?.pageTitle ?? "The Models"}
        pageIntro={
          doc?.pageIntro ??
          "Our handcrafted European wood-fired ovens — each a one-of-a-kind, in-stock build. Pick a size and finish, add it to your cart, and request a shipping quote."
        }
      />
      <Newsletter />
      <Footer />
    </div>
  );
}
