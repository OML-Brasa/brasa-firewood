/**
 * This configuration is used for the Sanity Studio that's mounted on the
 * `/studio` route in this Next.js app (src/app/studio/[[...tool]]/page.tsx).
 */
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision lets you query your content with GROQ from inside the Studio
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
