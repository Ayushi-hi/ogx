import { NextResponse } from "next/server";
import { Resend } from "resend";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  const errors: Record<string, string> = {};
  if (!name || name.length > 100) errors.name = "Enter your name (max 100 characters).";
  if (!EMAIL_RE.test(email) || email.length > 200) errors.email = "Enter a valid email address.";
  if (!message || message.length > 2000) errors.message = "Enter a message (max 2000 characters).";
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors, error: "Please fix the highlighted fields." }, { status: 400 });
  }

  // 1. Save. If this fails the submission genuinely failed.
  try {
    await connectDB();
    await Contact.create({ name, email, message });
  } catch (e) {
    console.error("[contact] save failed:", e);
    return NextResponse.json({ ok: false, error: "We couldn't save your message. Please try again shortly." }, { status: 500 });
  }

  // 2. Thank-you email. Failure here must NOT fail the submission.
  let emailSent = false;
  const key = process.env.RESEND_API_KEY;
  if (key) {
    try {
      const { error } = await new Resend(key).emails.send({
        from: process.env.RESEND_FROM || "OGX Studio <onboarding@resend.dev>",
        to: email,
        subject: "Thanks for reaching out to OGX Studio",
        html: `<p>Hi ${esc(name)},</p><p>Thanks for reaching out. Your message has been received and we'll get back to you soon.</p><p>&mdash; OGX Studio</p>`,
        text: `Hi ${name},\n\nThanks for reaching out. Your message has been received and we'll get back to you soon.\n\n- OGX Studio`,
      });
      if (error) console.error("[contact] resend error:", error);
      else emailSent = true;
    } catch (e) {
      console.error("[contact] email failed:", e);
    }
  } else {
    console.warn("[contact] RESEND_API_KEY not set; skipping email");
  }

  return NextResponse.json({ ok: true, emailSent }, { status: 201 });
}
