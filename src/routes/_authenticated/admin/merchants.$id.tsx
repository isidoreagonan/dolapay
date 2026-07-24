import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Building2, CheckCircle2, Mail, Snowflake, Crown, ShieldAlert, FileText, ExternalLink, XCircle, RefreshCw, Link2, Key, Link as LinkIcon, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/admin/merchants/$id")({
  component: Merchant360,
});


function Merchant360() {
  const { id } = useParams({ from: "/_authenticated/admin/merchants/$id" });
  const qc = useQueryClient();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

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
        .limit(100);
      
      let results: any[] = data ?? [];
      const existingIds = new Set(results.map((t) => t.id));

      const { data: wrs } = await (supabase.from("withdrawal_requests") as any)
        .select("id,amount,status,created_at,currency,profile_id,method")
        .eq("profile_id", id)
        .order("created_at", { ascending: false })
        .limit(100);
        
      if (wrs && wrs.length > 0) {
        for (const w of wrs) {
          if (!existingIds.has(w.id)) {
            const amt = Number(w.amount || 0);
            const st = amt === 101 ? "failed" : ((w.status === "completed" || w.status === "success" || w.status === "validé") ? "success" : (w.status === "failed" || w.status === "rejected" ? "failed" : "pending"));
            if (amt > 0 && amt !== 101) {
              existingIds.add(w.id);
              results.push({
                id: w.id,
                amount: amt,
                status: st,
                type: "pay-out",
                currency: w.currency || "XOF",
                created_at: w.created_at,
                description: w.method || "Mobile Money",
              });
            }
          }
        }
      }

      const { data: batches } = await (supabase.from("payout_batches") as any)
        .select("*, payout_batch_items(*)")
        .eq("owner_id", id)
        .order("created_at", { ascending: false })
        .limit(100);
        
      if (batches && batches.length > 0) {
        for (const b of batches) {
          if (b.payout_batch_items && Array.isArray(b.payout_batch_items)) {
            for (const item of b.payout_batch_items) {
              const realId = item.payout_id || item.id;
              if (!existingIds.has(realId)) {
                const amt = Number(item.amount || b.total_amount || 0);
                const st = amt === 101 ? "failed" : ((item.status === "completed" || item.status === "success" || item.status === "validé") ? "success" : (item.status === "failed" || item.status === "rejected" ? "failed" : "pending"));
                if (amt > 0 && amt !== 101) {
                  existingIds.add(realId);
                  results.push({
                    id: item.id,
                    amount: amt,
                    status: st,
                    type: "pay-out",
                    currency: item.currency || b.currency || "XOF",
                    created_at: item.created_at || b.created_at,
                    description: `Batch: ${b.name || b.id}`,
                  });
                }
              }
            }
          }
        }
      }

      return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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

  const { data: paymentLinks = [] } = useQuery({
    queryKey: ["admin-merchant-payment-links", id],
    queryFn: async () => {
      const { data } = await supabase.from("payment_links").select("*").eq("profile_id", id).order("created_at", { ascending: false }).limit(50);
      return data ?? [];
    },
  });

  const { data: apiKeys = [] } = useQuery({
    queryKey: ["admin-merchant-api-keys", id],
    queryFn: async () => {
      const { data } = await supabase.from("api_keys").select("*").eq("profile_id", id).order("created_at", { ascending: false }).limit(20);
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
    queryKey: ["admin-merchant-kycdocs", id],
    queryFn: async () => {
      const { data } = await supabase.from("kyc_documents").select("*").eq("profile_id", id);
      return data || [];
    },
    enabled: !!id,
  });

  // Merge the ones stored in the JSON field with any existing ones in the DB
  const rawDocs = [
    ...kycDocs,
    ...(Array.isArray(profile?.ai_verification_log) ? profile.ai_verification_log : [])
  ];

  const { data: allDocs = [] } = useQuery({
    queryKey: ["admin-merchant-docs-signed", rawDocs],
    queryFn: async () => {
      const processed = [];
      for (const doc of rawDocs) {
        const cleanPath = doc.file_path.startsWith("kyc-documents/") 
          ? doc.file_path.replace("kyc-documents/", "") 
          : doc.file_path;
        const { data } = await supabase.storage.from("kyc-documents").createSignedUrl(cleanPath, 3600);
        processed.push({ ...doc, signedUrl: data?.signedUrl || null });
      }
      return processed;
    },
    enabled: rawDocs.length > 0,
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
  const payIns = txs.filter((t) => t.type === "pay-in");
  const payOuts = txs.filter((t) => t.type === "pay-out");

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
            className="border-rose-400/40 bg-rose-400/10 text-rose-300 hover:bg-rose-400/20"
            disabled={profile.kyc_status === "rejected" || profile.kyc_status === "frozen" || action.isPending}
            onClick={() => { setRejectReason(""); setRejectModalOpen(true); }}
          >
            <XCircle className="h-3.5 w-3.5" /> Rejeter
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

      <Tabs defaultValue="kyc" className="mt-6">
        <TabsList className="bg-white/[0.03] border border-white/10 flex-wrap h-auto justify-start mb-6 rounded-lg p-1">
          <TabsTrigger value="kyc" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Conformité (KYC)</TabsTrigger>
          <TabsTrigger value="payin" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Paiements (Entrées)</TabsTrigger>
          <TabsTrigger value="payout" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Retraits (Sorties)</TabsTrigger>
          <TabsTrigger value="links" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Liens de Paiement</TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">API & Dév</TabsTrigger>
        </TabsList>

        <TabsContent value="kyc" className="space-y-6">
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
                {profile?.kyc_status === "in_compliance_review" && profile?.kyc_rejection_reason === "[RESSOUMIS]" && (
                  <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full text-xs font-bold uppercase mr-1 animate-pulse">
                    <RefreshCw className="h-3 w-3" /> Dossier Resoumis
                  </span>
                )}
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-semibold uppercase font-mono",
                  profile?.kyc_status === "approved" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : 
                  profile?.kyc_status === "rejected" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                  "bg-amber-500/20 text-amber-300 border border-amber-500/30"
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
                          ? `${profile.address}, ${profile.city || ""} (${profile.country || ""})`
                          : "—"}
                    </span>
                  </div>
                </div>
              </div>
            )}


            <div className="bg-slate-900/50 rounded-xl border border-white/5 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Pièces Justificatives</h3>
              {allDocs.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Aucun document téléversé.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {allDocs.map((doc: any) => {
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
                        {doc.signedUrl ? (
                          <a
                            href={doc.signedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-7 items-center justify-center rounded-md px-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" /> Voir
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic px-2">Lien expiré</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payin">
          <Panel title={`Paiements Entrants (${payIns.length})`}>
            {payIns.length === 0 ? (
              <Empty>Aucun paiement entrant</Empty>
            ) : (
              <table className="w-full text-xs">
                <tbody>
                  {payIns.map((t) => (
                    <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/5 transition-colors">
                      <td className="py-3 px-2 font-mono text-slate-500">{t.id.slice(0, 10)}…</td>
                      <td className="py-3 px-2 capitalize text-slate-400">{new Date(t.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                      <td className="py-3 px-2 text-right font-mono text-emerald-400 font-semibold">+{Number(t.amount).toLocaleString("fr-FR")} {t.currency}</td>
                      <td className="py-3 px-2 text-right"><StatusDot s={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="payout" className="space-y-6">
          <Panel title={`Retraits & Décaissements (${payOuts.length})`}>
            {payOuts.length === 0 ? (
              <Empty>Aucun retrait</Empty>
            ) : (
              <table className="w-full text-xs">
                <tbody>
                  {payOuts.map((t) => (
                    <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/5 transition-colors">
                      <td className="py-3 px-2 font-mono text-slate-500">{t.id.slice(0, 10)}…</td>
                      <td className="py-3 px-2 capitalize text-slate-400">{t.description || "Retrait"}</td>
                      <td className="py-3 px-2 text-slate-400">{new Date(t.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                      <td className="py-3 px-2 text-right font-mono text-rose-400 font-semibold">-{Number(t.amount).toLocaleString("fr-FR")} {t.currency}</td>
                      <td className="py-3 px-2 text-right"><StatusDot s={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>

          <Panel title={`Lots de virement groupés (${payouts.length})`}>
            {payouts.length === 0 ? (
              <Empty>Aucun lot</Empty>
            ) : (
              <table className="w-full text-xs">
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/5 transition-colors">
                      <td className="py-3 px-2 text-slate-300">{p.name}</td>
                      <td className="py-3 px-2 text-slate-500">{p.total_count} bénéficiaires</td>
                      <td className="py-3 px-2 text-slate-400">{new Date(p.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                      <td className="py-3 px-2 text-right font-mono text-white">{Number(p.total_amount).toLocaleString("fr-FR")} {p.currency}</td>
                      <td className="py-3 px-2 text-right"><StatusDot s={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="links">
          <Panel title={`Liens de Paiement (${paymentLinks.length})`}>
            {paymentLinks.length === 0 ? (
              <Empty>Aucun lien de paiement</Empty>
            ) : (
              <table className="w-full text-xs">
                <thead className="text-left text-[10px] text-slate-500 uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-2 px-2 font-medium">Titre</th>
                    <th className="py-2 px-2 font-medium">Créé le</th>
                    <th className="py-2 px-2 font-medium">Statut</th>
                    <th className="py-2 px-2 text-right font-medium">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentLinks.map((l: any) => (
                    <tr key={l.id} className="border-b border-white/[0.04] hover:bg-white/5 transition-colors">
                      <td className="py-3 px-2 font-medium text-white flex items-center gap-2">
                        <LinkIcon className="h-3 w-3 text-slate-500" /> {l.title}
                      </td>
                      <td className="py-3 px-2 text-slate-400">{new Date(l.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "short" })}</td>
                      <td className="py-3 px-2">
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", l.status === "active" ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-300")}>
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-slate-300">{l.amount ? `${Number(l.amount).toLocaleString("fr-FR")} ${l.currency || "XOF"}` : "Ouvert"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="api">
          <Panel title={`Clés API (${apiKeys.length})`}>
            {apiKeys.length === 0 ? (
              <Empty>Aucune clé API</Empty>
            ) : (
              <table className="w-full text-xs">
                <thead className="text-left text-[10px] text-slate-500 uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-2 px-2 font-medium">Nom</th>
                    <th className="py-2 px-2 font-medium">Mode</th>
                    <th className="py-2 px-2 font-medium">Prefix</th>
                    <th className="py-2 px-2 text-right font-medium">Créé le</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((k: any) => (
                    <tr key={k.id} className="border-b border-white/[0.04] hover:bg-white/5 transition-colors">
                      <td className="py-3 px-2 font-medium text-white flex items-center gap-2">
                        <Key className="h-3 w-3 text-slate-500" /> {k.name || "API Key"}
                      </td>
                      <td className="py-3 px-2">
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase", k.mode === "live" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-blue-500/20 text-blue-300 border border-blue-500/30")}>
                          {k.mode}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-mono text-slate-400">{k.key_prefix}...</td>
                      <td className="py-3 px-2 text-right text-slate-400">{new Date(k.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        </TabsContent>
      </Tabs>

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="border-white/10 bg-[#0b1d3a] text-white">
          <DialogHeader>
            <DialogTitle>Rejeter le dossier KYC</DialogTitle>
            <DialogDescription className="text-slate-400">
              Veuillez indiquer le motif du rejet. L'utilisateur recevra un email avec ce motif et sera invité à resoumettre ses documents.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              className="w-full h-32 p-3 text-sm rounded-md border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              placeholder="Ex: Le document d'identité est expiré. Veuillez fournir une pièce en cours de validité."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>Annuler</Button>
            <Button 
              variant="destructive" 
              className="bg-rose-600 hover:bg-rose-700 text-white"
              disabled={!rejectReason.trim() || action.isPending}
              onClick={() => {
                action.mutate({ kyc_status: "rejected", kyc_rejection_reason: rejectReason.trim() });
                setRejectModalOpen(false);
              }}
            >
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
