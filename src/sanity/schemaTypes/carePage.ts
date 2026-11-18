import { defineArrayMember, defineField, defineType } from "sanity";

const text = (name: string, title: string, rows = 3) => defineField({ name, title, type: "text", rows });
const str = (name: string, title: string, description?: string) => defineField({ name, title, type: "string", description });
const bullets = (name: string, title: string) =>
  defineField({ name, title, type: "array", of: [defineArrayMember({ type: "text", rows: 2 })] });

/** Care / curing guide page — editable content (falls back to src/content/care.json). */
export const carePage = defineType({
  name: "carePage",
  title: "Care Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero & SEO", default: true },
    { name: "intro", title: "Objective & Before You Begin" },
    { name: "firewood", title: "Firewood" },
    { name: "drying", title: "Drying" },
    { name: "firing", title: "Firing & Summary" },
  ],
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: [ { title: "English", value: "en" }, { title: "Español", value: "es" } ], layout: "radio" },
      initialValue: "en",
      group: "hero",
    }),

    // Hero & SEO
    { ...str("metaTitle", "SEO · page title", "Shown in the browser tab and search results."), group: "hero" },
    { ...text("metaDescription", "SEO · description", 2), group: "hero" },
    { ...str("heroBadge", "Hero · badge"), group: "hero" },
    { ...str("heroTitle", "Hero · title"), group: "hero" },
    { ...text("heroIntro", "Hero · intro"), group: "hero" },
    { ...str("downloadLabel", "Hero · download button label"), group: "hero" },
    defineField({
      name: "pdf",
      title: "Guide PDF",
      description: "Downloaded by the hero button. The button is hidden if this or its label is empty.",
      type: "file",
      options: { accept: "application/pdf" },
      group: "hero",
    }),

    // Objective & Before You Begin
    { ...str("objectiveTitle", "Objective · title"), group: "intro" },
    { ...text("objectiveBody", "Objective · body", 4), group: "intro" },
    { ...str("beforeTitle", "Before You Begin · title"), group: "intro" },
    { ...bullets("beforeItems", "Before You Begin · bullets"), group: "intro" },

    // Firewood
    { ...str("firewoodTitle", "Recommended Firewood · title"), group: "firewood" },
    { ...text("firewoodIntro", "Recommended Firewood · intro"), group: "firewood" },
    defineField({
      name: "firewoodHeaders",
      title: "Firewood table · column headers",
      type: "object",
      group: "firewood",
      fields: [str("wood", "Column 1 (wood)"), str("where", "Column 2 (where to find it)"), str("characteristics", "Column 3 (characteristics)")],
    }),
    defineField({
      name: "firewood",
      title: "Firewood table · rows",
      type: "array",
      group: "firewood",
      of: [
        defineArrayMember({
          name: "firewoodRow",
          title: "Wood",
          type: "object",
          fields: [str("wood", "Wood"), str("where", "Where to find it"), text("characteristics", "Characteristics", 2)],
          preview: { select: { title: "wood", subtitle: "where" } },
        }),
      ],
    }),
    { ...str("avoidTitle", "Woods to Avoid · title"), group: "firewood" },
    { ...bullets("avoid", "Woods to Avoid · bullets"), group: "firewood" },

    // Drying
    { ...str("dryingTitle", "Initial Drying · title"), group: "drying" },
    { ...text("dryingIntro", "Initial Drying · intro"), group: "drying" },
    defineField({
      name: "dryingHeaders",
      title: "Drying table · column headers",
      type: "object",
      group: "drying",
      fields: [str("cycle", "Column 1 (cycle)"), str("when", "Column 2 (when)"), str("temperature", "Column 3 (temperature)"), str("duration", "Column 4 (duration)")],
    }),
    defineField({
      name: "dryingCycles",
      title: "Drying table · rows",
      type: "array",
      group: "drying",
      of: [
        defineArrayMember({
          name: "dryingCycle",
          title: "Cycle",
          type: "object",
          fields: [str("cycle", "Cycle"), str("when", "When"), str("temperature", "Temperature"), str("duration", "Duration")],
          preview: {
            select: { cycle: "cycle", when: "when", temperature: "temperature", duration: "duration" },
            prepare: ({ cycle, when, temperature, duration }) => ({
              title: [cycle, when].filter(Boolean).join(" · "),
              subtitle: [temperature, duration].filter(Boolean).join(" · "),
            }),
          },
        }),
      ],
    }),
    { ...str("whyTitle", "Why box · title"), group: "drying" },
    { ...text("whyBody", "Why box · body"), group: "drying" },
    { ...str("cracksTitle", "Cracks box · title"), group: "drying" },
    { ...text("cracksBody", "Cracks box · body"), group: "drying" },

    // Firing & Summary
    { ...str("firingTitle", "Firing · title"), group: "firing" },
    { ...text("firingIntro", "Firing · intro"), group: "firing" },
    defineField({
      name: "firingHeaders",
      title: "Firing table · column headers",
      type: "object",
      group: "firing",
      fields: [str("step", "Column 1 (step)"), str("action", "Column 2 (action)"), str("temperature", "Column 3 (temperature)")],
    }),
    defineField({
      name: "firingSteps",
      title: "Firing table · rows",
      type: "array",
      group: "firing",
      of: [
        defineArrayMember({
          name: "firingStep",
          title: "Step",
          type: "object",
          fields: [str("step", "Step"), text("action", "Action", 2), str("temperature", "Temperature", "Use “—” when there is no target temperature.")],
          preview: {
            select: { step: "step", action: "action", temperature: "temperature" },
            prepare: ({ step, action, temperature }) => ({
              title: [step, action].filter(Boolean).join(". "),
              subtitle: temperature,
            }),
          },
        }),
      ],
    }),
    { ...text("firingOutro", "Firing · closing paragraph"), group: "firing" },
    { ...str("summaryTitle", "Summary · title"), group: "firing" },
    { ...bullets("summary", "Summary · bullets"), group: "firing" },
  ],
  preview: { prepare: () => ({ title: "Care Page" }) },
});
