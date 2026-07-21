import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CodeTabs, Lang } from "@/components/developers/CodeTabs";
import { Zap, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/developers/api/checkout-pay")({
  component: ApiCheckoutPayPage,
});

const paySnippets: Record<Lang, string> = {
  curl: `curl -X POST https://api.dola-pay.com/v1/checkout/pay \
  -H "Authorization: Bearer sk_live_votre_cle_secrete" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500,
    "currency": "XOF",
    "network": "MTN",
    "country": "BJ",
    "phone_number": "22900000000",
    "client_reference_id": "INV-001"
  }'`,
  node: `const response = await fetch("https://api.dola-pay.com/v1/checkout/pay", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_live_votre_cle_secrete",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    amount: 2500,
    currency: "XOF",
    network: "MTN",
    country: "BJ",
    phone_number: "22900000000",
    client_reference_id: "INV-001"
  })
});
const { data } = await response.json();
console.log(data.status); // Statut initial: "pending"`,
};

function ApiCheckoutPayPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Zap className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">
          Direct API Payment
        </h1>
      </div>
      
      <p className="text-lg text-navy/60 leading-relaxed mb-6 mt-4">
        Déclenchez directement un prompt de paiement USSD (STK Push) sur le téléphone de votre client. Idéal si vous avez votre propre application mobile ou que vous ne voulez pas rediriger l'utilisateur en dehors de votre site.
      </p>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-sm text-amber-900 mb-10 flex gap-4 shadow-sm">
        <AlertCircle className="h-6 w-6 shrink-0 text-amber-600" />
        <div>
          <h4 className="font-bold mb-1">Processus Asynchrone</h4>
          <p className="leading-relaxed text-amber-900/80">
            Contrairement à un paiement par carte bancaire, le Mobile Money est asynchrone. L'appel à l'API retournera presque immédiatement un statut <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono">pending</code>. Le paiement ne sera finalisé que lorsque le client aura saisi son code PIN sur son téléphone. <strong>Vous devez obligatoirement utiliser les Webhooks pour confirmer le paiement.</strong>
          </p>
        </div>
      </div>

      <section className="mt-8 pt-8 border-t border-border">
        <h2 className="text-2xl font-semibold text-navy tracking-tight mb-4">Déclencher un Paiement</h2>
        <div className="flex items-center gap-3 bg-muted p-4 rounded-xl border border-border mb-6">
          <span className="text-emerald-600 font-bold bg-emerald-500/10 px-2 py-1 rounded text-sm">POST</span>
          <code className="text-navy font-mono text-[15px]">/api/v1/checkout/pay</code>
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
                <td className="p-4 text-navy/70">Le montant à facturer au client (ex: <code className="text-xs bg-muted px-1 py-0.5 rounded">2500</code>). Toujours en entier.</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-primary font-bold">currency <span className="text-red-500">*</span></td>
                <td className="p-4 text-navy/70">La devise de la transaction. <code className="text-xs bg-muted px-1 py-0.5 rounded">XOF</code>.</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-primary font-bold">network <span className="text-red-500">*</span></td>
                <td className="p-4 text-navy/70">
                  L'opérateur mobile cible. Valeurs acceptées: <code className="text-xs font-bold text-primary">MTN</code>, <code className="text-xs font-bold text-primary">MOOV</code>, <code className="text-xs font-bold text-primary">WAVE</code>, <code className="text-xs font-bold text-primary">ORANGE</code>.
                </td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-primary font-bold">country <span className="text-red-500">*</span></td>
                <td className="p-4 text-navy/70">Le code pays ISO à deux lettres. Ex: <code className="text-xs font-bold text-primary">BJ</code> (Bénin), <code className="text-xs font-bold text-primary">CI</code> (Côte d'Ivoire).</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-primary font-bold">phone_number <span className="text-red-500">*</span></td>
                <td className="p-4 text-navy/70">Le numéro de téléphone du client qui recevra le prompt de paiement. Vous pouvez l'envoyer avec ou sans l'indicatif.</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-navy font-bold">client_reference_id</td>
                <td className="p-4 text-navy/70">Votre référence interne (ex: numéro de facture). Utile pour le rapprochement lors de la réception du Webhook.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeTabs snippets={paySnippets} />
      </section>
    </motion.div>
  );
}
