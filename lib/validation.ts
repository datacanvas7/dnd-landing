/** Email + attribution validation shared by client and server. */

export const EMAIL_MAX_LENGTH = 254;

/**
 * Pragmatic email shape check: something@domain.tld with no whitespace.
 * The database enforces a similar CHECK constraint as a second line of defense.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidEmail(raw: string): boolean {
  const email = normalizeEmail(raw);
  return email.length > 0 && email.length <= EMAIL_MAX_LENGTH && EMAIL_RE.test(email);
}

export type Attribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
const UTM_RE = /^[a-z0-9][a-z0-9 _.\-|]{0,98}[a-z0-9]$|^[a-z0-9]$/;

export const EMPTY_ATTRIBUTION: Attribution = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
};

/**
 * Extract and validate UTM parameters from a URL query string.
 * Attribution is never trusted raw: values are lowercased, trimmed,
 * length-capped and pattern-checked; anything else is dropped.
 */
export function parseAttribution(search: string): Attribution {
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(search);
  } catch {
    return { ...EMPTY_ATTRIBUTION };
  }

  const out: Attribution = { ...EMPTY_ATTRIBUTION };
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (!value) continue;
    const cleaned = value.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 100);
    if (UTM_RE.test(cleaned)) {
      out[key] = cleaned;
    }
  }
  return out;
}

/** Best-effort acquisition source derived from validated attribution. */
export function deriveSource(attr: Attribution): string {
  if (attr.utm_source) return attr.utm_source.slice(0, 64);
  return "direct";
}
