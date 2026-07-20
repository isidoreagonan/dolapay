import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, Info, Search } from "lucide-react";
import Flag from "@/components/ui/flag";

export type OperatorRate = {
  operator: string;
  payin: number | string; // percent or string expression
  payout: number | string; // percent or string expression
};

export type CountryRate = {
  code: string; // ISO-2
  name: string;
  flag: string;
  currency: string;
  operators: OperatorRate[];
};

export const COUNTRY_RATES: CountryRate[] = [
  {
    code: "BJ", name: "Bénin", flag: "🇧🇯", currency: "XOF",
    operators: [
      { operator: "MTN", payin: 3.20, payout: 2.50 },
      { operator: "Moov", payin: 3.20, payout: 2.00 }
    ],
  },
  {
    code: "BF", name: "Burkina Faso", flag: "🇧🇫", currency: "XOF",
    operators: [
      { operator: "Moov", payin: 4.00, payout: 3.00 },
      { operator: "Orange", payin: 4.30, payout: "Indisponible" }
    ],
  },
  {
    code: "CM", name: "Cameroun", flag: "🇨🇲", currency: "XAF",
    operators: [
      { operator: "MTN", payin: 2.75, payout: 2.30 },
      { operator: "Orange", payin: 2.77, payout: 2.00 }
    ],
  },
  {
    code: "CG", name: "Congo-Brazzaville", flag: "🇨🇬", currency: "XAF",
    operators: [
      { operator: "Airtel", payin: 5.00, payout: 2.00 },
      { operator: "MTN", payin: 5.00, payout: 2.00 }
    ],
  },
  {
    code: "CD", name: "RDC", flag: "🇨🇩", currency: "CDF",
    operators: [
      { operator: "Airtel", payin: 4.00, payout: 3.00 },
      { operator: "Orange", payin: 4.00, payout: 2.00 },
      { operator: "Vodacom", payin: 3.50, payout: 3.00 }
    ],
  },
  {
    code: "GA", name: "Gabon", flag: "🇬🇦", currency: "XAF",
    operators: [
      { operator: "Airtel", payin: 3.00, payout: 2.00 }
    ],
  },
  {
    code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮", currency: "XOF",
    operators: [
      { operator: "MTN", payin: 2.80, payout: 2.30 },
      { operator: "Orange", payin: 3.50, payout: 3.00 },
      { operator: "Wave", payin: 3.00, payout: 3.00 }
    ],
  },
  {
    code: "KE", name: "Kenya", flag: "🇰🇪", currency: "KES",
    operators: [
      { operator: "M-PESA", payin: "Indisponible", payout: "Indisponible" }
    ],
  },
  {
    code: "RW", name: "Rwanda", flag: "🇷🇼", currency: "RWF",
    operators: [
      { operator: "MTN", payin: 4.10, payout: "60 RWF + 2%" },
      { operator: "Airtel", payin: 3.50, payout: 2.00 }
    ],
  },
  {
    code: "SN", name: "Sénégal", flag: "🇸🇳", currency: "XOF",
    operators: [
      { operator: "YAS", payin: 3.00, payout: 2.50 },
      { operator: "Orange", payin: 3.00, payout: 2.80 },
      { operator: "Wave", payin: 3.00, payout: 3.00 }
    ],
  },
  {
    code: "SL", name: "Sierra Leone", flag: "🇸🇱", currency: "SLE",
    operators: [
      { operator: "Orange", payin: 4.30, payout: 3.15 }
    ],
  },
  {
    code: "UG", name: "Ouganda", flag: "🇺🇬", currency: "UGX",
    operators: [
      { operator: "MTN", payin: 4.00, payout: "Indisponible" },
      { operator: "Airtel", payin: 3.50, payout: "Indisponible" }
    ],
  },
  {
    code: "ZM", name: "Zambie", flag: "🇿🇲", currency: "ZMW",
    operators: [
      { operator: "Airtel", payin: "Indisponible", payout: 2.00 },
      { operator: "MTN", payin: "Indisponible", payout: "2% + e-Levy + 2%" },
      { operator: "Zamtel", payin: "Indisponible", payout: 3.00 }
    ],
  }
];

type Mode = "both" | "payin" | "payout";

interface Props {
  /** Restrict the columns shown */
  mode?: Mode;
  /** Show country filter chips */
  showFilters?: boolean;
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
}

const fmt = (n: number | string) => typeof n === "string" ? n : `${n.toFixed(n % 1 === 0 ? 0 : 2)}%`;

