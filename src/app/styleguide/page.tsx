/**
 * Temporary design-system preview — renders the tokens extracted from Figma
 * so we can eyeball the type scale + palette. Safe to delete once the real
 * pages are built.
 */
const copper = [50, 100, 200, 300, 400, 500, 600, 700, 800];
const charcoal = [50, 100, 200, 300, 400, 500, 600, 700, 800];

const typeScale: { cls: string; label: string; sample: string }[] = [
  { cls: "text-display", label: "Display · 80", sample: "Brasa" },
  { cls: "text-h1", label: "H1 · 60/72", sample: "The Art of Fire" },
  { cls: "text-h2", label: "H2 · 48/56", sample: "About Brasa" },
  { cls: "text-h3", label: "H3 · 40/48", sample: "The Collection" },
  { cls: "text-h4", label: "H4 · 32/40", sample: "Seasoned Hardwood" },
  { cls: "text-h5", label: "H5 · 24/28", sample: "Product Detail" },
  { cls: "text-h6", label: "H6 · 20/24", sample: "Free Delivery" },
];

const bodyScale: { cls: string; label: string }[] = [
  { cls: "text-body-lg", label: "Body Large · 20" },
  { cls: "text-body", label: "Body · 16" },
  { cls: "text-body-sm", label: "Body Small · 14" },
  { cls: "text-body-xs", label: "Body XSmall · 12" },
];

function Swatch({ name, prefix }: { name: number; prefix: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="h-16 w-full rounded-md border border-charcoal-100"
        style={{ background: `var(--color-${prefix}-${name})` }}
      />
      <span className="text-body-xs text-charcoal-600">
        {prefix}-{name}
      </span>
    </div>
  );
}

export default function StyleGuide() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 flex flex-col gap-16">
      <header className="flex flex-col gap-2">
        <p className="text-body-sm uppercase tracking-widest text-copper-600">
          Design system
        </p>
        <h1 className="text-h1">Brasa Firewood</h1>
        <p className="text-body-lg text-charcoal-600 max-w-2xl">
          Tokens extracted from Figma — Archivo for everything, Instrument Serif
          for accents, on a warm copper &amp; charcoal palette.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <h2 className="text-h4">Type scale</h2>
        <div className="flex flex-col gap-5">
          {typeScale.map((t) => (
            <div
              key={t.cls}
              className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6 border-b border-charcoal-100 pb-4"
            >
              <span className="text-body-xs uppercase tracking-wider text-charcoal-500 md:w-32 shrink-0">
                {t.label}
              </span>
              <span className={t.cls}>{t.sample}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-h4">Body &amp; accent</h2>
        {bodyScale.map((b) => (
          <div key={b.cls} className="flex flex-col md:flex-row md:gap-6">
            <span className="text-body-xs uppercase tracking-wider text-charcoal-500 md:w-32 shrink-0 pt-1">
              {b.label}
            </span>
            <p className={`${b.cls} max-w-2xl text-charcoal-700`}>
              Split, seasoned, and stacked by hand — firewood that lights fast
              and burns clean, for those who live by the flame.
            </p>
          </div>
        ))}
        <blockquote className="font-serif italic text-h3 text-copper-700 mt-4">
          &ldquo;Crafted for those who live by the flame.&rdquo;
        </blockquote>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-h4">Brand Copper</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
          {copper.map((n) => (
            <Swatch key={n} name={n} prefix="copper" />
          ))}
        </div>
        <h2 className="text-h4 mt-4">Brand Charcoal</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
          {charcoal.map((n) => (
            <Swatch key={n} name={n} prefix="charcoal" />
          ))}
        </div>
      </section>
    </main>
  );
}
