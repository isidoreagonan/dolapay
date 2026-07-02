import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, MessageSquare, Building2, Shield, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { LEGAL_ENTITY, LEGAL_ENTITY_ADDRESS_LINE } from "@/lib/legal-entity";
import { toast } from "sonner";

export const Route = createFileRoute("/company/contact")({
  head: () => ({
    meta: [
      { title: "Contact — DolaPay" },
      {
        name: "description",
        content:
          "Parlez à l'équipe DolaPay : ventes, support marchand, conformité ou partenariats. Réponse sous 24h ouvrées.",
      },
      { property: "og:title", content: "Contact — DolaPay" },
      {
        property: "og:description",
        content: "Parlez à l'équipe DolaPay : ventes, support, conformité ou partenariats.",
      },
    ],
  }),
  component: ContactPage,
});

const CHANNELS = [
  {
    icon: MessageSquare,
    label: "Ventes & Démos",
    desc: "Discutez avec un expert paiements pour estimer vos volumes et choisir vos canaux.",
    email: "sales@dola-pay.com",
  },
  {
    icon: Building2,
    label: "Support Marchand",
    desc: "Une question sur votre intégration, vos décaissements ou vos transactions.",
    email: "support@dola-pay.com",
  },
  {
    icon: Shield,
    label: "Conformité & KYC",
    desc: "Documents, vérification d'identité, AML/CFT et réclamations réglementaires.",
    email: "compliance@dola-pay.com",
  },
];

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    topic: "Ventes",
    message: "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Lightweight mailto fallback — keeps the UX honest while a real inbox is wired.
    const subject = encodeURIComponent(`[${form.topic}] ${form.name} — ${form.company || "DolaPay"}`);
    const body = encodeURIComponent(
      `Nom: ${form.name}\nEmail: ${form.email}\nEntreprise: ${form.company}\nSujet: ${form.topic}\n\n${form.message}`,
    );
    window.location.href = `mailto:hello@dola-pay.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success("Votre client mail s'ouvre — finalisez l'envoi à hello@dola-pay.com");
    }, 400);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:pt-40">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur">
              <Mail className="h-3.5 w-3.5" /> Contact
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Parlons de votre projet de paiement
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Une équipe basée entre l'Afrique de l'Ouest et les États-Unis, qui répond sous 24h ouvrées.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {CHANNELS.map((c, i) => (
            <Reveal key={c.label} delay={i * 80}>
              <a
                href={`mailto:${c.email}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-elegant transition-all hover:-translate-y-0.5 hover:border-primary/60"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{c.label}</h3>
                <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{c.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:underline">
                  {c.email}
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-border bg-card p-6 shadow-elegant sm:p-8"
            >
              <h2 className="text-xl font-semibold text-foreground">Écrivez-nous</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tous les champs sont requis. Nous reviendrons vers vous très vite.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Nom complet">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none"
                    placeholder="Awa Diallo"
                  />
                </Field>
                <Field label="Email professionnel">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none"
                    placeholder="awa@entreprise.com"
                  />
                </Field>
                <Field label="Entreprise">
                  <input
                    required
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none"
                    placeholder="Votre société"
                  />
                </Field>
                <Field label="Sujet">
                  <select
                    value={form.topic}
                    onChange={(e) => update("topic", e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none"
                  >
                    <option>Ventes</option>
                    <option>Support technique</option>
                    <option>Conformité / KYC</option>
                    <option>Partenariat</option>
                    <option>Presse</option>
                  </select>
                </Field>
              </div>

              <Field label="Message" className="mt-4">
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none resize-none"
                  placeholder="Volumes prévus, pays cibles, calendrier… plus c'est précis, mieux on répond."
                />
              </Field>

              <button
                type="submit"
                disabled={loading || sent}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.01] hover:bg-primary-glow disabled:opacity-70 sm:w-auto"
              >
                {sent ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Message prêt à envoyer
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Préparation…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Envoyer le message
                  </>
                )}
              </button>
              <p className="mt-3 text-xs text-muted-foreground">
                En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
              </p>
            </form>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-2">
            <div className="flex h-full flex-col gap-4 rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-card p-6 shadow-elegant sm:p-8">
              <h3 className="text-lg font-semibold text-foreground">Siège social</h3>
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/60 p-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="text-sm">
                  <div className="font-semibold text-foreground">{LEGAL_ENTITY.name}</div>
                  <div className="mt-1 text-muted-foreground">{LEGAL_ENTITY_ADDRESS_LINE}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Horaires support
                </div>
                <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                  <li className="flex justify-between">
                    <span>Lundi — Vendredi</span>
                    <span className="text-muted-foreground">08:00 — 20:00 GMT</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Samedi</span>
                    <span className="text-muted-foreground">09:00 — 14:00 GMT</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="text-muted-foreground">Sur incident</span>
                  </li>
                </ul>
              </div>

              <div className="mt-auto rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
                <div className="font-semibold">Urgence opérationnelle ?</div>
                <p className="mt-1 text-muted-foreground">
                  Marchands actifs : écrivez à{" "}
                  <a href="mailto:oncall@dola-pay.com" className="font-semibold text-primary hover:underline">
                    oncall@dola-pay.com
                  </a>{" "}
                  avec votre identifiant <code className="rounded bg-card px-1 py-0.5 text-xs">acc_…</code>.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold text-foreground/80">{label}</span>
      {children}
    </label>
  );
}
