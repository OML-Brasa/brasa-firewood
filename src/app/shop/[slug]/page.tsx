import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { ProductClient } from "@/components/ProductClient";
import { getLocale } from "@/lib/getLocale";
import { getAccessories } from "@/lib/getProducts";
import { getOven, ovens, roundUpToTen, sharedFaqs, sharedFeatures, type Oven } from "@/lib/productDefaults";
import { fetchSeo, seoMetadata } from "@/lib/seo";
import { client } from "@/sanity/lib/client";
import { localeDoc } from "@/sanity/lib/locale";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export function generateStaticParams() {
  return ovens.map((o) => ({ slug: o.slug }));
}

const PRODUCT_FILTER = 'type == "oven" && slug.current == $slug';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const seo = await fetchSeo("product", { lang: locale, slug }, { filter: PRODUCT_FILTER });
  const def = getOven(slug);
  return seoMetadata(seo, {
    title: def?.name ?? "Ovens",
    description:
      def?.shortDescription ||
      def?.tagline ||
      "A handcrafted European wood-fired clay oven by Brasa — built to order, in stock, and ready to ship.",
  });
}

const ovenQuery = `${localeDoc("product", PRODUCT_FILTER)}{
  name, "slug": slug.current, tagline, style, doors, shortDescription,
  variants[]{ size, finish, price, stock, base, description, image, gallery }
}`;

type VariantImg = Parameters<typeof urlFor>[0];

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const def = getOven(slug);
  const [doc, accessories] = await Promise.all([
    client.fetch(ovenQuery, { slug, lang: locale }).catch(() => null),
    getAccessories(locale),
  ]);

  if (!doc && !def) notFound();

  const oven: Oven = doc
    ? {
        type: "oven",
        slug,
        name: doc.name ?? def?.name ?? slug,
        tagline: doc.tagline ?? def?.tagline ?? "",
        style: doc.style ?? def?.style ?? "",
        doors: doc.doors ?? def?.doors ?? 1,
        shortDescription: doc.shortDescription ?? def?.shortDescription ?? "",
        variants:
          doc.variants?.length
            ? doc.variants.map((v: { size: string; finish: string; price: number; stock: number; base: string; description: string; image?: VariantImg; gallery?: VariantImg[] }) => {
                const image = v.image ? urlFor(v.image).width(1000).auto("format").url() : null;
                // Primary photo always leads the gallery; extra angles follow (deduped).
                const gallery = [
                  ...new Set([image, ...(v.gallery ?? []).map((g) => urlFor(g).width(1000).auto("format").url())]),
                ].filter((u): u is string => !!u);
                return {
                  size: v.size,
                  finish: v.finish,
                  price: roundUpToTen(v.price),
                  stock: v.stock ?? 1,
                  base: v.base ?? "",
                  description: v.description ?? "",
                  image,
                  gallery,
                };
              })
            : (def?.variants ?? []),
      }
    : (def as Oven);

  return (
    <div className="flex flex-col bg-background">
      <Navbar />
      <ProductClient oven={oven} accessories={accessories} features={sharedFeatures} faqs={sharedFaqs} />
      <Newsletter />
      <Footer />
    </div>
  );
}
