import { ImageResponse } from "next/og";
import { WORDMARK_VIEWBOX, LETTER_D_PATH, LETTER_D_SLIT, LETTER_N_PATH, WORDMARK_LETTERS } from "@/lib/brand/wordmark";

export const alt = "DND — Good Coffee. Better Company. Lahore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BURGUNDY = "#500600";
const CREAM = "#fffaf7";
const ROSE = "#e7b7a9";

/**
 * Fetch Anton for the share image. Deliberately sends NO browser
 * User-Agent: Google Fonts then serves TTF, which is the only format
 * satori's OpenType parser accepts (WOFF2 throws).
 */
async function antonFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Anton&display=swap",
    ).then((r) => r.text());
    const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
    if (!url) return null;
    const font = await fetch(url);
    if (!font.ok) return null;
    return await font.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const fontData = await antonFont();
  const fonts = fontData
    ? [{ name: "Anton", data: fontData, weight: 400 as const, style: "normal" as const }]
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BURGUNDY,
          padding: 80,
        }}
      >
        <svg
          width={860}
          height={Math.round((860 * WORDMARK_VIEWBOX.height) / WORDMARK_VIEWBOX.width)}
          viewBox={`0 0 ${WORDMARK_VIEWBOX.width} ${WORDMARK_VIEWBOX.height}`}
          display="flex"
        >
          {WORDMARK_LETTERS.map(({ letter, x }) => (
            <g key={`${letter}-${x}`} transform={`translate(${x} 0)`}>
              <path d={letter === "D" ? LETTER_D_PATH : LETTER_N_PATH} fill={CREAM} />
              {letter === "D" && (
                <rect
                  x={LETTER_D_SLIT.x}
                  y={LETTER_D_SLIT.y}
                  width={LETTER_D_SLIT.width}
                  height={LETTER_D_SLIT.height}
                  fill={BURGUNDY}
                />
              )}
            </g>
          ))}
        </svg>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontFamily: fonts ? "Anton" : "sans-serif",
            fontSize: 44,
            letterSpacing: 14,
            color: ROSE,
          }}
        >
          GOOD COFFEE. BETTER COMPANY.
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 56,
            display: "flex",
            fontFamily: fonts ? "Anton" : "sans-serif",
            fontSize: 26,
            letterSpacing: 10,
            color: "rgba(255,250,247,0.55)",
          }}
        >
          LAHORE · BREW. SIP. REPEAT.
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
