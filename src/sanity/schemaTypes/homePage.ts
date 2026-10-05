import { defineArrayMember, defineField, defineType } from "sanity";

/** Home page — editable content. Text that isn't set falls back to the
 *  values coded in src/app/page.tsx, so the page always renders. */
export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Internal title", type: "string", initialValue: "Home", hidden: true }),

    defineField({ name: "heroLine1", title: "Hero line 1", type: "string" }),
    defineField({ name: "heroLine2", title: "Hero line 2", type: "string" }),
    defineField({ name: "heroImage", title: "Hero · background image", type: "image", options: { hotspot: true } }),

    defineField({ name: "philosophy", title: "Philosophy strip", type: "string" }),

    defineField({ name: "aboutEyebrow", title: "About · eyebrow", type: "string" }),
    defineField({ name: "aboutTitle", title: "About · title", type: "string" }),
    defineField({ name: "aboutIntro", title: "About · intro sentence", type: "text", rows: 2 }),
    defineField({ name: "aboutConviction", title: "About · the conviction", type: "text", rows: 2 }),
    defineField({ name: "aboutChallenge", title: "About · the challenge", type: "text", rows: 3 }),
    defineField({ name: "aboutImage", title: "About · image", type: "image", options: { hotspot: true } }),

    defineField({ name: "featuredImage", title: "Collection · featured image", type: "image", options: { hotspot: true } }),

    defineField({
      name: "products",
      title: "Collection products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", type: "string" }),
            defineField({ name: "price", type: "string" }),
            defineField({ name: "image", type: "image", options: { hotspot: true } }),
          ],
          preview: { select: { title: "name", subtitle: "price", media: "image" } },
        }),
      ],
    }),

    defineField({ name: "materialImage", title: "Material story · image", type: "image", options: { hotspot: true } }),
    defineField({ name: "editorialRecipesImage", title: "Editorial · Recipes image", type: "image", options: { hotspot: true } }),
    defineField({ name: "editorialMemoriesImage", title: "Editorial · Memories image", type: "image", options: { hotspot: true } }),

    defineField({ name: "quoteText", title: "Quote", type: "text", rows: 2 }),
    defineField({ name: "quoteAttribution", title: "Quote attribution", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});