const PricingMatrix = ({
  mode: initialMode = "both",
  showFilters = true,
  title = "Tarifs par pays et opérateur",
  subtitle,
}: Props) => {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [country, setCountry] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return COUNTRY_RATES.filter((c) => {
      if (country !== "all" && c.code !== country) return false;
      if (q && !`${c.name} ${c.operators.map((o) => o.operator).join(" ")}`
        .toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [country, q]);

  const showPayin = mode === "both" || mode === "payin";
  const showPayout = mode === "both" || mode === "payout";

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-navy tracking-tight">{title}</h2>
          {subtitle && <p className="mt-3 text-navy/60 max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        {/* Transparency banner */}
        <div className="mx-auto max-w-4xl mb-8 rounded-2xl border border-primary/15 bg-primary/5 p-4 md:p-5 flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Info className="h-4 w-4 text-primary" />
          </div>
          <p className="text-sm md:text-[15px] text-navy/80 leading-relaxed">
            <span className="font-semibold text-navy">Transparence totale.</span>{" "}
            Tous les taux affichés incluent les <span className="font-medium">frais réels de l'opérateur</span>{" "}
            <span className="font-medium">plus notre commission DolaPay fixe de 2%</span>. Aucun frais caché.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Mode toggle */}
          {initialMode === "both" && (
            <div className="inline-flex p-1 rounded-xl bg-[#F5F8FF] border border-border self-start">
              {([
                { key: "both", label: "Tout" },
                { key: "payin", label: "Encaissement", icon: ArrowDownToLine },
                { key: "payout", label: "Décaissement", icon: ArrowUpFromLine },
              ] as { key: Mode; label: string; icon?: typeof ArrowDownToLine }[]).map((opt) => {
                const active = mode === opt.key;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setMode(opt.key)}
                    className={`relative px-3 md:px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                      active ? "text-white" : "text-navy/70 hover:text-navy"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="mode-pill"
                        className="absolute inset-0 rounded-lg bg-primary shadow-soft"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative flex items-center gap-1.5">
                      {Icon && <Icon className="h-3.5 w-3.5" />} {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Search */}
          <div className="relative md:ml-auto md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un opérateur…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-white text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            />
          </div>
        </div>

        {/* Country chips */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setCountry("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                country === "all"
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-navy/70 border-border hover:border-navy/30"
              }`}
            >
              Tous les pays
            </button>
            {COUNTRY_RATES.map((c) => (
              <button
                key={c.code}
                onClick={() => setCountry(c.code)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                  country === c.code
                    ? "bg-navy text-white border-navy"
                    : "bg-white text-navy/70 border-border hover:border-navy/30"
                }`}
              >
                <Flag code={c.flag} size={14} /> {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Desktop table */}
        <div className="hidden md:block rounded-3xl border border-border bg-white shadow-soft overflow-hidden">
          <div className="grid grid-cols-12 bg-[#F5F8FF] px-6 py-4 text-xs font-semibold uppercase tracking-wider text-navy/60">
            <div className="col-span-4">Pays</div>
            <div className="col-span-3">Opérateur</div>
            <div className="col-span-2">Devise</div>
            {showPayin && (
              <div className={`${showPayout ? "col-span-2" : "col-span-3"} text-right flex items-center justify-end gap-1.5`}>
                <ArrowDownToLine className="h-3.5 w-3.5" /> Encaissement
              </div>
            )}
            {showPayout && (
              <div className={`${showPayin ? "col-span-1" : "col-span-3"} text-right flex items-center justify-end gap-1.5`}>
                <ArrowUpFromLine className="h-3.5 w-3.5" /> Décaissement
              </div>
            )}
          </div>

          <AnimatePresence initial={false}>
            {filtered.length === 0 ? (
              <div className="px-6 py-10 text-center text-navy/50 text-sm">Aucun résultat.</div>
            ) : (
              filtered.flatMap((c, ci) =>
                c.operators.map((op, oi) => (
                  <motion.div
                    key={`${c.code}-${op.operator}`}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: (ci * c.operators.length + oi) * 0.02 }}
                    className={`grid grid-cols-12 items-center px-6 py-4 text-sm border-t border-border/70 hover:bg-primary/[0.02] transition-colors ${
                      oi === 0 ? "" : ""
                    }`}
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      {oi === 0 ? <Flag code={c.flag} size={22} /> : <span className="w-[30px]" />}
                      <span className={`font-medium ${oi === 0 ? "text-navy" : "text-navy/40"}`}>
                        {oi === 0 ? c.name : ""}
                      </span>
                    </div>
                    <div className="col-span-3 text-navy/80 font-medium">{op.operator}</div>
                    <div className="col-span-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F5F8FF] text-navy/60 text-xs font-mono">
                        {c.currency}
                      </span>
                    </div>
                    {showPayin && (
                      <div className={`${showPayout ? "col-span-2" : "col-span-3"} text-right`}>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/8 text-primary font-semibold tabular-nums">
                          {fmt(op.payin)}
                        </span>
                      </div>
                    )}
                    {showPayout && (
                      <div className={`${showPayin ? "col-span-1" : "col-span-3"} text-right`}>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy/5 text-navy font-semibold tabular-nums">
                          {fmt(op.payout)}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))
              )
            )}
          </AnimatePresence>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-border bg-white p-6 text-center text-navy/50 text-sm">
              Aucun résultat.
            </div>
          )}
          {filtered.map((c) => (
            <motion.div
              key={c.code}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-white shadow-soft overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 bg-[#F5F8FF] border-b border-border">
                <div className="flex items-center gap-2.5">
                  <Flag code={c.flag} size={22} />
                  <span className="font-semibold text-navy">{c.name}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-border text-navy/60">
                  {c.currency}
                </span>
              </div>
              <div className="divide-y divide-border/70">
                {c.operators.map((op) => (
                  <div key={op.operator} className="px-4 py-3 flex items-center justify-between gap-3">
                    <span className="font-medium text-navy/85 text-sm">{op.operator}</span>
                    <div className="flex items-center gap-2">
                      {showPayin && (
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] uppercase tracking-wide text-navy/40 flex items-center gap-1">
                            <ArrowDownToLine className="h-3 w-3" /> Pay-in
                          </span>
                          <span className="text-sm font-semibold text-primary tabular-nums">{fmt(op.payin)}</span>
                        </div>
                      )}
                      {showPayout && (
                        <div className="flex flex-col items-end pl-3 border-l border-border">
                          <span className="text-[10px] uppercase tracking-wide text-navy/40 flex items-center gap-1">
                            <ArrowUpFromLine className="h-3 w-3" /> Pay-out
                          </span>
                          <span className="text-sm font-semibold text-navy tabular-nums">{fmt(op.payout)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-navy/50">
          Les taux évoluent selon les grilles des opérateurs. Volumes {'>'}100M FCFA/mois : contactez-nous pour une grille dégressive.
        </p>
      </div>
    </section>
  );
};

export default PricingMatrix;
