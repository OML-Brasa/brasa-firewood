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
import catalog from "../src/content/catalog.json" with { type: "json" };

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
      { _key: "p1", name: "Dolce", price: "From $4,380", image: await image("model-dolce.png") },
      { _key: "p2", name: "Ravvivata", price: "From $5,040", image: await image("model-ravvivata.png") },
      { _key: "p3", name: "Ardente", price: "From $7,700", image: await image("model-ardente.png") },
      { _key: "p4", name: "Acerba", price: "From $1,520", image: await image("model-griggia.png") },
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
      { _key: "v2", title: "Four Collections", copy: "Dolce, Ravvivata, Ardente, and Acerba, across a range of sizes and finishes." },
      { _key: "v3", title: "Built to Last", copy: "Built and proven to perform for generations." },
      { _key: "v4", title: "Held to a Standard", copy: "Measured, finished, and inspected before every Brasa leaves the workshop." },
    ],
  };

  const shopPage = {
    _id: "shopPage",
    _type: "shopPage",
    pageTitle: "The Models",
    pageIntro:
      "Our handcrafted European wood-fired ovens — each a one-of-a-kind, in-stock build. Pick a size and finish, add it to your cart, and request a shipping quote.",
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
        { title: "No Online Payment", description: "We quote freight first — you only pay once you approve." },
        { title: "2-Year Premium Warranty", description: "Comprehensive Brasa coverage." },
        { title: "Free Design Consultation", description: "Speak with our wood-fired oven experts." },
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

  // ---- Product documents: ovens (with in-stock variants) + accessories ----
  const vKey = (o, v) => `${o.slug}-${v.size}-${v.finish}`.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const products = [];

  for (const [i, o] of catalog.ovens.entries()) {
    const variants = [];
    for (const v of o.variants) {
      const gallery = [];
      for (const [gi, g] of (v.gallery ?? []).entries()) {
        gallery.push({ _key: `${vKey(o, v)}-g${gi}`, ...(await image(`stock/${g}.jpg`)) });
      }
      variants.push({
        _key: vKey(o, v),
        size: v.size,
        finish: v.finish,
        price: v.price,
        stock: v.stock,
        base: v.base,
        description: v.description,
        ...(v.photo ? { image: await image(`stock/${v.photo}.jpg`) } : {}),
        ...(gallery.length ? { gallery } : {}),
      });
    }
    products.push({
      _id: `product.${o.slug}`,
      _type: "product",
      type: "oven",
      name: o.name,
      slug: { _type: "slug", current: o.slug },
      order: i,
      tagline: o.tagline,
      style: o.style,
      doors: o.doors,
      shortDescription: o.shortDescription,
      variants,
    });
  }

  for (const [i, a] of catalog.accessories.entries()) {
    products.push({
      _id: `product.acc-${a.slug}`,
      _type: "product",
      type: "accessory",
      name: a.name,
      slug: { _type: "slug", current: a.slug },
      order: 100 + i,
      shortDescription: a.shortDescription,
      description: a.description,
      price: a.price,
      ...(a.photo ? { image: await image(`stock/${a.photo}.jpg`) } : {}),
    });
  }

  return [homePage, aboutPage, shopPage, faqPage, contactPage, recipesPage, checkoutSettings, ...products];
}

const run = async () => {
  console.log("Uploading images & seeding documents…");
  const docs = await build();
  const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction());
  await tx.commit();
  console.log(`✓ Seeded ${docs.length} documents.`);

  // Remove any stale product docs that aren't in the current catalog (e.g. old
  // demo ovens). Deleting by explicit _id (never a parameterised query, which
  // can silently match everything if params don't bind) so we only ever remove
  // products we did NOT just write.
  const keepIds = new Set(docs.filter((d) => d._type === "product").map((d) => d._id));
  const existingIds = await client.fetch(`*[_type == "product"]._id`);
  const staleIds = existingIds.filter((id) => !keepIds.has(id));
  if (staleIds.length) {
    const delTx = staleIds.reduce((t, id) => t.delete(id), client.transaction());
    await delTx.commit();
    console.log(`✓ Removed ${staleIds.length} stale product(s): ${staleIds.join(", ")}`);
  }
};

run().catch((err) => {
  console.error("✗ Seed failed:", err.message || err);
  process.exit(1);
});
