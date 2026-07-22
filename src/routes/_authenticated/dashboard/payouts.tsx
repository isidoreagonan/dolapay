import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Send, Plus, FileSpreadsheet, Loader2, Crown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useProfile } from "./route";
import { getTier } from "@/lib/tier";

export const Route = createFileRoute("/_authenticated/dashboard/payouts")({
  component: PayoutsRoute,
});

type Batch = {
  id: string;
  name: string;
  currency: string;
  status: "draft" | "processing" | "completed" | "failed";
  total_amount: number;
  total_count: number;
  created_at: string;
};

type Row = { recipient_name: string; recipient_phone: string; provider: string; amount: number };

function PayoutsRoute() {
  const { data: profile } = useProfile();
  const tier = getTier(profile?.account_type);
  if (!tier.capabilities.payouts) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Card className="w-full max-w-lg border-amber-400/40 bg-card/70 p-8 text-center backdrop-blur-xl">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-amber-400/15 text-amber-500">
            <Crown className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold">Fonctionnalité Enterprise</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Passez à l'<strong>Enterprise Tier</strong> pour débloquer les décaissements automatisés
            vers des tiers, les virements en masse et les webhooks signés.
          </p>
          <Button asChild className="mt-5"><Link to="/dashboard/settings"><Crown className="h-4 w-4" /> Demander la mise à niveau</Link></Button>
        </Card>
      </div>
    );
  }
  return <PayoutsPage />;
}

