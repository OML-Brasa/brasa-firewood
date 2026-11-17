import type { Locale } from "@/lib/i18n";

/**
 * Hard-coded UI strings for the Shop page (ShopClient) and the home
 * Collection block (CollectionShowcase). Reuse `ui[locale].common` for
 * shared strings (From, Add, Home, Shop); shop-specific strings live here.
 *
 * `en` defines the shape; `es` must mirror it (enforced by the type below).
 */
const en = {
  // Tabs
  tabAll: "All",
  tabOvens: "Ovens",
  tabAccessories: "Accessories",

  // Collection + filter/sort toolbar
  collectionTitle: "The Collection",
  sizeLabel: "Size",
  allSizes: "All",
  sortBy: "Sort by",
  sortFeatured: "Featured",
  sortPriceAsc: "Price: Low to High",
  sortPriceDesc: "Price: High to Low",
  noOvens: "No ovens in that size.",
  clearFilter: "Clear filter",

  // Oven card meta
  sizeCount: (n: number) => `${n} ${n === 1 ? "size" : "sizes"}`,
  finishCount: (n: number) => `${n} ${n === 1 ? "finish" : "finishes"}`,
  viewConfigure: "View & Configure",

  // Essentials bundle
  bestValue: "Best Value",
  essentialsTitle: "The Essentials Package",
  essentialsCopy:
    "Everything you need to vent your oven, bundled together — the 1 m exhaust tube, hood, and 45° elbow.",
  addKit: "Add Kit to Cart",
  exhaustKitAlt: "Exhaust kit",

  // Accessories section
  accessoriesTitle: "Accessories",
  view: "View",

  // Shipping note
  shippingTitle: "Shipping is quoted per location",
  shippingCopy:
    "These ovens ship by freight, so cost depends on your area. Add what you want to your cart and request a shipping quote — we’ll follow up with the total.",

  // Recently viewed
  recentlyViewed: "Recently Viewed",
  recentEmptyTitle: "You haven’t viewed any ovens yet",
  recentEmptyCopy: "Models you look at will show up here.",

  // CollectionShowcase (home)
  viewBrasa: (name: string) => `View the Brasa ${name}`,
  ovenAlt: (name: string) => `Brasa ${name} oven`,
};

type Dict = typeof en;

const es: Dict = {
  // Tabs
  tabAll: "Todo",
  tabOvens: "Hornos",
  tabAccessories: "Accesorios",

  // Collection + filter/sort toolbar
  collectionTitle: "La colección",
  sizeLabel: "Medida",
  allSizes: "Todas",
  sortBy: "Ordenar por",
  sortFeatured: "Destacados",
  sortPriceAsc: "Precio: de menor a mayor",
  sortPriceDesc: "Precio: de mayor a menor",
  noOvens: "No hay hornos de esa medida.",
  clearFilter: "Quitar filtro",

  // Oven card meta
  sizeCount: (n: number) => `${n} ${n === 1 ? "medida" : "medidas"}`,
  finishCount: (n: number) => `${n} ${n === 1 ? "acabado" : "acabados"}`,
  viewConfigure: "Ver y configurar",

  // Essentials bundle
  bestValue: "Mejor valor",
  essentialsTitle: "El paquete esencial",
  essentialsCopy:
    "Todo lo que necesitas para ventilar tu horno, en un solo paquete — el tubo de escape de 1 m, la campana y el codo de 45°.",
  addKit: "Añadir kit al carrito",
  exhaustKitAlt: "Kit de escape",

  // Accessories section
  accessoriesTitle: "Accesorios",
  view: "Ver",

  // Shipping note
  shippingTitle: "El envío se cotiza según la ubicación",
  shippingCopy:
    "Estos hornos se envían por flete, así que el costo depende de tu área. Añade lo que quieras a tu carrito y solicita una cotización de envío — te daremos seguimiento con el total.",

  // Recently viewed
  recentlyViewed: "Visto recientemente",
  recentEmptyTitle: "Todavía no has visto ningún horno",
  recentEmptyCopy: "Los modelos que veas aparecerán aquí.",

  // CollectionShowcase (home)
  viewBrasa: (name: string) => `Ver el Brasa ${name}`,
  ovenAlt: (name: string) => `Horno Brasa ${name}`,
};

export const shopUI: Record<Locale, Dict> = { en, es };
