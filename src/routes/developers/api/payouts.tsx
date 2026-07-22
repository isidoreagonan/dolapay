import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CodeTabs, Lang } from "@/components/developers/CodeTabs";
import { Send, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/developers/api/payouts")({
  component: ApiPayoutsPage,
});

const payoutSnippets: Record<Lang, string> = {
  curl: `curl -X POST https://api.dola-pay.com/v1/payouts \\
  -H "Authorization: Bearer sk_live_votre_cle_secrete" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 5000,
    "currency": "XOF",
    "provider": "MTN",
    "recipient_phone": "22900000000",
    "reference": "Retrait_Commissions_Janvier"
  }'`,
  node: `const response = await fetch("https://api.dola-pay.com/v1/payouts", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_live_votre_cle_secrete",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    amount: 5000,
    currency: "XOF",
    provider: "MTN",
    recipient_phone: "22900000000",
    reference: "Retrait_Commissions_Janvier"
  })
});
const data = await response.json();
console.log(data.status); // Statut initial: "processing"`,
};

function ApiPayoutsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Send className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">
          Décaissements (Payouts)
        </h1>
      </div>
      
      <p className="text-lg text-navy/60 leading-relaxed mb-6 mt-4">
        Utilisez l'API de Décaissement pour envoyer de l'argent instantanément vers un compte Mobile Money. Parfait pour payer vos partenaires, vos livreurs, ou pour permettre à vos utilisateurs de retirer leurs gains.
      </p>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-sm text-amber-900 mb-10 flex gap-4 shadow-sm">
        <AlertCircle className="h-6 w-6 shrink-0 text-amber-600" />
        <div>
          <h4 className="font-bold mb-1">Processus Asynchrone</h4>
          <p className="leading-relaxed text-amber-900/80">
            Comme pour les paiements entrants, les décaissements sont traités de manière <strong>asynchrone</strong>. L'API retourne un statut <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono">processing</code>. Le montant (frais inclus) sera réservé sur votre solde DolaPay. Vous devez écouter les Webhooks pour savoir quand le décaissement passe en <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono">success</code> (ou s'il échoue, auquel cas les fonds vous seront restitués).
          </p>
        </div>
      </div>

      <section className="mt-8 pt-8 border-t border-border">
        <h2 className="text-2xl font-semibold text-navy tracking-tight mb-4">Initier un Décaissement</h2>
        <div className="flex items-center gap-3 bg-muted p-4 rounded-xl border border-border mb-6">
          <span className="text-emerald-600 font-bold bg-emerald-500/10 px-2 py-1 rounded text-sm">POST</span>
          <code className="text-navy font-mono text-[15px]">/api/v1/payouts</code>
        </div>
        
        <h3 className="text-lg font-semibold text-navy mt-8 mb-4">Paramètres du Body (JSON)</h3>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-navy font-semibold border-b border-border">
              <tr>
                <th className="p-4 w-1/3">Paramètre</th>
                <th className="p-4 w-2/3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-primary font-bold">amount <span className="text-red-500">*</span></td>
                <td className="p-4 text-navy/70">Le montant à envoyer (ex: <code className="text-xs bg-muted px-1 py-0.5 rounded">5000</code>). Toujours un entier strictement positif.</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-primary font-bold">currency <span className="text-red-500">*</span></td>
                <td className="p-4 text-navy/70">La devise cible. <code className="text-xs font-bold text-primary">XOF</code>, <code className="text-xs font-bold text-primary">XAF</code>. Par défaut, <code className="text-xs bg-muted px-1 py-0.5 rounded">XOF</code>.</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-primary font-bold">recipient_phone <span className="text-red-500">*</span></td>
                <td className="p-4 text-navy/70">Le numéro de téléphone du destinataire, <strong>avec l'indicatif du pays</strong> (ex: <code className="text-xs bg-muted px-1 py-0.5 rounded">22900000000</code>).</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-primary font-bold">provider <span className="text-red-500">*</span></td>
                <td className="p-4 text-navy/70">
                  L'opérateur mobile du destinataire. Exemples: <code className="text-xs font-bold text-primary">Orange</code>, <code className="text-xs font-bold text-primary">MTN</code>, <code className="text-xs font-bold text-primary">MOOV</code>, <code className="text-xs font-bold text-primary">Airtel</code>, <code className="text-xs font-bold text-primary">Free</code>. Par défaut, <code className="text-xs font-bold text-primary">Orange</code>.
                </td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-navy font-bold">reference</td>
                <td className="p-4 text-navy/70">Une référence interne optionnelle (ex: nom de votre partenaire ou motif du décaissement) pour vos réconciliations comptables.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeTabs snippets={payoutSnippets} />
      </section>
    </motion.div>
  );
}
