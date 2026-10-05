"use client";

/**
 * Client boundary for the embedded Sanity Studio.
 *
 * Importing `sanity.config` (which pulls in `@sanity/vision` → `swr`) must
 * happen in the client graph. If it were imported from the Server Component
 * `page.tsx`, `swr` would resolve under the `react-server` export condition,
 * whose build omits the default `useSWR` export and fails the build.
 */
import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

export default function Studio() {
  return <NextStudio config={config} />;
}
