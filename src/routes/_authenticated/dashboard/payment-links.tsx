import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Copy, Link as LinkIcon, Sparkles, Hash, Image as ImageIcon, Wallet,
  Receipt, MessageSquareHeart, ArrowRight, Eye, ExternalLink, Search,
  QrCode, CheckCircle2, Plus, ShieldCheck, Zap, Pencil, Trash2, TrendingUp, AlertTriangle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "./route";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/payment-links")({
  component: PaymentLinksPage,
});

type Currency = "XOF" | "XAF" | "USD";
type FeesPaidBy = "merchant" | "customer";

type PL = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  currency: Currency;
  slug: string;
  active: boolean;
  created_at: string;
  image_url: string | null;
  invoice_number: string | null;
  thank_you_message: string | null;
  fees_paid_by: FeesPaidBy;
  success_url: string | null;
  failure_url: string | null;
  revenue?: number;
  tx_count?: number;
};

const CURRENCIES: { code: Currency; label: string; symbol: string }[] = [
  { code: "XOF", label: "Franc CFA Ouest", symbol: "F CFA" },
  { code: "XAF", label: "Franc CFA Central", symbol: "F CFA" },
  { code: "USD", label: "Dollar US", symbol: "$" },
];

function genInvoice() {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const rnd = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `INV-${y}${m}-${rnd}`;
}

function PaymentLinksPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const locked = profile?.kyc_status !== "approved";
  const [previewLink, setPreviewLink] = useState<PL | null>(null);
  const [deleteLink, setDeleteLink] = useState<PL | null>(null);
  const [search, setSearch] = useState("");

  // Fetch links with revenue stats
  const { data: links = [], isLoading, error: queryError } = useQuery({
    queryKey: ["my-payment-links"],
    queryFn: async (): Promise<PL[]> => {
      try {
        let rawLinks: any[] = [];
        try {
          const { data, error } = await supabase
            .from("payment_links")
            .select("*")
            .eq("profile_id", profile!.id)
            .order("created_at", { ascending: false });
          if (error) throw error;
          rawLinks = data ?? [];
        } catch (e: any) {
          console.error("Error fetching payment_links table:", e);
          throw new Error(`[Table payment_links] ${e.message || String(e)}`);
        }
        
        if (rawLinks.length === 0) return [];

        let txs: any[] = [];
        try {
          // Fetch revenue per link from successful transactions of type "payment_link"
          const { data, error: txsErr } = await supabase
            .from("transactions")
            .select("amount, status, description")
            .eq("profile_id", profile!.id)
            .eq("type", "payment_link")
            .eq("status", "success");
          if (txsErr) throw txsErr;
          txs = data ?? [];
        } catch (e: any) {
          console.error("Error fetching transactions table:", e);
          throw new Error(`[Table transactions] ${e.message || String(e)}`);
        }

        const revenueMap: Record<string, { revenue: number; count: number }> = {};
        
        txs.forEach((t) => {
          if (!t.description) return;
          const desc = t.description;
          // Find which raw link matches this transaction
          const matched = rawLinks.find((l) => 
            desc.startsWith(`[${l.slug}]`) || 
            desc.includes(` · ${l.title} · `) || 
            desc.startsWith(`${l.title} · `)
          );
          if (matched) {
            if (!revenueMap[matched.id]) {
              revenueMap[matched.id] = { revenue: 0, count: 0 };
            }
            revenueMap[matched.id].revenue += Number(t.amount);
            revenueMap[matched.id].count += 1;
          }
        });

        return rawLinks.map((l) => ({
          ...l,
          revenue: revenueMap[l.id]?.revenue ?? 0,
          tx_count: revenueMap[l.id]?.count ?? 0,
        })) as PL[];
      } catch (err) {
        console.error("Detailed query error in payment-links.tsx:", err);
        throw err;
      }
    },
  });

  const filtered = useMemo(
    () =>
      links.filter(
        (l) =>
          !search ||
          l.title.toLowerCase().includes(search.toLowerCase()) ||
          l.invoice_number?.toLowerCase().includes(search.toLowerCase()),
      ),
    [links, search],
  );

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("payment_links").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-payment-links"] }),
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const deleteLink_ = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("payment_links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lien supprimé");
      setDeleteLink(null);
      qc.invalidateQueries({ queryKey: ["my-payment-links"] });
    },
    onError: () => toast.error("Impossible de supprimer ce lien"),
  });

  const totalRevenue = links.reduce((s, l) => s + (l.revenue ?? 0), 0);
  const activeCount = links.filter((l) => l.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Studio de facturation
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight">Liens de paiement</h1>
          <p className="text-sm text-muted-foreground">
            Créez, modifiez et supprimez vos liens Mobile Money — connectés à PawaPay Live.
          </p>
        </div>
        <Button
          size="lg"
          disabled={locked}
          className="gap-2 shadow-lg shadow-primary/30"
          onClick={() => navigate({ to: "/dashboard/payment-links/new" })}
        >
          <Plus className="h-4 w-4" /> Nouveau lien
        </Button>
      </div>

      {locked && (
        <Card className="border-amber-300/40 bg-amber-50/60 p-4 text-sm text-amber-900 dark:bg-amber-500/5 dark:text-amber-200 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          Vérification KYC requise pour créer des liens de paiement connectés à PawaPay.
        </Card>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={LinkIcon} label="Liens créés" value={links.length} />
        <StatCard icon={Zap} label="Actifs" value={activeCount} accent="emerald" />
        <StatCard icon={TrendingUp} label="Revenus collectés" value={new Intl.NumberFormat("fr-FR").format(Math.round(totalRevenue)) + " F"} accent="primary" />
        <StatCard icon={Receipt} label="Transactions" value={links.reduce((s, l) => s + (l.tx_count ?? 0), 0)} />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un lien (titre, n° facture)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 pl-9"
        />
      </div>

      {/* Links Grid */}
      <AnimatePresence mode="popLayout">
        {queryError ? (
          <Card className="border-rose-300/40 bg-rose-50/60 p-5 text-sm text-rose-900 dark:bg-rose-500/5 dark:text-rose-200 flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold text-rose-500">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Erreur de chargement des liens
            </div>
            <p className="text-xs font-mono opacity-80">{(queryError as Error).message || String(queryError)}</p>
          </Card>
        ) : isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl border border-border/40 bg-muted/20 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center"
          >
            <LinkIcon className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <p className="mt-3 text-sm text-muted-foreground">
              {search ? "Aucun résultat pour cette recherche." : "Aucun lien pour l'instant. Créez-en un !"}
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((l, i) => (
              <motion.div
                key={l.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
              >
                <LinkCard
                  link={l}
                  onToggle={(v) => toggleActive.mutate({ id: l.id, active: v })}
                  onPreview={() => setPreviewLink(l)}
                  onEdit={() => navigate({ to: "/dashboard/payment-links/$id/edit", params: { id: l.id } })}
                  onDelete={() => setDeleteLink(l)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Preview Dialog */}
      <Dialog open={!!previewLink} onOpenChange={(v) => !v && setPreviewLink(null)}>
        {previewLink && <PreviewDialog link={previewLink} />}
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteLink} onOpenChange={(v) => !v && setDeleteLink(null)}>
        <DialogContent className="max-w-sm border-rose-500/20 bg-card/95">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-500">
              <AlertTriangle className="h-5 w-5" /> Supprimer ce lien ?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Le lien <span className="font-semibold text-foreground">"{deleteLink?.title}"</span> sera définitivement supprimé.
              Les transactions existantes ne seront pas affectées.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteLink(null)}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={deleteLink_.isPending}
                onClick={() => deleteLink && deleteLink_.mutate(deleteLink.id)}
              >
                {deleteLink_.isPending ? "Suppression…" : "Supprimer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, accent = "default",
}: { icon: React.ElementType; label: string; value: React.ReactNode; accent?: "default" | "primary" | "emerald" }) {
  const ring = accent === "emerald" ? "ring-emerald-500/20" : accent === "primary" ? "ring-primary/20" : "ring-border";
  const text = accent === "emerald" ? "text-emerald-500" : accent === "primary" ? "text-primary" : "text-muted-foreground";
  return (
    <div className={cn("rounded-2xl border bg-card/60 p-4 ring-1 backdrop-blur-xl", ring)}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className={cn("h-4 w-4", text)} />
      </div>
      <div className="mt-2 text-2xl font-black tracking-tight">{value}</div>
    </div>
  );
}

function LinkCard({
  link, onToggle, onPreview, onEdit, onDelete,
}: {
  link: PL;
  onToggle: (v: boolean) => void;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/pay/${link.slug}`;
  const sym = CURRENCIES.find((c) => c.code === link.currency)?.symbol ?? link.currency;
  const amount = new Intl.NumberFormat("fr-FR").format(Number(link.amount));
  const revenue = new Intl.NumberFormat("fr-FR").format(Math.round(link.revenue ?? 0));

  return (
    <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-card/80 via-card/60 to-card/40 p-0 backdrop-blur-2xl transition-all hover:shadow-2xl hover:shadow-primary/10">
      {/* Image banner */}
      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-primary/30 via-primary/10 to-transparent">
        {link.image_url ? (
          <img src={link.image_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <LinkIcon className="h-10 w-10 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        <div className="absolute right-3 top-3 flex items-center gap-2">
          <Badge variant={link.active ? "default" : "secondary"} className="backdrop-blur">
            {link.active ? "Actif" : "Inactif"}
          </Badge>
        </div>
        {/* Edit / Delete buttons on hover */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="h-7 w-7 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors"
            title="Modifier"
          >
            <Pencil className="h-3.5 w-3.5 text-white" />
          </button>
          <button
            onClick={onDelete}
            className="h-7 w-7 rounded-lg bg-rose-500/20 backdrop-blur flex items-center justify-center hover:bg-rose-500/40 transition-colors"
            title="Supprimer"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-300" />
          </button>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold leading-tight">{link.title}</h3>
            <Switch checked={link.active} onCheckedChange={onToggle} />
          </div>
          {link.invoice_number && (
            <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
              <Hash className="h-3 w-3" /> {link.invoice_number}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black tracking-tight">{amount}</span>
          <span className="text-sm text-muted-foreground">{sym}</span>
        </div>

        {/* Revenue stats */}
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold text-emerald-300">{revenue} {sym} collectés</span>
          <span className="ml-auto text-[10px] text-muted-foreground">{link.tx_count ?? 0} paiements</span>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2 backdrop-blur">
          <LinkIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate font-mono text-[11px] text-muted-foreground">{url}</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(url); toast.success("Lien copié !"); }} title="Copier">
            <Copy className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={onPreview} title="QR Code">
            <Eye className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit} title="Modifier">
            <Pencil className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" asChild title="Ouvrir">
            <a href={url} target="_blank" rel="noreferrer"><ExternalLink className="h-3 w-3" /></a>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function PreviewDialog({ link }: { link: PL }) {
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/pay/${link.slug}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}`;
  return (
    <DialogContent className="max-w-md border-white/10 bg-card/90 backdrop-blur-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2"><QrCode className="h-5 w-5 text-primary" /> Partager le lien</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid place-items-center rounded-2xl border border-border/60 bg-background/60 p-6">
          <img src={qr} alt="QR" className="h-48 w-48 rounded-lg" />
        </div>
        <div className="rounded-xl border border-border/60 bg-background/60 p-3">
          <div className="text-[10px] font-semibold uppercase text-muted-foreground">URL publique</div>
          <div className="mt-1 break-all font-mono text-xs">{url}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => { navigator.clipboard.writeText(url); toast.success("Copié"); }}>
            <Copy className="h-4 w-4 mr-1" /> Copier
          </Button>
          <Button asChild>
            <a href={url} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4 mr-1" /> Ouvrir</a>
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}



