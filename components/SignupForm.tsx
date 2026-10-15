"use client";

import { useEffect, useRef, useState } from "react";
import { membership } from "@/lib/config/membership";
import {
  EMPTY_ATTRIBUTION,
  isValidEmail,
  normalizeEmail,
  parseAttribution,
  type Attribution,
} from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";
import { IgLink } from "@/components/IgLink";

type Status =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "success" }
  | { phase: "duplicate" }
  | { phase: "invalid"; message: string }
  | { phase: "error"; message: string };

const ATTRIBUTION_KEY = "dnd_attribution";

/**
 * Capture validated UTM attribution from the current URL (persisting it for
 * the session), falling back to what was captured earlier. Read at submit
 * time — client-only, SSR-safe, no extra renders.
 */
function captureAttribution(): Attribution {
  const fresh = parseAttribution(window.location.search);
  const hasFresh = Object.values(fresh).some(Boolean);
  if (hasFresh) {
    try {
      sessionStorage.setItem(
        ATTRIBUTION_KEY,
        JSON.stringify(
          Object.fromEntries(Object.entries(fresh).filter(([, v]) => v !== null)),
        ),
      );
    } catch {
      // sessionStorage may be unavailable; attribution just won't persist.
    }
    return fresh;
  }
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (raw) return parseAttribution(new URLSearchParams(JSON.parse(raw)).toString());
  } catch {
    // fall through
  }
  return EMPTY_ATTRIBUTION;
}

const FIELD =
  "w-full appearance-none rounded-none border-0 border-b-2 border-cream/25 bg-transparent " +
  "px-0 py-3.5 text-base text-cream placeholder:text-rose/45 " +
  "transition-colors duration-200 hover:border-cream/45 focus:border-rose focus:outline-none " +
  "focus-visible:outline-none";

const BUTTON =
  "inline-flex w-full items-center justify-center rounded-none bg-cream px-6 py-4 " +
  "font-display text-lg tracking-[0.08em] text-burgundy uppercase " +
  "transition-colors duration-200 hover:bg-rose hover:text-burgundy-deep " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-rose " +
  "disabled:cursor-not-allowed disabled:opacity-60 sm:text-xl";

export function SignupForm() {
  const mountedAt = useRef<number>(0);
  const [status, setStatus] = useState<Status>({ phase: "idle" });
  const [email, setEmail] = useState("");
  const [hpValue, setHpValue] = useState("");

  useEffect(() => {
    if (mountedAt.current === 0) mountedAt.current = Date.now();
  }, []);

  const loading = status.phase === "loading";
  const settled = status.phase === "success" || status.phase === "duplicate";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || settled) return;

    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) {
      setStatus({
        phase: "invalid",
        message: normalized
          ? "That email doesn't look right. Check it and try again."
          : "Enter your email address to join DND-Gang.",
      });
      return;
    }

    setStatus({ phase: "loading" });
    const attribution = captureAttribution();
    const sourceProp = { source: attribution.utm_source ?? "direct" };
    trackEvent("signup_submit", sourceProp);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalized,
          attribution,
          hp: hpValue,
          dwellMs: Date.now() - mountedAt.current,
        }),
      });

      if (res.status === 409) {
        setStatus({ phase: "duplicate" });
        trackEvent("signup_duplicate", sourceProp);
        return;
      }
      if (res.status === 429) {
        setStatus({
          phase: "error",
          message: "That's a few signups in a row. Give it a minute and try again.",
        });
        return;
      }
      if (!res.ok) {
        setStatus({
          phase: "error",
          message: "Something went wrong on our end. Your email is still here — try again.",
        });
        trackEvent("signup_error", sourceProp);
        return;
      }

      setStatus({ phase: "success" });
      trackEvent("signup_success", sourceProp);
    } catch {
      setStatus({
        phase: "error",
        message: "You seem to be offline. Your email is still here — check your connection and try again.",
      });
      trackEvent("signup_error", sourceProp);
    }
  }

  if (status.phase === "success") {
    return (
      <div className="flex flex-col gap-5" role="status" aria-live="polite">
        <p className="font-display text-4xl tracking-tight text-cream uppercase sm:text-5xl">
          You&apos;re in.
        </p>
        <p className="max-w-sm text-base leading-relaxed text-rose">
          You&apos;re in the DND-Gang. Watch your inbox for updates.
        </p>
        <div className="h-px w-full bg-rose/25" aria-hidden="true" />
        <IgLink
          location="success"
          className="inline-flex w-fit items-center gap-2 border-b border-rose/50 pb-1 font-sans text-sm font-medium tracking-[0.18em] text-rose uppercase transition-colors duration-200 hover:border-rose hover:text-cream"
        >
          Follow the build on Instagram ↗
        </IgLink>
      </div>
    );
  }

  if (status.phase === "duplicate") {
    return (
      <div className="flex flex-col gap-5" role="status" aria-live="polite">
        <p className="font-display text-4xl tracking-tight text-cream uppercase sm:text-5xl">
          Already in.
        </p>
        <p className="max-w-sm text-base leading-relaxed text-rose">
          That email is already on the DND-Gang list — you&apos;re covered. Watch your
          inbox for updates.
        </p>
        <div className="h-px w-full bg-rose/25" aria-hidden="true" />
        <IgLink
          location="success"
          className="inline-flex w-fit items-center gap-2 border-b border-rose/50 pb-1 font-sans text-sm font-medium tracking-[0.18em] text-rose uppercase transition-colors duration-200 hover:border-rose hover:text-cream"
        >
          Follow the build on Instagram ↗
        </IgLink>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="dnd-email"
          className="font-sans text-[0.6875rem] font-medium tracking-[0.22em] text-rose uppercase"
        >
          Email address
        </label>
        <input
          id="dnd-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          autoCapitalize="off"
          maxLength={254}
          value={email}
          disabled={loading}
          aria-invalid={status.phase === "invalid"}
          aria-describedby={
            status.phase === "invalid" || status.phase === "error" ? "dnd-form-status" : undefined
          }
          onChange={(e) => {
            setEmail(e.target.value);
            if (status.phase === "invalid") setStatus({ phase: "idle" });
          }}
          placeholder="you@lahore.city"
          className={`${FIELD} ${status.phase === "invalid" ? "border-rose" : ""}`}
        />
      </div>

      {/* Spam trap: visually hidden from humans, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="dnd-company">Company</label>
        <input
          id="dnd-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={hpValue}
          onChange={(e) => setHpValue(e.target.value)}
        />
      </div>

      <div aria-live="polite" aria-atomic="true">
        {(status.phase === "invalid" || status.phase === "error") && (
          <p
            id="dnd-form-status"
            className="mb-5 border-l-2 border-rose pl-4 text-sm leading-relaxed text-rose"
          >
            {status.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={loading} className={BUTTON}>
        {loading ? "Claiming…" : membership.ctaLabel}
      </button>
    </form>
  );
}
