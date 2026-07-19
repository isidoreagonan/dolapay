import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Building2, CheckCircle2, Mail, Snowflake, Crown, ShieldAlert, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/merchants/$id")({
  component: Merchant360,
});


function Merchant360() {
  const { id } = useParams({ from: "/_authenticated/admin/merchants/$id" });
  const qc = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["admin-merchant", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: business } = useQuery({
    queryKey: ["admin-merchant-biz", id],
    queryFn: async () => {
      const { data } = await supabase.from("businesses").select("*").eq("profile_id", id).maybeSingle();
      return data;
    },
  });

  const { data: txs = [] } = useQuery({
    queryKey: ["admin-merchant-txs", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("id,amount,currency,status,type,created_at,description")
        .eq("profile_id", id)
        .order("created_at", { ascending: false })
        .limit(50);
      return data ?? [];
    },
  });

  const { data: payouts = [] } = useQuery({
    queryKey: ["admin-merchant-payouts", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("payout_batches")
        .select("id,name,currency,status,total_amount,total_count,created_at")
        .eq("owner_id", id)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  const { data: reps = [] } = useQuery({
    queryKey: ["admin-merchant-reps", id],
    queryFn: async () => {
      const { data } = await supabase.from("business_representatives").select("*").eq("profile_id", id);
      return data ?? [];
    },
  });

  const ubos = (business?.ubos as any[]) || [];

  const { data: kycDocs = [] } = useQuery({
    queryKey: ["admin-merchant-docs", id],
    queryFn: async () => {
      const { data } = await supabase.from("kyc_documents").select("*").eq("profile_id", id);
      return data ?? [];
    },
  });

  const action = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => {
      const { error } = await supabase.from("profiles").update(patch as never).eq("id", id);
      if (error) throw error;
      if (patch.kyc_status === "approved" || patch.kyc_status === "rejected") {
        try {
          await fetch("/api/public/send-notification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: patch.kyc_status === "approved" ? "kyc_approved" : "kyc_rejected",
              profileId: id,
              reason: (patch as any).kyc_rejection_reason || "Documents flous ou incomplets",
            }),
          });
        } catch (e) {}
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-merchant", id] });
      toast.success("Mis à jour");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!profile) {
    return <div className="text-sm text-slate-400">Chargement…</div>;
  }

  const volume = txs.filter((t) => t.status === "success").reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="space-y-6">
      <Link to="/admin/merchants" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white">
        <ArrowLeft className="h-3 w-3" /> Marchands
      </Link>

      <header className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white">
              <Building2 className="h-5 w-5 text-slate-400" />
              <h1 className="text-xl font-bold">{business?.company_name || profile.full_name || "—"}</h1>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {profile.email}</span>
              <span className="font-mono">acc_{profile.id.replace(/-/g, "").slice(0, 16)}</span>
              <span>{profile.country ?? "—"}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
              <span className={cn(
                "rounded-full border px-2 py-0.5 font-semibold uppercase",
                profile.account_type === "enterprise" ? "border-violet-400/30 bg-violet-400/15 text-violet-300" : "border-slate-400/30 bg-slate-400/15 text-slate-300",
              )}>{profile.account_type} tier</span>
              <Kyc s={profile.kyc_status as never} />
              {profile.ai_verification_score !== null && (
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-0.5 font-mono font-semibold text-emerald-300">
                  AI score {Number(profile.ai_verification_score).toFixed(0)}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Volume traité</div>
            <div className="font-mono text-xl font-bold text-white">{volume.toLocaleString("fr-FR")} F</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <Button
            size="sm"
            variant="outline"
            className="border-emerald-400/40 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
            disabled={profile.kyc_status === "approved" || action.isPending}
            onClick={() => action.mutate({ kyc_status: "approved", kyc_rejection_reason: null })}
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Approuver
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-slate-400/40 bg-white/5 text-slate-200 hover:bg-white/10"
            disabled={profile.kyc_status === "frozen" || action.isPending}
            onClick={() => action.mutate({ kyc_status: "frozen" })}
          >
            <Snowflake className="h-3.5 w-3.5" /> Geler
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-violet-400/40 bg-violet-400/10 text-violet-300 hover:bg-violet-400/20"
            disabled={profile.account_type === "enterprise" || action.isPending}
            onClick={() => action.mutate({ account_type: "enterprise" })}
          >
            <Crown className="h-3.5 w-3.5" /> Passer Enterprise
          </Button>
        </div>
      </header>

      {/* DOSSIER KYC / KYB */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-violet-400" /> Dossier de Conformité (KYC/KYB)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Vérification manuelle des documents (Identité, RCCM, IFU) téléversés par l'utilisateur.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Statut KYC / KYB :</span>
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-semibold uppercase font-mono",
              profile?.kyc_status === "approved" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            )}>
              {profile?.kyc_status || "En attente"}
            </span>
          </div>
        </div>

        {/* 1. Infos Société & Registre Officiel */}
        {profile?.account_type === "enterprise" && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">1. Informations Société & Registre d'État</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/[0.02] p-4 rounded-lg border border-white/5 text-xs">
              <div>
                <span className="text-slate-500 block">Raison Sociale</span>
                <span className="text-white font-medium">{business?.company_name || "—"}</span>
              </div>
              <div>
                <span className="text-slate-500 block">N° RCCM / Registre</span>
                <span className="text-white font-mono">{business?.registration_number || "—"}</span>
              </div>
              <div>
                <span className="text-slate-500 block">N° IFU / Tax ID</span>
                <span className="text-white font-mono">{business?.tax_id || "—"}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Siège Social</span>
                <span className="text-white">
                  {business?.headquarters_address 
                    ? `${business.headquarters_address}${business.hq_city ? `, ${business.hq_city}` : ""}${business.hq_country ? ` (${business.hq_country})` : ""}`
                    : profile?.address
                      ? `${profile.address}, ${profile.city} (${profile.country})`
                      : "—"}
                </span>
              </div>
            </div>
          </div>
        )}


        {/* Documents justificatifs */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Documents Justificatifs Téléversés</h3>
          {kycDocs.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Aucun document téléversé.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {kycDocs.map((doc: any) => {
                // Parse real document type from file_path: "kyc-documents/UID/rccm-123456.pdf" -> "rccm"
                const parts = doc.file_path.split("/");
                const filename = parts[parts.length - 1] || "";
                const realType = filename.split("-")[0] || doc.document_type;
                
                return (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="h-4 w-4 text-violet-400 shrink-0" />
                      <div className="overflow-hidden">
                        <span className="text-xs font-medium text-white block truncate uppercase">{realType}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{doc.status}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-slate-300 hover:text-white"
                      onClick={async () => {
                        const { data } = await supabase.storage.from("kyc-documents").createSignedUrl(doc.file_path, 3600);
                        if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                        else toast.error("Impossible d'ouvrir le fichier (vérifiez le bucket stocké)");
                      }}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" /> Voir
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">

        <Panel title={`Transactions (${txs.length})`}>
          {txs.length === 0 ? (
            <Empty>Aucune transaction</Empty>
          ) : (
            <table className="w-full text-xs">
              <tbody>
                {txs.slice(0, 12).map((t) => (
                  <tr key={t.id} className="border-b border-white/[0.04]">
                    <td className="py-2 font-mono text-slate-500">{t.id.slice(0, 10)}…</td>
                    <td className="py-2 capitalize text-slate-400">{t.type}</td>
                    <td className="py-2 text-right font-mono text-white">{Number(t.amount).toLocaleString("fr-FR")} {t.currency}</td>
                    <td className="py-2 text-right"><StatusDot s={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>

        <Panel title={`Lots de décaissement (${payouts.length})`}>
          {payouts.length === 0 ? (
            <Empty>Aucun lot</Empty>
          ) : (
            <table className="w-full text-xs">
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} className="border-b border-white/[0.04]">
                    <td className="py-2 text-slate-300">{p.name}</td>
                    <td className="py-2 text-slate-500">{p.total_count} bénéficiaires</td>
                    <td className="py-2 text-right font-mono text-white">{Number(p.total_amount).toLocaleString("fr-FR")} {p.currency}</td>
                    <td className="py-2 text-right"><StatusDot s={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      </section>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <h3 className="mb-3 text-sm font-semibold text-white">{title}</h3>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-xs text-slate-500">{children}</p>;
}

function Kyc({ s }: { s: "pending" | "approved" | "rejected" | "frozen" }) {
  const map = {
    pending: "border-amber-400/30 bg-amber-400/15 text-amber-300",
    approved: "border-emerald-400/30 bg-emerald-400/15 text-emerald-300",
    rejected: "border-rose-400/30 bg-rose-400/15 text-rose-300",
    frozen: "border-slate-400/30 bg-slate-400/15 text-slate-300",
  } as const;
  return <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase", map[s])}>KYC {s}</span>;
}

function StatusDot({ s }: { s: string }) {
  const map: Record<string, string> = {
    success: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    pending: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    failed: "bg-rose-400/15 text-rose-300 border-rose-400/30",
    processing: "bg-sky-400/15 text-sky-300 border-sky-400/30",
    completed_with_errors: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  };
  return <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase", map[s] ?? map.pending)}>{s}</span>;
}
