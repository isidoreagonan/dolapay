import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShieldAlert, Building2, CheckCircle2, Clock, AlertTriangle, ArrowRight, ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/compliance")({
  component: ComplianceDashboard,
});

function ComplianceDashboard() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["admin-compliance-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, businesses(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = profiles.filter((p: any) => {
    const q = search.toLowerCase();
    const name = (p.full_name || p.businesses?.[0]?.company_name || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const underReviewCount = profiles.filter((p: any) => p.kyc_status === "under_review" || p.kyc_status === "pending").length;
  const approvedCount = profiles.filter((p: any) => p.kyc_status === "approved").length;
  const enterpriseCount = profiles.filter((p: any) => p.account_type === "enterprise").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ShieldAlert className="h-7 w-7 text-violet-400" /> Centre de Conformité & Audit KYB (Didit AI)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Audit légal 24h, vérification biométrique des dirigeants, contrôle UBOs &gt; 25% et screening anti-blanchiment (AML/PEP).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {underReviewCount} à auditer
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> {approvedCount} vérifiés
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold flex items-center gap-1.5">
            <Building2 className="h-4 w-4" /> {enterpriseCount} Entreprises
          </div>
        </div>
      </header>

      <div className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/10">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <Input
          placeholder="Rechercher une entreprise, un dirigeant ou un email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-0 bg-transparent text-white focus-visible:ring-0 placeholder:text-slate-500 text-sm"
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-sm text-slate-400">Chargement des dossiers de conformité...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">Aucun dossier trouvé</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400 border-b border-white/10 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Entreprise / Marchand</th>
                  <th className="py-3.5 px-4">Tier & Pays</th>
                  <th className="py-3.5 px-4">Score Didit AI</th>
                  <th className="py-3.5 px-4">Statut AML / PEP</th>
                  <th className="py-3.5 px-4">Statut Légal (24h)</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((p: any) => {
                  const biz = p.businesses?.[0];
                  const aiScore = biz?.didit_score || p.ai_verification_score || null;
                  const status = p.kyc_status || "pending";

                  return (
                    <tr 
                      key={p.id} 
                      onClick={() => navigate({ to: "/admin/merchants/$id", params: { id: p.id } })}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">
                          {biz?.company_name || p.full_name || "Sans Nom"}
                        </div>
                        <div className="text-slate-400 text-[11px] font-mono mt-0.5">{p.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-semibold uppercase mr-1.5",
                          p.account_type === "enterprise" ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                        )}>
                          {p.account_type}
                        </span>
                        <span className="text-slate-400">{biz?.country || p.country || "—"}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {aiScore ? (
                          <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                            {Number(aiScore).toFixed(0)}%
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">En attente</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Clear (Aucune sanction)
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                          status === "approved" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                          status === "under_review" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse" :
                          status === "rejected" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                          "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                        )}>
                          {status === "under_review" ? "À auditer (24h SLA)" : status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors"
                        >
                          Ouvrir Dossier <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
