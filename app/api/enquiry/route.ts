import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";

/* ---------------------------------------------------------------------------
   Placeholder enquiry transport.
   - Validates required fields and honours the honeypot.
   - Currently LOGS the enquiry server-side and returns { ok: true } so the
     front-end "Thank you" flow works end to end with no third party wired up.
   - The client has their own mailboxes (sales@ / technical@). When they choose
     a transport, wire ONE of the marked TODO branches below:
       (a) direct SMTP via a lib (nodemailer) using SMTP_* env vars,
       (b) a transactional provider (Resend/Domains/SES) via RESEND_API_KEY,
       (c) a Formspree-style endpoint via FORMSPREE_ID.
     The shape of `payload` is already stable, so the wiring is isolated here.
   --------------------------------------------------------------------------- */

type EnquiryPayload = {
  enquiry_type?: string;
  product?: string;
  source_url?: string;
  full_name?: string;
  company?: string;
  email?: string;
  phone?: string;
  message?: string;
  website?: string; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let data: EnquiryPayload;
  try {
    data = (await req.json()) as EnquiryPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: pretend success so bots never learn they were filtered.
  if (typeof data.website === "string" && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = (data.full_name ?? "").trim();
  const email = (data.email ?? "").trim();
  if (!name || !email) {
    return NextResponse.json({ ok: false, error: "Please add your name and email." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "That email address does not look right." }, { status: 400 });
  }

  const type = data.enquiry_type === "technical" ? "technical" : "sales";
  const to = type === "technical" ? SITE.contact.technicalEmail : SITE.contact.salesEmail;

  const payload = {
    receivedAt: new Date().toISOString(),
    to,
    type,
    product: (data.product ?? "General enquiry").slice(0, 160),
    sourceUrl: (data.source_url ?? "").slice(0, 500),
    fullName: name.slice(0, 120),
    company: (data.company ?? "").slice(0, 160),
    email: email.slice(0, 160),
    phone: (data.phone ?? "").slice(0, 40),
    message: (data.message ?? "").slice(0, 4000),
  };

  // Placeholder behaviour: log to the server console.
  // eslint-disable-next-line no-console
  console.log("[enquiry] new lead:", JSON.stringify(payload));

  // TODO(transport): replace the block above with a real send once the client
  // confirms their mail setup. Example (env-gated, safe to leave dormant):
  //   if (process.env.RESEND_API_KEY) { await sendViaResend(payload); }
  //   else if (process.env.FORMSPREE_ID) { await forwardToFormspree(payload); }

  return NextResponse.json({ ok: true });
}

// Reject other verbs explicitly.
export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405 });
}
