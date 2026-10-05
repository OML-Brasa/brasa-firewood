import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { ShopClient, type ShopProduct } from "@/components/ShopClient";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

// Re-fetch from Sanity at most once a minute, so Studio edits appear
// on the live site without a redeploy.
export const revalidate = 60;

/** Resolve a Sanity image to a sized URL, falling back to a bundled asset. */
const img = (src: Parameters<typeof urlFor>[0] | undefined | null, fallback: string, w = 1200) =>
  src ? urlFor(src).width(w).auto("format").url() : fallback;

const shopQuery = `*[_type == "shopPage"][0]{
  pageTitle, pageIntro, products[]{ name, price, desc, image },
  bundleTitle, bundleDescription, bundlePrice, bundleImage
}`;

const products: ShopProduct[] = [
  { slug: "dolce", name: "Dolce", price: "From $2,450", image: "/images/shop-dolce.png", desc: "Precise, the all-time traditional oven. Built for control at an intimate scale. Available in 80–110cm. Includes cast iron door with glass, thermometer, chimney cap, and flue dampers." },
  { slug: "ravvivata", name: "Ravvivata", price: "From $5,850", image: "/images/shop-ravvivata.png", desc: "Responsive and versatile — full control and exceptional heat retention for the cook who wants it all. Available in 80–110cm. Includes cast iron door with glass, thermometer, chimney cap, and flue dampers." },
  { slug: "ardente", name: "Ardente", price: "From $3,100", image: "/images/shop-ardente.png", desc: "Built for high performance. For those who push the fire hardest by maximizing space, versatility, and heat distribution. Available in 80–110cm. Includes cast iron door with glass, thermometer, chimney cap, and flue dampers." },
  { slug: "griggia", name: "Griggia", price: "From $1,950", image: "/images/shop-griggia.png", desc: "Double the experience of your cook — the connoisseur's instrument. Available in 80–110cm. Includes cast iron door with glass, thermometer, chimney cap, and flue dampers." },
];

export default async function ShopPage() {
  const doc = await client.fetch(shopQuery).catch(() => null);
  const productsC: ShopProduct[] = products.map((p, i) => ({
    ...p,
    slug: p.slug,
    name: doc?.products?.[i]?.name ?? p.name,
    price: doc?.products?.[i]?.price ?? p.price,
    desc: doc?.products?.[i]?.desc ?? p.desc,
    image: img(doc?.products?.[i]?.image, p.image, 700),
  }));

  return (
    <div className="flex flex-col bg-background">
      <Navbar />
      <ShopClient
        pageTitle={doc?.pageTitle ?? "The Models"}
        pageIntro={
          doc?.pageIntro ??
          "Explore our handcrafted European wood-fired ovens. Each model is built with premium refractory materials and available in multiple sizes, dome finishes, and base configurations to suit your outdoor kitchen."
        }
        products={productsC}
        bundle={{
          title: doc?.bundleTitle ?? "The Essentials Package",
          description:
            doc?.bundleDescription ??
            "Our best-selling traditional oven bundled with a concrete base and premium insulation. Everything you need to start cooking wood-fired meals at home.",
          price: doc?.bundlePrice ?? "$199",
          image: doc?.bundleImage ? urlFor(doc.bundleImage).width(900).auto("format").url() : null,
        }}
      />
      <Newsletter />
      <Footer />
    </div>
  );
}
