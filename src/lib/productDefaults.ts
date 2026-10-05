import type { ProductData } from "@/components/ProductClient";

/** Code defaults for the four ovens — used when a Sanity `product` document is
 *  missing, and as the source the seed script writes into Sanity. */

export const sharedFeatures: ProductData["features"] = [
  { title: "Refractory-Clay Core", copy: "Proven for hundreds of years for heat retention and even radiant performance." },
  { title: "Heat Retention", copy: "Reaches searing temperatures fast, then holds them for hours." },
  { title: "Precise, Repeatable Results", copy: "The control a disciplined cook expects, every session." },
  { title: "Live-Wood Flavor", copy: "Never coal, gas, or electricity." },
  { title: "Hand-Built in Europe", copy: "Finished to a standard of modern sophistication." },
  { title: "Built to Last", copy: "Built and proven to perform for generations." },
];

export const sharedSpecs: ProductData["specs"] = [
  { label: "Cooking Surface", value: '36" diameter / 1,018 sq. in.' },
  { label: "Overall Dimensions", value: '48"W x 52"D x 68"H (including stand)' },
  { label: "Weight", value: "1,250 lbs (Oven dome only: 850 lbs)" },
  { label: "Max Temperature", value: "1000°F (538°C)" },
  { label: "Heat-up Time", value: "45 minutes to 900°F" },
  { label: "Construction Material", value: "Authentic refractory clay double-baked chamber" },
  { label: "Insulation", value: '3" high-density ceramic fiber blanket' },
  { label: "Installation Type", value: "Specialized positioning / Integrated Base" },
];

export const sharedFaqs: ProductData["faqs"] = [
  { question: "How long does it take to heat up?", answer: "About 45 minutes to reach 900°F from a cold start with seasoned hardwood — then it holds heat for hours on a single fire." },
  { question: "Can it stay outdoors during winter?", answer: "Yes. Brasa ovens are built for year-round outdoor use; we recommend a fitted cover and keeping the chamber dry between fires." },
  { question: "What wood is recommended?", answer: "Seasoned hardwoods such as oak, maple, or fruitwoods. Avoid softwoods, treated lumber, or anything green or damp." },
  { question: "Does it require professional installation?", answer: "The oven arrives assembled; most customers need only a level base. White-glove delivery and placement is available at checkout." },
  { question: "What's included with every oven?", answer: "A cast iron door with glass, an oven thermometer, a chimney cap, and flue dampers are included as standard." },
  { question: "How much does it weigh?", answer: "Roughly 1,250 lbs installed on its base; the refractory dome alone is about 850 lbs." },
  { question: "What warranty do you offer?", answer: "Every Brasa is backed by a multi-year warranty on the refractory chamber against defects in materials and workmanship." },
  { question: "Where do you ship?", answer: "We ship across the mainland U.S., Puerto Rico, and the Dominican Republic. Contact us for freight timelines to your zone." },
];

export const compareData = {
  models: ["Dolce", "Ravvivata", "Ardente", "Grigia"],
  rows: [
    { feature: "Model Sizes", values: ["75–120", "75–120", "90–120", "75–120"] },
    { feature: "Exterior Size", values: ["100×100 – 150×150 cm", "100×100 – 150×150 cm", "120×120 – 150×150 cm", "100×100 – 150×150 cm"] },
    { feature: "Concrete Base", values: ["6–32 blocks", "6–32 blocks", "10–36 blocks", "6–32 blocks"] },
    { feature: "Insulation", values: ["Premium", "Premium", "Premium", "Premium"] },
    { feature: "Finish Options", values: ["Smooth, Brick, Stone, Wood, Marble, Premium", "Smooth, Brick, Stone, Wood, Marble, Premium", "Traditional, Classic, Mixed, Brick, Stone, Wood", "Traditional, Classic, Brick & Stone"] },
    { feature: "Burner Type", values: ["—", "—", "—", "Round or Square"] },
  ],
};

const insulationStd = ["Yes (Multi-layer)", "No"];
const basesStd = ["Concrete Base", "Metal Base", "No Base"];

