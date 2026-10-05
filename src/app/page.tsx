/* eslint-disable @next/next/no-img-element */
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

/** Resolve a Sanity image to a sized URL, falling back to a bundled asset. */
const img = (src: Parameters<typeof urlFor>[0] | undefined | null, fallback: string, w = 1200) =>
  src ? urlFor(src).width(w).auto("format").url() : fallback;

// Re-fetch from Sanity at most once a minute, so Studio edits appear
// on the live site without a redeploy.
export const revalidate = 60;

const homeQuery = `*[_type == "homePage"][0]{
  heroLine1, heroLine2, heroImage, philosophy,
  aboutEyebrow, aboutTitle, aboutIntro, aboutConviction, aboutChallenge, aboutImage,
  featuredImage, materialImage, editorialRecipesImage, editorialMemoriesImage,
  products[]{ name, price, image }, quoteText, quoteAttribution
}`;

/* Content — verbatim from Figma frame brasa-home-luxury-wireframe (8039:1276). */
const content = {
  hero: { image: "/images/hero.png", title: ["Engineered for fire.", "Refined by testing."] },
  philosophy: "EUROPEAN CRAFTSMANSHIP · REFRACTORY CLAY · BUILT TO LAST GENERATIONS",
  about: {
    eyebrow: "About",
    title: "Engineered for the cook who takes fire seriously.",
    image: "/images/about.png",
    cta: "Learn More",
    intro: "Brasa began with a conviction and a challenge.",
    conviction: "that live-fire cooking is one of the last real disciplines a human can master at home.",
    challenge: "to build an oven precise enough to reward that discipline — and refined enough to belong in a modern life and become a piece of art in every backyard.",
  },
  collection: {
    title: "The Collection",
    meta: "4 Models Available",
    featured: "/images/featured-oven.png",
    products: [
      { name: "Dolce", price: "$$", image: "/images/model-dolce.png" },
      { name: "Ravvivata", price: "$$", image: "/images/model-ravvivata.png" },
      { name: "Ardente", price: "$$", image: "/images/model-ardente.png" },
      { name: "Griggia", price: "$$", image: "/images/model-griggia.png" },
    ],
  },
  material: {
    title: "Performance you can measure. Sophistication you can see.",
    image: "/images/material.png",
    cta: "Learn the Science",
    points: [
      { label: "Engineered, then finished", copy: "Performance is designed in first; the beauty follows the function." },
      { label: "Proven through testing", copy: "Every heat curve, every dimension, refined until it performed." },
      { label: "Control that repeats", copy: "Even, predictable heat — the results a disciplined cook expects, every time." },
      { label: "Built to a lasting standard", copy: "Made to perform for decades, not seasons." },
    ],
  },
  quote: {
    text: "An instrument, not an appliance. That's the difference you feel the first time you cook on one.",
    attribution: "— Exel F. Colón, Founder, Brasa",
  },
  experience: {
    title: "The Ownership Experience",
    steps: [
      { n: "01", title: "Select Your Oven", copy: "Choose from four collections — Dolce, Ravvivata, Ardente, or Griggia — each engineered to the same standard, sized and finished for the way you cook and the space you have." },
      { n: "02", title: "Configure to Your Taste", copy: "Dial in your base, insulation, and finish. Every Brasa is built to order, so the instrument you receive is the one you specified." },
      { n: "03", title: "White-Glove Delivery", copy: "From curbside freight to full white-glove installation, we deliver and place your oven so it's ready to season and fire on day one." },
    ],
  },
  editorial: [
    { kicker: "Recipes", image: "/images/editorial-recipes.png", copy: "From your first seasoning fire to a full evening of searing, roasting, and baking on one bed of embers — recipes built around the way a Brasa actually cooks.", cta: "Read More" },
    { kicker: "Memories worth Sharing", image: "/images/editorial-memories.png", copy: "A Brasa is built for the table as much as the fire — long dinners, hands-on cooking, and the kind of evening that's better with people around it.", cta: "Read More" },
  ],
  comparison: {
    title: "Compare Our Ovens",
    subtitle: "Side-by-side specifications for all assembled oven lines.",
    models: ["Dolce", "Ravvivata", "Ardente", "Grigia"],
    rows: [
      { feature: "Model Sizes", values: ["75–120", "75–120", "90–120", "75–120"] },
      { feature: "Exterior Size", values: ["100×100 – 150×150 cm", "100×100 – 150×150 cm", "120×120 – 150×150 cm", "100×100 – 150×150 cm"] },
      { feature: "Concrete Base", values: ["6–32 blocks", "6–32 blocks", "10–36 blocks", "6–32 blocks"] },
      { feature: "Insulation", values: ["Premium", "Premium", "Premium", "Premium"] },
      { feature: "Finish Options", values: ["Smooth, Brick, Stone, Wood, Marble, Premium", "Smooth, Brick, Stone, Wood, Marble, Premium", "Traditional, Classic, Mixed, Brick, Stone, Wood", "Traditional, Classic, Brick & Stone"] },
      { feature: "Burner Type", values: ["—", "—", "—", "Round or Square"] },
    ],
    shipTitle: "We Ship To",
    regions: [
      { place: "United States", copy: "Standard freight ships free to the mainland U.S.; express and white-glove options are available at checkout." },
      { place: "Puerto Rico", copy: "We ship to Puerto Rico — contact us for current freight timelines to your zone." },
      { place: "Dominican Republic", copy: "We ship to the Dominican Republic — contact us for current freight timelines to your zone." },
    ],
  },
  newsletter: { title: "Join the Brasa Community", copy: "Recipes, restocks, and the occasional fire story — straight to your inbox." },
  footer: {
    tagline: "Hand-built, refractory-clay ovens engineered for the way serious cooks actually cook.",
    columns: [
      { h: "Collection", items: ["Dolce", "Ravvivata", "Ardente", "Griggia"] },
      { h: "Company", items: ["Our Story", "Shop", "Contact"] },
      { h: "Learn", items: ["Refractory Science", "Recipes", "FAQ"] },
    ],
    social: { h: "Follow the Fire", copy: "Follow along for fire, food, and the making of every oven." },
    legal: ["Privacy Policy", "Terms of Use", "Refractory Care"],
  },
};

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";
const eyebrow = "text-[13px] font-semibold uppercase tracking-[0.19em] text-charcoal-500";
const sectionTitle =
  "font-heading text-[28px] md:text-[36px] font-extrabold leading-[1.14] tracking-[-0.015em] text-charcoal-800";

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

