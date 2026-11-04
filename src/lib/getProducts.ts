import { accessories as accessoryDefaults, ovens as ovenDefaults, roundUpToTen, type AccessoryProduct, type Oven } from "@/lib/productDefaults";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

type ImgSrc = Parameters<typeof urlFor>[0];
const url = (image: ImgSrc | undefined, w: number) => (image ? urlFor(image).width(w).auto("format").url() : null);

const ovensQuery = `*[_type == "product" && type == "oven"] | order(order asc){
  name, "slug": slug.current, tagline, style, doors, shortDescription,
  variants[]{ size, finish, price, stock, base, description, image, gallery }
}`;

const accessoriesQuery = `*[_type == "product" && type == "accessory"] | order(order asc){
  name, "slug": slug.current, price, stock, shortDescription, description, image
}`;

type DocVariant = { size: string; finish: string; price: number; stock?: number; base?: string; description?: string; image?: ImgSrc; gallery?: ImgSrc[] };

/** All oven lines for the shop grid — Sanity first, code defaults as fallback. */
export async function getOvens(): Promise<Oven[]> {
  const docs = await client.fetch(ovensQuery).catch(() => null);
  if (!docs?.length) return ovenDefaults;
  return docs.map((d: { name: string; slug: string; tagline: string; style: string; doors: number; shortDescription: string; variants?: DocVariant[] }) => ({
    type: "oven" as const,
    slug: d.slug,
    name: d.name,
    tagline: d.tagline ?? "",
    style: d.style ?? "",
    doors: d.doors ?? 1,
    shortDescription: d.shortDescription ?? "",
    variants: (d.variants ?? []).map((v) => {
      const image = url(v.image, 800);
      // Primary photo always leads the gallery; extra angles follow (deduped).
      const gallery = [...new Set([url(v.image, 1000), ...(v.gallery ?? []).map((g) => url(g, 1000))])].filter(
        (u): u is string => !!u
      );
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
    }),
  }));
}

/** All accessories — Sanity first, code defaults as fallback. */
export async function getAccessories(): Promise<AccessoryProduct[]> {
  const docs = await client.fetch(accessoriesQuery).catch(() => null);
  if (!docs?.length) return accessoryDefaults;
  return docs.map((d: { name: string; slug: string; price: number; stock?: number; shortDescription?: string; description?: string; image?: ImgSrc }) => ({
    type: "accessory" as const,
    slug: d.slug,
    name: d.name,
    price: roundUpToTen(d.price),
    stock: d.stock ?? 0,
    shortDescription: d.shortDescription ?? "",
    description: d.description ?? "",
    image: url(d.image, 600),
  }));
}
