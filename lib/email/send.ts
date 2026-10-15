/**
 * Welcome-email delivery.
 *
 * Two modes, decided purely by environment — no new npm dependencies:
 *
 *  1. RESEND_API_KEY set  → send via the Resend REST API (plain fetch).
 *     EMAIL_FROM must be a verified sender (see README "Email setup").
 *  2. No key (local dev)  → write the rendered email to .outbox/ as an
 *     .html + .txt pair so the full flow is testable with zero accounts.
 *
 * Delivery failure must NEVER fail the signup itself — the row is already
 * stored at this point, so errors are logged server-side only and the
 * caller carries on.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { SITE_URL } from "@/lib/config/site";
import { renderWelcomeEmail } from "@/lib/email/welcome";

const DEFAULT_RESEND_API_URL = "https://api.resend.com/emails";
const SEND_TIMEOUT_MS = 8_000;

export type SendResult = {
  sent: boolean;
  mode: "resend" | "outbox";
};

export async function sendWelcomeEmail(to: string): Promise<SendResult> {
  const email = renderWelcomeEmail(SITE_URL);
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Local/dev fallback: park the rendered email in .outbox/ (gitignored).
    const dir = path.join(process.cwd(), ".outbox");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safeTo = to.replace(/[^a-z0-9@._-]/gi, "_");
    try {
      await mkdir(dir, { recursive: true });
      await Promise.all([
        writeFile(path.join(dir, `${stamp}-${safeTo}.html`), email.html, "utf8"),
        writeFile(path.join(dir, `${stamp}-${safeTo}.txt`), email.text, "utf8"),
      ]);
      console.warn(
        `[email] RESEND_API_KEY not set — welcome email for ${to} written to .outbox/ (dev only)`,
      );
      return { sent: true, mode: "outbox" };
    } catch (err) {
      console.error("[email] failed to write outbox file:", err);
      return { sent: false, mode: "outbox" };
    }
  }

  const from =
    process.env.EMAIL_FROM ?? "DND <welcome@dndlhr.com>";
  const replyTo = process.env.EMAIL_REPLY_TO ?? "hello@dndlhr.com";

  // Overridable for tests (e.g. pointing at a local stub); defaults to Resend.
  const apiUrl = process.env.RESEND_API_URL ?? DEFAULT_RESEND_API_URL;

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: replyTo,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
      // Must be awaited before the handler returns (Vercel may otherwise
      // freeze the function once the HTTP response is done).
      cache: "no-store",
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[email] Resend ${res.status}: ${detail.slice(0, 500)}`);
      return { sent: false, mode: "resend" };
    }
    return { sent: true, mode: "resend" };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { sent: false, mode: "resend" };
  }
}
