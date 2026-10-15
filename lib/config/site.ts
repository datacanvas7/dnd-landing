const vercelUrl = process.env.VERCEL_URL;

/** Canonical site URL. Set NEXT_PUBLIC_SITE_URL for local/custom-domain use. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");

export const INSTAGRAM_URL = "https://www.instagram.com/dndlhr/";
export const INSTAGRAM_HANDLE = "@dndlhr";

export const SITE_NAME = "DND";
export const TAGLINE = "BREW. SIP. REPEAT.";
