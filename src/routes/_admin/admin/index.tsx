import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ShieldAlert,
  Sparkles,
  Maximize2,
  ShieldOff,
  CheckCircle2,
  FileText,
  Mail,
  Building2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_admin/admin/")({
  component: AdminCenter,
});

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  account_type: "standard" | "enterprise";
  kyc_status: "pending" | "approved" | "rejected" | "frozen";
  verification_mode: "manual" | "didit_ai";
  ai_verification_score: number | null;
  ai_verification_log: {
    mrz_check?: "passed" | "failed";
    sanctions_screening?: "clean" | "hit";
    face_match_score?: number;
    liveness_score?: number;
  } | null;
  ai_verified_at: string | null;
  country: string | null;
  created_at: string;
};

type BusinessRow = {
  profile_id: string;
  company_name: string;
  hq_country: string | null;
};

function AdminCenter() {
  const [selected, setSelected] = useState<ProfileRow | null>(null);

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles-v2"],
    queryFn: async (): Promise<ProfileRow[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id,email,full_name,account_type,kyc_status,verification_mode,ai_verification_score,ai_verification_log,ai_verified_at,country,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as ProfileRow[];
    },
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ["admin-businesses"],
    queryFn: async (): Promise<BusinessRow[]> => {
      const { data, error } = await supabase.from("businesses").select("profile_id,company_name,hq_country");
      if (error) throw error;
      return (data ?? []) as BusinessRow[];
    },
  });
  const bizMap = new Map(businesses.map((b) => [b.profile_id, b]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Centre de revue KYC</h1>
        <p className="text-sm text-muted-foreground">Examinez les dossiers marchands, AI Didit ou revue manuelle.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Entreprise</th>
                <th className="px-4 py-3 text-left">Pays</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Mode</th>
                <th className="px-4 py-3 text-left">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {profiles.map((p) => {
                const biz = bizMap.get(p.id);
                const country = biz?.hq_country || p.country || "—";
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="cursor-pointer transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold">{biz?.company_name || p.full_name || "—"}</div>
                      <div className="text-xs text-muted-foreground">{p.email}</div>
                    </td>
                    <td className="px-4 py-3">{country}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                        p.account_type === "enterprise"
                          ? "bg-violet-500/10 text-violet-600 dark:text-violet-300"
                          : "bg-slate-500/10 text-slate-600 dark:text-slate-300",
                      )}>
                        {p.account_type}
                      </span>
                    </td>
                    <td className="px-4 py-3"><ModeBadge mode={p.verification_mode} /></td>
                    <td className="px-4 py-3"><StatusBadge status={p.kyc_status} /></td>
                  </tr>
                );
              })}
              {profiles.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Aucun marchand.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <MerchantDrawer
        profile={selected}
        business={selected ? bizMap.get(selected.id) ?? null : null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function ModeBadge({ mode }: { mode: ProfileRow["verification_mode"] }) {
  if (mode === "didit_ai") {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600 shadow-[0_0_12px_rgba(52,211,153,0.35)] dark:text-emerald-300"
      >
        <Sparkles className="h-3 w-3" /> Auto-approuvé (Didit AI)
      </motion.span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-300">
      Revue manuelle
    </span>
  );
}

function StatusBadge({ status }: { status: ProfileRow["kyc_status"] }) {
  const map = {
    pending: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    approved: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
    rejected: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
    frozen: "bg-slate-500/15 text-slate-500",
  } as const;
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", map[status])}>{status}</span>;
}

function MerchantDrawer({
  profile,
  business,
  onClose,
}: {
  profile: ProfileRow | null;
  business: BusinessRow | null;
  onClose: () => void;
}) {
  const qc = useQueryClient();

  const { data: docs = [] } = useQuery({
    queryKey: ["admin-docs-v2", profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kyc_documents")
        .select("id,document_type,file_path,status")
        .eq("profile_id", profile!.id);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: urlMap = {} } = useQuery({
    queryKey: ["admin-docs-urls", profile?.id, docs.map((d) => d.id).join(",")],
    enabled: docs.length > 0,
    queryFn: async () => {
      const out: Record<string, string> = {};
      for (const d of docs) {
        // file_path may be "bucket/uid/file.ext" (new) or "uid/file.ext" (legacy → kyc-documents)
        const KNOWN = ["enterprise-kyc-docs", "kyc-documents"];
        const first = d.file_path.split("/")[0];
        const bucket = KNOWN.includes(first) ? first : "kyc-documents";
        const key = KNOWN.includes(first) ? d.file_path.slice(first.length + 1) : d.file_path;
        const { data } = await supabase.storage.from(bucket).createSignedUrl(key, 600);
        if (data?.signedUrl) out[d.id] = data.signedUrl;
      }
      return out;
    },
  });

  const setStatus = useMutation({
    mutationFn: async (args: { status: ProfileRow["kyc_status"]; reason?: string }) => {
      const patch: Record<string, unknown> = { kyc_status: args.status };
      if (args.status === "rejected") patch.kyc_rejection_reason = args.reason ?? null;
      const { error } = await supabase.from("profiles").update(patch as never).eq("id", profile!.id);
      if (error) throw error;
    },
    onSuccess: (_d, args) => {
      const map = { approved: "Compte approuvé manuellement", frozen: "Compte suspendu", rejected: "Dossier rejeté" } as Record<string, string>;
      toast.success(map[args.status] ?? "Statut mis à jour");
      qc.invalidateQueries({ queryKey: ["admin-profiles-v2"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [zoom, setZoom] = useState<string | null>(null);

  return (
    <Sheet open={!!profile} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
        {profile && (
          <>
            <SheetHeader className="border-b border-border bg-muted/30 p-6">
              <SheetTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {business?.company_name || profile.full_name || "Marchand"}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2 text-xs">
                <Mail className="h-3 w-3" /> {profile.email}
              </SheetDescription>
              <div className="mt-2 flex flex-wrap gap-2">
                <ModeBadge mode={profile.verification_mode} />
                <StatusBadge status={profile.kyc_status} />
              </div>
            </SheetHeader>

            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              {profile.verification_mode === "didit_ai" && profile.ai_verification_log && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    <Sparkles className="h-4 w-4" /> Journal d'audit AI
                  </div>
                  <p className="text-sm text-emerald-900/80 dark:text-emerald-100/80">
                    Contrôle MRZ <strong>{profile.ai_verification_log.mrz_check === "passed" ? "validé" : "échoué"}</strong>,
                    screening sanctions <strong>{profile.ai_verification_log.sanctions_screening === "clean" ? "RAS" : "hit"}</strong>,
                    score de face match <strong>{(profile.ai_verification_log.face_match_score ?? 0).toFixed(1)}%</strong>.
                  </p>
                </div>
              )}

              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Documents stockés</div>
                {docs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun document soumis.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {docs.map((d) => {
                      const url = urlMap[d.id];
                      const isPdf = d.file_path.toLowerCase().endsWith(".pdf");
                      return (
                        <div key={d.id} className="group relative overflow-hidden rounded-xl border border-border bg-muted/30">
                          <div className="aspect-[4/3] w-full bg-background">
                            {url && !isPdf ? (
                              <img src={url} alt={d.document_type} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
                                <FileText className="h-8 w-8" />
                                <span className="text-[10px]">PDF</span>
                              </div>
                            )}
                          </div>
                          {url && (
                            <button
                              onClick={() => isPdf ? window.open(url, "_blank") : setZoom(url)}
                              className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-[10px] font-medium opacity-0 shadow backdrop-blur transition-opacity group-hover:opacity-100"
                            >
                              <Maximize2 className="h-3 w-3" /> Zoom
                            </button>
                          )}
                          <div className="border-t border-border p-2">
                            <div className="truncate text-xs font-semibold capitalize">{d.document_type.replace(/_/g, " ")}</div>
                            <div className="text-[10px] text-muted-foreground">{d.status}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-border bg-background/95 p-4 backdrop-blur">
              <Button
                variant="outline"
                className="flex-1 border-rose-500/40 text-rose-600 hover:bg-rose-500/10 hover:text-rose-600"
                onClick={() => {
                  const reason = window.prompt("Motif du rejet (visible par le marchand) :");
                  if (reason && reason.trim()) setStatus.mutate({ status: "rejected", reason: reason.trim() });
                }}
                disabled={setStatus.isPending}
              >
                <ShieldOff className="h-4 w-4" /> Rejeter
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-slate-500/40 text-slate-600 hover:bg-slate-500/10"
                onClick={() => setStatus.mutate({ status: "frozen" })}
                disabled={setStatus.isPending}
              >
                <ShieldOff className="h-4 w-4" /> Suspendre
              </Button>
              <Button
                className="flex-1 bg-emerald-600 text-white hover:bg-emerald-600/90"
                onClick={() => setStatus.mutate({ status: "approved" })}
                disabled={setStatus.isPending}
              >
                <CheckCircle2 className="h-4 w-4" /> Approuver
              </Button>
            </div>

            <Dialog open={!!zoom} onOpenChange={(o) => !o && setZoom(null)}>
              <DialogContent className="max-w-4xl border-0 bg-black/95 p-2">
                {zoom && <img src={zoom} alt="" className="max-h-[85vh] w-full object-contain" />}
              </DialogContent>
            </Dialog>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
