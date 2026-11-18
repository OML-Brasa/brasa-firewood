import type { StructureResolver } from "sanity/structure";

/**
 * Each page exists in two languages: the English document keeps its original id
 * (e.g. `homePage`) and the Spanish one uses the `__es` suffix (e.g.
 * `homePage__es`). Singletons open an English / Español pair; products are
 * grouped into English and Español lists by their `language` field.
 */
type S = Parameters<StructureResolver>[0];

const singleton = (S: S, type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(
      S.list()
        .title(title)
        .items([
          S.listItem()
            .title("English")
            .id(`${type}-en`)
            .child(S.document().schemaType(type).documentId(type)),
          S.listItem()
            .title("Español")
            .id(`${type}-es`)
            .child(S.document().schemaType(type).documentId(`${type}__es`)),
        ])
    );

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singleton(S, "homePage", "Home Page"),
      singleton(S, "aboutPage", "About Page"),
      singleton(S, "shopPage", "Shop Page"),
      singleton(S, "faqPage", "FAQ Page"),
      singleton(S, "contactPage", "Contact Page"),
      singleton(S, "recipesPage", "Recipes Page"),
      singleton(S, "legalPage", "Legal Pages"),
      singleton(S, "checkoutSettings", "Checkout Settings"),
      S.divider(),
      S.listItem()
        .title("Products")
        .id("products")
        .child(
          S.list()
            .title("Products")
            .items([
              S.listItem()
                .title("English")
                .id("products-en")
                .child(
                  S.documentList()
                    .title("Products — English")
                    .filter('_type == "product" && (language == "en" || !defined(language))')
                    .defaultOrdering([{ field: "order", direction: "asc" }])
                ),
              S.listItem()
                .title("Español")
                .id("products-es")
                .child(
                  S.documentList()
                    .title("Products — Español")
                    .filter('_type == "product" && language == "es"')
                    .defaultOrdering([{ field: "order", direction: "asc" }])
                ),
            ])
        ),
    ]);
