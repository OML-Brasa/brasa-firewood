import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { ShopClient } from "@/components/ShopClient";
import { getAccessories, getOvens } from "@/lib/getProducts";
import { client } from "@/sanity/lib/client";

export const revalidate = 60;

const shopQuery = `*[_type == "shopPage"][0]{ pageTitle, pageIntro }`;

export default async function ShopPage() {
  const [doc, ovens, accessories] = await Promise.all([
    client.fetch(shopQuery).catch(() => null),
    getOvens(),
    getAccessories(),
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
