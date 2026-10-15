import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { SignupForm } from "@/components/SignupForm";
import { IgLink } from "@/components/IgLink";
import { membership } from "@/lib/config/membership";
import { INSTAGRAM_HANDLE } from "@/lib/config/site";

const MARQUEE_ITEMS = ["BREW", "SIP", "REPEAT"];

// Evaluated once at build time so the static prerender stays deterministic.
const FOOTER_YEAR = new Date().getFullYear();

const POINTS = [
  {
    number: "01",
    title: "Your 10% membership benefit",
    body: "10% off your order, up to a maximum discount of Rs 3,000 — valid till February 2027. Your details land in your inbox.",
  },
  {
    number: "02",
    title: "First updates from DND",
    body: "Opening news, straight from the source. No noise, no fillers — just what's next.",
  },
  {
    number: "03",
    title: "Good coffee. Better company.",
    body: "DND-Gang is the crowd around the cup. Get in before the first sip.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
        <Link
          href="/"
          aria-label="DND — home"
          className="text-cream transition-colors duration-200 hover:text-rose"
        >
          <Wordmark className="h-6 w-auto sm:h-7" slitColor="#500600" />
        </Link>
        <IgLink
          location="header"
          className="font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-rose uppercase transition-colors duration-200 hover:text-cream"
        >
          Instagram ↗
        </IgLink>
      </header>

      <main className="flex flex-1 flex-col">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="grain relative flex flex-1 flex-col justify-center overflow-hidden px-5 pt-10 pb-20 sm:px-8 sm:pt-14 sm:pb-24 lg:px-12">
          <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10 lg:py-10">
            <div className="flex flex-col lg:col-span-7">
              <p className="flex items-center gap-3 font-sans text-[0.6875rem] font-medium tracking-[0.24em] text-rose uppercase sm:text-xs">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose"
                />
                Lahore, something&apos;s brewing.
              </p>

              <h1 className="mt-7 font-display text-[clamp(3.25rem,14vw,8.25rem)] leading-[0.86] tracking-[-0.015em] text-cream uppercase sm:mt-9">
                <span className="block">
                  Good coffee<span className="text-rose">.</span>
                </span>
                <span className="block">
                  Better company<span className="text-rose">.</span>
                </span>
              </h1>

              <p className="mt-8 max-w-md text-base leading-relaxed text-rose sm:text-lg">
                Lahore, meet your new coffee ritual. Join DND-Gang for your 10%
                membership benefit and first updates from DND.
              </p>

              <p className="mt-10 hidden font-display text-[0.9375rem] tracking-[0.35em] text-cream/35 uppercase lg:block">
                Brew . Sip . Repeat .
              </p>
            </div>

            {/* ── Signup panel ──────────────────────────────────────────── */}
            <div className="lg:col-span-5 lg:self-center">
              <div className="w-full border border-rose/20 bg-burgundy-deep p-6 sm:p-9 lg:p-10">
                <h2 className="font-display text-[clamp(1.75rem,6vw,2.5rem)] leading-[0.95] tracking-tight text-cream uppercase">
                  Get in with DND-Gang<span className="text-rose">.</span>
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-rose sm:text-base">
                  Your spot starts here. Sign up to receive your 10% membership
                  details and updates from DND.
                </p>

                <div className="mt-8">
                  <SignupForm />
                </div>

                <div className="mt-8 border-t border-rose/20 pt-5">
                  <p className="text-xs leading-relaxed text-cream/55">
                    No spam. Just DND updates and your membership details.{" "}
                    <a
                      href="/privacy"
                      className="underline underline-offset-2 transition-colors duration-200 hover:text-rose"
                    >
                      Privacy policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Ticker ───────────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="overflow-hidden border-y border-burgundy bg-cream py-3 select-none sm:py-4"
        >
          <div className="marquee-track">
            {[0, 1].map((half) => (
              <div key={half} className="flex shrink-0 items-center">
                {Array.from({ length: 6 }).flatMap((_, i) =>
                  MARQUEE_ITEMS.map((word) => (
                    <span
                      key={`${half}-${i}-${word}`}
                      className="flex items-center font-display text-xl tracking-[0.2em] text-burgundy uppercase sm:text-2xl"
                    >
                      {word}
                      <span className="mx-5 text-rose sm:mx-7" aria-hidden="true">
                        ●
                      </span>
                    </span>
                  )),
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── What joining gets you ────────────────────────────────────── */}
        <section className="bg-cream px-5 py-20 text-burgundy sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto w-full max-w-7xl">
            <p className="font-sans text-[0.6875rem] font-medium tracking-[0.24em] text-clay uppercase">
              The membership
            </p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,7vw,4.5rem)] leading-[0.9] tracking-tight uppercase">
              Get in before the first sip<span className="text-rose">.</span>
            </h2>

            <ul className="mt-14 grid grid-cols-1 gap-px border border-burgundy/15 bg-burgundy/15 sm:grid-cols-3">
              {POINTS.map((point) => (
                <li key={point.number} className="bg-cream p-7 sm:p-9">
                  <span className="font-display text-3xl tracking-tight text-rose">
                    {point.number}
                  </span>
                  <h3 className="mt-4 font-display text-xl leading-tight tracking-wide uppercase sm:text-2xl">
                    {point.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-clay">{point.body}</p>
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-xl text-xs leading-relaxed text-clay">
              {membership.termsNote}
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="grain relative overflow-hidden px-5 pt-16 pb-10 sm:px-8 sm:pt-20 lg:px-12">
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center">
          <Wordmark className="w-full max-w-2xl text-cream" slitColor="#500600" />
          <p className="mt-8 font-display text-lg tracking-[0.3em] text-rose uppercase sm:text-xl">
            Brew . Sip . Repeat .
          </p>

          <div className="mt-14 flex w-full flex-col items-center gap-4 border-t border-cream/15 pt-8 sm:flex-row sm:justify-between">
            <p className="text-xs text-cream/55">
              © {FOOTER_YEAR} DND · Lahore, Pakistan
            </p>
            <div className="flex items-center gap-6">
              <IgLink
                location="footer"
                className="font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-rose uppercase transition-colors duration-200 hover:text-cream"
              >
                Follow the build on Instagram ↗
              </IgLink>
              <a
                href="/privacy"
                className="font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-cream/55 uppercase transition-colors duration-200 hover:text-cream"
              >
                Privacy
              </a>
            </div>
          </div>
          <p className="mt-6 text-[0.6875rem] text-cream/35">
            Find us at {INSTAGRAM_HANDLE} — opening details shared there first.
          </p>
        </div>
      </footer>
    </div>
  );
}
