import { defineField, defineType } from "sanity";

/** Legal pages — Privacy Policy and Terms of Use.
 *  Rich-text bodies are editable in Studio; the site shows placeholder
 *  copy until these are filled in. */
export const legalPage = defineType({
  name: "legalPage",
  title: "Legal Pages",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: [ { title: "English", value: "en" }, { title: "Español", value: "es" } ], layout: "radio" },
      initialValue: "en",
    }),
    defineField({ name: "privacyTitle", title: "Privacy · title", type: "string" }),
    defineField({ name: "privacyUpdated", title: "Privacy · last updated", description: "e.g. January 2026", type: "string" }),
    defineField({
      name: "privacyBody",
      title: "Privacy · body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({ name: "termsTitle", title: "Terms · title", type: "string" }),
    defineField({ name: "termsUpdated", title: "Terms · last updated", description: "e.g. January 2026", type: "string" }),
    defineField({
      name: "termsBody",
      title: "Terms · body",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({ name: "privacySeo", title: "Privacy · SEO", type: "seo" }),
    defineField({ name: "termsSeo", title: "Terms · SEO", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Legal Pages" }) },
});
