import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/developers/api")({ component: DocsPage });
import { useState } from "react";
import { motion } from "framer-motion";
import { Book, Zap, Webhook, ShieldCheck, Code2, Terminal, Copy, Check } from "lucide-react";
import PageShell from "@/components/site/page-shell";

type Lang = "curl" | "node";

const nav = [
  { id: "intro", label: "Introduction", icon: Book },
  { id: "auth", label: "Authentification", icon: ShieldCheck },
  { id: "payin", label: "Encaisser (Pay-in)", icon: Zap },
  { id: "payout", label: "Décaisser (Pay-out)", icon: Zap },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "errors", label: "Erreurs & retry", icon: Terminal },
];

const snippets: Record<string, Record<Lang, string>> = {
  payin: {
    curl: `curl https://api.dola-pay.com/v1/charges \\
  -H "Authorization: Bearer $DOLA_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 25000,
    "currency": "XOF",
    "channel": "orange_money",
    "customer": { "phone": "+2250700000000" },
    "webhook": "https://mon-shop.com/hooks/dola"
  }'`,
    node: `import DolaPay from "dolapay";
const dola = new DolaPay(process.env.DOLA_SECRET_KEY);

const charge = await dola.charges.create({
  amount: 25000,           // FCFA
  currency: "XOF",
  channel: "orange_money", // mtn, wave, moov, mpesa...
  customer: { phone: "+2250700000000" },
  webhook: "https://mon-shop.com/hooks/dola",
});

console.log(charge.id, charge.status);`,
  },
  payout: {
    curl: `curl https://api.dola-pay.com/v1/payouts \\
  -H "Authorization: Bearer $DOLA_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 50000,
    "currency": "XOF",
    "channel": "wave",
    "recipient": { "phone": "+2250700000000", "name": "Aïssatou K." }
  }'`,
    node: `const payout = await dola.payouts.create({
  amount: 50000,
  currency: "XOF",
  channel: "wave",
  recipient: { phone: "+2250700000000", name: "Aïssatou K." },
});

// Bulk : envoyez jusqu'à 10 000 payouts par requête
await dola.payouts.createBulk([/* ... */]);`,
  },
  webhooks: {
    curl: `# DolaPay signe chaque webhook avec HMAC SHA-256
# Header : X-Dola-Signature: t=1710000000,v1=abc...

curl https://mon-shop.com/hooks/dola \\
  -X POST \\
  -H "X-Dola-Signature: t=1710000000,v1=<hmac>" \\
  -d '{ "event": "charge.succeeded", "data": { ... } }'`,
    node: `import { verifyWebhook } from "dolapay";

app.post("/hooks/dola", (req, res) => {
  const event = verifyWebhook(
    req.rawBody,
    req.headers["x-dola-signature"],
    process.env.DOLA_WEBHOOK_SECRET
  );

  switch (event.type) {
    case "charge.succeeded":
      // Marquez la commande comme payée
      break;
    case "payout.completed":
      // Notifiez le destinataire
      break;
  }
  res.sendStatus(200);
});`,
  },
};

