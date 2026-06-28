export type GlobeCountry = {
  name: string;
  code: string;
  flag: string;
  currency: string;
  lat: number;
  lng: number;
};

// Hand-tuned positions (in %) for a wide, breathing constellation
const POSITIONS: Record<string, { x: number; y: number; size?: number }> = {
  SN: { x: 6, y: 22, size: 64 },
  CI: { x: 18, y: 48, size: 72 },
  BJ: { x: 32, y: 26, size: 56 },
  SL: { x: 4, y: 62, size: 52 },
  CM: { x: 48, y: 56, size: 68 },
  GA: { x: 34, y: 74, size: 58 },
  CG: { x: 50, y: 86, size: 54 },
  CD: { x: 64, y: 64, size: 80 },
  UG: { x: 76, y: 38, size: 64 },
  RW: { x: 82, y: 60, size: 56 },
  KE: { x: 94, y: 24, size: 72 },
  ZM: { x: 70, y: 92, size: 56 },
};


const BUBBLES: { x: number; y: number; text: string; emoji?: string; hideOnMobile?: boolean }[] = [];



// Connections between countries (drawn as dashed curves)
const LINES: [string, string][] = [
  ["SN", "CI"], ["CI", "BJ"], ["CI", "SL"], ["BJ", "CM"],
  ["CM", "GA"], ["GA", "CG"], ["CG", "CD"], ["CD", "UG"],
  ["UG", "KE"], ["UG", "RW"], ["CD", "ZM"], ["CM", "UG"],
];

export default function CountriesConstellation({ countries }: { countries: GlobeCountry[] }) {
  const byCode = Object.fromEntries(countries.map((c) => [c.code, c]));

  return (
    <div className="relative mx-auto w-full max-w-[1100px]">

      {/* Mobile-first country board */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-3 shadow-elegant backdrop-blur sm:hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid grid-cols-2 gap-2">
          {countries.map((c) => {
            const flagCode = c.code.toLowerCase();
            return (
              <div
                key={c.code}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-2xl border border-border bg-background/80 px-2.5 py-2.5"
              >
                <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-card bg-card text-xl shadow-sm ring-1 ring-border">
                  <img
                    src={`https://flagcdn.com/w80/${flagCode}.png`}
                    srcSet={`https://flagcdn.com/w160/${flagCode}.png 2x`}
                    alt={c.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                  <span aria-hidden>{c.flag}</span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-bold leading-tight text-foreground">{c.name}</span>
                  <span className="block truncate text-[11px] font-semibold leading-tight text-primary">{c.currency}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative mx-auto hidden aspect-[2/1] w-full sm:block">

      {/* Soft brand glow */}
      <div className="pointer-events-none absolute -inset-10 rounded-[50%] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.18),transparent_65%)] blur-2xl" />

      {/* Dashed connection lines */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {LINES.map(([a, b], i) => {
          const pa = POSITIONS[a];
          const pb = POSITIONS[b];
          if (!pa || !pb) return null;
          const mx = (pa.x + pb.x) / 2;
          const my = (pa.y + pb.y) / 2 - 6;
          return (
            <path
              key={i}
              d={`M ${pa.x} ${pa.y} Q ${mx} ${my} ${pb.x} ${pb.y}`}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="0.25"
              strokeDasharray="0.8 0.8"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* Floating bubbles */}
      {BUBBLES.map((b, i) => (
        <div
          key={i}
          className={`absolute -translate-x-1/2 -translate-y-1/2 animate-fade-in ${b.hideOnMobile ? "hidden sm:block" : ""}`}
          style={{ left: `${b.x}%`, top: `${b.y}%`, animationDelay: `${i * 200}ms` }}
        >
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-1 shadow-elegant sm:gap-2 sm:px-3 sm:py-1.5">
            <span className="text-sm leading-none sm:text-base">{b.emoji}</span>
            <span className="font-display text-[10px] font-semibold text-foreground sm:text-xs whitespace-nowrap">{b.text}</span>
          </div>
        </div>
      ))}


      {/* Country flag avatars */}
      {countries.map((c) => {
        const p = POSITIONS[c.code];
        if (!p) return null;
        const size = p.size ?? 56;
        const flagCode = c.code.toLowerCase();
        return (
          <div
            key={c.code}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%`, animation: `float-soft 6s ease-in-out ${(p.x + p.y) % 4}s infinite` }}
          >
            <div
              className="relative grid cursor-pointer place-items-center overflow-hidden rounded-full border-[3px] border-card bg-card shadow-elegant ring-1 ring-border transition-all duration-300 hover:scale-110 hover:ring-primary hover:shadow-glow"
              style={{ width: `clamp(36px, ${size / 9}vw, ${size}px)`, height: `clamp(36px, ${size / 9}vw, ${size}px)`, fontSize: `clamp(20px, ${size / 18}vw, ${size / 2}px)` }}
            >

              <img
                src={`https://flagcdn.com/w160/${flagCode}.png`}
                srcSet={`https://flagcdn.com/w320/${flagCode}.png 2x`}
                alt={c.name}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <span aria-hidden className="leading-none">{c.flag}</span>
            </div>
            {/* Tooltip */}
            <div className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              {c.name} · <span className="text-primary">{c.currency}</span>
            </div>
            {/* Live dot */}
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
            </span>
          </div>
        );
      })}

      <style>{`
        @keyframes float-soft {
          0%, 100% { transform: translate(-50%, -50%); }
          50% { transform: translate(-50%, calc(-50% - 8px)); }
        }
      `}</style>
      </div>
    </div>
  );
}
