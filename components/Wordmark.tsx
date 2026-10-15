import {
  LETTER_D_PATH,
  LETTER_D_SLIT,
  LETTER_N_PATH,
  WORDMARK_LETTERS,
  WORDMARK_VIEWBOX,
} from "@/lib/brand/wordmark";

type Props = {
  /** Applied to the <svg> — use for sizing; currentColor fills the letters. */
  className?: string;
  /** The surface color behind the mark; the D slits are punched in this color. */
  slitColor?: string;
};

/**
 * The DND wordmark, recreated as vector geometry from the supplied brand
 * reference (heavy blocky letterforms, thin vertical slit counters).
 * Used in the header, footer, favicon and social share image.
 */
export function Wordmark({ className, slitColor = "#500600" }: Props) {
  return (
    <svg
      viewBox={`0 0 ${WORDMARK_VIEWBOX.width} ${WORDMARK_VIEWBOX.height}`}
      className={className}
      role="img"
      aria-label="DND"
      focusable="false"
    >
      {WORDMARK_LETTERS.map(({ letter, x }) => (
        <g key={`${letter}-${x}`} transform={`translate(${x} 0)`}>
          <path d={letter === "D" ? LETTER_D_PATH : LETTER_N_PATH} fill="currentColor" />
          {letter === "D" && (
            <rect
              x={LETTER_D_SLIT.x}
              y={LETTER_D_SLIT.y}
              width={LETTER_D_SLIT.width}
              height={LETTER_D_SLIT.height}
              fill={slitColor}
            />
          )}
        </g>
      ))}
    </svg>
  );
}
