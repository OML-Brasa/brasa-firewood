import { Download, Flame, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { getLocale } from "@/lib/getLocale";

const PDF_HREF = "/care/brasa-oven-curing-guide.pdf";

export const metadata: Metadata = {
  title: "Oven Care & Curing Guide | Brasa",
  description:
    "How to dry, cure and fire your Brasa wood-fired clay oven for best performance — recommended firewood, drying cycles and firing steps.",
};

const wrap = "mx-auto w-full max-w-[880px] px-6 md:px-10";

const en = {
  heroBadge: "Oven Care",
  heroTitle: (
    <>
      Drying &amp; Curing Your Clay Oven
    </>
  ),
  heroIntro:
    "A technical guide to drying, curing and firing your Brasa wood-fired oven for the best performance. Applies to all Brasa models · temperatures in °F.",
  downloadLabel: "Download the guide (PDF)",

  objectiveTitle: "Objective",
  objectiveBody:
    "This guide describes the recommended procedure for drying and starting up a new Brasa clay oven, or one that has been out of use, in order to remove internal moisture, properly cure its materials, and optimize its performance.",

  beforeTitle: "Before You Begin",
  beforeItems: [
    "Before lighting the oven, make sure it is completely dry and free of moisture.",
    "If the oven has been out of use for 10–15 days, carry out a gradual drying process before operating at high temperatures.",
    "If the oven is installed outdoors, fit the chimney with a suitable flue pipe and rain cap.",
    "Use only dry, small-sized hardwood (see “Recommended Firewood”).",
    "Monitor the temperature with a thermometer during each cycle.",
  ],

  firewoodTitle: "Recommended Firewood",
  firewoodIntro:
    "Use well-seasoned hardwoods: air-dry them for 6 to 12 months, until moisture content is below 20%. These options are easy to find in the United States and Puerto Rico.",
  firewoodHeaders: ["Wood", "Where to find it", "Characteristics"] as [string, string, string],
  firewood: [
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
  ] as [string, string, string][],

  avoidTitle: "Woods to Avoid",
  avoid: [
    "Softwoods or resinous woods (pine, cypress, cedar) — heavy smoke and soot (creosote).",
    "Treated, painted or varnished wood, plywood, pallets and construction scraps — they release toxic substances.",
    "Toxic plants such as manchineel (common along Puerto Rico's coasts) or oleander — their smoke is toxic.",
    "Green, damp or moldy wood — it smokes, soils the dome and produces little heat.",
  ],

  dryingTitle: "Initial Drying Process",
  dryingIntro:
    "Carry out the following heating cycles progressively. During drying, keep the door and the chimney damper fully open to allow moisture to escape.",
  dryingHeaders: ["Cycle", "When", "Temperature", "Duration"] as [string, string, string, string],
  dryingCycles: [
    ["1", "Day 1", "176–212°F", "3–4 h"],
    ["2", "Day 2 (or a few days later)", "176–212°F", "3–4 h"],
    ["3", "Next cycle", "302–392°F", "3–4 h"],
    ["4", "Next cycle", "482–572°F", "2.5–3 h"],
    ["5", "Final curing", "788–896°F", "30–45 min"],
  ] as [string, string, string, string][],

  whyTitle: "Why is this necessary?",
  whyBody:
    "Gradual heating allows the oven's internal insulation to cure properly. The insulating materials absorb heat, contract slightly, and become harder and more stable.",
  cracksTitle: "Hairline cracks & fissures",
  cracksBody:
    "Small fissures may appear around the flue, the door, or the dome. These are a natural part of curing — after several uses they may open slightly, then seal on their own.",

  firingTitle: "Firing for Full Performance",
  firingIntro:
    "Once the initial drying is complete, follow this procedure each time you fire the oven. At the start, keep the chimney damper and the door air-intake regulator open.",
  firingHeaders: ["Step", "Action", "Temperature"] as [string, string, string],
  firingSteps: [
    ["1", "Load 4–6 small, dry sticks or branches and light them.", "—"],
    ["2", "About 5 minutes after the flame catches, add 3–4 more sticks. If more combustion is needed, open the door slightly to increase the draft.", "—"],
    ["3", "At 15 minutes, add 2–3 more sticks.", "≈ 572°F"],
    ["4", "Keep feeding the fire until it reaches the target temperature, and hold it for 20–30 minutes to heat the clay insulation.", "824–860°F"],
    ["5", "When the flame dies out, the dome turns white and the temperature drops. Remove the embers, leaving a couple of handfuls inside to retain heat longer.", "392–464°F"],
    ["6", "Close the chimney damper to 80% and close the door air-intake regulator. The oven is ready for cooking.", "—"],
  ] as [string, string, string][],
  firingOutro:
    "During the first few uses, the oven performs below its full capacity. Performance improves progressively: it will reach temperature faster and use less firewood over time.",

  summaryTitle: "Summary",
  summary: [
    "Verify that the oven is completely dry.",
    "Use dry, small-sized hardwood; avoid resinous, treated or toxic woods.",
    "Keep the door and chimney damper open during drying.",
    "Increase the temperature progressively.",
    "Finish with a cycle at 788–896°F for 30–45 minutes.",
    "For each firing, bring the oven to 824–860°F for 20–30 minutes, then close the damper to 80% and close the air regulator.",
    "Expect lower performance during the first few uses; it improves progressively.",
    "Consider small initial fissures caused by insulation curing to be normal.",
  ],
};

const es: typeof en = {
  heroBadge: "Cuidado del Horno",
  heroTitle: (
    <>
      Secado y Curado de tu Horno de Arcilla
    </>
  ),
  heroIntro:
    "Una guía técnica para secar, curar y encender tu horno de leña Brasa y lograr el máximo rendimiento. Aplica a todos los modelos Brasa · temperaturas en °F.",
  downloadLabel: "Descargar la guía (PDF)",

  objectiveTitle: "Objetivo",
  objectiveBody:
    "Esta guía describe el procedimiento recomendado para secar y poner en marcha un horno de arcilla Brasa nuevo, o uno que ha estado sin uso, con el fin de eliminar la humedad interna, curar correctamente sus materiales y optimizar su rendimiento.",

  beforeTitle: "Antes de Empezar",
  beforeItems: [
    "Antes de encender el horno, asegúrate de que esté completamente seco y libre de humedad.",
    "Si el horno ha estado sin uso por 10–15 días, realiza un proceso de secado gradual antes de operarlo a altas temperaturas.",
    "Si el horno está instalado al exterior, coloca en la chimenea un tubo de tiro adecuado y un sombrerete contra lluvia.",
    "Usa solo madera dura seca y de tamaño pequeño (ver “Leña Recomendada”).",
    "Monitorea la temperatura con un termómetro durante cada ciclo.",
  ],

  firewoodTitle: "Leña Recomendada",
  firewoodIntro:
    "Usa maderas duras bien curadas: sécalas al aire de 6 a 12 meses, hasta que la humedad esté por debajo del 20%. Estas opciones son fáciles de conseguir en Estados Unidos y Puerto Rico.",
  firewoodHeaders: ["Madera", "Dónde conseguirla", "Características"],
  firewood: [
    ["Roble", "En todo EE. UU.", "Calor intenso y duradero. La opción más versátil, y pariente de la encina."],
    ["Nogal americano (hickory)", "Este y sur de EE. UU.", "Muy densa; alto calor y un fuerte sabor ahumado."],
    ["Arce duro", "Norte y este de EE. UU.", "Llama constante y sabor suave."],
    ["Fresno", "En todo EE. UU.", "Enciende con facilidad y produce poco humo."],
    ["Pecán y mezquite", "Sur y suroeste de EE. UU.", "Pecán: sabor suave. Mezquite: muy caliente; mejor mezclado con otra madera."],
    ["Frutales: manzano, cerezo", "En todo EE. UU.", "Aroma dulce y suave; ideal para pizza, pan y carnes."],
    ["Guayaba", "Puerto Rico", "Frutal muy valorado; aroma dulce."],
    ["Cítricos: naranja, limón, toronja", "Puerto Rico", "Fácil de conseguir de la poda; aroma agradable."],
    ["Úcar (olivo negro)", "Puerto Rico", "Madera muy densa; brasas de larga duración."],
    ["Tamarindo y algarrobo", "Puerto Rico", "Maderas duras con buen rendimiento de calor."],
  ],

  avoidTitle: "Maderas a Evitar",
  avoid: [
    "Maderas blandas o resinosas (pino, ciprés, cedro) — mucho humo y hollín (creosota).",
    "Madera tratada, pintada o barnizada, plywood, paletas y restos de construcción — liberan sustancias tóxicas.",
    "Plantas tóxicas como el manzanillo (común en las costas de Puerto Rico) o la adelfa — su humo es tóxico.",
    "Madera verde, húmeda o con moho — humea, ensucia la bóveda y produce poco calor.",
  ],

  dryingTitle: "Proceso de Secado Inicial",
  dryingIntro:
    "Realiza los siguientes ciclos de calentamiento de forma progresiva. Durante el secado, mantén la puerta y el regulador de tiro de la chimenea completamente abiertos para permitir que la humedad escape.",
  dryingHeaders: ["Ciclo", "Cuándo", "Temperatura", "Duración"],
  dryingCycles: [
    ["1", "Día 1", "176–212°F", "3–4 h"],
    ["2", "Día 2 (o unos días después)", "176–212°F", "3–4 h"],
    ["3", "Siguiente ciclo", "302–392°F", "3–4 h"],
    ["4", "Siguiente ciclo", "482–572°F", "2.5–3 h"],
    ["5", "Curado final", "788–896°F", "30–45 min"],
  ],

  whyTitle: "¿Por qué es necesario?",
  whyBody:
    "El calentamiento gradual permite que el aislamiento interno del horno se cure correctamente. Los materiales aislantes absorben el calor, se contraen ligeramente y se vuelven más duros y estables.",
  cracksTitle: "Grietas finas y fisuras",
  cracksBody:
    "Pueden aparecer pequeñas fisuras alrededor del tiro, la puerta o la bóveda. Son una parte natural del curado — tras varios usos pueden abrirse un poco y luego sellarse por sí solas.",

  firingTitle: "Encendido para Máximo Rendimiento",
  firingIntro:
    "Una vez completado el secado inicial, sigue este procedimiento cada vez que enciendas el horno. Al inicio, mantén abiertos el regulador de tiro de la chimenea y el regulador de entrada de aire de la puerta.",
  firingHeaders: ["Paso", "Acción", "Temperatura"],
  firingSteps: [
    ["1", "Coloca 4–6 palos o ramas pequeñas y secas, y enciéndelos.", "—"],
    ["2", "Unos 5 minutos después de que prenda la llama, agrega 3–4 palos más. Si se necesita más combustión, abre un poco la puerta para aumentar el tiro.", "—"],
    ["3", "A los 15 minutos, agrega 2–3 palos más.", "≈ 572°F"],
    ["4", "Sigue alimentando el fuego hasta que alcance la temperatura objetivo, y mantenla por 20–30 minutos para calentar el aislamiento de arcilla.", "824–860°F"],
    ["5", "Cuando la llama se apaga, la bóveda se vuelve blanca y la temperatura baja. Retira las brasas, dejando un par de puñados dentro para conservar el calor por más tiempo.", "392–464°F"],
    ["6", "Cierra el regulador de tiro de la chimenea al 80% y cierra el regulador de entrada de aire de la puerta. El horno está listo para cocinar.", "—"],
  ],
  firingOutro:
    "Durante los primeros usos, el horno rinde por debajo de su capacidad total. El rendimiento mejora progresivamente: alcanzará la temperatura más rápido y usará menos leña con el tiempo.",

  summaryTitle: "Resumen",
  summary: [
    "Verifica que el horno esté completamente seco.",
    "Usa madera dura seca y de tamaño pequeño; evita maderas resinosas, tratadas o tóxicas.",
    "Mantén la puerta y el regulador de tiro de la chimenea abiertos durante el secado.",
    "Aumenta la temperatura progresivamente.",
    "Termina con un ciclo a 788–896°F por 30–45 minutos.",
    "Para cada encendido, lleva el horno a 824–860°F por 20–30 minutos, luego cierra el regulador de tiro al 80% y cierra el regulador de aire.",
    "Espera un rendimiento menor durante los primeros usos; mejora progresivamente.",
    "Considera normales las pequeñas fisuras iniciales causadas por el curado del aislamiento.",
  ],
};

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

export default async function CarePage() {
  const locale = await getLocale();
  const t = locale === "es" ? es : en;

  return (
    <div className="flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-sand">
        <div className={`${wrap} flex flex-col items-start gap-5 py-16`}>
          <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-copper-600">
            <Flame size={14} /> {t.heroBadge}
          </span>
          <h1 className="font-heading text-[36px] md:text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-charcoal-800">
            {t.heroTitle}
          </h1>
          <p className="max-w-2xl text-[16px] leading-[1.6] text-charcoal-600">
            {t.heroIntro}
          </p>
          <a
            href={PDF_HREF}
            download
            className="inline-flex items-center justify-center gap-2 rounded-md bg-copper-600 px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-copper-700"
          >
            <Download size={16} /> {t.downloadLabel}
          </a>
        </div>
      </section>

      {/* Body */}
      <section className={`${wrap} flex flex-col gap-12 py-16`}>
        <div className="flex flex-col gap-3">
          <SectionTitle>{t.objectiveTitle}</SectionTitle>
          <p className="text-[15px] leading-[1.7] text-charcoal-600">
            {t.objectiveBody}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <SectionTitle>{t.beforeTitle}</SectionTitle>
          <Bullets items={t.beforeItems} />
        </div>

        <div className="flex flex-col gap-4">
          <SectionTitle>{t.firewoodTitle}</SectionTitle>
          <p className="text-[15px] leading-[1.7] text-charcoal-600">
            {t.firewoodIntro}
          </p>
          <div className="overflow-x-auto rounded-lg border border-charcoal-200">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="bg-sand text-charcoal-800">
                  <th className="px-4 py-3 font-bold">{t.firewoodHeaders[0]}</th>
                  <th className="px-4 py-3 font-bold">{t.firewoodHeaders[1]}</th>
                  <th className="px-4 py-3 font-bold">{t.firewoodHeaders[2]}</th>
                </tr>
              </thead>
              <tbody>
                {t.firewood.map(([w, where, chars]) => (
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
            <TriangleAlert size={18} className="text-copper-600" /> {t.avoidTitle}
          </h3>
          <Bullets items={t.avoid} />
        </div>

        <div className="flex flex-col gap-4">
          <SectionTitle>{t.dryingTitle}</SectionTitle>
          <p className="text-[15px] leading-[1.7] text-charcoal-600">
            {t.dryingIntro}
          </p>
          <div className="overflow-x-auto rounded-lg border border-charcoal-200">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="bg-sand text-charcoal-800">
                  <th className="px-4 py-3 font-bold">{t.dryingHeaders[0]}</th>
                  <th className="px-4 py-3 font-bold">{t.dryingHeaders[1]}</th>
                  <th className="px-4 py-3 font-bold">{t.dryingHeaders[2]}</th>
                  <th className="px-4 py-3 font-bold">{t.dryingHeaders[3]}</th>
                </tr>
              </thead>
              <tbody>
                {t.dryingCycles.map(([c, when, temp, dur]) => (
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
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg bg-sand p-5">
            <h3 className="font-heading text-[18px] font-extrabold text-charcoal-800">{t.whyTitle}</h3>
            <p className="text-[15px] leading-[1.6] text-charcoal-600">
              {t.whyBody}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-lg bg-sand p-5">
            <h3 className="font-heading text-[18px] font-extrabold text-charcoal-800">{t.cracksTitle}</h3>
            <p className="text-[15px] leading-[1.6] text-charcoal-600">
              {t.cracksBody}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SectionTitle>{t.firingTitle}</SectionTitle>
          <p className="text-[15px] leading-[1.7] text-charcoal-600">
            {t.firingIntro}
          </p>
          <div className="overflow-x-auto rounded-lg border border-charcoal-200">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="bg-sand text-charcoal-800">
                  <th className="px-4 py-3 font-bold">{t.firingHeaders[0]}</th>
                  <th className="px-4 py-3 font-bold">{t.firingHeaders[1]}</th>
                  <th className="px-4 py-3 font-bold">{t.firingHeaders[2]}</th>
                </tr>
              </thead>
              <tbody>
                {t.firingSteps.map(([s, action, temp]) => (
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
            {t.firingOutro}
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-charcoal-200 p-6">
          <SectionTitle>{t.summaryTitle}</SectionTitle>
          <Bullets items={t.summary} />
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
