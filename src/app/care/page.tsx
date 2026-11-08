import { Download, Flame, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";

const PDF_HREF = "/care/brasa-oven-curing-guide.pdf";

export const metadata: Metadata = {
  title: "Oven Care & Curing Guide | Brasa",
  description:
    "How to dry, cure and fire your Brasa wood-fired clay oven for best performance — recommended firewood, drying cycles and firing steps.",
};

const wrap = "mx-auto w-full max-w-[880px] px-6 md:px-10";

const firewood: [string, string, string][] = [
  ["Oak", "Throughout the U.S.", "Intense, long-lasting heat. The most versatile choice, and a relative of holm oak."],
  ["Hickory", "Eastern & southern U.S.", "Very dense; high heat and a strong smoky flavor."],
  ["Hard maple", "Northern & eastern U.S.", "Steady flame and mild flavor."],
  ["Ash", "Throughout the U.S.", "Lights easily and produces little smoke."],
  ["Pecan & mesquite", "Southern & southwestern U.S.", "Pecan: mild flavor. Mesquite: very hot; best mixed with another wood."],
  ["Fruitwoods: apple, cherry", "Throughout the U.S.", "Sweet, mild aroma; ideal for pizza, bread and meats."],
  ["Guava", "Puerto Rico", "Highly valued fruitwood; sweet aroma."],
  ["Citrus: orange, lemon, grapefruit", "Puerto Rico", "Readily available from pruning; pleasant aroma."],
  ["Úcar (black olive)", "Puerto Rico", "Very dense wood; long-lasting embers."],
  ["Tamarind & algarrobo", "Puerto Rico", "Hardwoods with good heat output."],
];

const avoid = [
  "Softwoods or resinous woods (pine, cypress, cedar) — heavy smoke and soot (creosote).",
  "Treated, painted or varnished wood, plywood, pallets and construction scraps — they release toxic substances.",
  "Toxic plants such as manchineel (common along Puerto Rico's coasts) or oleander — their smoke is toxic.",
  "Green, damp or moldy wood — it smokes, soils the dome and produces little heat.",
];

const dryingCycles: [string, string, string, string][] = [
  ["1", "Day 1", "176–212°F (80–100°C)", "3–4 h"],
  ["2", "Day 2 (or a few days later)", "176–212°F (80–100°C)", "3–4 h"],
  ["3", "Next cycle", "302–392°F (150–200°C)", "3–4 h"],
  ["4", "Next cycle", "482–572°F (250–300°C)", "2.5–3 h"],
  ["5", "Final curing", "788–896°F (420–480°C)", "30–45 min"],
];

const firingSteps: [string, string, string][] = [
  ["1", "Load 4–6 small, dry sticks or branches and light them.", "—"],
  ["2", "About 5 minutes after the flame catches, add 3–4 more sticks. If more combustion is needed, open the door slightly to increase the draft.", "—"],
  ["3", "At 15 minutes, add 2–3 more sticks.", "≈ 572°F (300°C)"],
  ["4", "Keep feeding the fire until it reaches the target temperature, and hold it for 20–30 minutes to heat the clay insulation.", "824–860°F (440–460°C)"],
  ["5", "When the flame dies out, the dome turns white and the temperature drops. Remove the embers, leaving a couple of handfuls inside to retain heat longer.", "392–464°F (200–240°C)"],
  ["6", "Close the chimney damper to 80% and close the door air-intake regulator. The oven is ready for cooking.", "—"],
];

const summary = [
  "Verify that the oven is completely dry.",
  "Use dry, small-sized hardwood; avoid resinous, treated or toxic woods.",
  "Keep the door and chimney damper open during drying.",
  "Increase the temperature progressively.",
  "Finish with a cycle at 788–896°F (420–480°C) for 30–45 minutes.",
  "For each firing, bring the oven to 824–860°F (440–460°C) for 20–30 minutes, then close the damper to 80% and close the air regulator.",
  "Expect lower performance during the first few uses; it improves progressively.",
  "Consider small initial fissures caused by insulation curing to be normal.",
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-heading text-[24px] md:text-[28px] font-extrabold tracking-[-0.01em] text-charcoal-800">{children}</h2>;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((t) => (
        <li key={t} className="flex gap-2 text-[15px] leading-[1.6] text-charcoal-600">
          <span className="mt-[2px] text-copper-600">•</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CarePage() {
  return (
    <div className="flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-sand">
        <div className={`${wrap} flex flex-col items-start gap-5 py-16`}>
          <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-copper-600">
            <Flame size={14} /> Oven Care
          </span>
          <h1 className="font-heading text-[36px] md:text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-charcoal-800">
            Drying &amp; Curing Your Clay Oven
          </h1>
          <p className="max-w-2xl text-[16px] leading-[1.6] text-charcoal-600">
            A technical guide to drying, curing and firing your Brasa wood-fired oven for the best performance. Applies to all Brasa models · temperatures in °F and °C.
          </p>
          <a
            href={PDF_HREF}
            download
            className="inline-flex items-center justify-center gap-2 rounded-md bg-copper-600 px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-copper-700"
          >
            <Download size={16} /> Download the guide (PDF)
          </a>
        </div>
      </section>

      {/* Body */}
      <section className={`${wrap} flex flex-col gap-12 py-16`}>
        <div className="flex flex-col gap-3">
          <SectionTitle>Objective</SectionTitle>
          <p className="text-[15px] leading-[1.7] text-charcoal-600">
            This guide describes the recommended procedure for drying and starting up a new Brasa clay oven, or one that has been out of use, in order to remove internal moisture, properly cure its materials, and optimize its performance.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <SectionTitle>Before You Begin</SectionTitle>
          <Bullets
            items={[
              "Before lighting the oven, make sure it is completely dry and free of moisture.",
              "If the oven has been out of use for 10–15 days, carry out a gradual drying process before operating at high temperatures.",
              "If the oven is installed outdoors, fit the chimney with a suitable flue pipe and rain cap.",
              "Use only dry, small-sized hardwood (see “Recommended Firewood”).",
              "Monitor the temperature with a thermometer during each cycle.",
            ]}
          />
        </div>

        <div className="flex flex-col gap-4">
          <SectionTitle>Recommended Firewood</SectionTitle>
          <p className="text-[15px] leading-[1.7] text-charcoal-600">
            Use well-seasoned hardwoods: air-dry them for 6 to 12 months, until moisture content is below 20%. These options are easy to find in the United States and Puerto Rico.
          </p>
          <div className="overflow-x-auto rounded-lg border border-charcoal-200">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="bg-sand text-charcoal-800">
                  <th className="px-4 py-3 font-bold">Wood</th>
                  <th className="px-4 py-3 font-bold">Where to find it</th>
                  <th className="px-4 py-3 font-bold">Characteristics</th>
                </tr>
              </thead>
              <tbody>
                {firewood.map(([w, where, chars]) => (
                  <tr key={w} className="border-t border-charcoal-200 align-top text-charcoal-600">
                    <td className="px-4 py-3 font-semibold text-charcoal-800">{w}</td>
                    <td className="px-4 py-3">{where}</td>
                    <td className="px-4 py-3">{chars}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-[#e8b4a0] bg-[#fdf3ef] p-5">
          <h3 className="flex items-center gap-2 font-heading text-[18px] font-extrabold text-charcoal-800">
            <TriangleAlert size={18} className="text-copper-600" /> Woods to Avoid
          </h3>
          <Bullets items={avoid} />
        </div>

        <div className="flex flex-col gap-4">
          <SectionTitle>Initial Drying Process</SectionTitle>
          <p className="text-[15px] leading-[1.7] text-charcoal-600">
            Carry out the following heating cycles progressively. During drying, keep the door and the chimney damper fully open to allow moisture to escape.
          </p>
          <div className="overflow-x-auto rounded-lg border border-charcoal-200">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="bg-sand text-charcoal-800">
                  <th className="px-4 py-3 font-bold">Cycle</th>
                  <th className="px-4 py-3 font-bold">When</th>
                  <th className="px-4 py-3 font-bold">Temperature</th>
                  <th className="px-4 py-3 font-bold">Duration</th>
                </tr>
              </thead>
              <tbody>
                {dryingCycles.map(([c, when, temp, dur]) => (
                  <tr key={c} className="border-t border-charcoal-200 align-top text-charcoal-600">
                    <td className="px-4 py-3 font-semibold text-charcoal-800">{c}</td>
                    <td className="px-4 py-3">{when}</td>
                    <td className="px-4 py-3">{temp}</td>
                    <td className="px-4 py-3">{dur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[13px] italic text-charcoal-500">°C values are the equivalents of the temperatures shown in °F.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg bg-sand p-5">
            <h3 className="font-heading text-[18px] font-extrabold text-charcoal-800">Why is this necessary?</h3>
            <p className="text-[15px] leading-[1.6] text-charcoal-600">
              Gradual heating allows the oven&apos;s internal insulation to cure properly. The insulating materials absorb heat, contract slightly, and become harder and more stable.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-lg bg-sand p-5">
            <h3 className="font-heading text-[18px] font-extrabold text-charcoal-800">Hairline cracks &amp; fissures</h3>
            <p className="text-[15px] leading-[1.6] text-charcoal-600">
              Small fissures may appear around the flue, the door, or the dome. These are a natural part of curing — after several uses they may open slightly, then seal on their own.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SectionTitle>Firing for Full Performance</SectionTitle>
          <p className="text-[15px] leading-[1.7] text-charcoal-600">
            Once the initial drying is complete, follow this procedure each time you fire the oven. At the start, keep the chimney damper and the door air-intake regulator open.
          </p>
          <div className="overflow-x-auto rounded-lg border border-charcoal-200">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="bg-sand text-charcoal-800">
                  <th className="px-4 py-3 font-bold">Step</th>
                  <th className="px-4 py-3 font-bold">Action</th>
                  <th className="px-4 py-3 font-bold">Temperature</th>
                </tr>
              </thead>
              <tbody>
                {firingSteps.map(([s, action, temp]) => (
                  <tr key={s} className="border-t border-charcoal-200 align-top text-charcoal-600">
                    <td className="px-4 py-3 font-semibold text-charcoal-800">{s}</td>
                    <td className="px-4 py-3">{action}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{temp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[15px] leading-[1.6] text-charcoal-600">
            During the first few uses, the oven performs below its full capacity. Performance improves progressively: it will reach temperature faster and use less firewood over time.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-charcoal-200 p-6">
          <SectionTitle>Summary</SectionTitle>
          <Bullets items={summary} />
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
