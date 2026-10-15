# DND — Motion Graphics Ad Prompt

_A paste-ready prompt for AI video tools (Runway, Veo, Kling) or a motion designer.
Built from the live site copy, `globals.css` brand palette and the confirmed
membership terms in `lib/config/membership.ts` — every offer line is exact._

---

## 🎬 Master prompt — 15s vertical (9:16), Instagram Reels

```
MOTION GRAPHICS AD — "DND: Good Coffee. Better Company." (15 seconds, 9:16 vertical, Instagram Reels)

BRAND SYSTEM (exact):
- Primary: deep burgundy #500600 (backgrounds), warm cream #fffaf7 (text/ticker)
- Accent: dusty rose #e7b7a9 (dots, periods, small labels)
- Display type: heavy condensed grotesque, ALL CAPS, tight leading (Anton style)
- Body type: neutral humanist sans (Inter style), letterspaced micro-labels
- Texture: subtle film grain over burgundy fields
- Motif: a cream marquee band with repeating burgundy text sliding horizontally

STYLE: premium café brand film — confident, warm, tactile. Macro coffee footage
mixed with kinetic typography. Slow cinematic camera, crisp type reveals, no
gimmicky 3D. Grain + slight halation. Do NOT invent extra text, logos, or people
holding phones.

SCENES:
1. (0–3s) Macro espresso pour into a glass on a burgundy backdrop, steam rising,
   shallow depth of field. A small rose dot pulses in, then the letterspaced
   micro-label types on: "LAHORE, SOMETHING'S BREWING."
2. (3–6s) Hard cut. Cream headline slams in line by line, heavy condensed caps
   with rose-colored periods: "GOOD COFFEE." / "BETTER COMPANY." Underneath it,
   the cream marquee band scrolls: "BREW . SIP . REPEAT. BREW . SIP . REPEAT."
3. (6–9s) Warm lifestyle beat: hands clinking two coffee cups over a wooden
   table, natural window light, friends blurred behind — "the crowd around the cup."
4. (9–12s) Burgundy card, grain texture. Offer lines reveal in order:
   "10% OFF" (huge) → "UP TO RS 3,000" → "VALID TILL FEBRUARY 2027" with a
   rose underline sweep.
5. (12–15s) End card: deep burgundy square with heavy cream "DND" wordmark,
   tagline "BREW . SIP . REPEAT." beneath, then CTA "CLAIM MY 10% OFF" and
   "@dndlhr" fading in. Hold 1.5s.

AUDIO: café ambience → confident lo-fi hip-hop beat; whoosh on each type reveal,
a ceramic "clink" on the cup hit, soft espresso-pour sound under scene 1, music
resolves on the end card.

TEXT RULES: only the exact lines listed above. Never render URLs, misspellings,
or watermarks. Keep #500600 exact — do not shift to purple or bright red.
```

---

## 6-second bumper cutdown

Keep only scene 2 → scene 4 → scene 5: **the hook, the offer, the CTA.**

## Practical notes

- **Best split workflow:** generate the *footage* scenes (1, 3) in Runway/Veo/Kling
  **without text**, then overlay all typography in CapCut/After Effects — AI video
  models still mangle headlines. Veo 3 is the exception for one-shot with text.
- **Music:** "confident lo-fi / warm café beat", or Instagram's commercial-licensed
  audio library to stay safe.
- **Offer terms are owner-confirmed** (10% off, capped Rs 3,000, valid till
  Feb 2027) — the ad cannot overpromise; secondary questions (per-visit vs once,
  exclusions) stay unclaimed.
- **Wordmark:** heavy cream "DND" on a burgundy square — geometry lives in
  `lib/brand/wordmark.ts` if you need an exact still.
