/**
 * GROQ helpers for document-level internationalization.
 *
 * Each content type has one document per language, tagged with a `language`
 * field ("en" | "es"). `localeDoc` selects the document for the requested
 * language and falls back to English (then to any document) so a page never
 * renders empty. Pass `{ lang }` (plus any params used in `filter`) to
 * `client.fetch`.
 */
export function localeDoc(type: string, filter = ""): string {
  const base = `_type == "${type}"${filter ? ` && ${filter}` : ""}`;
  return (
    `coalesce(` +
    `*[${base} && language == $lang][0], ` +
    `*[${base} && language == "en"][0], ` +
    `*[${base}][0]` +
    `)`
  );
}
