/** Real in-stock catalog, cross-checked against the OML-01 check list
 *  (data lives in src/content/catalog.json, shared with the seed script).
 *
 *  Each oven line has variants — a real unit per size/finish, with its own
 *  price and photo. Prices are the FULL regular prices; discounts are applied
 *  at checkout via promo codes (BRASA10 / BRASA15). Used as the code fallback
 *  when a Sanity `product` document is missing. */
import catalog from "@/content/catalog.json";

export type Variant = {
  size: string;
  finish: string;
  price: number;
  stock: number;
  base: string;
  description: string;
  image: string | null;
  /** Ordered gallery (primary first). Falls back to [image] when no gallery set. */
  gallery: string[];
};

export type Oven = {
  type: "oven";
  slug: string;
  name: string;
  tagline: string;
  style: string;
  doors: number;
  shortDescription: string;
  variants: Variant[];
};

export type AccessoryProduct = {
  type: "accessory";
  slug: string;
  name: string;
  price: number;
  stock: number;
  shortDescription: string;
  description: string;
  image: string | null;
};

/** Per stakeholder: every displayed price is rounded UP to the next ten
 *  ("a la próxima decena") — e.g. 5036.11 → 5040, 110.46 → 120. Applied at
 *  every boundary prices enter the app (code catalog + Sanity) so nothing slips
 *  through unrounded, even values edited later in Studio. */
export const roundUpToTen = (n: number) => Math.ceil(n / 10) * 10;

const stockImg = (photo: string | null) => (photo ? `/images/stock/${photo}.jpg` : null);

type RawVariant = Omit<Variant, "image" | "gallery"> & { photo: string | null; gallery?: string[] };
type RawOven = Omit<Oven, "type" | "variants"> & { variants: RawVariant[] };
type RawAccessory = Omit<AccessoryProduct, "type" | "image"> & { photo: string | null };

export const ovens: Oven[] = (catalog.ovens as RawOven[]).map((o) => ({
  type: "oven",
  slug: o.slug,
  name: o.name,
  tagline: o.tagline,
  style: o.style,
  doors: o.doors,
  shortDescription: o.shortDescription,
  variants: o.variants.map(({ photo, gallery, ...v }) => ({
    ...v,
    price: roundUpToTen(v.price),
    image: stockImg(photo),
    gallery: (gallery ?? (photo ? [photo] : [])).map((p) => `/images/stock/${p}.jpg`),
  })),
}));

export const accessories: AccessoryProduct[] = (catalog.accessories as RawAccessory[]).map(({ photo, ...a }) => ({
  type: "accessory",
  ...a,
  price: roundUpToTen(a.price),
  image: stockImg(photo),
}));

export const getOven = (slug: string) => ovens.find((o) => o.slug === slug);

// Shared brand content used across every oven's detail page.
export const sharedFeatures = [
  { title: "Refractory-Clay Core", copy: "Proven for hundreds of years for heat retention and even radiant performance." },
  { title: "Heat Retention", copy: "Reaches searing temperatures fast, then holds them for hours." },
  { title: "Precise, Repeatable Results", copy: "The control a disciplined cook expects, every session." },
  { title: "Live-Wood Flavor", copy: "Never coal, gas, or electricity." },
  { title: "Hand-Built in Europe", copy: "Finished to a standard of modern sophistication." },
  { title: "Built to Last", copy: "Built and proven to perform for generations." },
];

export const sharedFaqs = [
  { question: "How long does it take to heat up?", answer: "About 45 minutes to reach 900°F from a cold start with seasoned hardwood — then it holds heat for hours on a single fire." },
  { question: "Can it stay outdoors during winter?", answer: "Yes. Brasa ovens are built for year-round outdoor use; we recommend a fitted cover and keeping the chamber dry between fires." },
  { question: "What wood is recommended?", answer: "Seasoned hardwoods such as oak, maple, or fruitwoods. Avoid softwoods, treated lumber, or anything green or damp." },
  { question: "Does it require professional installation?", answer: "The oven arrives on its base ready to use; it only needs a level spot. Delivery and placement are quoted separately." },
  { question: "What's included?", answer: "Every oven ships with its base, premium insulation, an upper glass door, and a thermometer (Ardente ovens include two cast-iron doors and two thermometers)." },
  { question: "How is shipping handled?", answer: "Freight on these ovens is heavy and varies by location, so we quote it per order. Add what you want to your cart and request a shipping quote — we'll follow up with the total." },
  { question: "Do you offer discounts?", answer: "We're running an introductory promotion — enter your discount code at checkout to apply it before requesting your quote." },
  { question: "Where do you ship?", answer: "We ship across the mainland U.S., Puerto Rico, and the Dominican Republic. Contact us for freight timelines to your zone." },
];
