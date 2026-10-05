/**
 * Seeds the three singleton page documents (homePage / aboutPage / shopPage)
 * with the copy AND images currently used on the site, so everything can be
 * edited/replaced in Studio.
 *
 * Usage:
 *   1. Create an Editor token at https://sanity.io/manage → your project →
 *      API → Tokens → "Add API token" (permissions: Editor).
 *   2. Add it to .env.local as:  SANITY_API_WRITE_TOKEN="<token>"
 *   3. Run:  npm run seed
 *
 * Safe to re-run: it uses createOrReplace on fixed document IDs, and Sanity
 * deduplicates identical image uploads by content hash, so images are not
 * duplicated. Re-running resets these docs to the values below.
 */
import { createReadStream, readFileSync } from "node:fs";
import { createClient } from "next-sanity";

import faqContent from "../src/content/faq.json" with { type: "json" };
import contactContent from "../src/content/contact.json" with { type: "json" };
import recipesContent from "../src/content/recipes.json" with { type: "json" };

// Minimal .env.local loader (no extra dependency needed).
function loadEnv() {
  try {
    for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local — rely on real env */
  }
}
loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error(
    "\n✗ Missing SANITY_API_WRITE_TOKEN.\n" +
      "  Create an Editor token at https://sanity.io/manage (API → Tokens),\n" +
      '  then add it to .env.local as:  SANITY_API_WRITE_TOKEN="<token>"\n'
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

// Upload a file from public/images once and return an image field value.
// Sanity dedupes by content hash, so re-running reuses the same asset.
const assetCache = new Map();
async function image(file) {
  if (!assetCache.has(file)) {
    process.stdout.write(`  ↑ uploading ${file}\n`);
    const asset = await client.assets.upload(
      "image",
      createReadStream(new URL(`../public/images/${file}`, import.meta.url)),
      { filename: file }
    );
    assetCache.set(file, asset._id);
  }
  return { _type: "image", asset: { _type: "reference", _ref: assetCache.get(file) } };
}

async function build() {
  const homePage = {
    _id: "homePage",
    _type: "homePage",
    title: "Home",
    heroLine1: "Engineered for fire.",
    heroLine2: "Refined by testing.",
    heroImage: await image("hero.png"),
    philosophy: "EUROPEAN CRAFTSMANSHIP · REFRACTORY CLAY · BUILT TO LAST GENERATIONS",
    aboutEyebrow: "About",
    aboutTitle: "Engineered for the cook who takes fire seriously.",
    aboutIntro: "Brasa began with a conviction and a challenge.",
    aboutConviction: "that live-fire cooking is one of the last real disciplines a human can master at home.",
    aboutChallenge:
      "to build an oven precise enough to reward that discipline — and refined enough to belong in a modern life and become a piece of art in every backyard.",
    aboutImage: await image("about.png"),
    featuredImage: await image("featured-oven.png"),
    products: [
      { _key: "p1", name: "Dolce", price: "$$", image: await image("model-dolce.png") },
      { _key: "p2", name: "Ravvivata", price: "$$", image: await image("model-ravvivata.png") },
      { _key: "p3", name: "Ardente", price: "$$", image: await image("model-ardente.png") },
      { _key: "p4", name: "Griggia", price: "$$", image: await image("model-griggia.png") },
    ],
    materialImage: await image("material.png"),
    editorialRecipesImage: await image("editorial-recipes.png"),
    editorialMemoriesImage: await image("editorial-memories.png"),
    quoteText:
      "An instrument, not an appliance. That's the difference you feel the first time you cook on one.",
    quoteAttribution: "— Exel F. Colón, Founder, Brasa",
  };

  const aboutPage = {
    _id: "aboutPage",
    _type: "aboutPage",
    heroTitle: "A discipline worth the right instrument.",
    heroSubtitle:
      "Every Brasa is hand-formed by European artisans, then held to a standard closer to an instrument than an appliance. Each is measured, finished, and inspected before it leaves.",
    heroImage: await image("about-hero.jpg"),
    originEyebrow: "About Brasa",
    originTitle: "Our Story",
    originBody:
      "Brasa began with a conviction and a challenge. The conviction is that live-fire cooking is one of the last real disciplines a human can master at home. The challenge is to build an oven precise enough to reward that discipline — and refined enough to belong in a modern life and become a piece of art in every backyard.",
    originImage: await image("about-family.jpg"),
    quoteText:
      "We didn't set out to build an oven. We set out to build the standard every serious cook deserves.",
    quoteAuthor: "— Exel Colón",
    quoteRole: "Founder & Master Potter",
    promises: [
      { _key: "pr1", title: "Proven for Generations", copy: "Refractory clay has earned its place over hundreds of years — not a lab trial, a tradition that works." },
      { _key: "pr2", title: "Holds Its Heat", copy: "Steel spikes hot and drops fast. Brick heats unevenly. Clay absorbs heat, holds it, and radiates it back slow and even, hour after hour." },
      { _key: "pr3", title: "One Fire, Every Course", copy: "A Brasa can sear at full temperature and still be roasting and baking long after the flames settle." },
    ],
    artisansBody:
      "We didn't start with how a Brasa should look. We started with how it should perform. Heat retention, radiant evenness, airflow, recovery time — each was tested, measured, and refined until the fire behaved the way a disciplined cook needs it to. Only then did we finish it. Function came first; sophistication followed.",
    steps: [
      { _key: "s1", n: "01", title: "Refractory-Clay Core", copy: "Proven for hundreds of years for heat retention and even radiant performance." },
      { _key: "s2", n: "02", title: "Heat Retention", copy: "Reaches searing temperatures fast, then holds them steady for hours on end." },
      { _key: "s3", n: "03", title: "Repeatable Precision", copy: "The exact, repeatable control a disciplined cook expects, session after session." },
      { _key: "s4", n: "04", title: "The Flavor of Live Wood", copy: "The unmistakable taste only live wood delivers — never coal, gas, or electricity." },
    ],
    values: [
      { _key: "v1", title: "Hand-Built in Europe", copy: "Finished to a standard of modern sophistication." },
      { _key: "v2", title: "Four Collections", copy: "Dolce, Ravvivata, Ardente, and Griggia, across a range of sizes and finishes." },
      { _key: "v3", title: "Built to Last", copy: "Built and proven to perform for generations." },
      { _key: "v4", title: "Held to a Standard", copy: "Measured, finished, and inspected before every Brasa leaves the workshop." },
    ],
  };

  const shopPage = {
    _id: "shopPage",
    _type: "shopPage",
    pageTitle: "The Models",
    pageIntro:
      "Explore our handcrafted European wood-fired ovens. Each model is built with premium refractory materials and available in multiple sizes, dome finishes, and base configurations to suit your outdoor kitchen.",
    products: [
      { _key: "sp1", name: "Dolce", price: "From $2,450", image: await image("shop-dolce.png"), desc: "Precise, the all-time traditional oven. Built for control at an intimate scale. Available in 80–110cm. Includes cast iron door with glass, thermometer, chimney cap, and flue dampers." },
      { _key: "sp2", name: "Ravvivata", price: "From $5,850", image: await image("shop-ravvivata.png"), desc: "Responsive and versatile — full control and exceptional heat retention for the cook who wants it all. Available in 80–110cm. Includes cast iron door with glass, thermometer, chimney cap, and flue dampers." },
      { _key: "sp3", name: "Ardente", price: "From $3,100", image: await image("shop-ardente.png"), desc: "Built for high performance. For those who push the fire hardest by maximizing space, versatility, and heat distribution. Available in 80–110cm. Includes cast iron door with glass, thermometer, chimney cap, and flue dampers." },
      { _key: "sp4", name: "Griggia", price: "From $1,950", image: await image("shop-griggia.png"), desc: "Double the experience of your cook — the connoisseur's instrument. Available in 80–110cm. Includes cast iron door with glass, thermometer, chimney cap, and flue dampers." },
    ],
    bundleTitle: "The Essentials Package",
    bundleDescription:
      "Our best-selling traditional oven bundled with a concrete base and premium insulation. Everything you need to start cooking wood-fired meals at home.",
    bundlePrice: "$199",
    bundleImage: await image("featured-oven.png"),
  };

  const keyed = (arr, p) => arr.map((x, i) => ({ _key: `${p}${i}`, ...x }));

  // ---- Checkout settings (cart / checkout / confirmation flow) ----
  const checkoutSettings = {
    _id: "checkoutSettings",
    _type: "checkoutSettings",
    shippingMethods: keyed(
      [
        { name: "Standard Freight Delivery", description: "Tailgate delivery via partner carrier. Curbside drop-off.", price: 0 },
        { name: "Express Insured Shipping", description: "Prioritized carrier dispatch. Fully protected transit.", price: 149 },
        { name: "White Glove Delivery & Setup", description: "Scheduled delivery, unboxing, assembly, and precise stand installation by outdoor oven specialists.", price: 349 },
      ],
      "sm"
    ),
    trustBadges: keyed(
      [
        { title: "100% Secure Checkout", description: "Encrypted transaction processing." },
        { title: "2-Year Premium Warranty", description: "Comprehensive Brasa coverage." },
        { title: "Free Design Consultation", description: "Speak with our outdoor oven experts." },
      ],
      "tb"
    ),
    whatsNext: keyed(
      [
        { title: "Confirmation Email", description: "A receipt and detailed order confirmation has been dispatched to your inbox." },
        { title: "Order Processing", description: "Our refractory specialists are preparing your Brasa oven for safe freight transport (1–2 business days)." },
        { title: "Shipping Notification", description: "You will receive an email containing a dedicated freight tracking number once your oven leaves our facility." },
        { title: "Delivery & Wood-Fired Feast!", description: "The carrier will call to schedule a convenient curbside delivery window. Fire up and enjoy!" },
      ],
      "wn"
    ),
    accessories: keyed(
      [
        { name: "Cast Iron Door", description: "With heat-rated glass", price: 180 },
        { name: "Oven Thermometer", description: "Per-chamber dial gauge", price: 45 },
        { name: "Stainless Chimney Cap", description: "Weather + spark guard", price: 60 },
        { name: "Flue Damper Set", description: "Cast-iron airflow control", price: 35 },
      ],
      "ac"
    ),
    taxRate: 0.08,
    financeText: "As Low As $405/Mo With Affirm",
    supportPhone: "1-800-555-0199",
    supportEmail: "support@brasaoutdoor.com",
  };

  // ---- FAQ / Contact / Recipes page documents (from src/content/*.json) ----
  const faqPage = {
    _id: "faqPage",
    _type: "faqPage",
    heroTitle: faqContent.heroTitle,
    heroSubtitle: faqContent.heroSubtitle,
    searchPlaceholder: faqContent.searchPlaceholder,
    categories: faqContent.categories.map((c, ci) => ({ _key: `cat${ci}`, title: c.title, items: keyed(c.items, `q${ci}_`) })),
    ctaTitle: faqContent.ctaTitle,
    ctaSubtitle: faqContent.ctaSubtitle,
    ctaPhone: faqContent.ctaPhone,
    ctaEmail: faqContent.ctaEmail,
  };

  const contactPage = {
    _id: "contactPage",
    _type: "contactPage",
    heroTitle: contactContent.heroTitle,
    heroSubtitle: contactContent.heroSubtitle,
    formTitle: contactContent.formTitle,
    subjects: contactContent.subjects,
    detailsTitle: contactContent.detailsTitle,
    detailsIntro: contactContent.detailsIntro,
    email: contactContent.email,
    phone: contactContent.phone,
    businessHours: contactContent.businessHours,
    consultationTitle: contactContent.consultationTitle,
    consultationBody: contactContent.consultationBody,
    faqTitle: contactContent.faqTitle,
    faqIntro: contactContent.faqIntro,
    faqs: keyed(contactContent.faqs, "cq"),
  };

  const recipesPage = {
    _id: "recipesPage",
    _type: "recipesPage",
    heroTitle: recipesContent.heroTitle,
    heroSubtitle: recipesContent.heroSubtitle,
    searchPlaceholder: recipesContent.searchPlaceholder,
    categories: recipesContent.categories,
    recipes: recipesContent.recipes.map((r, i) => ({ _key: `r${i}`, ...r })),
    submitTitle: recipesContent.submitTitle,
    submitSubtitle: recipesContent.submitSubtitle,
  };

  // ---- Product documents (power /shop/[slug] detail pages) ----
  const insulationStd = ["Yes (Multi-layer)", "No"];
  const basesStd = ["Concrete Base", "Metal Base", "No Base"];
  const sharedFeatures = keyed(
    [
      { title: "Refractory-Clay Core", copy: "Proven for hundreds of years for heat retention and even radiant performance." },
      { title: "Heat Retention", copy: "Reaches searing temperatures fast, then holds them for hours." },
      { title: "Precise, Repeatable Results", copy: "The control a disciplined cook expects, every session." },
      { title: "Live-Wood Flavor", copy: "Never coal, gas, or electricity." },
      { title: "Hand-Built in Europe", copy: "Finished to a standard of modern sophistication." },
      { title: "Built to Last", copy: "Built and proven to perform for generations." },
    ],
    "f"
  );
  const sharedSpecs = keyed(
    [
      { label: "Cooking Surface", value: '36" diameter / 1,018 sq. in.' },
      { label: "Overall Dimensions", value: '48"W x 52"D x 68"H (including stand)' },
      { label: "Weight", value: "1,250 lbs (Oven dome only: 850 lbs)" },
      { label: "Max Temperature", value: "1000°F (538°C)" },
      { label: "Heat-up Time", value: "45 minutes to 900°F" },
      { label: "Construction Material", value: "Authentic refractory clay double-baked chamber" },
      { label: "Insulation", value: '3" high-density ceramic fiber blanket' },
      { label: "Installation Type", value: "Specialized positioning / Integrated Base" },
    ],
    "sp"
  );
  const sharedFaqs = keyed(
    [
      { question: "How long does it take to heat up?", answer: "About 45 minutes to reach 900°F from a cold start with seasoned hardwood — then it holds heat for hours on a single fire." },
      { question: "Can it stay outdoors during winter?", answer: "Yes. Brasa ovens are built for year-round outdoor use; we recommend a fitted cover and keeping the chamber dry between fires." },
      { question: "What wood is recommended?", answer: "Seasoned hardwoods such as oak, maple, or fruitwoods. Avoid softwoods, treated lumber, or anything green or damp." },
      { question: "Does it require professional installation?", answer: "The oven arrives assembled; most customers need only a level base. White-glove delivery and placement is available at checkout." },
      { question: "What's included with every oven?", answer: "A cast iron door with glass, an oven thermometer, a chimney cap, and flue dampers are included as standard." },
      { question: "How much does it weigh?", answer: "Roughly 1,250 lbs installed on its base; the refractory dome alone is about 850 lbs." },
      { question: "What warranty do you offer?", answer: "Every Brasa is backed by a multi-year warranty on the refractory chamber against defects in materials and workmanship." },
      { question: "Where do you ship?", answer: "We ship across the mainland U.S., Puerto Rico, and the Dominican Republic. Contact us for freight timelines to your zone." },
    ],
    "q"
  );

  const productSpecs = {
    dolce: {
      order: 0,
      tagline: "Traditional Oven",
      price: "From $2,450",
      priceSymbol: "$$$",
      shortDescription: "Precise, the all-time traditional oven. Built for control at an intimate scale.",
      img: "shop-dolce.png",
      financeNote: "As low as $102/mo with 24-month financing.",
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
    },
    ravvivata: {
      order: 1,
      tagline: "Traditional Oven",
      price: "From $5,850",
      priceSymbol: "$$$",
      shortDescription: "Responsive and versatile — full control and exceptional heat retention for the cook who wants it all.",
      img: "shop-ravvivata.png",
      financeNote: "As low as $244/mo with 24-month financing.",
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
    },
    ardente: {
      order: 2,
      tagline: "Traditional Oven",
      price: "From $3,100",
      priceSymbol: "$$$",
      shortDescription: "Built for high performance. For those who push the fire hardest by maximizing space, versatility, and heat distribution.",
      img: "shop-ardente.png",
      financeNote: "As low as $129/mo with 24-month financing.",
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
    },
    griggia: {
      order: 3,
      tagline: "Traditional Oven",
      price: "From $1,950",
      priceSymbol: "$$$",
      shortDescription: "Double the experience of your cook — the connoisseur's instrument.",
      img: "shop-griggia.png",
      financeNote: "As low as $81/mo with 24-month financing.",
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
    },
  };

  const products = [];
  for (const [slug, s] of Object.entries(productSpecs)) {
    products.push({
      _id: `product.${slug}`,
      _type: "product",
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      slug: { _type: "slug", current: slug },
      order: s.order,
      tagline: s.tagline,
      price: s.price,
      priceSymbol: s.priceSymbol,
      shortDescription: s.shortDescription,
      gallery: [{ _key: "g0", ...(await image(s.img)) }],
      sizes: keyed(s.sizes, "sz"),
      insulation: s.insulation,
      domeColors: keyed(s.domeColors, "dc"),
      archFinishes: s.archFinishes,
      bases: basesStd,
      financeNote: s.financeNote,
      features: sharedFeatures,
      specs: sharedSpecs,
      faqs: sharedFaqs,
    });
  }

  return [homePage, aboutPage, shopPage, faqPage, contactPage, recipesPage, checkoutSettings, ...products];
}

const run = async () => {
  console.log("Uploading images & seeding documents…");
  const docs = await build();
  const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction());
  await tx.commit();
  console.log(`✓ Seeded ${docs.length} documents with images: ${docs.map((d) => d._id).join(", ")}`);
};

run().catch((err) => {
  console.error("✗ Seed failed:", err.message || err);
  process.exit(1);
});
