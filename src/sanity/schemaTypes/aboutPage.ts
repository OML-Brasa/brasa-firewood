import { defineArrayMember, defineField, defineType } from "sanity";

const titleCopy = {
  type: "object" as const,
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "copy", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "title", subtitle: "copy" } },
};

/** About page — editable content (falls back to code defaults in
 *  src/app/about/page.tsx). */
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero · title", type: "string" }),
    defineField({ name: "heroSubtitle", title: "Hero · subtitle", type: "text", rows: 3 }),
    defineField({ name: "heroImage", title: "Hero · background image", type: "image", options: { hotspot: true } }),

    defineField({ name: "originEyebrow", title: "Our Story · eyebrow", type: "string" }),
    defineField({ name: "originTitle", title: "Our Story · title", type: "string" }),
    defineField({ name: "originBody", title: "Our Story · body", type: "text", rows: 4 }),
    defineField({ name: "originImage", title: "Our Story · image", type: "image", options: { hotspot: true } }),

    defineField({ name: "quoteText", title: "Philosophy quote", type: "text", rows: 2 }),
    defineField({ name: "quoteAuthor", title: "Quote · author", type: "string" }),
    defineField({ name: "quoteRole", title: "Quote · role", type: "string" }),

    defineField({ name: "promises", title: "The Clay Difference (3)", type: "array", of: [defineArrayMember(titleCopy)] }),
    defineField({ name: "artisansBody", title: "The Artisans · body", type: "text", rows: 4 }),
    defineField({ name: "artisansImage", title: "The Artisans · image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "steps",
      title: "Workshop steps (4)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "n", title: "Number", type: "string" }),
            defineField({ name: "title", type: "string" }),
            defineField({ name: "copy", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "n" } },
        }),
      ],
    }),
    defineField({ name: "values", title: "Brand values (4)", type: "array", of: [defineArrayMember(titleCopy)] }),
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});