const CodeBlock = ({ code, lang }: { code: string; lang: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="rounded-2xl bg-[#050B24] border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
        <span className="text-xs text-white/50 font-mono">{lang}</span>
        <button onClick={copy} className="text-xs text-white/60 hover:text-white flex items-center gap-1.5">
          {copied ? <><Check className="h-3.5 w-3.5" /> Copié</> : <><Copy className="h-3.5 w-3.5" /> Copier</>}
        </button>
      </div>
      <pre className="p-5 text-[13px] leading-relaxed font-mono text-white/85 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const CodeTabs = ({ id }: { id: string }) => {
  const [lang, setLang] = useState<Lang>("node");
  const s = snippets[id];
  if (!s) return null;
  return (
    <div className="mt-6">
      <div className="flex gap-1 mb-2 text-xs">
        {(["node", "curl"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${lang === l ? "bg-navy text-white" : "text-navy/60 hover:bg-navy/5"}`}
          >
            {l === "node" ? "Node.js" : "cURL"}
          </button>
        ))}
      </div>
      <CodeBlock code={s[lang]} lang={lang === "node" ? "pay.ts" : "shell"} />
    </div>
  );
};

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-32 pt-12 first:pt-0">
    <h2 className="text-2xl md:text-3xl font-semibold text-navy tracking-tight">{title}</h2>
    <div className="mt-4 text-navy/70 leading-relaxed space-y-4">{children}</div>
  </section>
);

const DocsPage = () => (
  <PageShell
    title="Documentation API DolaPay — Guide développeurs"
    description="Documentation complète de l'API DolaPay : authentification, encaissements Mobile Money, décaissements en masse, webhooks signés, gestion des erreurs."
    canonicalUrl="/developers/api"
  >
    <div className="mx-auto max-w-7xl px-4 md:px-6 pt-28 md:pt-36 pb-12 md:pb-16">
      <div className="grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-border bg-white p-4">
            <div className="text-xs uppercase tracking-wider text-navy/40 px-3 mb-2">Documentation</div>
            <nav className="space-y-0.5">
              {nav.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-navy/70 hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-4 rounded-2xl bg-navy text-white p-5">
            <Code2 className="h-5 w-5 text-electric-glow" />
            <div className="mt-3 text-sm font-semibold">Sandbox illimité</div>
            <div className="mt-1 text-xs text-white/60">Testez avec de faux opérateurs, aucune carte requise.</div>
          </div>
        </aside>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary uppercase">
            <Book className="h-3.5 w-3.5" /> Docs · v1
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-navy tracking-tight">
            API DolaPay
          </h1>
          <p className="mt-4 text-lg text-navy/60">
            RESTful, JSON, HTTPS. Base URL : <code className="text-primary bg-primary/5 rounded px-1.5 py-0.5 text-sm">https://api.dola-pay.com/v1</code>
          </p>

          <Section id="intro" title="Introduction">
            <p>
              L'API DolaPay vous permet d'encaisser et de décaisser en Mobile Money et par carte bancaire dans <strong>12 économies africaines</strong> — 🇨🇮 🇸🇳 🇲🇱 🇧🇫 🇧🇯 🇹🇬 🇨🇲 🇬🇦 🇳🇬 🇬🇭 🇰🇪 🇨🇩 — via un seul endpoint.
            </p>
            <p>
              Tous les endpoints acceptent et retournent du JSON. Les montants sont exprimés en unités entières de la devise locale (FCFA sans décimales).
            </p>
          </Section>

          <Section id="auth" title="Authentification">
            <p>
              Authentifiez chaque requête avec votre clé secrète en en-tête <code className="text-primary bg-primary/5 rounded px-1.5 py-0.5 text-sm">Authorization: Bearer sk_live_...</code>. Ne l'exposez jamais côté client.
            </p>
            <CodeBlock lang="shell" code={`curl https://api.dola-pay.com/v1/charges \\
  -H "Authorization: Bearer sk_live_xxx"`} />
          </Section>

          <Section id="payin" title="Encaisser (Pay-in)">
            <p>
              Créez une charge pour déclencher une demande de paiement Mobile Money (STK Push) ou carte. Le client reçoit une notification sur son téléphone et confirme avec son code PIN.
            </p>
            <p>
              Canaux supportés : <code className="text-primary bg-primary/5 rounded px-1 py-0.5">orange_money</code>, <code className="text-primary bg-primary/5 rounded px-1 py-0.5">mtn</code>, <code className="text-primary bg-primary/5 rounded px-1 py-0.5">wave</code>, <code className="text-primary bg-primary/5 rounded px-1 py-0.5">moov</code>, <code className="text-primary bg-primary/5 rounded px-1 py-0.5">mpesa</code>, <code className="text-primary bg-primary/5 rounded px-1 py-0.5">card</code>.
            </p>
            <CodeTabs id="payin" />
          </Section>

          <Section id="payout" title="Décaisser (Pay-out)">
            <p>
              Envoyez de l'argent vers n'importe quel portefeuille Mobile Money ou compte bancaire. Les payouts sont instantanés (moyenne 3,2 s) et disponibles 24/7.
            </p>
            <CodeTabs id="payout" />
          </Section>

          <Section id="webhooks" title="Webhooks">
            <p>
              DolaPay envoie un webhook signé HMAC-SHA256 pour chaque évènement (<code className="text-primary bg-primary/5 rounded px-1 py-0.5">charge.succeeded</code>, <code className="text-primary bg-primary/5 rounded px-1 py-0.5">payout.completed</code>, etc.). Vérifiez toujours la signature avant de traiter l'évènement.
            </p>
            <p>Politique de retry : 5 tentatives avec back-off exponentiel (1 min, 5 min, 30 min, 2 h, 12 h).</p>
            <CodeTabs id="webhooks" />
          </Section>

          <Section id="errors" title="Erreurs & retry">
            <p>
              L'API retourne des codes HTTP standards. Les erreurs 5xx sont retryables (idempotency-key recommandé) ; les erreurs 4xx signalent un problème avec la requête.
            </p>
            <div className="rounded-2xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["200", "Succès"],
                    ["400", "Requête invalide"],
                    ["401", "Clé API manquante ou invalide"],
                    ["402", "Solde insuffisant sur le compte marchand"],
                    ["429", "Rate limit atteint"],
                    ["500", "Erreur serveur — retry avec back-off"],
                  ].map(([code, label]) => (
                    <tr key={code} className="border-b border-border last:border-0">
                      <td className="p-3 font-mono text-primary w-24">{code}</td>
                      <td className="p-3 text-navy/70">{label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </motion.article>
      </div>
    </div>
  </PageShell>
);



