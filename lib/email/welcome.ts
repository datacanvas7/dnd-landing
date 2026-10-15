/**
 * Welcome email sent to every new DND-Gang signup.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Membership terms (owner-confirmed, Oct 2026): 10% off, capped at
 * Rs 3,000, valid till February 2027 — stated plainly in the email below.
 * Update this copy (and lib/config/membership.ts) if the terms change.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Email-client notes:
 *  • No web fonts — Gmail et al. strip them. Display feel comes from
 *    Arial Black / system stacks, uppercase and letter-spacing.
 *  • Table layout + inline styles only; no SVG (unsupported in email).
 *  • Both HTML and plain-text parts are produced (text aids deliverability).
 */

import { INSTAGRAM_URL } from "@/lib/config/site";

const BURGUNDY = "#500600";
const CREAM = "#fffaf7";
const ROSE = "#e7b7a9";

const DISPLAY_FONT =
  "'Arial Black', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const BODY_FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export type WelcomeEmail = {
  subject: string;
  preheader: string;
  html: string;
  text: string;
};

export function renderWelcomeEmail(siteUrl: string): WelcomeEmail {
  const subject = "You're in. Here's what happens next.";
  const preheader = "Good coffee. Better company.";

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:${CREAM};">
  <!-- Preheader, hidden from view -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&zwnj;&nbsp;${"&nbsp;".repeat(80)}</div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${CREAM}" style="background:${CREAM};">
    <tr><td align="center" style="padding:32px 16px;">

      <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:560px;">

        <!-- Header band -->
        <tr><td bgcolor="${BURGUNDY}" style="background:${BURGUNDY};border-radius:2px 2px 0 0;padding:36px 40px;text-align:center;">
          <div style="font-family:${DISPLAY_FONT};font-size:56px;line-height:1;font-weight:900;letter-spacing:0.06em;color:${CREAM};">DND</div>
          <div style="font-family:${BODY_FONT};font-size:11px;line-height:1;letter-spacing:0.34em;color:${ROSE};text-transform:uppercase;padding-top:14px;">Brew&nbsp;.&nbsp;Sip&nbsp;.&nbsp;Repeat</div>
        </td></tr>

        <!-- Body -->
        <tr><td bgcolor="#ffffff" style="background:#ffffff;border-radius:0 0 2px 2px;padding:40px;">
          <h1 style="margin:0;font-family:${DISPLAY_FONT};font-size:30px;line-height:1.15;font-weight:900;letter-spacing:0.02em;color:${BURGUNDY};text-transform:uppercase;">Welcome to DND&#8209;Gang.</h1>
          <p style="margin:18px 0 0;font-family:${BODY_FONT};font-size:16px;line-height:1.6;color:#332b29;">
            You&rsquo;re on the list &mdash; before the first sip, just like that.
          </p>

          <hr style="border:0;border-top:1px solid #ecdcd6;margin:32px 0;">

          <h2 style="margin:0;font-family:${DISPLAY_FONT};font-size:17px;line-height:1.2;font-weight:900;letter-spacing:0.12em;color:${BURGUNDY};text-transform:uppercase;">Your 10% membership benefit</h2>
          <p style="margin:12px 0 0;font-family:${BODY_FONT};font-size:16px;line-height:1.6;color:#332b29;">
            10% off your order &mdash; up to a maximum discount of Rs&nbsp;3,000
            &mdash; valid till February 2027. Show this email at the counter when
            DND opens in Lahore.
          </p>

          <h2 style="margin:32px 0 0;font-family:${DISPLAY_FONT};font-size:17px;line-height:1.2;font-weight:900;letter-spacing:0.12em;color:${BURGUNDY};text-transform:uppercase;">What happens next</h2>
          <p style="margin:12px 0 0;font-family:${BODY_FONT};font-size:16px;line-height:1.6;color:#332b29;">
            Opening news, the membership terms, and the first-sip invite &mdash;
            and nothing else. No spam, ever.
          </p>

          <!-- CTA -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:36px auto 8px;">
            <tr><td bgcolor="${BURGUNDY}" style="background:${BURGUNDY};border-radius:2px;">
              <a href="${INSTAGRAM_URL}" style="display:inline-block;font-family:${DISPLAY_FONT};font-size:14px;font-weight:900;letter-spacing:0.14em;color:${CREAM};text-decoration:none;text-transform:uppercase;padding:16px 28px;">Follow the build on Instagram&nbsp;&#8599;</a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td bgcolor="${BURGUNDY}" style="background:${BURGUNDY};border-radius:0 0 2px 2px;padding:28px 40px;text-align:center;">
          <div style="font-family:${DISPLAY_FONT};font-size:13px;letter-spacing:0.2em;color:${CREAM};text-transform:uppercase;">DND&nbsp;&nbsp;&middot;&nbsp;&nbsp;Brew&nbsp;.&nbsp;Sip&nbsp;.&nbsp;Repeat.</div>
          <p style="margin:14px 0 0;font-family:${BODY_FONT};font-size:12px;line-height:1.6;color:${ROSE};">
            Lahore, Pakistan<br>
            <a href="${siteUrl}" style="color:${ROSE};text-decoration:underline;">dnd</a> &middot;
            <a href="${siteUrl}/privacy" style="color:${ROSE};text-decoration:underline;">Privacy</a><br>
            Don&rsquo;t want these emails? Reply to this message and you&rsquo;ll be
            removed &mdash; one email, done.
          </p>
        </td></tr>

      </table>

    </td></tr>
  </table>
</body>
</html>`;

  const text = `YOU'RE IN. HERE'S WHAT HAPPENS NEXT.

Welcome to DND-Gang.

You're on the list — before the first sip, just like that.

YOUR 10% MEMBERSHIP BENEFIT
10% off your order — up to a maximum discount of Rs 3,000 — valid
till February 2027. Show this email at the counter when DND opens
in Lahore.

WHAT HAPPENS NEXT
Opening news, the membership terms, and the first-sip invite — and
nothing else. No spam, ever.

FOLLOW THE BUILD ON INSTAGRAM
${INSTAGRAM_URL}

—
DND · BREW. SIP. REPEAT.
Lahore, Pakistan
${siteUrl} · ${siteUrl}/privacy
Don't want these emails? Reply to this message and you'll be removed
— one email, done.
`;

  return { subject, preheader, html, text };
}
