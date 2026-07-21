import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CodeTabs, Lang } from "@/components/developers/CodeTabs";
import { Webhook, ShieldCheck, CheckCircle, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/developers/api/webhooks")({
  component: ApiWebhooksPage,
});

const webhookSnippets: Record<Lang, string> = {
  curl: `# DolaPay envoie une requête POST à votre Webhook URL
# Header inclus pour la sécurité : x-dolapay-signature

curl -X POST https://votre-site.com/webhooks/dolapay \
  -H "x-dolapay-signature: t=1710000000,v1=ab23c4d5e6f7..." \
  -d '{
    "id": "evt_987654321",
    "type": "checkout.success",
    "created_at": "2024-03-10T12:00:00Z",
    "data": { 
      "session_id": "cs_test_123", 
      "client_reference_id": "CMD-10293",
      "amount": 5000,
      "status": "success"
    }
  }'`,
  node: `import crypto from "crypto";
import express from "express";

const app = express();
const WEBHOOK_SECRET = process.env.DOLAPAY_WEBHOOK_SECRET;

app.post("/webhooks/dolapay", express.raw({ type: "application/json" }), (req, res) => {
  const signatureHeader = req.headers["x-dolapay-signature"];
  const payload = req.body.toString();
  
  // 1. Extraire le timestamp et la signature du header
  // x-dolapay-signature ressemble à : t=1710000000,v1=ab23c4d...
  const parts = signatureHeader.split(',');
  const timestamp = parts.find(p => p.startsWith('t=')).split('=')[1];
  const signature = parts.find(p => p.startsWith('v1=')).split('=')[1];
  
  // 2. Recréer la chaîne à signer : "timestamp.payload"
  const signedPayload = \`\${timestamp}.\${payload}\`;
  
  // 3. Calculer le HMAC SHA-256 avec votre Webhook Secret
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(signedPayload)
    .digest('hex');
    
  // 4. Comparer les signatures de manière sécurisée
  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    const event = JSON.parse(payload);
    
    // Traiter l'événement
    if (event.type === "checkout.success") {
      console.log("Paiement validé :", event.data.client_reference_id);
      // Mettre à jour la base de données...
    }
    
    // Il est très important de répondre avec un 200 OK rapidement
    res.status(200).send("Webhook reçu");
  } else {
    res.status(401).send("Signature invalide");
  }
});`,
};

function ApiWebhooksPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Webhook className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">
          Webhooks & Callbacks
        </h1>
      </div>
      
      <p className="text-lg text-navy/60 leading-relaxed mb-6 mt-4">
        Les paiements Mobile Money sont par nature asynchrones. L'utilisateur peut mettre plusieurs minutes avant de saisir son code PIN. Pour automatiser vos processus (livraison, facturation), vous devez écouter nos Webhooks.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-navy tracking-tight mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-500" /> 
          Événements supportés
        </h2>
        <div className="grid gap-4 mt-6">
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <code className="text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded font-bold text-sm">checkout.success</code>
            </div>
            <p className="text-navy/70 leading-relaxed">
              Cet événement est déclenché dès que le client valide le paiement sur son téléphone et que les fonds sont sécurisés par DolaPay. C'est le signal pour vous de valider la commande ou de livrer le service.
            </p>
          </div>
          
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <code className="text-red-600 bg-red-500/10 px-2 py-1 rounded font-bold text-sm">checkout.failed</code>
            </div>
            <p className="text-navy/70 leading-relaxed">
              Déclenché si le paiement échoue. Les raisons peuvent être multiples : fonds insuffisants, annulation par le client sur son téléphone, ou expiration du délai d'attente (timeout).
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 pt-8 border-t border-border">
        <h2 className="text-2xl font-semibold text-navy tracking-tight mb-4 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Sécuriser vos endpoints (Vérification HMAC)
        </h2>
        <p className="text-navy/80 leading-relaxed mb-6">
          Comme votre URL de Webhook sera publiquement accessible sur Internet, vous devez vous assurer que seules les requêtes provenant de DolaPay sont traitées. Pour cela, nous signons chaque webhook envoyé avec un système <strong>HMAC SHA-256</strong>.
        </p>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8">
          <h4 className="font-bold text-navy mb-2">Où trouver ma clé secrète de Webhook ?</h4>
          <p className="text-sm text-navy/70">
            La clé de signature des Webhooks est différente de votre clé d'API secrète. Vous pouvez la trouver dans votre <strong>Tableau de bord {'>'} Développeurs {'>'} Webhooks</strong>.
          </p>
        </div>

        <h3 className="text-lg font-semibold text-navy mt-8 mb-4">Structure du Header de Signature</h3>
        <p className="text-navy/80 leading-relaxed mb-4">
          L'en-tête HTTP <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm">x-dolapay-signature</code> contient le timestamp de l'événement et la signature calculée, séparés par une virgule.
        </p>
        <div className="bg-muted p-4 rounded-xl border border-border font-mono text-sm text-navy mb-8">
          x-dolapay-signature: t=1710000000,v1=ab23c4d5e6f7...
        </div>

        <CodeTabs snippets={webhookSnippets} />
      </section>
      
      <section className="mt-12 pt-8 border-t border-border">
        <h2 className="text-2xl font-semibold text-navy tracking-tight mb-4">Politique de Retry</h2>
        <p className="text-navy/80 leading-relaxed">
          Si votre serveur ne répond pas avec un statut HTTP <code>200 OK</code> ou s'il est indisponible, DolaPay tentera de renvoyer le webhook plusieurs fois avec un back-off exponentiel pour garantir la livraison.
        </p>
        <div className="flex gap-2 mt-4 text-sm font-mono text-primary font-bold">
          <span className="bg-primary/10 px-2 py-1 rounded">Immédiat</span> → 
          <span className="bg-primary/10 px-2 py-1 rounded">5 min</span> → 
          <span className="bg-primary/10 px-2 py-1 rounded">30 min</span> → 
          <span className="bg-primary/10 px-2 py-1 rounded">2 heures</span> → 
          <span className="bg-primary/10 px-2 py-1 rounded">12 heures</span>
        </div>
      </section>
    </motion.div>
  );
}
