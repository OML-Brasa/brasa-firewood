import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { ProductClient, type ProductData } from "@/components/ProductClient";
import { getCheckoutSettings } from "@/lib/getCheckoutSettings";
import { compareData, getProductDefault, productDefaults } from "@/lib/productDefaults";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

// Re-fetch from Sanity at most once a minute, so Studio edits appear
// on the live site without a redeploy.
export const revalidate = 60;

export function generateStaticParams() {
  return productDefaults.map((p) => ({ slug: p.slug }));
}

const productQuery = `*[_type == "product" && slug.current == $slug][0]{
  name, tagline, price, priceSymbol, shortDescription, "slug": slug.current,
  gallery, sizes[]{ model, dims }, insulation, domeColors[]{ name, color },
  archFinishes, bases, financeNote,
  features[]{ title, copy }, specs[]{ label, value }, faqs[]{ question, answer }
}`;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const def = getProductDefault(slug);
  const [doc, settings] = await Promise.all([
    client.fetch(productQuery, { slug }).catch(() => null),
    getCheckoutSettings(),
  ]);

  if (!doc && !def) notFound();

  const gallery: string[] =
    Array.isArray(doc?.gallery) && doc.gallery.length
      ? doc.gallery.map((g: Parameters<typeof urlFor>[0]) => urlFor(g).width(1000).auto("format").url())
      : (def?.gallery ?? []);

  const product: ProductData = {
    slug,
    name: doc?.name ?? def?.name ?? slug,
    tagline: doc?.tagline ?? def?.tagline ?? "",
    price: doc?.price ?? def?.price ?? "",
    priceSymbol: doc?.priceSymbol ?? def?.priceSymbol ?? "",
    shortDescription: doc?.shortDescription ?? def?.shortDescription ?? "",
    gallery,
    sizes: doc?.sizes?.length ? doc.sizes : (def?.sizes ?? []),
    insulation: doc?.insulation ?? def?.insulation ?? [],
    domeColors: doc?.domeColors?.length ? doc.domeColors : (def?.domeColors ?? []),
    archFinishes: doc?.archFinishes?.length ? doc.archFinishes : (def?.archFinishes ?? []),
    bases: doc?.bases?.length ? doc.bases : (def?.bases ?? []),
    financeNote: doc?.financeNote ?? def?.financeNote ?? "",
    features: doc?.features?.length ? doc.features : (def?.features ?? []),
    specs: doc?.specs?.length ? doc.specs : (def?.specs ?? []),
    faqs: doc?.faqs?.length ? doc.faqs : (def?.faqs ?? []),
  };

  return (
    <div className="flex flex-col bg-background">
      <Navbar />
      <ProductClient product={product} compare={compareData} accessories={settings.accessories} />
      <Newsletter />
      <Footer />
    </div>
  );
}
