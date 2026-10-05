import { Check } from "lucide-react";
import Link from "next/link";

const steps = [
  { label: "Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout" },
  { label: "Confirmation", href: "/order-confirmed" },
];

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-20";

/** Sand subheader with breadcrumbs (left) + 3-step progress (right).
 *  `step` is 1-based: 1 = Cart, 2 = Checkout, 3 = Confirmation. */
export function CheckoutStepper({ step }: { step: 1 | 2 | 3 }) {
  const crumbs = steps.slice(0, step);
  return (
    <div className="border-b border-[#e7e2d7] bg-sand">
      <div className={`${wrap} flex flex-wrap items-center justify-between gap-3 py-4`}>
        <nav className="flex items-center gap-2 text-[13px] text-charcoal-500">
          <Link href="/" className="transition-colors hover:text-copper-600">Home</Link>
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-2">
              <span>/</span>
              {i === crumbs.length - 1 ? (
                <span className="font-bold text-charcoal-800">{c.label}</span>
              ) : (
                <Link href={c.href} className="transition-colors hover:text-copper-600">{c.label}</Link>
              )}
            </span>
          ))}
        </nav>

        <ol className="flex items-center gap-2">
          {steps.map((s, i) => {
            const n = i + 1;
            const done = n < step;
            const current = n === step;
            return (
              <li key={s.label} className="flex items-center gap-2">
                <span
                  className={`flex size-6 items-center justify-center rounded-full text-[12px] font-bold ${
                    done || current ? "bg-copper-500 text-white" : "bg-charcoal-100 text-charcoal-500"
                  }`}
                >
                  {done ? <Check size={13} strokeWidth={3} /> : n}
                </span>
                <span className={`text-[13px] ${current ? "font-bold text-charcoal-800" : "text-charcoal-500"}`}>{s.label}</span>
                {n < steps.length && <span className="mx-1 h-px w-8 bg-charcoal-100" aria-hidden />}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