function LearnMore({ label, href = "#", light = false }: { label: string; href?: string; light?: boolean }) {
  return (
    <a
      href={href}
      className={`inline-flex w-fit items-center gap-2 text-[15px] font-bold uppercase tracking-[0.04em] transition-colors ${
        light ? "text-sand hover:text-white" : "text-charcoal-800 hover:text-copper-600"
      }`}
    >
      {label}
      <Arrow />
    </a>
  );
}

export default async function Home() {
  const doc = await client.fetch(homeQuery).catch(() => null);
  const c = {
    ...content,
    hero: {
      ...content.hero,
      title: [doc?.heroLine1 ?? content.hero.title[0], doc?.heroLine2 ?? content.hero.title[1]],
      image: img(doc?.heroImage, content.hero.image, 1920),
    },
    philosophy: doc?.philosophy ?? content.philosophy,
    about: {
      ...content.about,
      eyebrow: doc?.aboutEyebrow ?? content.about.eyebrow,
      title: doc?.aboutTitle ?? content.about.title,
      intro: doc?.aboutIntro ?? content.about.intro,
      conviction: doc?.aboutConviction ?? content.about.conviction,
      challenge: doc?.aboutChallenge ?? content.about.challenge,
      image: img(doc?.aboutImage, content.about.image, 900),
    },
    collection: {
      ...content.collection,
      featured: img(doc?.featuredImage, content.collection.featured, 1400),
      products: content.collection.products.map((p, i) => ({
        ...p,
        name: doc?.products?.[i]?.name ?? p.name,
        price: doc?.products?.[i]?.price ?? p.price,
        image: img(doc?.products?.[i]?.image, p.image, 700),
      })),
    },
    material: {
      ...content.material,
      image: img(doc?.materialImage, content.material.image, 900),
    },
    editorial: content.editorial.map((e, i) => ({
      ...e,
      image: img(
        i === 0 ? doc?.editorialRecipesImage : doc?.editorialMemoriesImage,
        e.image,
        800
      ),
    })),
    quote: {
      ...content.quote,
      text: doc?.quoteText ?? content.quote.text,
      attribution: doc?.quoteAttribution ?? content.quote.attribution,
    },
  };
  return (
    <div id="top" className="flex flex-col bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[520px] w-full overflow-hidden bg-charcoal-800 md:h-[760px]">
        <img src={c.hero.image} alt="Brasa oven and live-fire cooking" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/5 to-transparent" />
        <div className={`${wrap} relative flex h-full items-center`}>
          <h1 className="max-w-[640px] font-heading text-[40px] font-extrabold leading-[1.05] tracking-[-0.02em] text-sand md:text-[64px]">
            {c.hero.title[0]}
            <br />
            {c.hero.title[1]}
          </h1>
        </div>
      </section>

      {/* PHILOSOPHY STRIP */}
      <section className="border-b border-[#edf2f7] bg-sand">
        <div className={`${wrap} py-14 text-center text-[15px] font-bold uppercase tracking-[0.08em] text-charcoal-800 md:py-16`}>
          {c.philosophy}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-sand">
        <div className={`${wrap} grid items-center gap-12 py-20 md:grid-cols-2 md:gap-20 md:py-[120px]`}>
          <div className="aspect-[10/7] overflow-hidden rounded-xl">
            <img src={c.about.image} alt="Brasa" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col gap-6">
            <span className={eyebrow}>{c.about.eyebrow}</span>
            <h2 className="font-heading text-[36px] font-extrabold leading-[1.08] tracking-[-0.011em] text-charcoal-800 md:text-[56px]">
              {c.about.title}
            </h2>
            <div className="flex flex-col gap-4 text-[18px] leading-[1.5] text-charcoal-500">
              <p>{c.about.intro}</p>
              <p>
                <strong className="font-bold text-charcoal-800">The conviction:</strong>{" "}
                {c.about.conviction}
              </p>
              <p>
                <strong className="font-bold text-charcoal-800">The challenge:</strong>{" "}
                {c.about.challenge}
              </p>
            </div>
            <LearnMore label={c.about.cta} href="#collection" />
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section id="collection" className="bg-background">
        <div className={`${wrap} py-16 md:py-24`}>
          <div className="flex items-end justify-between">
            <h2 className={sectionTitle}>{c.collection.title}</h2>
            <span className={`${eyebrow} hidden sm:block`}>{c.collection.meta}</span>
          </div>

          {/* Featured — the frame export already includes the bordered card */}
          <img
            src={c.collection.featured}
            alt="Featured Brasa oven"
            className="mt-12 w-full"
          />

          {/* Cards — each export is the bordered card; name + price sit below */}
          <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {c.collection.products.map((p) => (
              <article key={p.name} className="flex flex-col gap-4">
                <img src={p.image} alt={`Brasa ${p.name} oven`} className="w-full" />
                <div className="flex items-center justify-between">
                  <h3 className="text-[20px] font-extrabold text-charcoal-800">{p.name}</h3>
                  <span className="text-[18px] font-bold tracking-[0.02em] text-charcoal-800">{p.price}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MATERIAL STORY */}
      <section className="bg-background">
        <div className={`${wrap} grid items-center gap-12 py-20 md:grid-cols-2 md:gap-20 md:py-[120px]`}>
          <div className="flex flex-col gap-8">
            <h2 className={sectionTitle}>{c.material.title}</h2>
            <div className="flex flex-col gap-4">
              {c.material.points.map((pt) => (
                <p key={pt.label} className="text-[18px] leading-[1.4] text-charcoal-500">
                  <strong className="font-bold text-charcoal-800">{pt.label}</strong> — {pt.copy}
                </p>
              ))}
            </div>
            <LearnMore label={c.material.cta} href="#compare" />
          </div>
          <div className="aspect-[10/9] overflow-hidden rounded-xl">
            <img src={c.material.image} alt="Live-fire cooking on a Brasa" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* QUOTE INTERLUDE */}
      <section className="bg-copper-500 text-sand">
        <div className={`${wrap} flex flex-col items-center gap-6 py-24 text-center md:py-[140px]`}>
          <blockquote className="max-w-4xl font-serif text-[32px] italic leading-[1.15] md:text-[40px]">
            &ldquo;{c.quote.text}&rdquo;
          </blockquote>
          <cite className="text-[15px] font-bold uppercase not-italic tracking-[0.06em] text-sand/90">
            {c.quote.attribution}
          </cite>
        </div>
      </section>

      {/* EXPERIENCE JOURNEY */}
      <section id="experience" className="bg-background">
        <div className={`${wrap} py-20 md:py-[120px]`}>
          <h2 className={`${sectionTitle} text-center`}>{c.experience.title}</h2>
          <div className="mx-auto mt-16 grid max-w-[1120px] gap-12 md:grid-cols-3 md:gap-10">
            {c.experience.steps.map((s) => (
              <div key={s.n} className="flex flex-col gap-4">
                <span className="font-heading text-[80px] font-bold leading-none text-copper-500">{s.n}</span>
                <h3 className="text-[15px] font-bold uppercase tracking-[0.04em] text-charcoal-800">{s.title}</h3>
                <p className="text-[15px] leading-[1.4] text-charcoal-500">{s.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL DUO */}
      <section id="editorial" className="bg-background">
        <div className={`${wrap} grid gap-10 pb-20 md:grid-cols-2 md:pb-[120px]`}>
          {c.editorial.map((e) => (
            <article key={e.kicker} className="flex flex-col gap-5">
              <div className="aspect-[62/38] overflow-hidden rounded-xl">
                <img src={e.image} alt={e.kicker} className="h-full w-full object-cover" />
              </div>
              <h3 className="font-heading text-[24px] font-extrabold tracking-[-0.01em] text-charcoal-800 md:text-[28px]">{e.kicker}</h3>
              <p className="text-[15px] leading-[1.5] text-charcoal-500">{e.copy}</p>
              <LearnMore label={e.cta} />
            </article>
          ))}
        </div>
      </section>

      {/* COMPARISON */}
      <section id="compare" className="bg-background">
        <div className={`${wrap} py-16`}>
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className={sectionTitle}>{c.comparison.title}</h2>
            <p className="max-w-2xl text-[18px] leading-[1.4] text-charcoal-500">{c.comparison.subtitle}</p>
          </div>

          <div className="mt-12 overflow-x-auto rounded border border-charcoal-500">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="bg-copper-500 text-sand">
                  <th className="px-4 py-4 text-[15px] font-bold uppercase tracking-[0.04em]">Features</th>
                  {c.comparison.models.map((m) => (
                    <th key={m} className="px-4 py-4 text-[15px] font-bold uppercase tracking-[0.04em]">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.comparison.rows.map((r, i) => (
                  <tr key={r.feature} className={`border-t border-charcoal-100 ${i % 2 ? "bg-[#f8fafc]" : "bg-background"}`}>
                    <td className="px-4 py-4 text-[15px] text-charcoal-500">{r.feature}</td>
                    {r.values.map((v, j) => (
                      <td key={j} className="px-4 py-4 text-[15px] text-charcoal-500">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* We Ship To */}
          <div className="mt-20">
            <h3 className="text-center font-heading text-[28px] font-extrabold tracking-[-0.015em] text-charcoal-800 md:text-[36px]">
              {c.comparison.shipTitle}
            </h3>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {c.comparison.regions.map((r) => (
                <div key={r.place} className="flex flex-col gap-3 rounded-xl border border-[#e7e2d7] bg-sand p-8">
                  <span className="text-[18px] font-bold text-charcoal-800">{r.place}</span>
                  <p className="text-[15px] leading-[1.45] text-charcoal-500">{r.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
