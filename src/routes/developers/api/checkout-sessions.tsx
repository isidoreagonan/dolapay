import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CodeTabs, Lang } from "@/components/developers/CodeTabs";
import { Globe } from "lucide-react";

export const Route = createFileRoute("/developers/api/checkout-sessions")({
  component: ApiSessionsPage,
});

const sessionsSnippets: Record<Lang, string> = {
  curl: `curl -X POST https://api.dola-pay.com/v1/checkout/sessions \
  -H "Authorization: Bearer sk_live_votre_cle_secrete" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "XOF",
    "success_url": "https://votre-site.com/success?session_id={CHECKOUT_SESSION_ID}",
    "cancel_url": "https://votre-site.com/cancel",
    "client_reference_id": "CMD-10293",
    "customer_name": "Jean Dupont",
    "customer_email": "jean.dupont@email.com"
  }'`,
  node: `const response = await fetch("https://api.dola-pay.com/v1/checkout/sessions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_live_votre_cle_secrete",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    amount: 5000,
    currency: "XOF",
    success_url: "https://votre-site.com/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://votre-site.com/cancel",
    client_reference_id: "CMD-10293",
    customer_name: "Jean Dupont",
    customer_email: "jean.dupont@email.com"
  })
});
const { data } = await response.json();
console.log(data.url); // Redirigez l'utilisateur vers cette URL pour payer`,
};

function ApiSessionsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Globe className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">
          Checkout Sessions
        </h1>
      </div>
      
      <p className="text-lg text-navy/60 leading-relaxed mb-10 mt-4">
        La méthode de paiement la plus simple et sécurisée. Redirigez votre client vers la page de paiement hébergée par DolaPay. Parfait pour les sites E-commerce.
      </p>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-navy tracking-tight mb-4">Comment ça marche ?</h2>
        <div className="grid sm:grid-cols-3 gap-6 mt-6">
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-[100%] transition-transform group-hover:scale-125" />
            <div className="text-4xl font-black text-primary/20 mb-2">1</div>
            <div className="font-bold text-navy mb-2 text-base relative z-10">Création (API)</div>
            <div className="text-sm text-navy/70 leading-relaxed relative z-10">Faites un appel API <code>POST</code> depuis votre backend sécurisé pour créer une session avec le montant de la commande.</div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-[100%] transition-transform group-hover:scale-125" />
            <div className="text-4xl font-black text-blue-500/20 mb-2">2</div>
            <div className="font-bold text-navy mb-2 text-base relative z-10">Redirection (Client)</div>
            <div className="text-sm text-navy/70 leading-relaxed relative z-10">L'API vous renvoie une URL unique (<code>data.url</code>). Redirigez le navigateur de votre client vers ce lien. DolaPay s'occupe de la page de paiement.</div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-[100%] transition-transform group-hover:scale-125" />
            <div className="text-4xl font-black text-emerald-500/20 mb-2">3</div>
            <div className="font-bold text-navy mb-2 text-base relative z-10">Confirmation (Webhook)</div>
            <div className="text-sm text-navy/70 leading-relaxed relative z-10">Le client paie. Il est redirigé vers votre <code>success_url</code>. Vous recevez un webhook sécurisé pour valider la commande dans votre base.</div>
          </div>
        </div>
      </section>

      <section className="mt-12 pt-8 border-t border-border">
        <h2 className="text-2xl font-semibold text-navy tracking-tight mb-4">Créer une Checkout Session</h2>
        <div className="flex items-center gap-3 bg-muted p-4 rounded-xl border border-border mb-6">
          <span className="text-emerald-600 font-bold bg-emerald-500/10 px-2 py-1 rounded text-sm">POST</span>
          <code className="text-navy font-mono text-[15px]">/api/v1/checkout/sessions</code>
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
                <td className="p-4 text-navy/70">Le montant à facturer au client (ex: <code className="text-xs bg-muted px-1 py-0.5 rounded">5000</code>). Toujours en entier (sans décimales). <strong>Minimum 100 FCFA.</strong></td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-primary font-bold">currency <span className="text-red-500">*</span></td>
                <td className="p-4 text-navy/70">La devise de la transaction. Actuellement, seul <code className="text-xs bg-muted px-1 py-0.5 rounded">XOF</code> est supporté pour l'UEMOA.</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-primary font-bold">success_url <span className="text-red-500">*</span></td>
                <td className="p-4 text-navy/70">
                  L'URL où rediriger le client après un paiement réussi. 
                  Vous pouvez inclure <code>{'{CHECKOUT_SESSION_ID}'}</code> dans l'URL ; DolaPay le remplacera par le vrai ID.
                </td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-primary font-bold">cancel_url <span className="text-red-500">*</span></td>
                <td className="p-4 text-navy/70">L'URL où rediriger le client s'il clique sur "Annuler" sur la page de paiement.</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-navy font-bold">client_reference_id</td>
                <td className="p-4 text-navy/70">Une référence unique de votre système (ex: ID de Commande). Ce champ vous sera renvoyé tel quel dans les webhooks pour faire la correspondance.</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="p-4 font-mono text-navy font-bold">customer_email</td>
                <td className="p-4 text-navy/70">L'email du client, utilisé pour préremplir le formulaire ou envoyer un reçu (Optionnel).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeTabs snippets={sessionsSnippets} />
      </section>
    </motion.div>
  );
}
