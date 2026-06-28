import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/audit")({
  component: AuditPage,
});

type AuditRow = {
  id: string;
  admin_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown> | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
};

function AuditPage() {
  const [live, setLive] = useState<AuditRow[]>([]);

  const { data: rows = [] } = useQuery({
    queryKey: ["admin-audit"],
    queryFn: async (): Promise<AuditRow[]> => {
      const { data, error } = await supabase
        .from("admin_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as AuditRow[];
    },
  });

  useEffect(() => {
    const ch = supabase
      .channel("admin-audit-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "admin_audit_log" }, (p) => {
        setLive((prev) => [p.new as AuditRow, ...prev].slice(0, 100));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const all = [...live, ...rows.filter((r) => !live.find((l) => l.id === r.id))];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Journal d'audit</h1>
        <p className="mt-1 text-sm text-slate-400">Toutes les actions admin sont immuables et tracées (lecture seule, même pour vous).</p>
      </header>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Quand</th>
                <th className="px-3 py-2 text-left font-medium">Action</th>
                <th className="px-3 py-2 text-left font-medium">Cible</th>
                <th className="px-3 py-2 text-left font-medium">Admin</th>
                <th className="px-3 py-2 text-left font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {all.map((r) => (
                <tr key={r.id} className="border-b border-white/[0.04]">
                  <td className="px-3 py-2 font-mono text-slate-500">{new Date(r.created_at).toLocaleString("fr-FR")}</td>
                  <td className="px-3 py-2 font-mono text-emerald-300">{r.action}</td>
                  <td className="px-3 py-2 font-mono text-slate-400">{r.target_type ? `${r.target_type}/${(r.target_id ?? "").slice(0, 10)}` : "—"}</td>
                  <td className="px-3 py-2 font-mono text-slate-500">{r.admin_id.slice(0, 8)}…</td>
                  <td className="px-3 py-2 font-mono text-slate-500">{r.ip ?? "—"}</td>
                </tr>
              ))}
              {all.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-12 text-center text-slate-500">Aucun événement journalisé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
