/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MEMBERSHIP OFFER CONFIGURATION — the single place to update the offer.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * TERMS CONFIRMED by the owner (Oct 2026):
 *   • 10% off the order
 *   • Discount capped at Rs 3,000
 *   • Valid till February 2027
 *
 * Still open (does NOT block launch — nothing on the page claims these):
 *   • Does the 10% apply every visit, or once per customer?
 *   • Any product exclusions?
 *   • Combining with other offers?
 *   • Physical / digital card issued? (Not built in v1.)
 *   • Redemption at the counter — the welcome email currently assumes "show
 *     this email"; update lib/email/welcome.ts if a code/card flow is used.
 *
 * If the owner changes the discount terms, update `offerLabel`, `ctaLabel`,
 * `termsNote` and the copy in components/SignupForm.tsx + app/page.tsx +
 * lib/email/welcome.ts to match.
 */

export const membership = {
  /** The approved conversion incentive, as displayed. */
  offerLabel: "10% membership benefit",
  /** Button label — rendered uppercase via CSS, so title case reads correctly. */
  ctaLabel: "Claim my 10% Off",
  /** Flip stays true while the headline terms above remain as approved. */
  termsConfirmed: true,
  /** Honest summary shown near the form — mirrors the confirmed terms. */
  termsNote:
    "Your 10% membership benefit: 10% off your order, up to a maximum discount of Rs 3,000 — valid till February 2027.",
} as const;
