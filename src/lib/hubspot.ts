/**
 * HubSpot contact-form integration via the Forms API.
 *
 * Configure with env vars (see .env.local / Vercel):
 *   HUBSPOT_PORTAL_ID   the Hub/Portal ID (a number, public)
 *   HUBSPOT_FORM_GUID   the GUID of a HubSpot form (public)
 *
 * Both are public IDs — no secret token is needed. The Forms API endpoint
 * creates/updates the contact, logs the submission, and (per the form's own
 * settings in HubSpot) emails the team. Until both are set, isHubspotReady()
 * is false and the contact route tells the client to fall back to email.
 *
 * The HubSpot form must contain these fields (internal names): firstname,
 * lastname, email, phone, message. The website's "Subject" value is prepended
 * to the message, so no custom "subject" property is required in HubSpot.
 */

const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID ?? "";
const FORM_GUID = process.env.HUBSPOT_FORM_GUID ?? "";

export function isHubspotReady(): boolean {
  return Boolean(PORTAL_ID && FORM_GUID);
}

export type ContactSubmission = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  pageUri?: string;
};

export type HubspotResult = { ok: true } | { ok: false; error: string };

export async function submitContactForm(data: ContactSubmission): Promise<HubspotResult> {
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`;

  // Fold the subject into the message so the HubSpot form only needs the
  // standard contact fields (no custom "subject" property to set up).
  const message = data.subject ? `Subject: ${data.subject}\n\n${data.message}` : data.message;

  const fields = [
    { name: "firstname", value: data.firstName },
    { name: "lastname", value: data.lastName },
    { name: "email", value: data.email },
    ...(data.phone ? [{ name: "phone", value: data.phone }] : []),
    { name: "message", value: message },
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields,
      context: data.pageUri ? { pageUri: data.pageUri, pageName: "Contact | Brasa" } : undefined,
    }),
  });

  if (res.ok) return { ok: true };

  const detail = (await res.json().catch(() => ({}))) as { message?: string };
  console.error("[hubspot] submit failed", res.status, detail.message);
  return { ok: false, error: detail.message ?? `http-${res.status}` };
}
