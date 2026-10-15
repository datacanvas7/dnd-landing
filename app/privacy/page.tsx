import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

export const metadata: Metadata = {
  title: "Privacy Policy — DND",
  description: "How DND handles your email address for the DND-Gang waitlist.",
};

/**
 * Minimal, honest privacy policy. It describes only what this site actually
 * does — no invented retention promises, processors or compliance claims.
 * Owner should review before launch and add a contact channel.
 */
export default function PrivacyPage() {
  return (
    <main className="grain relative flex flex-1 flex-col px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <Link
          href="/"
          aria-label="Back to the DND landing page"
          className="inline-block text-cream transition-colors duration-200 hover:text-rose"
        >
          <Wordmark className="h-6 w-auto" slitColor="#500600" />
        </Link>

        <h1 className="mt-12 font-display text-[clamp(2.25rem,8vw,3.5rem)] leading-[0.9] tracking-tight text-cream uppercase">
          Privacy policy<span className="text-rose">.</span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-rose">
          <section>
            <h2 className="font-display text-lg tracking-wide text-cream uppercase">
              What we collect
            </h2>
            <p className="mt-2">
              When you join the DND-Gang waitlist, we collect your email address
              and basic campaign information (for example, whether you arrived
              from an Instagram link). We do not collect your name, phone
              number, payment details or location.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg tracking-wide text-cream uppercase">
              Why we collect it
            </h2>
            <p className="mt-2">
              Solely to send you DND updates and your membership details, and to
              understand which campaigns bring people in. We do not sell, rent
              or share your email address with third parties for marketing.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg tracking-wide text-cream uppercase">
              Where it&apos;s stored
            </h2>
            <p className="mt-2">
              Signups are stored in DND&apos;s Supabase database. Access is
              restricted to the DND team. The public site itself cannot read,
              change or delete the list.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg tracking-wide text-cream uppercase">
              Analytics
            </h2>
            <p className="mt-2">
              This site uses privacy-conscious, cookieless analytics (Vercel Web
              Analytics) to count visits and conversions. No advertising
              trackers or cross-site cookies are used, so no cookie consent is
              required for them.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg tracking-wide text-cream uppercase">
              Your choices
            </h2>
            <p className="mt-2">
              Every update email will include a way to unsubscribe. You can
              also ask DND to remove your address at any time by sending a
              direct message on{" "}
              <a
                href="https://www.instagram.com/dndlhr/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors duration-200 hover:text-cream"
              >
                Instagram ↗
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg tracking-wide text-cream uppercase">
              Changes
            </h2>
            <p className="mt-2">
              If DND starts sending newsletters, running promotions or using
              additional tools, this policy will be updated here before those
              practices begin.
            </p>
          </section>
        </div>

        <p className="mt-12 font-display text-sm tracking-[0.3em] text-cream/40 uppercase">
          Brew . Sip . Repeat .
        </p>
      </div>
    </main>
  );
}
