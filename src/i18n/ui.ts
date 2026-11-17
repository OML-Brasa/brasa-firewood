import type { Locale } from "@/lib/i18n";

/**
 * Interface-string dictionary for hard-coded UI text (nav, footer, buttons,
 * form labels, etc.). Editable CMS content is translated in Sanity, not here.
 *
 * `en` defines the shape; `es` must mirror it (enforced by the type below).
 */
const en = {
  nav: {
    story: "Story",
    shop: "Shop",
    faq: "FAQ",
    recipes: "Recipes",
    care: "Care",
    contact: "Contact",
    home: "Home",
    cart: "Cart",
    menu: "Menu",
  },
  footer: {
    tagline:
      "Hand-built, refractory-clay ovens engineered for the way serious cooks actually cook.",
    collection: "Collection",
    company: "Company",
    learn: "Learn",
    ourStory: "Our Story",
    shop: "Shop",
    contact: "Contact",
    refractoryCare: "Refractory Care",
    recipes: "Recipes",
    faq: "FAQ",
    followTitle: "Follow the Fire",
    followCopy: "Follow along for fire, food, and the making of every oven.",
    rights: "All rights reserved.",
    designedBy: "Designed by",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
  },
};

type UIDict = typeof en;

const es: UIDict = {
  nav: {
    story: "Historia",
    shop: "Tienda",
    faq: "Preguntas",
    recipes: "Recetas",
    care: "Cuidado",
    contact: "Contacto",
    home: "Inicio",
    cart: "Carrito",
    menu: "Menú",
  },
  footer: {
    tagline:
      "Hornos de arcilla refractaria, hechos a mano y pensados para quienes cocinan con fuego en serio.",
    collection: "Colección",
    company: "Compañía",
    learn: "Aprende",
    ourStory: "Nuestra Historia",
    shop: "Tienda",
    contact: "Contacto",
    refractoryCare: "Cuidado del Horno",
    recipes: "Recetas",
    faq: "Preguntas",
    followTitle: "Sigue el Fuego",
    followCopy: "Síguenos para ver fuego, comida y la creación de cada horno.",
    rights: "Todos los derechos reservados.",
    designedBy: "Diseñado por",
    privacy: "Política de Privacidad",
    terms: "Términos de Uso",
  },
};

export const ui: Record<Locale, UIDict> = { en, es };

/** Get the UI dictionary for a locale. */
export function t(locale: Locale): UIDict {
  return ui[locale];
}
