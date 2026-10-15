"use client";

import { track } from "@vercel/analytics";

export type DndEvent =
  | "signup_submit"
  | "signup_success"
  | "signup_duplicate"
  | "signup_error"
  | "instagram_click";

/**
 * First-party event tracking via Vercel Web Analytics (cookieless, no
 * personal data, no third-party ad scripts). Events carry campaign
 * attribution only — never the email address.
 */
export function trackEvent(name: DndEvent, props?: Record<string, string>) {
  try {
    track(name, props);
  } catch {
    // Analytics must never break the signup flow.
  }
}
