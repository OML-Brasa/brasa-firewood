import { defineArrayMember, defineField, defineType } from "sanity";

/** Recipes page — editable content (falls back to src/content/recipes.json). */
export const recipesPage = defineType({
  name: "recipesPage",
  title: "Recipes Page",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero · title", type: "string" }),
    defineField({ name: "heroSubtitle", title: "Hero · subtitle", type: "string" }),
    defineField({ name: "searchPlaceholder", title: "Search placeholder", type: "string" }),
    defineField({ name: "categories", title: "Category tabs", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({
      name: "recipes",
      title: "Recipes",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "category", title: "Category", type: "string" }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
            defineField({ name: "prepTime", title: "Prep time", type: "string" }),
            defineField({ name: "cookTime", title: "Cook time", type: "string" }),
            defineField({ name: "ovenTemp", title: "Oven temp", type: "string" }),
            defineField({ name: "difficulty", title: "Difficulty", type: "string" }),
            defineField({ name: "ingredients", title: "Ingredients", type: "array", of: [defineArrayMember({ type: "string" })] }),
            defineField({ name: "directions", title: "Directions", type: "text", rows: 5 }),
          ],
          preview: { select: { title: "title", subtitle: "category", media: "image" } },
        }),
      ],
    }),
    defineField({ name: "submitTitle", title: "Submit CTA · title", type: "string" }),
    defineField({ name: "submitSubtitle", title: "Submit CTA · subtitle", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Recipes Page" }) },
});
