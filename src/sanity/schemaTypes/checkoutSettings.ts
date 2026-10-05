import { defineArrayMember, defineField, defineType } from "sanity";

/** Editable content shared across the cart / checkout / confirmation flow. */
export const checkoutSettings = defineType({
  name: "checkoutSettings",
  title: "Checkout Settings",
  type: "document",
  fields: [
    defineField({
      name: "shippingMethods",
      title: "Shipping methods",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "description", title: "Description", type: "string" }),
            defineField({ name: "price", title: "Price (USD, 0 = FREE)", type: "number" }),
          ],
          preview: { select: { title: "name", subtitle: "description" } },
        }),
      ],
    }),
    defineField({
      name: "trustBadges",
      title: "Trust badges",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "string" }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
    }),
    defineField({
      name: "whatsNext",
      title: "Confirmation · What's Next steps",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
    }),
    defineField({
      name: "accessories",
      title: "Complete Your Setup · accessories",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "description", title: "Description", type: "string" }),
            defineField({ name: "price", title: "Price (USD)", type: "number" }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
          ],
          preview: { select: { title: "name", subtitle: "description", media: "image" } },
        }),
      ],
    }),
    defineField({ name: "taxRate", title: "Estimated tax rate (e.g. 0.08 = 8%)", type: "number", initialValue: 0.08 }),
    defineField({ name: "financeText", title: "Financing line", type: "string" }),
    defineField({ name: "supportPhone", title: "Support phone", type: "string" }),
    defineField({ name: "supportEmail", title: "Support email", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Checkout Settings" }) },
});
