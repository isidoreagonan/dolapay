import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/merchants")({
  component: MerchantsList,
});

type Row = {
  id: string;
  email: string;
  full_name: string | null;
  account_type: "standard" | "enterprise";
  kyc_status: "pending" | "approved" | "rejected" | "frozen";
  country: string | null;
  created_at: string;
};

function MerchantsList() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "frozen" | "rejected">("all");

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-merchants-list"],
    queryFn: async (): Promise<Row[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id,email,full_name,account_type,kyc_status,country,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const filtered = rows.filter((r) => {
    if (filter !== "all" && r.kyc_status !== filter) return false;
    if (!q) return true;
    const needle = q.toLowerCase();
    return (
      r.email.toLowerCase().includes(needle) ||
      (r.full_name ?? "").toLowerCase().includes(needle) ||
      r.id.includes(needle.replace("acc_", ""))
    );
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Marchands</h1>
        <p className="mt-1 text-sm text-slate-400">{rows.length} comptes enregistrés sur la plateforme.</p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher email, nom, acc_id…"
            className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-white/30 focus:outline-none"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1 text-xs">
          {(["all", "pending", "approved", "frozen", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-3 py-1 font-medium capitalize transition-colors",
                filter === f ? "bg-white/10 text-white" : "text-slate-400 hover:text-white",
              )}
            >
              {f === "all" ? "Tous" : f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Marchand</th>
                <th className="px-3 py-2 text-left font-medium">acc_id</th>
                <th className="px-3 py-2 text-left font-medium">Pays</th>
                <th className="px-3 py-2 text-left font-medium">Tier</th>
                <th className="px-3 py-2 text-left font-medium">KYC</th>
                <th className="px-3 py-2 text-left font-medium">Créé</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.04]">
                  <td className="px-3 py-2">
                    <Link to="/admin/merchants/$id" params={{ id: r.id }} className="block">
                      <div className="font-semibold text-white">{r.full_name || "—"}</div>
                      <div className="text-[10px] text-slate-500">{r.email}</div>
                    </Link>
                  </td>
                  <td className="px-3 py-2 font-mono text-[10px] text-slate-400">acc_{r.id.replace(/-/g, "").slice(0, 12)}</td>
                  <td className="px-3 py-2 text-slate-400">{r.country ?? "—"}</td>
                  <td className="px-3 py-2">
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase",
                      r.account_type === "enterprise" ? "bg-violet-400/15 text-violet-300" : "bg-slate-400/15 text-slate-300",
                    )}>
                      {r.account_type}
                    </span>
                  </td>
                  <td className="px-3 py-2"><Kyc s={r.kyc_status} /></td>
                  <td className="px-3 py-2 text-[10px] text-slate-500">{new Date(r.created_at).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-12 text-center text-slate-500">Aucun résultat.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Kyc({ s }: { s: Row["kyc_status"] }) {
  const map = {
    pending: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    approved: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    rejected: "bg-rose-400/15 text-rose-300 border-rose-400/30",
    frozen: "bg-slate-400/15 text-slate-300 border-slate-400/30",
  } as const;
  return <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase", map[s])}>{s}</span>;
}
