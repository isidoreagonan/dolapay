import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sparkles, Receipt, Hash, Wallet, ImageIcon, ArrowRight, MessageSquareHeart, CheckCircle2, LinkIcon, ChevronLeft, Palette
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/payment-links_/new")({
  component: NewPaymentLinkPage,
});

type Currency = "XOF" | "XAF" | "USD";
type FeesPaidBy = "merchant" | "customer";

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

function NewPaymentLinkPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();

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

  const [primaryColor, setPrimaryColor] = useState("#0066FF");
  const [buttonTextColor, setButtonTextColor] = useState("#FFFFFF");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [themeMode, setThemeMode] = useState("light");

  const validUrl = (s: string) => {
    if (!s.trim()) return null;
    try { return new URL(s.trim()).toString(); } catch { throw new Error("URL invalide"); }
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        amount: Number(amount),
        currency,
        image_url: imageUrl || null,
        invoice_number: invoiceNumber.trim() || null,
        fees_paid_by: feesPaidBy,
        success_url: validUrl(successUrl),
        failure_url: validUrl(failureUrl),
        thank_you_message: thankYou.trim() || null,
        theme_config: {
          primaryColor,
          buttonTextColor,
          fontFamily,
          themeMode,
        },
      };

      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Non connecté");
      const slug = Math.random().toString(36).slice(2, 10);
      const { error } = await supabase.from("payment_links").insert({
        ...payload,
        profile_id: u.user.id,
        merchant_id: u.user.id,
        slug,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lien créé avec succès ✓");
      qc.invalidateQueries({ queryKey: ["my-payment-links"] });
      navigate({ to: "/dashboard/payment-links" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/dashboard/payment-links" })} className="rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <LinkIcon className="h-3.5 w-3.5" /> Liens de paiement
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight">Nouveau lien</h1>
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); save.mutate(); }}
        className="space-y-6"
      >
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Section icon={Receipt} title="Informations principales">
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Titre du paiement *</Label>
                  <Input className="mt-1.5 h-12 text-lg font-medium" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} placeholder="Ex : Abonnement Pro — Mensuel" />
                </div>
                <div>
                  <Label className="text-muted-foreground">Description (optionnel)</Label>
                  <Textarea className="mt-1.5 resize-none text-base" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} placeholder="Détaillez ce que le client paie…" rows={3} />
                </div>
                <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                  <div>
                    <Label className="text-muted-foreground">Montant *</Label>
                    <Input className="mt-1.5 h-12 text-lg font-bold" type="number" min={10} step="any" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="10000" />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Devise</Label>
                    <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                      <SelectTrigger className="mt-1.5 h-12 text-base font-semibold"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c.code} value={c.code}>{c.code} — {c.symbol}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Section>

            <Section icon={ImageIcon} title="Visuel de la page">
              <ImageUploader value={imageUrl} onChange={setImageUrl} />
            </Section>

            <Section icon={Palette} title="Apparence">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  <div>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Bouton (Fond)</Label>
                    <div className="mt-1.5 flex h-12 items-center gap-3 rounded-xl border border-border/60 bg-background/50 px-3">
                      <input 
                        type="color" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded bg-transparent border-0 p-0"
                      />
                      <Input 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)} 
                        className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Bouton (Texte)</Label>
                    <div className="mt-1.5 flex h-12 items-center gap-3 rounded-xl border border-border/60 bg-background/50 px-3">
                      <input 
                        type="color" 
                        value={buttonTextColor} 
                        onChange={(e) => setButtonTextColor(e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded bg-transparent border-0 p-0"
                      />
                      <Input 
                        value={buttonTextColor} 
                        onChange={(e) => setButtonTextColor(e.target.value)} 
                        className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Police</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger className="mt-1.5 h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter (Moderne)</SelectItem>
                        <SelectItem value="system-ui">Système</SelectItem>
                        <SelectItem value="serif">Serif (Élégant)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Thème</Label>
                    <Select value={themeMode} onValueChange={setThemeMode}>
                      <SelectTrigger className="mt-1.5 h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Clair ☀️</SelectItem>
                        <SelectItem value="dark">Sombre 🌙</SelectItem>
                        <SelectItem value="auto">Automatique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Section>

            <Section icon={ArrowRight} title="Redirection & Expérience">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-emerald-600">URL succès (Optionnel)</Label>
                    <Input className="mt-1.5" type="url" value={successUrl} onChange={(e) => setSuccessUrl(e.target.value)} placeholder="https://votre-site.com/merci" />
                  </div>
                  <div>
                    <Label className="text-rose-600">URL échec (Optionnel)</Label>
                    <Input className="mt-1.5" type="url" value={failureUrl} onChange={(e) => setFailureUrl(e.target.value)} placeholder="https://votre-site.com/echec" />
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Message de remerciement personnalisé</Label>
                  <Textarea
                    className="mt-1.5 resize-none"
                    value={thankYou}
                    onChange={(e) => setThankYou(e.target.value)}
                    maxLength={300}
                    rows={2}
                    placeholder="Merci pour votre confiance ! Votre commande sera traitée sous 24h."
                  />
                </div>
              </div>
            </Section>
          </div>

          {/* Right sidebar options */}
          <div className="space-y-6">
            <Section icon={Hash} title="Facturation">
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Numéro de facture</Label>
                  <div className="mt-1.5 flex gap-2">
                    <Input className="font-mono" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="INV-2026-001" />
                    <Button type="button" variant="secondary" onClick={() => setInvoiceNumber(genInvoice())} className="shrink-0">
                      Générer
                    </Button>
                  </div>
                </div>
              </div>
            </Section>

            <Section icon={Wallet} title="Frais de transaction">
              <div className="space-y-3">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Qui paie les frais ?</Label>
                <div className="grid gap-3">
                  {(["merchant", "customer"] as FeesPaidBy[]).map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setFeesPaidBy(f)}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-left transition-all",
                        feesPaidBy === f
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : "border-border/60 bg-background/50 hover:border-primary/40",
                      )}
                    >
                      <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                        <Wallet className="h-4 w-4" />
                        {f === "merchant" ? "Moi (commerçant)" : "Le client"}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {f === "merchant" ? "Les frais seront déduits de vos revenus." : "Les frais seront ajoutés au total payé par le client."}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Section>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur shadow-sm">
          <Button type="button" variant="ghost" onClick={() => navigate({ to: "/dashboard/payment-links" })}>
            Annuler
          </Button>
          <Button type="submit" size="lg" disabled={save.isPending} className="gap-2 px-8">
            <CheckCircle2 className="h-4 w-4" />
            {save.isPending ? "Création en cours…" : "Créer le lien de paiement"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-5 md:p-6 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 text-base font-bold text-foreground">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        {title}
      </div>
      {children}
    </div>
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
      <Label className="text-muted-foreground text-xs uppercase tracking-wider mb-2 block">Image de couverture (max 2 Mo)</Label>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-border shadow-sm group">
          <img src={value} alt="" className="h-48 w-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button" variant="destructive"
              onClick={() => onChange("")}
            >
              Supprimer l'image
            </Button>
          </div>
        </div>
      ) : (
        <label className={cn(
          "flex h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/70 bg-background/40 text-sm text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5",
          uploading && "pointer-events-none opacity-60",
        )}>
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <ImageIcon className="h-6 w-6" />
          </div>
          <span className="font-medium text-foreground">{uploading ? "Téléversement en cours…" : "Cliquez pour importer une image"}</span>
          <span className="text-xs">PNG, JPG, WEBP jusqu'à 2 Mo</span>
          <input
            type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
          />
        </label>
      )}
    </div>
  );
}
