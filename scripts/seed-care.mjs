/**
 * Seeds the Care page (English `carePage` + Spanish `carePage__es`) with the
 * copy from src/content/care.json and uploads the bundled guide PDF, so the
 * page can be edited in Studio.
 *
 * Usage (needs SANITY_API_WRITE_TOKEN in .env.local — see seed-sanity.mjs):
 *   npm run seed:care
 *
 * Safe to re-run: documents are created only if they don't exist yet, so edits
 * made in Studio are never overwritten. To reset a document to the bundled copy,
 * delete it in Studio first and run this again.
 */
import { createReadStream, readFileSync } from "node:fs";
import { createClient } from "next-sanity";

import care from "../src/content/care.json" with { type: "json" };

function loadEnv() {
  try {
    for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local — rely on real env */
  }
}
loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "bnm22fin";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error('\n✗ Missing SANITY_API_WRITE_TOKEN. Add it to .env.local as:  SANITY_API_WRITE_TOKEN="<token>"\n');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const rows = (items, type, prefix) => items.map((r, i) => ({ _key: `${prefix}${i + 1}`, _type: type, ...r }));

function doc(c, id, language, pdfAssetId) {
  const [wood, where, characteristics] = c.firewoodHeaders;
  const [cycle, when, dTemp, duration] = c.dryingHeaders;
  const [step, action, fTemp] = c.firingHeaders;
  return {
    ...c,
    _id: id,
    _type: "carePage",
    language,
    pdf: { _type: "file", asset: { _type: "reference", _ref: pdfAssetId } },
    firewoodHeaders: { wood, where, characteristics },
    firewood: rows(c.firewood, "firewoodRow", "wood-"),
    dryingHeaders: { cycle, when, temperature: dTemp, duration },
    dryingCycles: rows(c.dryingCycles, "dryingCycle", "cycle-"),
    firingHeaders: { step, action, temperature: fTemp },
    firingSteps: rows(c.firingSteps, "firingStep", "step-"),
  };
}

const run = async () => {
  console.log("  ↑ uploading brasa-oven-curing-guide.pdf");
  const pdf = await client.assets.upload(
    "file",
    createReadStream(new URL("../public/care/brasa-oven-curing-guide.pdf", import.meta.url)),
    { filename: "brasa-oven-curing-guide.pdf", contentType: "application/pdf" }
  );

  const docs = [doc(care.en, "carePage", "en", pdf._id), doc(care.es, "carePage__es", "es", pdf._id)];
  const existing = new Set(await client.fetch(`*[_id in $ids]._id`, { ids: docs.map((d) => d._id) }));
  await docs.reduce((tx, d) => tx.createIfNotExists(d), client.transaction()).commit();

  for (const d of docs) console.log(existing.has(d._id) ? `• ${d._id} already exists — left unchanged` : `✓ created ${d._id}`);
};

run().catch((err) => {
  console.error("✗ Seed failed:", err.message || err);
  process.exit(1);
});
