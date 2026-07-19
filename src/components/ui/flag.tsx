// Cross-platform flag component. Windows Chrome and many desktop browsers do not
// render regional-indicator emojis as color flags, so we render SVG images from
// the free flagcdn.com CDN instead. Accepts either an ISO-2 code ("ci") or an
// emoji flag ("🇨🇮") and maps it to the right image.

const EMOJI_TO_ISO: Record<string, string> = {
  "🇧🇯": "bj", "🇨🇮": "ci", "🇨🇲": "cm", "🇨🇩": "cd", "🇸🇳": "sn",
  "🇲🇱": "ml", "🇧🇫": "bf", "🇹🇬": "tg", "🇬🇦": "ga", "🇳🇬": "ng",
  "🇬🇭": "gh", "🇰🇪": "ke", "🇨🇬": "cg", "🇷🇼": "rw",
};

export const flagToIso = (v: string) => {
  if (!v) return "";
  const trimmed = v.trim();
  if (EMOJI_TO_ISO[trimmed]) return EMOJI_TO_ISO[trimmed];
  return trimmed.slice(0, 2).toLowerCase();
};

interface FlagProps {
  /** ISO-2 code (e.g. "ci") or emoji flag (e.g. "🇨🇮"). */
  code: string;
  /** Displayed height in px. Width auto-scales. */
  size?: number;
  className?: string;
  alt?: string;
}

const Flag = ({ code, size = 20, className = "", alt }: FlagProps) => {
  const iso = flagToIso(code);
  if (!iso) return null;
  const w = Math.round(size * 1.35);
  return (
    <img
      src={`https://flagcdn.com/${iso}.svg`}
      width={w}
      height={size}
      loading="lazy"
      alt={alt ?? `Drapeau ${iso.toUpperCase()}`}
      className={`inline-block object-cover rounded-[3px] shadow-[0_0_0_1px_rgba(15,23,42,0.06)] ${className}`}
      style={{ height: size, width: w }}
    />
  );
};

export default Flag;
