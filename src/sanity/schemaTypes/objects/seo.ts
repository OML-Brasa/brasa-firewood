import { defineField, defineType } from "sanity";

/**
 * Reusable SEO block — the per-page meta title and description shown in
 * browser tabs, search results, and link previews. Attach it to any page
 * document with `type: "seo"`. Both fields are optional: when left empty the
 * page falls back to its built-in default (see each route's generateMetadata).
 */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description:
        "Title for this page in the browser tab and search results. Leave empty to use the page's default. Aim for ~50–60 characters.",
      validation: (Rule) =>
        Rule.max(70).warning("Longer than ~60 characters may be truncated in search results."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      description:
        "Summary shown under the title in search results. Leave empty to use the page's default. Aim for ~150–160 characters.",
      validation: (Rule) =>
        Rule.max(180).warning("Longer than ~160 characters may be truncated in search results."),
    }),
  ],
});
