/**
 * DND wordmark geometry, traced from the supplied brand reference image
 * (deep burgundy square, heavy white DND lettering, "BREW . SIP . REPEAT").
 *
 * The letterforms are custom: flat-left D's with a heavy rounded right side
 * and a thin vertical slit counter; a blocky N whose counters are small
 * triangles. Coordinates are designed on a 100-unit cap height.
 */

/** Letter advance widths on the 100-unit grid. */
export const WORDMARK_VIEWBOX = { width: 308, height: 100 } as const;

/** Outer contour of the "D" (slit must be drawn separately in the page color). */
export const LETTER_D_PATH =
  "M0,4 Q0,0 4,0 H50 C76,0 92,21 92,50 C92,79 76,100 50,100 H4 Q0,100 0,96 Z";

/** The thin vertical slit inside the "D" (a 4x52 rect at x=33, y=24). */
export const LETTER_D_SLIT = { x: 33, y: 24, width: 4, height: 52 } as const;

/** Contour of the blocky "N". */
export const LETTER_N_PATH = "M0,0 H24 L64,58 V0 H92 V100 H68 L28,42 V100 H0 Z";

/** X offsets for each letter inside the wordmark. */
export const WORDMARK_LETTERS = [
  { letter: "D", x: 0 },
  { letter: "N", x: 108 },
  { letter: "D", x: 216 },
] as const;
