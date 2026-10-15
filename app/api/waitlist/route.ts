import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email/send";
import {
  deriveSource,
  isValidEmail,
  normalizeEmail,
  parseAttribution,
  type Attribution,
} from "@/lib/validation";

/**
 * Waitlist signup endpoint.
 *
 * All writes to public.dnd_waitlist go through here so the browser never
 * holds a Supabase key. The route validates + normalizes the email, enforces
 * a lightweight per-IP rate limit and spam checks, then inserts explicit
 * columns using the anon key (RLS allows insert-only, no reads).
 */

type Body = {
  email?: unknown;
  attribution?: unknown;
  hp?: unknown;
  dwellMs?: unknown;
};

// ── Per-IP rate limiting ────────────────────────────────────────────────────
// In-memory sliding window. On serverless this is per-instance — good enough
// to blunt casual abuse; swap for Upstash/Redis or Turnstile before scaling
// the campaign (see README "Abuse protection").
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Keep the map from growing unbounded.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function sanitizeUtm(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value.slice(0, 100) : null;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
  }

  // Honeypot filled → silently accept without writing anything, so bots
  // don't learn they were filtered.
  if (typeof body.hp === "string" && body.hp.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Implausibly fast submit → treat the same way (humans take >1.2s to type).
  if (typeof body.dwellMs !== "number" || body.dwellMs < 1200) {
    return NextResponse.json({ ok: true });
  }

  if (typeof body.email !== "string" || !isValidEmail(body.email)) {
    return NextResponse.json({ ok: false, code: "invalid_email" }, { status: 400 });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, code: "rate_limited" }, { status: 429 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    // Misconfiguration — logged server-side only; never echoed to the client.
    console.error("[waitlist] SUPABASE_URL / SUPABASE_ANON_KEY are not configured");
    return NextResponse.json({ ok: false, code: "unavailable" }, { status: 503 });
  }

  // Re-derive attribution server-side from the (already sanitized) client copy.
  const raw = body.attribution;
  const attribution: Attribution =
    raw && typeof raw === "object"
      ? {
          utm_source: sanitizeUtm((raw as Record<string, unknown>).utm_source),
          utm_medium: sanitizeUtm((raw as Record<string, unknown>).utm_medium),
          utm_campaign: sanitizeUtm((raw as Record<string, unknown>).utm_campaign),
          utm_content: sanitizeUtm((raw as Record<string, unknown>).utm_content),
        }
      : parseAttribution("");

  const email = normalizeEmail(body.email);
  const source = deriveSource(attribution);

  // Explicit column selection — clients can never write arbitrary columns.
  const { error } = await supabase.from("dnd_waitlist").insert({
    email,
    source,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_content: attribution.utm_content,
  });

  if (error) {
    if (error.code === "23505") {
      // Unique violation — this address is already on the list.
      return NextResponse.json({ ok: false, code: "duplicate" }, { status: 409 });
    }
    console.error("[waitlist] insert failed:", error.code, error.message);
    return NextResponse.json({ ok: false, code: "server_error" }, { status: 500 });
  }

  // Welcome email — awaited deliberately (a serverless function may stop
  // work once the response is sent). The signup is already stored, so a
  // delivery failure is logged but never surfaced as an error to the user.
  await sendWelcomeEmail(email);

  return NextResponse.json({ ok: true });
}