export const productDefaults: ProductData[] = [
  {
    slug: "dolce",
    name: "Dolce",
    tagline: "Traditional Oven",
    price: "From $2,450",
    priceSymbol: "$$$",
    shortDescription: "Precise, the all-time traditional oven. Built for control at an intimate scale.",
    gallery: ["/images/shop-dolce.png"],
    sizes: [
      { model: "model 75", dims: "(100x100 cm)" },
      { model: "model 80", dims: "(110x110 cm)" },
      { model: "model 85", dims: "(110x110 cm)" },
      { model: "model 90", dims: "(120x120 cm)" },
      { model: "model 95", dims: "(120x120 cm)" },
      { model: "model 100", dims: "(130x130 cm)" },
      { model: "model 110", dims: "(130x130 cm)" },
    ],
    insulation: insulationStd,
    domeColors: [
      { name: "Classic Single Coat Mortar", color: "#DED7D4" },
      { name: "Black Marble Tile", color: "#1C1C1C" },
      { name: "Black Brick", color: "#595959" },
    ],
    archFinishes: ["Red Brick", "Faux Wood", "Black Brick/Black Border", "White Brick", "Black Brick/White Border", "Black Brick/Chocolate Border"],
    bases: basesStd,
    financeNote: "As low as $102/mo with 24-month financing.",
    features: sharedFeatures,
    specs: sharedSpecs,
    faqs: sharedFaqs,
  },
  {
    slug: "ravvivata",
    name: "Ravvivata",
    tagline: "Traditional Oven",
    price: "From $5,850",
    priceSymbol: "$$$",
    shortDescription: "Responsive and versatile — full control and exceptional heat retention for the cook who wants it all.",
    gallery: ["/images/shop-ravvivata.png"],
    sizes: [
      { model: "model 75", dims: "(100x100 cm)" },
      { model: "model 80", dims: "(110x110 cm)" },
      { model: "model 85", dims: "(110x110 cm)" },
      { model: "model 90", dims: "(120x120 cm)" },
      { model: "model 95", dims: "(120x120 cm)" },
      { model: "model 100", dims: "(130x130 cm)" },
      { model: "model 110", dims: "(130x130 cm)" },
    ],
    insulation: insulationStd,
    domeColors: [
      { name: "Classic Single Coat Mortar", color: "#DED7D4" },
      { name: "Black Marble Tile", color: "#1C1C1C" },
      { name: "Black Brick", color: "#595959" },
    ],
    archFinishes: ["Red Brick", "Faux Wood", "Black Brick/Black Border", "White Brick", "Black Brick/White Border", "Black Brick/Chocolate Border"],
    bases: basesStd,
    financeNote: "As low as $244/mo with 24-month financing.",
    features: sharedFeatures,
    specs: sharedSpecs,
    faqs: sharedFaqs,
  },
  {
    slug: "ardente",
    name: "Ardente",
    tagline: "Traditional Oven",
    price: "From $3,100",
    priceSymbol: "$$$",
    shortDescription: "Built for high performance. For those who push the fire hardest by maximizing space, versatility, and heat distribution.",
    gallery: ["/images/shop-ardente.png"],
    sizes: [
      { model: "model 90", dims: "(120x120 cm)" },
      { model: "model 95", dims: "(120x120 cm)" },
      { model: "model 100", dims: "(130x130 cm)" },
      { model: "model 110", dims: "(140x140 cm)" },
      { model: "model 120", dims: "(150x150 cm)" },
    ],
    insulation: [],
    domeColors: [
      { name: "Classic Single Coat Mortar", color: "#DED7D4" },
      { name: "Kaolin Brick", color: "#C6875A" },
      { name: "Black Brick", color: "#4A4A4A" },
      { name: "Natural Stone", color: "#C9BFA5" },
      { name: "Red Brick", color: "#B45B3E" },
      { name: "Terracotta Brick", color: "#C46A3F" },
      { name: "White Single Coat Mortar", color: "#EDEAE3" },
    ],
    archFinishes: ["Black Brick", "Terracotta Brick", "Faux Wood", "Faux Stone", "Red Brick"],
    bases: basesStd,
    financeNote: "As low as $129/mo with 24-month financing.",
    features: sharedFeatures,
    specs: sharedSpecs,
    faqs: sharedFaqs,
  },
  {
    slug: "griggia",
    name: "Griggia",
    tagline: "Traditional Oven",
    price: "From $1,950",
    priceSymbol: "$$$",
    shortDescription: "Double the experience of your cook — the connoisseur's instrument.",
    gallery: ["/images/shop-griggia.png"],
    sizes: [
      { model: "model 75", dims: "(100x100 cm)" },
      { model: "model 80", dims: "(110x110 cm)" },
      { model: "model 85", dims: "(120x110 cm)" },
      { model: "model 90", dims: "(120x110 cm)" },
      { model: "model 95", dims: "(130x130 cm)" },
      { model: "model 100", dims: "(130x130 cm)" },
      { model: "model 110", dims: "(150x150 cm)" },
      { model: "model 120", dims: "(150x150 cm)" },
    ],
    insulation: insulationStd,
    domeColors: [
      { name: "Classic Single Coat Mortar", color: "#DED7D4" },
      { name: "Natural Stone", color: "#C9BFA5" },
      { name: "Red Brick", color: "#B45B3E" },
    ],
    archFinishes: ["Red Brick"],
    bases: basesStd,
    financeNote: "As low as $81/mo with 24-month financing.",
    features: sharedFeatures,
    specs: sharedSpecs,
    faqs: sharedFaqs,
  },
];

export const getProductDefault = (slug: string) => productDefaults.find((p) => p.slug === slug);
