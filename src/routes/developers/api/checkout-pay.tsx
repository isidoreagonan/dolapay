import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CodeTabs, Lang } from "@/components/developers/CodeTabs";
import { Zap, AlertCircle, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/developers/api/checkout-pay")({
  component: ApiCheckoutPayPage,
});

const paySnippets: Record<Lang, string> = {
  curl: `curl -X POST https://api.dola-pay.com/v1/charges \\
  -H "Authorization: Bearer sk_live_votre_cle_secrete" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 2500,
    "currency": "XOF",
    "provider": "Orange",
    "customer_phone": "22900000000",
    "description": "Paiement de la facture #001"
  }'`,
  node: `const response = await fetch("https://api.dola-pay.com/v1/charges", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_live_votre_cle_secrete",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    amount: 2500,
    currency: "XOF",
    provider: "Orange",
    customer_phone: "22900000000",
    description: "Paiement de la facture #001"
  })
});
const data = await response.json();

if (data.status === "redirect") {
  // Rediriger le client vers l'URL de paiement générée
  console.log("Redirection vers:", data.redirect_url);
} else {
  console.log("Statut:", data.status); // "pending"
}`,
};

function ApiCheckoutPayPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Zap className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">
          Paiement API Direct (Charges)
        </h1>
      </div>
      
      <p className="text-lg text-navy/60 leading-relaxed mb-6 mt-4">
        Déclenchez directement un paiement depuis votre backend en utilisant l'API <strong>Charges</strong>. Cette API s'adapte automatiquement au pays cible : elle initie un prompt USSD direct (sans redirection) ou renvoie une URL de redirection (pour des pays spécifiques comme le Burkina Faso).
      </p>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 text-sm text-blue-900 mb-6 flex gap-4 shadow-sm">
        <ExternalLink className="h-6 w-6 shrink-0 text-blue-600" />
        <div>
          <h4 className="font-bold mb-1">Attention aux Redirections (Cas du Burkina Faso)</h4>
          <p className="leading-relaxed text-blue-900/80 mb-2">
            La majorité des pays (Bénin, Côte d'Ivoire, Sénégal...) supportent le <strong>USSD Push (sans redirection)</strong>. L'API retourne <code className="bg-blue-500/20 px-1 py-0.5 rounded font-mono">status: "pending"</code> et le client reçoit immédiatement le prompt de validation sur son téléphone.
          </p>
          <p className="leading-relaxed text-blue-900/80">
            Cependant, pour le <strong>Burkina Faso (+226)</strong>, la réglementation exige un portail de paiement. L'API retourne alors <code className="bg-blue-500/20 px-1 py-0.5 rounded font-mono">status: "redirect"</code> avec une <code className="bg-blue-500/20 px-1 py-0.5 rounded font-mono">redirect_url</code>. Vous <strong>devez</strong> rediriger le navigateur de votre client vers cette URL pour qu'il puisse finaliser son paiement.
          </p>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-sm text-amber-900 mb-10 flex gap-4 shadow-sm">
        <AlertCircle className="h-6 w-6 shrink-0 text-amber-600" />
        <div>
          <h4 className="font-bold mb-1">Processus Asynchrone</h4>
          <p className="leading-relaxed text-amber-900/80">
            Que la transaction soit "pending" ou "redirect", le statut final du paiement est <strong>asynchrone</strong>. Vous devez obligatoirement écouter les Webhooks DolaPay (<code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono">transaction.success</code>) pour valider la commande de votre côté. Ne vous fiez jamais uniquement au retour du client sur votre site.
          </p>
        </div>
      </div>

      <section className="mt-8 pt-8 border-t border-border">
        <h2 className="text-2xl font-semibold text-navy tracking-tight mb-4">Initier un Paiement</h2>
        <div className="flex items-center gap-3 bg-muted p-4 rounded-xl border border-border mb-6">
          <span className="text-emerald-600 font-bold bg-emerald-500/10 px-2 py-1 rounded text-sm">POST</span>
          <code className="text-navy font-mono text-[15px]">/api/v1/charges</code>
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
                <td className="p-4 text-navy/70">Le montant entier à facturer (ex: <code className="text-xs bg-muted px-1 py-0.5 rounded">2500</code>).</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-primary font-bold">currency <span className="text-red-500">*</span></td>
                <td className="p-4 text-navy/70">La devise. Valeurs supportées: <code className="text-xs font-bold text-primary">XOF</code>, <code className="text-xs font-bold text-primary">XAF</code>.</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-primary font-bold">customer_phone <span className="text-red-500">*</span></td>
                <td className="p-4 text-navy/70">Le numéro de téléphone du client, avec l'indicatif (ex: <code className="text-xs bg-muted px-1 py-0.5 rounded">22900000000</code>). L'indicatif détermine automatiquement le pays de destination.</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-primary font-bold">provider <span className="text-red-500">*</span></td>
                <td className="p-4 text-navy/70">
                  L'opérateur mobile ciblé. Exemples: <code className="text-xs font-bold text-primary">Orange</code>, <code className="text-xs font-bold text-primary">MTN</code>, <code className="text-xs font-bold text-primary">MOOV</code>, <code className="text-xs font-bold text-primary">Airtel</code>, <code className="text-xs font-bold text-primary">Free</code>.
                </td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-navy font-bold">description</td>
                <td className="p-4 text-navy/70">La description du paiement qui s'affichera chez le client ou dans votre tableau de bord.</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-navy font-bold">metadata</td>
                <td className="p-4 text-navy/70">Un objet JSON optionnel pour stocker vos références internes (ex: numéro de commande, ID client). Il sera renvoyé dans le Webhook.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeTabs snippets={paySnippets} />
      </section>
    </motion.div>
  );
}
