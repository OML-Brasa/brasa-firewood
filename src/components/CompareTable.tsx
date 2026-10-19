export type CompareData = { models: string[]; rows: { feature: string; values: string[] }[] };

/**
 * Oven comparison. On desktop it's a table; on mobile it becomes one stacked
 * card per model so no information is cut off (the wide table can't fit a phone).
 */
export function CompareTable({ models, rows }: CompareData) {
  return (
    <>
      {/* Desktop: table */}
      <div className="mt-10 hidden overflow-x-auto rounded border border-charcoal-500 md:block">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="bg-copper-500 text-sand">
              <th className="px-4 py-4 text-[15px] font-bold uppercase tracking-[0.04em]">Features</th>
              {models.map((m) => (
                <th key={m} className="px-4 py-4 text-[15px] font-bold uppercase tracking-[0.04em]">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
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

      {/* Mobile: one card per model */}
      <div className="mt-8 flex flex-col gap-5 md:hidden">
        {models.map((m, mi) => (
          <div key={m} className="overflow-hidden rounded-lg border border-charcoal-300">
            <div className="bg-copper-500 px-4 py-3 text-[14px] font-bold uppercase tracking-[0.04em] text-sand">{m}</div>
            <div className="flex flex-col">
              {rows.map((r, ri) => (
                <div key={r.feature} className={`flex items-start justify-between gap-4 px-4 py-3 ${ri % 2 ? "bg-[#f8fafc]" : "bg-background"}`}>
                  <span className="text-[13px] text-charcoal-500">{r.feature}</span>
                  <span className="text-right text-[13px] font-medium text-charcoal-800">{r.values[mi]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
