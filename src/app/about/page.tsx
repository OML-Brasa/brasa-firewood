/* eslint-disable @next/next/no-img-element */
import {
  BookmarkCheck,
  Blocks,
  CircleDashedCheck,
  Flame,
  Image as ImageIcon,
  LibraryBig,
  ShieldCheck,
  Star,
  Waves,
} from "lucide-react";

import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

// Re-fetch from Sanity at most once a minute, so Studio edits appear
// on the live site without a redeploy.
export const revalidate = 60;

/** Resolve a Sanity image to a sized URL, falling back to a bundled asset. */
const img = (src: Parameters<typeof urlFor>[0] | undefined | null, fallback: string, w = 1200) =>
  src ? urlFor(src).width(w).auto("format").url() : fallback;

const aboutQuery = `*[_type == "aboutPage"][0]{
  heroTitle, heroSubtitle, heroImage, originEyebrow, originTitle, originBody, originImage,
  quoteText, quoteAuthor, quoteRole, artisansBody, artisansImage,
  promises[]{ title, copy }, steps[]{ n, title, copy }, values[]{ title, copy }
}`;

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";
const eyebrow = "text-[13px] font-semibold uppercase tracking-[0.19em] text-charcoal-500";
const sectionTitle =
  "font-heading text-[28px] md:text-[36px] font-extrabold leading-[1.14] tracking-[-0.015em] text-charcoal-800";

const promises = [
  {
    Icon: ShieldCheck,
    title: "Proven for Generations",
    copy: "Refractory clay has earned its place over hundreds of years — not a lab trial, a tradition that works.",
  },
  {
    Icon: Waves,
    title: "Holds Its Heat",
    copy: "Steel spikes hot and drops fast. Brick heats unevenly. Clay absorbs heat, holds it, and radiates it back slow and even, hour after hour.",
  },
  {
    Icon: Flame,
    title: "One Fire, Every Course",
    copy: "A Brasa can sear at full temperature and still be roasting and baking long after the flames settle.",
  },
];

const steps = [
  { n: "01", title: "Refractory-Clay Core", copy: "Proven for hundreds of years for heat retention and even radiant performance." },
  { n: "02", title: "Heat Retention", copy: "Reaches searing temperatures fast, then holds them steady for hours on end." },
  { n: "03", title: "Repeatable Precision", copy: "The exact, repeatable control a disciplined cook expects, session after session." },
  { n: "04", title: "The Flavor of Live Wood", copy: "The unmistakable taste only live wood delivers — never coal, gas, or electricity." },
];

const values = [
  { Icon: Blocks, title: "Hand-Built in Europe", copy: "Finished to a standard of modern sophistication." },
  { Icon: LibraryBig, title: "Four Collections", copy: "Dolce, Ravvivata, Ardente, and Griggia, across a range of sizes and finishes." },
  { Icon: CircleDashedCheck, title: "Built to Last", copy: "Built and proven to perform for generations." },
  { Icon: BookmarkCheck, title: "Held to a Standard", copy: "Measured, finished, and inspected before every Brasa leaves the workshop." },
];

