import { defineArrayMember, defineField, defineType } from "sanity";

/** Contact page — editable content (falls back to src/content/contact.json). */
export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero · title", type: "string" }),
    defineField({ name: "heroSubtitle", title: "Hero · subtitle", type: "text", rows: 3 }),
    defineField({ name: "heroImage", title: "Hero · background image (optional)", type: "image", options: { hotspot: true } }),

    defineField({ name: "formTitle", title: "Form · title", type: "string" }),
    defineField({ name: "subjects", title: "Form · subject options", type: "array", of: [defineArrayMember({ type: "string" })] }),

    defineField({ name: "detailsTitle", title: "Contact details · title", type: "string" }),
    defineField({ name: "detailsIntro", title: "Contact details · intro", type: "text", rows: 2 }),
    defineField({ name: "email", title: "Email address", type: "string" }),
    defineField({ name: "phone", title: "Phone number", type: "string" }),
    defineField({ name: "businessHours", title: "Business hours", type: "text", rows: 3 }),

    defineField({ name: "consultationTitle", title: "Consultation · title", type: "string" }),
    defineField({ name: "consultationBody", title: "Consultation · body", type: "text", rows: 2 }),

    defineField({ name: "faqTitle", title: "Common Questions · title", type: "string" }),
    defineField({ name: "faqIntro", title: "Common Questions · intro", type: "text", rows: 2 }),
    defineField({
      name: "faqs",
      title: "Common Questions",
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
  preview: { prepare: () => ({ title: "Contact Page" }) },
});
