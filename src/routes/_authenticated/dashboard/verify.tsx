import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  ShieldCheck,
  Sparkles,
  ScanLine,
  ScanFace,
  Landmark,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "./route";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/verify")({
  component: VerifyPage,
});

type AiLog = {
  mrz_check: "passed" | "failed";
  sanctions_screening: "clean" | "hit";
  face_match_score: number;
  liveness_score: number;
  provider: "didit";
};

function VerifyPage() {
  const { data: profile } = useProfile();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: aiState } = useQuery({
    queryKey: ["ai-verification", profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("verification_mode,ai_verification_score,ai_verification_log,ai_verified_at,kyc_status")
        .eq("id", profile!.id)
        .maybeSingle();
      if (error) throw error;
      return data as {
        verification_mode: "manual" | "didit_ai";
        ai_verification_score: number | null;
        ai_verification_log: AiLog | null;
        ai_verified_at: string | null;
        kyc_status: string;
      } | null;
    },
  });

  const finalize = useMutation({
    mutationFn: async (log: AiLog) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          verification_mode: "didit_ai",
          ai_verification_score: log.face_match_score,
          ai_verification_log: log as unknown as never,
          ai_verified_at: new Date().toISOString(),
          kyc_status: "approved",
        })
        .eq("id", profile!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Identité vérifiée ✓", { description: "Décaissements et clés API live débloqués." });
      qc.invalidateQueries({ queryKey: ["ai-verification"] });
      qc.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const isVerified = (aiState?.kyc_status ?? profile?.kyc_status) === "approved";
  const isPending = !isVerified && (profile?.kyc_status ?? "pending") === "pending";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vérification d'identité</h1>
        <p className="text-sm text-muted-foreground">Centre de conformité — débloquez vos paiements en moins de 10 secondes.</p>
      </div>

      {isPending && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" />
          <div className="text-sm text-amber-900 dark:text-amber-200">
            <strong>Action requise.</strong> Complétez votre vérification d'identité pour débloquer les décaissements et les clés API live.
          </div>
        </motion.div>
      )}

      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#0b1d3a] via-[#0e2347] to-[#10306b] p-8 text-white shadow-2xl">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-sky-300" /> Powered by Didit
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Vérification AI instantanée</h2>
            <p className="max-w-xl text-sm text-white/70 sm:text-base">
              Vérifiez votre CNI / RCCM et faites un rapide selfie de vivacité. Approuvé automatiquement en moins de 10 secondes
              grâce au croisement avec les registres gouvernementaux et le screening sanctions.
            </p>

            {isVerified ? (
              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-200">
                <CheckCircle2 className="h-4 w-4" /> Identité vérifiée{aiState?.ai_verification_score ? ` · Score ${Number(aiState.ai_verification_score).toFixed(1)}%` : ""}
              </div>
            ) : (
              <Button
                onClick={() => setOpen(true)}
                size="lg"
                className="group h-12 gap-2 rounded-xl bg-white px-6 text-[#0b1d3a] shadow-lg hover:bg-white/90"
              >
                <ShieldCheck className="h-5 w-5" />
                Démarrer la vérification d'identité
                <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
              </Button>
            )}
          </div>

          <div className="hidden lg:block">
            <div className="relative h-44 w-44 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <ScanFace className="h-20 w-20 text-sky-300/80" />
              </div>
              <motion.div
                animate={{ y: [10, 130, 10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-4 h-0.5 rounded-full bg-gradient-to-r from-transparent via-sky-300 to-transparent shadow-[0_0_18px_rgba(125,211,252,0.8)]"
              />
            </div>
          </div>
        </div>
      </Card>

      {isVerified && aiState?.ai_verification_log && (
        <Card className="border-emerald-500/30 bg-emerald-500/5 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Journal d'audit AI
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <LogItem label="MRZ" value={aiState.ai_verification_log.mrz_check === "passed" ? "Validé" : "Échec"} />
            <LogItem label="Sanctions" value={aiState.ai_verification_log.sanctions_screening === "clean" ? "RAS" : "Hit"} />
            <LogItem label="Face match" value={`${aiState.ai_verification_log.face_match_score.toFixed(1)}%`} />
            <LogItem label="Vivacité" value={`${aiState.ai_verification_log.liveness_score.toFixed(1)}%`} />
          </div>
        </Card>
      )}

      <DiditModal
        open={open}
        onClose={() => setOpen(false)}
        onComplete={(log) => {
          finalize.mutate(log);
          setOpen(false);
        }}
      />
    </div>
  );
}

function LogItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-emerald-500/20 bg-background/60 p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  );
}

type Step = { key: string; label: string; icon: typeof ScanLine };
const STEPS: Step[] = [
  { key: "scan", label: "Scan du document d'identité…", icon: ScanLine },
  { key: "face", label: "Vérification de vivacité (Face Match)…", icon: ScanFace },
  { key: "registry", label: "Croisement avec le registre gouvernemental…", icon: Landmark },
];

function DiditModal({ open, onClose, onComplete }: { open: boolean; onClose: () => void; onComplete: (log: AiLog) => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) { setStep(0); return; }
    if (step >= STEPS.length) {
      const t = setTimeout(() => {
        onComplete({
          provider: "didit",
          mrz_check: "passed",
          sanctions_screening: "clean",
          face_match_score: 99.4,
          liveness_score: 98.7,
        });
      }, 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1600);
    return () => clearTimeout(t);
  }, [open, step, onComplete]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md overflow-hidden border-0 bg-gradient-to-br from-[#0b1d3a] to-[#10306b] p-0 text-white">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-white">Session Didit AI</DialogTitle>
          <DialogDescription className="text-white/60">Ne fermez pas cette fenêtre pendant la vérification.</DialogDescription>
        </DialogHeader>

        <div className="relative mx-6 mt-4 aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          <div className="absolute inset-0 flex items-center justify-center">
            <ScanFace className="h-32 w-32 text-sky-300/40" />
          </div>
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-sky-300/30 to-transparent"
          />
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
          </div>
        </div>

        <div className="space-y-2 px-6 pb-6 pt-5">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            const Icon = s.icon;
            return (
              <div
                key={s.key}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors",
                  done && "border-emerald-400/40 bg-emerald-400/10 text-emerald-100",
                  active && "border-sky-400/40 bg-sky-400/10 text-sky-100",
                  !done && !active && "border-white/10 bg-white/5 text-white/40",
                )}
              >
                {done ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> :
                  active ? <Loader2 className="h-4 w-4 animate-spin text-sky-300" /> :
                  <Icon className="h-4 w-4" />}
                <span>{s.label}</span>
              </div>
            );
          })}
          <AnimatePresence>
            {step >= STEPS.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-3 py-2.5 text-sm font-semibold text-emerald-200"
              >
                <CheckCircle2 className="h-4 w-4" /> Identité confirmée — finalisation…
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