function PayoutsPage() {
  const qc = useQueryClient();
  const { data: batches = [] } = useQuery({
    queryKey: ["payout-batches"],
    queryFn: async (): Promise<Batch[]> => {
      const { data, error } = await supabase
        .from("payout_batches")
        .select("id,name,currency,status,total_amount,total_count,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? [])
        .filter((b: any) => !b.name?.startsWith("[Retrait Wallet]"))
        .map((b: any) => {
          return { ...b };
        }) as Batch[];
    },
  });

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("XOF");
  const [rows, setRows] = useState<Row[]>([
    { recipient_name: "", recipient_phone: "", provider: "MTN", amount: 0 },
  ]);

  function addRow() {
    setRows((r) => [...r, { recipient_name: "", recipient_phone: "", provider: "MTN", amount: 0 }]);
  }
  function updateRow(i: number, patch: Partial<Row>) {
    setRows((r) => r.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  }
  function removeRow(i: number) {
    setRows((r) => r.filter((_, idx) => idx !== i));
  }

  async function handleCsv(file: File) {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const parsed: Row[] = [];
    for (let i = 0; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim());
      if (i === 0 && isNaN(Number(cols[3]))) continue; // header
      parsed.push({
        recipient_name: cols[0] ?? "",
        recipient_phone: cols[1] ?? "",
        provider: cols[2] ?? "MTN",
        amount: Number(cols[3] ?? 0),
      });
    }
    if (parsed.length) {
      setRows(parsed);
      toast.success(`${parsed.length} lignes importées`);
    } else {
      toast.error("CSV vide ou invalide");
    }
  }

  const createBatch = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Non connecté");
      const valid = rows.filter((r) => r.recipient_name && r.recipient_phone && r.amount > 0);
      if (!valid.length) throw new Error("Ajoutez au moins une ligne valide");
      const total = valid.reduce((s, r) => s + Number(r.amount), 0);
      const { data: batch, error: e1 } = await supabase
        .from("payout_batches")
        .insert({
          owner_id: u.user.id,
          name: name || `Batch du ${new Date().toLocaleDateString("fr-FR")}`,
          currency,
          total_amount: total,
          total_count: valid.length,
          status: "draft",
        })
        .select()
        .single();
      if (e1) throw e1;
      const { error: e2 } = await supabase
        .from("payout_batch_items")
        .insert(valid.map((r) => ({ ...r, batch_id: batch.id, currency })));
      if (e2) throw e2;
    },
    onSuccess: () => {
      toast.success("Batch créé");
      setOpen(false);
      setName("");
      setRows([{ recipient_name: "", recipient_phone: "", provider: "MTN", amount: 0 }]);
      qc.invalidateQueries({ queryKey: ["payout-batches"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const sendBatch = useMutation({
    mutationFn: async (id: string) => {
      // Simulate processing — flip to processing then completed
      const { error } = await supabase
        .from("payout_batches")
        .update({ status: "processing" })
        .eq("id", id);
      if (error) throw error;
      await new Promise((r) => setTimeout(r, 800));
      await supabase
        .from("payout_batch_items")
        .update({ status: "success" })
        .eq("batch_id", id);
      await supabase.from("payout_batches").update({ status: "completed" }).eq("id", id);
    },
    onSuccess: () => {
      toast.success("Batch envoyé");
      qc.invalidateQueries({ queryKey: ["payout-batches"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Décaissements en masse</h1>
          <p className="text-sm text-muted-foreground">
            Importez un CSV ou ajoutez manuellement vos bénéficiaires.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Nouveau batch</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Créer un batch de décaissement</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Label>Nom du batch</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Salaires Juin" />
              </div>
              <div>
                <Label>Devise</Label>
                <Input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-sm hover:bg-accent">
                <Upload className="h-4 w-4" /> Importer CSV
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleCsv(e.target.files[0])}
                />
              </Label>
              <span className="text-xs text-muted-foreground">
                Format: nom, téléphone, opérateur, montant
              </span>
            </div>

            <div className="max-h-72 overflow-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase">
                  <tr>
                    <th className="px-3 py-2 text-left">Nom</th>
                    <th className="px-3 py-2 text-left">Téléphone</th>
                    <th className="px-3 py-2 text-left">Opérateur</th>
                    <th className="px-3 py-2 text-right">Montant</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-2"><Input value={r.recipient_name} onChange={(e) => updateRow(i, { recipient_name: e.target.value })} /></td>
                      <td className="p-2"><Input value={r.recipient_phone} onChange={(e) => updateRow(i, { recipient_phone: e.target.value })} /></td>
                      <td className="p-2"><Input value={r.provider} onChange={(e) => updateRow(i, { provider: e.target.value })} /></td>
                      <td className="p-2"><Input type="number" value={r.amount} onChange={(e) => updateRow(i, { amount: Number(e.target.value) })} className="text-right" /></td>
                      <td className="p-2"><button onClick={() => removeRow(i)} className="text-xs text-muted-foreground hover:text-rose-500">×</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={addRow}><Plus className="mr-2 h-4 w-4" /> Ajouter une ligne</Button>
              <div className="text-sm">
                <span className="text-muted-foreground">Total: </span>
                <span className="font-mono font-bold">{fmt(total)} {currency}</span>
                <span className="ml-3 text-muted-foreground">({rows.length} bénéficiaires)</span>
              </div>
            </div>

            <Button
              className="w-full"
              disabled={createBatch.isPending}
              onClick={() => createBatch.mutate()}
            >
              {createBatch.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
              Créer le batch
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Bénéficiaires</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Créé</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{b.name}</td>
                <td className="px-4 py-3">{b.total_count}</td>
                <td className="px-4 py-3 text-right font-mono">{fmt(Number(b.total_amount))} {b.currency}</td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(b.created_at).toLocaleDateString("fr-FR")}</td>
                <td className="px-4 py-3 text-right">
                  {b.status === "draft" && (
                    <Button size="sm" disabled={sendBatch.isPending} onClick={() => sendBatch.mutate(b.id)}>
                      <Send className="mr-2 h-3 w-3" /> Envoyer
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {batches.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Aucun batch encore. Créez-en un pour commencer.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: Batch["status"] }) {
  const map = {
    draft: "bg-slate-500/15 text-slate-500",
    processing: "bg-amber-500/15 text-amber-600",
    completed: "bg-emerald-500/15 text-emerald-600",
    failed: "bg-rose-500/15 text-rose-600",
  } as const;
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", map[status])}>{status}</span>;
}

function fmt(n: number) { return new Intl.NumberFormat("fr-FR").format(Math.round(n)); }
