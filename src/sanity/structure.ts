import type { StructureResolver } from "sanity/structure";

/**
 * Singleton page documents open their single editable document directly.
 * Products are a normal collection (a list you can add to / reorder).
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home Page")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("About Page")
        .id("aboutPage")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.listItem()
        .title("Shop Page")
        .id("shopPage")
        .child(S.document().schemaType("shopPage").documentId("shopPage")),
      S.listItem()
        .title("FAQ Page")
        .id("faqPage")
        .child(S.document().schemaType("faqPage").documentId("faqPage")),
      S.listItem()
        .title("Contact Page")
        .id("contactPage")
        .child(S.document().schemaType("contactPage").documentId("contactPage")),
      S.listItem()
        .title("Recipes Page")
        .id("recipesPage")
        .child(S.document().schemaType("recipesPage").documentId("recipesPage")),
      S.listItem()
        .title("Checkout Settings")
        .id("checkoutSettings")
        .child(S.document().schemaType("checkoutSettings").documentId("checkoutSettings")),
      S.divider(),
      S.listItem()
        .title("Products")
        .schemaType("product")
        .child(S.documentTypeList("product").title("Products").defaultOrdering([{ field: "order", direction: "asc" }])),
    ]);
