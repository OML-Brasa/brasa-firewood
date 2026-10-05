import { defineArrayMember, defineField, defineType } from "sanity";

/** A single oven model — powers both the shop grid card and its /shop/[slug]
 *  detail page. Everything here is editable; the page falls back to code
 *  defaults only when a document is missing entirely. */
export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Sort order", type: "number", initialValue: 0 }),

    defineField({ name: "tagline", title: "Tagline", type: "string", description: 'e.g. "Traditional Oven"' }),
    defineField({ name: "price", title: "Price (shop card)", type: "string", description: 'e.g. "From $2,450"' }),
    defineField({ name: "priceSymbol", title: "Price symbol (detail hero)", type: "string", description: 'e.g. "$$$"' }),
    defineField({ name: "shortDescription", title: "Short description", type: "text", rows: 3 }),

    defineField({
      name: "gallery",
      title: "Gallery images",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),

    // ---- Configurator options ----
    defineField({
      name: "sizes",
      title: "Oven sizes",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "model", title: "Model", type: "string", description: 'e.g. "model 90"' }),
            defineField({ name: "dims", title: "Dimensions", type: "string", description: 'e.g. "(120x120 cm)"' }),
          ],
          preview: { select: { title: "model", subtitle: "dims" } },
        }),
      ],
    }),
    defineField({ name: "insulation", title: "Insulation options", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({
      name: "domeColors",
      title: "Dome colors",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "color", title: "Swatch color (hex)", type: "string", description: 'e.g. "#DED7D4"' }),
          ],
          preview: { select: { title: "name", subtitle: "color" } },
        }),
      ],
    }),
    defineField({ name: "archFinishes", title: "Arch finishes", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "bases", title: "Base options", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "financeNote", title: "Financing note", type: "string", description: 'e.g. "As low as $242/mo with 24-month financing."' }),

    // ---- Content sections ----
    defineField({
      name: "features",
      title: "Features & Benefits (6)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "copy", title: "Copy", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "copy" } },
        }),
      ],
    }),
    defineField({
      name: "specs",
      title: "Technical specifications",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "faqs",
      title: "Frequently asked questions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string" }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        }),
      ],
    }),
  ],
  orderings: [{ title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "price", media: "gallery.0" } },
});