export default async function AboutPage() {
  const doc = await client.fetch(aboutQuery).catch(() => null);
  const promisesC = promises.map((p, i) => ({ ...p, title: doc?.promises?.[i]?.title ?? p.title, copy: doc?.promises?.[i]?.copy ?? p.copy }));
  const stepsC = steps.map((s, i) => ({ ...s, n: doc?.steps?.[i]?.n ?? s.n, title: doc?.steps?.[i]?.title ?? s.title, copy: doc?.steps?.[i]?.copy ?? s.copy }));
  const valuesC = values.map((v, i) => ({ ...v, title: doc?.values?.[i]?.title ?? v.title, copy: doc?.values?.[i]?.copy ?? v.copy }));
  const heroImage = img(doc?.heroImage, "/images/about-hero.jpg", 1920);
  const originImage = img(doc?.originImage, "/images/about-family.jpg", 900);
  const artisansImage = doc?.artisansImage ? urlFor(doc.artisansImage).width(1280).auto("format").url() : null;
  return (
    <div className="flex flex-col bg-background">
      <Navbar />

      {/* 1. HERO — bg image + centered white card */}
      <section className="relative flex h-[560px] w-full items-center justify-center overflow-hidden bg-charcoal-800 md:h-[640px]">
        <img src={heroImage} alt="Brasa workshop" className="absolute inset-0 h-full w-full object-cover" />
        <div className={`${wrap} relative flex justify-center`}>
          <div className="flex w-full max-w-[800px] flex-col items-center gap-6 rounded-lg border border-[#cbd5e0] bg-white p-8 text-center md:p-10">
            <h1 className="font-heading text-[36px] font-extrabold leading-[1.08] tracking-[-0.01em] text-charcoal-800 md:text-[56px]">
              {doc?.heroTitle ?? "A discipline worth the right instrument."}
            </h1>
            <p className="max-w-[578px] text-[18px] leading-[1.6] text-charcoal-500 md:text-[20px]">
              {doc?.heroSubtitle ??
                "Every Brasa is hand-formed by European artisans, then held to a standard closer to an instrument than an appliance. Each is measured, finished, and inspected before it leaves."}
            </p>
            <a
              href="#"
              className="mt-2 rounded bg-copper-500 px-7 py-3.5 text-[14px] font-bold uppercase tracking-[0.03em] text-sand transition-colors hover:bg-copper-600"
            >
              Explore Our Ovens
            </a>
          </div>
        </div>
      </section>

      {/* 2. BRAND ORIGIN */}
      <section className="bg-background">
        <div className={`${wrap} grid items-center gap-12 py-20 md:grid-cols-2 md:gap-16`}>
          <div className="aspect-[608/458] overflow-hidden rounded-md border border-[#cbd5e0]">
            <img src={originImage} alt="A family gathered around a Brasa oven" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className={eyebrow}>{doc?.originEyebrow ?? "About Brasa"}</span>
              <h2 className={sectionTitle}>{doc?.originTitle ?? "Our Story"}</h2>
            </div>
            <p className="text-[18px] leading-[1.6] text-charcoal-500 md:text-[20px]">
              {doc?.originBody ??
                "Brasa began with a conviction and a challenge. The conviction is that live-fire cooking is one of the last real disciplines a human can master at home. The challenge is to build an oven precise enough to reward that discipline — and refined enough to belong in a modern life and become a piece of art in every backyard."}
            </p>
            <Link
              href="/#collection"
              className="w-fit rounded bg-copper-500 px-7 py-3.5 text-[14px] font-bold uppercase tracking-[0.03em] text-sand transition-colors hover:bg-copper-600"
            >
              Explore the Collection
            </Link>
          </div>
        </div>
      </section>

      {/* 3. PHILOSOPHY */}
      <section className="bg-copper-500 text-sand">
        <div className={`${wrap} flex flex-col items-center gap-6 py-24 text-center`}>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} strokeWidth={2} className="text-sand" />
            ))}
          </div>
          <blockquote className="max-w-3xl font-serif text-[32px] italic leading-[1.15] md:text-[40px]">
            &ldquo;
            {doc?.quoteText ??
              "We didn't set out to build an oven. We set out to build the standard every serious cook deserves."}
            &rdquo;
          </blockquote>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[15px] font-bold uppercase tracking-[0.04em]">
              {doc?.quoteAuthor ?? "— Exel Colón"}
            </span>
            <span className="text-[14px] text-sand/85">{doc?.quoteRole ?? "Founder & Master Potter"}</span>
          </div>
        </div>
      </section>

      {/* 4. THE CLAY DIFFERENCE */}
      <section className="bg-background">
        <div className={`${wrap} py-20`}>
          <div className="flex flex-col items-center gap-3 text-center">
            <span className={eyebrow}>The Material</span>
            <h2 className={sectionTitle}>The Clay Difference</h2>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {promisesC.map(({ Icon, title, copy }) => (
              <div key={title} className="flex flex-col items-center gap-3 text-center">
                <Icon size={44} strokeWidth={2} className="text-charcoal-800" />
                <h3 className="font-heading text-[20px] font-extrabold text-charcoal-800">{title}</h3>
                <p className="text-[15px] leading-[1.4] text-charcoal-500">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE ARTISANS */}
      <section className="bg-background">
        <div className={`${wrap} flex flex-col gap-8 py-20`}>
          <div className="flex flex-col items-center gap-3 text-center">
            <span className={eyebrow}>The Process</span>
            <h2 className={sectionTitle}>Engineered first.</h2>
          </div>
          <div className="flex aspect-[1280/540] w-full items-center justify-center overflow-hidden rounded-xl border border-[#cbd5e0] bg-[#dedddd]">
            {artisansImage ? (
              <img src={artisansImage} alt="Brasa artisans at work" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon size={32} strokeWidth={1.6} className="text-charcoal-400" />
            )}
          </div>
          <p className="text-[18px] leading-[1.4] text-charcoal-500">
            {doc?.artisansBody ??
              "We didn't start with how a Brasa should look. We started with how it should perform. Heat retention, radiant evenness, airflow, recovery time — each was tested, measured, and refined until the fire behaved the way a disciplined cook needs it to. Only then did we finish it. Function came first; sophistication followed."}
          </p>
        </div>
      </section>

      {/* 6. FROM WORKSHOP TO HOME */}
      <section className="bg-background">
        <div className={`${wrap} py-20`}>
          <div className="flex flex-col items-center gap-3 text-center">
            <span className={eyebrow}>What Makes a Brasa</span>
            <h2 className={sectionTitle}>Built by Hand. Proven by Testing.</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stepsC.map((s) => (
              <div key={s.n} className="flex flex-col gap-4 rounded-md border border-charcoal-300 bg-sand p-6">
                <span className="font-heading text-[36px] font-extrabold leading-none text-copper-500">{s.n}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-[20px] font-extrabold text-charcoal-800">{s.title}</h3>
                  <p className="text-[15px] leading-[1.4] text-[#718096]">{s.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BRAND VALUES STRIP */}
      <section className="border-y border-[#edf2f7] bg-background">
        <div className={`${wrap} grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4`}>
          {valuesC.map(({ Icon, title, copy }) => (
            <div key={title} className="flex flex-col items-center gap-3 text-center">
              <Icon size={44} strokeWidth={2} className="text-charcoal-800" />
              <h3 className="font-heading text-[20px] font-extrabold text-charcoal-800">{title}</h3>
              <p className="text-[15px] leading-[1.4] text-charcoal-500">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
