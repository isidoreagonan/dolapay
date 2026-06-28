import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Loader2, Shield, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import logoFull from "@/assets/dolapay-logo.png.asset.json";

export const Route = createFileRoute("/pay/$slug")({
  component: PayPage,
  head: ({ params }) => ({
    meta: [
      { title: `Paiement · DolaPay` },
      { name: "description", content: `Réglez en toute sécurité via DolaPay (${params.slug}).` },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type Link = {
  id: string; title: string; amount: number; currency: string; active: boolean;
  description: string | null; image_url: string | null; invoice_number: string | null;
  thank_you_message: string | null; fees_paid_by: "merchant" | "customer";
};
type TxStatus = "pending" | "success" | "failed";

const PROVIDERS = ["MTN", "MOOV", "Orange", "Wave", "Airtel", "M-PESA"];

function PayPage() {
  const { slug } = Route.useParams();

  const { data: link, isLoading, error } = useQuery({
    queryKey: ["public-link", slug],
    queryFn: async (): Promise<Link> => {
      const { data, error } = await supabase
        .from("payment_links")
        .select("id,title,amount,currency,active,description,image_url,invoice_number,thank_you_message,fees_paid_by")
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data as Link;
    },
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("MTN");
  const [txId, setTxId] = useState<string | null>(null);
  const [status, setStatus] = useState<TxStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [idemKey] = useState(() => crypto.randomUUID());
  const [redirectUrls, setRedirectUrls] = useState<{ success_url?: string | null; failure_url?: string | null }>({});
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);


  // Status polling via public server endpoint (no anon DB exposure)
  useEffect(() => {
    if (!txId) return;
    let cancelled = false;
    const poll = setInterval(async () => {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/public/tx-status/${txId}`, { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as { status?: TxStatus };
        if (json?.status) setStatus(json.status);
      } catch {
        /* ignore transient errors */
      }
    }, 2000);
    return () => {
      cancelled = true;
      clearInterval(poll);
    };
  }, [txId]);


  useEffect(() => {
    if (status === "success" || status === "failed") setSubmitting(false);
  }, [status]);

  // Auto-redirect after success/failed if URL configured (5s countdown, status remains visible)
  useEffect(() => {
    if (status !== "success" && status !== "failed") return;
    const url = status === "success" ? redirectUrls.success_url : redirectUrls.failure_url;
    if (!url) return;
    setRedirectCountdown(5);
    const t = setInterval(() => {
      setRedirectCountdown((c) => {
        if (c === null) return null;
        if (c <= 1) { clearInterval(t); window.location.href = url; return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [status, redirectUrls]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) {
      toast.error("Renseignez votre nom et téléphone");
      return;
    }
    setSubmitting(true);
    setStatus("pending");
    try {
      const res = await fetch(`/api/public/pay/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idemKey },
        body: JSON.stringify({ customer_name: name, customer_phone: phone, provider }),
      });
      const body = (await res.json()) as { transaction_id?: string; status?: TxStatus; success_url?: string | null; failure_url?: string | null; error?: string };
      if (res.status === 429) { toast.error("Trop de tentatives. Patientez un instant."); setStatus(null); setSubmitting(false); return; }
      if (!res.ok || !body.transaction_id) {
        toast.error(body.error ?? "Échec");
        setStatus(null);
        setSubmitting(false);
        return;
      }
      setRedirectUrls({ success_url: body.success_url, failure_url: body.failure_url });
      setTxId(body.transaction_id);
      if (body.status) setStatus(body.status);
    } catch {
      toast.error("Erreur réseau");
      setStatus(null);
      setSubmitting(false);
    }
  }


  if (isLoading) {
    return <CenteredCard><Loader2 className="h-6 w-6 animate-spin text-primary" /></CenteredCard>;
  }
  if (error || !link) {
    return (
      <CenteredCard>
        <XCircle className="h-12 w-12 text-rose-500" />
        <h1 className="mt-4 text-xl font-bold">Lien introuvable</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ce lien de paiement n'existe pas ou n'est plus actif.</p>
      </CenteredCard>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center justify-center">
          <img src={logoFull.url} alt="DolaPay" className="h-8" />
        </div>

        <Card className="overflow-hidden border-white/10 backdrop-blur-2xl">
          {link.image_url && (
            <div className="relative h-40 w-full overflow-hidden">
              <img src={link.image_url} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
            </div>
          )}
          <div className="bg-primary p-6 text-primary-foreground">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider opacity-80">
              <span>Vous payez</span>
              {link.invoice_number && <span className="font-mono">#{link.invoice_number}</span>}
            </div>
            <div className="mt-1 text-lg font-semibold">{link.title}</div>
            {link.description && <p className="mt-1 text-sm opacity-80">{link.description}</p>}
            <div className="mt-4 text-4xl font-bold tracking-tight">
              {fmt(link.amount)} <span className="text-xl opacity-80">{link.currency}</span>
            </div>
            {link.fees_paid_by === "customer" && (
              <div className="mt-2 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold">
                Frais de transaction inclus
              </div>
            )}
          </div>

          <div className="p-6">
            {!txId && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
                </div>
                <div>
                  <Label htmlFor="phone">Numéro Mobile Money</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={20} placeholder="+229 ..." />
                </div>
                <div>
                  <Label>Opérateur</Label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    {PROVIDERS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setProvider(p)}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
                          provider === p
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:bg-accent",
                        )}
                      >
                        <Smartphone className="mx-auto mb-1 h-4 w-4" />
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Payer {fmt(link.amount)} {link.currency}
                </Button>
              </form>
            )}

            {txId && <StatusView status={status ?? "pending"} amount={link.amount} currency={link.currency} countdown={redirectCountdown} thankYou={link.thank_you_message} />}
          </div>

          <div className="flex items-center justify-center gap-2 border-t border-border bg-muted/30 px-6 py-3 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" /> Paiement sécurisé par DolaPay
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatusView({ status, amount, currency, countdown, thankYou }: { status: TxStatus; amount: number; currency: string; countdown: number | null; thankYou: string | null }) {
  if (status === "pending") {
    return (
      <div className="py-8 text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <h2 className="mt-4 text-lg font-bold">Paiement en cours…</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirmez la demande sur votre téléphone pour finaliser le paiement.
        </p>
      </div>
    );
  }
  if (status === "success") {
    return (
      <div className="py-8 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
        <h2 className="mt-4 text-lg font-bold">Paiement réussi</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Votre paiement de <span className="font-semibold">{fmt(amount)} {currency}</span> a été reçu.
        </p>
        {thankYou && (
          <div className="mx-auto mt-4 max-w-xs rounded-2xl border border-emerald-200/40 bg-emerald-50/60 p-3 text-sm text-emerald-900 dark:bg-emerald-500/5 dark:text-emerald-200">
            {thankYou}
          </div>
        )}
        {countdown !== null && <p className="mt-3 text-xs text-muted-foreground">Redirection dans {countdown}s…</p>}
      </div>
    );
  }
  return (
    <div className="py-8 text-center">
      <XCircle className="mx-auto h-14 w-14 text-rose-500" />
      <h2 className="mt-4 text-lg font-bold">Paiement échoué</h2>
      <p className="mt-1 text-sm text-muted-foreground">Réessayez ou contactez le commerçant.</p>
      {countdown !== null && <p className="mt-3 text-xs text-muted-foreground">Redirection dans {countdown}s…</p>}
      <Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>Réessayer</Button>
    </div>
  );
}

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <Card className="flex w-full max-w-md flex-col items-center p-10 text-center">{children}</Card>
    </div>
  );
}

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}

