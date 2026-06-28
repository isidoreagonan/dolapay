import { createFileRoute } from "@tanstack/react-router";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Copy, Link as LinkIcon, Sparkles, Hash, Image as ImageIcon, Wallet,
  Receipt, MessageSquareHeart, ArrowRight, Eye, ExternalLink, Search,
  QrCode, CheckCircle2, Plus, ShieldCheck, Zap,
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
  const { data: profile } = useProfile();
  const locked = profile?.kyc_status !== "approved";
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [previewLink, setPreviewLink] = useState<PL | null>(null);

  const { data: links = [] } = useQuery({
    queryKey: ["my-payment-links"],
    queryFn: async (): Promise<PL[]> => {
      const { data, error } = await supabase
        .from("payment_links")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PL[];
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
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Studio de facturation
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight">Liens de paiement</h1>
          <p className="text-sm text-muted-foreground">
            Créez des liens élégants — devise, image, redirection, remerciement, frais — sans une ligne de code.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" disabled={locked} className="gap-2 shadow-lg shadow-primary/30">
              <Plus className="h-4 w-4" /> Nouveau lien
            </Button>
          </DialogTrigger>
          <CreateLinkDialog onClose={() => setOpen(false)} />
        </Dialog>
      </div>

      {locked && (
        <Card className="border-amber-300/40 bg-amber-50/60 p-4 text-sm text-amber-900 dark:bg-amber-500/5 dark:text-amber-200">
          Vérification KYC requise pour créer des liens de paiement.
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={LinkIcon} label="Liens" value={links.length} />
        <StatCard icon={Zap} label="Actifs" value={links.filter((l) => l.active).length} accent="emerald" />
        <StatCard icon={Receipt} label="Avec facture" value={links.filter((l) => l.invoice_number).length} />
        <StatCard icon={ShieldCheck} label="Sécurisés" value={"100%"} accent="primary" />
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un lien (titre, n° facture)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 pl-9"
        />
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center"
          >
            <LinkIcon className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <p className="mt-3 text-sm text-muted-foreground">Aucun lien pour l'instant.</p>
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
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <Dialog open={!!previewLink} onOpenChange={(v) => !v && setPreviewLink(null)}>
        {previewLink && <PreviewDialog link={previewLink} />}
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

function LinkCard({ link, onToggle, onPreview }: { link: PL; onToggle: (v: boolean) => void; onPreview: () => void }) {
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/pay/${link.slug}`;
  const sym = CURRENCIES.find((c) => c.code === link.currency)?.symbol ?? link.currency;
  const amount = new Intl.NumberFormat("fr-FR").format(Number(link.amount));
  return (
    <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-card/80 via-card/60 to-card/40 p-0 backdrop-blur-2xl transition-all hover:shadow-2xl hover:shadow-primary/10">
      {/* Mobile compact layout */}
      <div className="flex gap-3 p-3 sm:hidden">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent">
          {link.image_url ? (
            <img src={link.image_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <LinkIcon className="h-7 w-7 text-primary/50" />
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold leading-tight">{link.title}</h3>
              {link.invoice_number && (
                <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                  <Hash className="h-2.5 w-2.5" /> {link.invoice_number}
                </div>
              )}
            </div>
            <Switch checked={link.active} onCheckedChange={onToggle} className="scale-90" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black tracking-tight">{amount}</span>
            <span className="text-[11px] text-muted-foreground">{sym}</span>
            <Badge variant={link.active ? "default" : "secondary"} className="ml-auto h-4 px-1.5 text-[9px]">
              {link.active ? "Actif" : "Inactif"}
            </Badge>
          </div>
          <div className="mt-1 grid grid-cols-3 gap-1.5">
            <Button size="sm" variant="outline" className="h-8 gap-1 px-2 text-[11px]" onClick={() => { navigator.clipboard.writeText(url); toast.success("Lien copié"); }}>
              <Copy className="h-3 w-3" /> Copier
            </Button>
            <Button size="sm" variant="outline" className="h-8 gap-1 px-2 text-[11px]" onClick={onPreview}>
              <Eye className="h-3 w-3" /> Voir
            </Button>
            <Button size="sm" variant="outline" className="h-8 gap-1 px-2 text-[11px]" asChild>
              <a href={url} target="_blank" rel="noreferrer"><ExternalLink className="h-3 w-3" /> Ouvrir</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop / tablet rich layout */}
      <div className="hidden sm:block">
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
            <span className="ml-auto text-[10px] font-semibold uppercase text-muted-foreground">
              Frais: {link.fees_paid_by === "customer" ? "Client" : "Vous"}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2 backdrop-blur">
            <LinkIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate font-mono text-[11px] text-muted-foreground">{url}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(url); toast.success("Lien copié"); }}>
              <Copy className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={onPreview}>
              <Eye className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={url} target="_blank" rel="noreferrer"><ExternalLink className="h-3 w-3" /></a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function CreateLinkDialog({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("XOF");
  const [imageUrl, setImageUrl] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [feesPaidBy, setFeesPaidBy] = useState<FeesPaidBy>("merchant");
  const [successUrl, setSuccessUrl] = useState("");
  const [failureUrl, setFailureUrl] = useState("");
  const [thankYou, setThankYou] = useState("");

  const create = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Non connecté");
      const slug = Math.random().toString(36).slice(2, 10);
      const validUrl = (s: string) => {
        if (!s.trim()) return null;
        try { return new URL(s.trim()).toString(); } catch { throw new Error("URL invalide"); }
      };
      const { error } = await supabase.from("payment_links").insert({
        profile_id: u.user.id,
        title: title.trim(),
        description: description.trim() || null,
        amount: Number(amount),
        currency,
        slug,
        image_url: imageUrl || null,
        invoice_number: invoiceNumber.trim() || null,
        fees_paid_by: feesPaidBy,
        success_url: validUrl(successUrl),
        failure_url: validUrl(failureUrl),
        thank_you_message: thankYou.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lien créé avec succès");
      qc.invalidateQueries({ queryKey: ["my-payment-links"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-white/10 bg-card/90 backdrop-blur-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="h-5 w-5 text-primary" /> Nouveau lien de paiement
        </DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => { e.preventDefault(); create.mutate(); }}
        className="space-y-5"
      >
        <Section icon={Receipt} title="Informations principales">
          <div>
            <Label>Titre du paiement *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} placeholder="Ex : Abonnement Pro — Mensuel" />
          </div>
          <div>
            <Label>Description (optionnel)</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} placeholder="Détaillez ce que le client paie…" rows={2} />
          </div>
          <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
            <div>
              <Label>Montant *</Label>
              <Input type="number" min={100} step="any" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="10000" />
            </div>
            <div>
              <Label>Devise</Label>
              <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.code} — {c.symbol}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Section>

        <Section icon={Hash} title="Facturation & frais">
          <div>
            <Label>Numéro de facture</Label>
            <div className="flex gap-2">
              <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="INV-2026-001" />
              <Button type="button" variant="outline" onClick={() => setInvoiceNumber(genInvoice())} className="shrink-0 gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Générer
              </Button>
            </div>
          </div>
          <div>
            <Label>Qui paie les frais de transaction ?</Label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {(["merchant", "customer"] as FeesPaidBy[]).map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFeesPaidBy(f)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left text-sm transition-all",
                    feesPaidBy === f
                      ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <Wallet className="h-4 w-4" />
                    {f === "merchant" ? "Moi (commerçant)" : "Le client"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {f === "merchant" ? "Frais déduits du montant reçu" : "Frais ajoutés au paiement"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section icon={ImageIcon} title="Visuel">
          <ImageUploader value={imageUrl} onChange={setImageUrl} />
        </Section>


        <Section icon={ArrowRight} title="Redirection après paiement">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-emerald-600">URL succès</Label>
              <Input type="url" value={successUrl} onChange={(e) => setSuccessUrl(e.target.value)} placeholder="https://votre-site.com/merci" />
            </div>
            <div>
              <Label className="text-rose-600">URL échec</Label>
              <Input type="url" value={failureUrl} onChange={(e) => setFailureUrl(e.target.value)} placeholder="https://votre-site.com/echec" />
            </div>
          </div>
        </Section>

        <Section icon={MessageSquareHeart} title="Message de remerciement">
          <Textarea
            value={thankYou}
            onChange={(e) => setThankYou(e.target.value)}
            maxLength={300}
            rows={2}
            placeholder="Merci pour votre confiance ! Votre commande sera traitée sous 24h."
          />
        </Section>

        <div className="sticky bottom-0 -mx-6 -mb-6 flex gap-3 border-t border-border bg-card/95 px-6 py-4 backdrop-blur">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
          <Button type="submit" disabled={create.isPending} className="flex-1 gap-2">
            <CheckCircle2 className="h-4 w-4" /> Créer le lien
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-background/40 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-sm font-bold">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </div>
        {title}
      </div>
      {children}
    </div>
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

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Format d'image invalide"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Max 2 Mo"); return; }
    setUploading(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Non connecté");
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${u.user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("payment-link-images").upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      const { data: signed, error: sErr } = await supabase.storage
        .from("payment-link-images")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (sErr || !signed) throw sErr ?? new Error("URL indisponible");
      onChange(signed.signedUrl);
      toast.success("Image téléversée");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec du téléversement");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div>
      <Label>Image de couverture (max 2 Mo)</Label>
      {value ? (
        <div className="relative mt-1 overflow-hidden rounded-xl border border-border">
          <img src={value} alt="" className="h-40 w-full object-cover" />
          <Button
            type="button" size="sm" variant="secondary"
            className="absolute right-2 top-2 h-7"
            onClick={() => onChange("")}
          >
            Retirer
          </Button>
        </div>
      ) : (
        <label className={cn(
          "mt-1 flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/70 bg-background/40 text-sm text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/5",
          uploading && "pointer-events-none opacity-60",
        )}>
          <ImageIcon className="h-6 w-6" />
          <span>{uploading ? "Téléversement…" : "Cliquez pour importer une image"}</span>
          <input
            type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
          />
        </label>
      )}
    </div>
  );
}
