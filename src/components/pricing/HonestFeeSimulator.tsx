import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  PAYIN_OPERATORS,
  PLATFORM_FEES,
  computePayinFees,
  fmtMoney,
  fmtPct,
} from "@/lib/pricing-schedule";

const MIN = 100_000;
const MAX = 100_000_000;
const STEP = 100_000;

export default function HonestFeeSimulator() {
  const [volume, setVolume] = useState(10_000_000);
  const [operatorId, setOperatorId] = useState(PAYIN_OPERATORS[0].id);

  const operator = useMemo(
    () => PAYIN_OPERATORS.find((o) => o.id === operatorId) ?? PAYIN_OPERATORS[0],
    [operatorId],
  );

  const fees = useMemo(() => computePayinFees(volume, operator), [volume, operator]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-5 backdrop-blur-xl shadow-elegant sm:p-8">
      <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
        {/* Controls */}
        <div className="space-y-7">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" /> Simulateur honnête
            </span>
            <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Calculez le juste prix, en direct.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Commission DolaPay fixe + frais réels de l'opérateur. Aucun coût caché.
            </p>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Volume mensuel
              </label>
              <span className="font-display text-xl font-bold tabular-nums text-foreground">
                {fmtMoney(volume)}
              </span>
            </div>
            <Slider
              value={[volume]}
              min={MIN}
              max={MAX}
              step={STEP}
              onValueChange={(v) => setVolume(v[0])}
              className="mt-4"
            />
            <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              <span>{fmtMoney(MIN)}</span>
              <span>{fmtMoney(MAX)}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Réseau Mobile Money
            </label>
            <select
              value={operatorId}
              onChange={(e) => setOperatorId(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {PAYIN_OPERATORS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.network} · {o.country} — opérateur {fmtPct(o.operatorFee)}
                </option>
              ))}
            </select>
          </div>

          {fees.tier === "enterprise" && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-xs">
              <span className="text-base">👑</span>
              <div>
                <div className="font-bold text-amber-700 dark:text-amber-300">Palier Enterprise activé</div>
                <div className="text-amber-700/80 dark:text-amber-200/80">
                  Volume &gt; {fmtMoney(PLATFORM_FEES.enterpriseThresholdXof)} : commission DolaPay
                  réduite à {fmtPct(PLATFORM_FEES.payinEnterprise)}.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live breakdown */}
        <motion.div
          key={`${volume}-${operatorId}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-border bg-background/80 p-5 shadow-sm sm:p-6"
        >
          <Row label="Volume encaissé" value={fmtMoney(volume)} bold />
          <Divider />
          <Row
            label={`Frais opérateur réels (${fmtPct(operator.operatorFee)})`}
            value={`- ${fmtMoney(fees.operatorFee)}`}
            sub={`${operator.network} ${operator.country}`}
          />
          <Row
            label={`Commission DolaPay (${fmtPct(fees.platformRate)})`}
            value={`- ${fmtMoney(fees.platformFee)}`}
            sub={fees.tier === "enterprise" ? "Tarif Enterprise" : "Tarif Standard"}
          />
          <Divider />
          <div className="flex items-center justify-between gap-3 py-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total frais DolaPay
              </div>
              <div className="text-[11px] text-muted-foreground">
                Soit {fmtPct((fees.total / volume) || 0)} tout compris
              </div>
            </div>
            <div className="font-display text-2xl font-bold text-foreground tabular-nums">
              {fmtMoney(fees.total)}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Économie vs concurrence (~3,5% flat)
                </span>
              </div>
              <span className="font-display text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                + {fmtMoney(Math.max(0, fees.savings))}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
              Concurrent traditionnel : {fmtMoney(fees.competitor)} · DolaPay : {fmtMoney(fees.total)}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Row({ label, value, sub, bold }: { label: string; value: string; sub?: string; bold?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <div className="min-w-0">
        <div className={`text-sm ${bold ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{label}</div>
        {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
      </div>
      <div className={`tabular-nums ${bold ? "font-display text-lg font-bold text-foreground" : "text-sm font-semibold text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="my-1 h-px bg-border" />;
}
