import { defineArrayMember, defineField, defineType } from "sanity";

const qa = {
  type: "object" as const,
  fields: [
    defineField({ name: "question", title: "Question", type: "string" }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
};

/** FAQ page — editable content (falls back to src/content/faq.json). */
export const faqPage = defineType({
  name: "faqPage",
  title: "FAQ Page",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero · title", type: "string" }),
    defineField({ name: "heroSubtitle", title: "Hero · subtitle", type: "string" }),
    defineField({ name: "searchPlaceholder", title: "Search placeholder", type: "string" }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Category title", type: "string" }),
            defineField({ name: "items", title: "Questions", type: "array", of: [defineArrayMember(qa)] }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
    defineField({ name: "ctaTitle", title: "CTA · title", type: "string" }),
    defineField({ name: "ctaSubtitle", title: "CTA · subtitle", type: "string" }),
    defineField({ name: "ctaPhone", title: "CTA · phone", type: "string" }),
    defineField({ name: "ctaEmail", title: "CTA · email", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "FAQ Page" }) },
});
