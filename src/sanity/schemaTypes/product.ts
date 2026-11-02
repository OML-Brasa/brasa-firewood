import { defineArrayMember, defineField, defineType } from "sanity";

const isAccessory = ({ parent }: { parent?: { type?: string } }) => parent?.type === "accessory";
const isOven = ({ parent }: { parent?: { type?: string } }) => parent?.type !== "oven";

/** An oven line (Dolce / Ravvivata / Ardente / Acerba) with in-stock variants,
 *  or an accessory. Each oven variant is a real unit with its own size, finish,
 *  price and photo — selecting size + finish on the product page picks one. */
export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: { list: [{ title: "Oven", value: "oven" }, { title: "Accessory", value: "accessory" }], layout: "radio" },
      initialValue: "oven",
      validation: (r) => r.required(),
    }),
    defineField({ name: "name", title: "Name", type: "string", description: 'Oven line (e.g. "Dolce") or accessory name', validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: "order", title: "Sort order", type: "number", initialValue: 0 }),
    defineField({ name: "shortDescription", title: "Short description", type: "string", description: "One line, shown on the shop card." }),

    // ---- Oven ----
    defineField({ name: "tagline", title: "Tagline", type: "string", description: 'e.g. "Superior Wood-Fired Oven"', hidden: isOven }),
    defineField({ name: "style", title: "Style", type: "string", description: 'e.g. "Superior", "Supreme", "Enclosing / Indirect", "Complete Lot"', hidden: isOven }),
    defineField({ name: "doors", title: "Upper doors", type: "number", description: "1 or 2 (drives the spec sheet).", initialValue: 1, hidden: isOven }),
    defineField({
      name: "variants",
      title: "Variants (in-stock units)",
      type: "array",
      hidden: isOven,
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "size", title: "Size", type: "string", description: 'e.g. "80 cm"' }),
            defineField({ name: "finish", title: "Finish / color", type: "string", description: 'e.g. "Red Brick"' }),
            defineField({ name: "price", title: "Price (USD)", type: "number" }),
            defineField({ name: "stock", title: "Units in stock", type: "number", initialValue: 1 }),
            defineField({ name: "base", title: "Base", type: "string", description: 'e.g. "Metal Base"' }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
            defineField({ name: "image", title: "Primary photo", type: "image", options: { hotspot: true }, description: "Shown on shop cards, cart, and as the first gallery image." }),
            defineField({
              name: "gallery",
              title: "Gallery (extra angles)",
              type: "array",
              description: "Additional photos shown as thumbnails on the product page. The primary photo leads automatically.",
              of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
            }),
          ],
          preview: { select: { title: "finish", subtitle: "size", media: "image" }, prepare: ({ title, subtitle, media }) => ({ title: `${subtitle ?? ""} · ${title ?? ""}`, media }) },
        }),
      ],
    }),

    // ---- Accessory ----
    defineField({ name: "price", title: "Price (USD)", type: "number", hidden: ({ parent }) => !isAccessory({ parent }) }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, hidden: ({ parent }) => !isAccessory({ parent }) }),
    defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true }, hidden: ({ parent }) => !isAccessory({ parent }) }),
  ],
  orderings: [{ title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", type: "type", media: "variants.0.image", accMedia: "image" },
    prepare: ({ title, type, media, accMedia }) => ({ title, subtitle: type === "accessory" ? "Accessory" : "Oven", media: media ?? accMedia }),
  },
});
