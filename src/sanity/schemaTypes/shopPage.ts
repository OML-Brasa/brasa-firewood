import { defineArrayMember, defineField, defineType } from "sanity";

/** Shop page — editable content (falls back to code defaults in
 *  src/app/shop/page.tsx). */
export const shopPage = defineType({
  name: "shopPage",
  title: "Shop Page",
  type: "document",
  fields: [
    defineField({ name: "pageTitle", title: "Page title", type: "string" }),
    defineField({ name: "pageIntro", title: "Page intro", type: "text", rows: 3 }),

    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", type: "string" }),
            defineField({ name: "price", type: "string" }),
            defineField({ name: "desc", title: "Description", type: "text", rows: 3 }),
            defineField({ name: "image", type: "image", options: { hotspot: true } }),
          ],
          preview: { select: { title: "name", subtitle: "price", media: "image" } },
        }),
      ],
    }),

    defineField({ name: "bundleTitle", title: "Essentials bundle · title", type: "string" }),
    defineField({ name: "bundleDescription", title: "Essentials bundle · description", type: "text", rows: 3 }),
    defineField({ name: "bundlePrice", title: "Essentials bundle · price", type: "string" }),
    defineField({ name: "bundleImage", title: "Essentials bundle · image", type: "image", options: { hotspot: true } }),
  ],
  preview: { prepare: () => ({ title: "Shop Page" }) },
});
