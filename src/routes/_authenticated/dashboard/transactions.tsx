import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/transactions")({
  component: TransactionsPage,
});

type Tx = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  description: string | null;
  created_at: string;
};

function TransactionsPage() {
  const { data: txs = [], isLoading } = useQuery({
    queryKey: ["my-tx-all"],
    queryFn: async (): Promise<Tx[]> => {
      const { data, error } = await supabase
        .from("transactions")
        .select("id,amount,currency,status,type,description,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Tx[];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground">Historique complet de vos encaissements et décaissements.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Montant</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">Chargement…</td></tr>
              )}
              {!isLoading && txs.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Aucune transaction.</td></tr>
              )}
              {txs.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(t.created_at).toLocaleString("fr-FR")}</td>
                  <td className="px-4 py-3 capitalize">{t.type}</td>
                  <td className="px-4 py-3 font-mono">{new Intl.NumberFormat("fr-FR").format(Number(t.amount))} {t.currency}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{t.description ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
    pending: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    failed: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${m[status] ?? "bg-muted"}`}>{status}</span>;
}
