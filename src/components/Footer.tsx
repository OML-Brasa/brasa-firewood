/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa6";

const columns = [
  {
    h: "Collection",
    items: [
      { label: "Dolce", href: "/shop/dolce" },
      { label: "Ravvivata", href: "/shop/ravvivata" },
      { label: "Ardente", href: "/shop/ardente" },
      { label: "Griggia", href: "/shop/griggia" },
    ],
  },
  {
    h: "Company",
    items: [
      { label: "Our Story", href: "/about" },
      { label: "Shop", href: "/shop" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    h: "Learn",
    items: [
      { label: "Refractory Science", href: "/about" },
      { label: "Recipes", href: "/recipes" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

const social = [
  { label: "Instagram", href: "#", Icon: FaInstagram },
  { label: "Facebook", href: "#", Icon: FaFacebookF },
  { label: "YouTube", href: "#", Icon: FaYoutube },
];

const legal = ["Privacy Policy", "Terms of Use", "Refractory Care"];

export function Footer() {
  return (
    <footer className="bg-charcoal-800 text-sand">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-10 pt-20 md:px-20">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr_1.4fr] md:gap-10">
          <div className="flex flex-col gap-4">
            <img src="/images/logo.png" alt="Brasa" className="h-12 w-auto object-contain object-left" />
            <p className="max-w-xs text-[15px] leading-[1.4] text-sand/70">
              Hand-built, refractory-clay ovens engineered for the way serious cooks actually cook.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.h} className="flex flex-col gap-4">
              <span className="text-[15px] font-bold uppercase tracking-[0.04em] text-sand">{col.h}</span>
              <div className="flex flex-col gap-3">
                {col.items.map((it) => (
                  <Link key={it.label} href={it.href} className="text-[15px] text-sand/70 transition-colors hover:text-copper-300">
                    {it.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-4">
            <span className="text-[15px] font-bold uppercase tracking-[0.04em] text-sand">Follow the Fire</span>
            <p className="text-[15px] leading-[1.4] text-sand/70">
              Follow along for fire, food, and the making of every oven.
            </p>
            <div className="flex gap-3">
              {social.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sand transition-colors hover:bg-copper-500 hover:text-white"
                >
                  <Icon size={16} aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-[#cbd5e0]/30 pt-5">
          <div className="flex flex-col justify-between gap-3 text-[13px] text-sand/70 sm:flex-row">
            <span>© {new Date().getFullYear()} Brasa. All rights reserved.</span>
            <div className="flex gap-6">
              {legal.map((l) => (
                <a key={l} href="#" className="transition-colors hover:text-copper-300">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
