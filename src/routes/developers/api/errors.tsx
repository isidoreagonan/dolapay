import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CodeTabs, Lang } from "@/components/developers/CodeTabs";
import { AlertCircle, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/developers/api/errors")({
  component: ApiErrorsPage,
});

const successSnippets: Record<Lang, string> = {
  curl: `{
  "status": "success",
  "message": "Session créée avec succès",
  "data": {
    "session_id": "cs_test_123456789",
    "url": "https://pay.dola-pay.com/c/cs_test_123456789",
    "amount": 5000,
    "currency": "XOF",
    "status": "pending",
    "client_reference_id": "CMD-10293",
    "created_at": "2024-03-10T12:00:00Z"
  }
}`,
  node: `// Toutes les réponses réussies (HTTP 200/201) suivent cette structure JSON :
{
  "status": "success",
  "message": "Texte descriptif du succès",
  "data": {
    // L'objet principal (Session, Transaction, etc.)
  }
}`,
};

const errorsSnippets: Record<Lang, string> = {
  curl: `{
  "status": "error",
  "message": "Fonds insuffisants sur le portefeuille client",
  "error_code": "insufficient_funds",
  "details": {
    "provider_message": "Solde insuffisant"
  }
}`,
  node: `try {
  const response = await apiCall();
} catch (error) {
  // En cas d'erreur HTTP 400 ou 500, la réponse JSON est :
  console.log(error.response.status); // 400
  console.log(error.response.data.error_code); // "invalid_phone_number"
  console.log(error.response.data.message); // "Le numéro de téléphone est invalide."
}`,
};

function ApiErrorsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <AlertCircle className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">
          Codes & Erreurs
        </h1>
      </div>
      
      <p className="text-lg text-navy/60 leading-relaxed mb-10 mt-4">
        DolaPay utilise les codes de statut HTTP standards pour indiquer le succès ou l'échec d'une requête API. Le corps de la réponse contiendra toujours un JSON prévisible.
      </p>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-navy tracking-tight mb-4 flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-emerald-500" />
          Réponses de Succès (200 OK)
        </h2>
        <p className="text-navy/80 leading-relaxed mb-6">
          Toutes les requêtes réussies retournent un code HTTP <strong>200 OK</strong> ou <strong>201 Created</strong>. L'objet JSON retourné contient toujours les propriétés <code>status: "success"</code>, un <code>message</code> explicatif, et les données pertinentes dans l'objet <code>data</code>.
        </p>
        <CodeTabs snippets={successSnippets} />
      </section>

      <section className="mt-16 pt-8 border-t border-border">
        <h2 className="text-2xl font-semibold text-navy tracking-tight mb-4 flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-red-500" />
          Gestion des Erreurs (4xx, 5xx)
        </h2>
        <p className="text-navy/80 leading-relaxed mb-6">
          En cas d'échec de la requête, l'API retourne un code HTTP de la famille <strong>4xx</strong> (erreur client, ex: paramètre manquant) ou <strong>5xx</strong> (erreur serveur). Le corps de la réponse contiendra toujours la propriété <code>status: "error"</code> et un <code>error_code</code> technique que vous pouvez traiter dans votre code.
        </p>

        <h3 className="text-lg font-semibold text-navy mt-8 mb-4">Codes HTTP standards</h3>
        <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-navy font-semibold">
              <tr>
                <th className="p-4 border-b border-border w-32">Code HTTP</th>
                <th className="p-4 border-b border-border">Signification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-mono text-emerald-600 font-bold">200 - 201</td>
                <td className="p-4 text-navy/70 leading-relaxed"><strong>Succès.</strong> La requête a été traitée sans problème.</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-mono text-amber-600 font-bold">400</td>
                <td className="p-4 text-navy/70 leading-relaxed"><strong>Bad Request.</strong> Les paramètres fournis sont manquants ou invalides (ex: format du numéro de téléphone incorrect, montant invalide).</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-mono text-amber-600 font-bold">401</td>
                <td className="p-4 text-navy/70 leading-relaxed"><strong>Unauthorized.</strong> Votre clé d'API (<code>Authorization: Bearer ...</code>) est manquante, invalide, ou a été révoquée.</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-mono text-amber-600 font-bold">402</td>
                <td className="p-4 text-navy/70 leading-relaxed"><strong>Payment Required.</strong> Le compte marchand n'a pas assez de fonds (particulièrement utilisé pour les API de décaissement).</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-mono text-amber-600 font-bold">404</td>
                <td className="p-4 text-navy/70 leading-relaxed"><strong>Not Found.</strong> La ressource demandée n'existe pas (ex: vous essayez de récupérer une <code>session_id</code> qui n'existe pas).</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-mono text-red-600 font-bold">429</td>
                <td className="p-4 text-navy/70 leading-relaxed"><strong>Too Many Requests.</strong> Rate limit dépassé. Vous effectuez trop de requêtes par seconde. Veuillez ralentir vos appels.</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-mono text-red-600 font-bold">500 - 504</td>
                <td className="p-4 text-navy/70 leading-relaxed"><strong>Server Error.</strong> Une erreur s'est produite du côté de DolaPay ou de l'opérateur mobile (MTN/Wave...). Ces erreurs sont généralement temporaires, vous pouvez réessayer la requête (Retry).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold text-navy mt-10 mb-4">Format d'erreur JSON</h3>
        <CodeTabs snippets={errorsSnippets} />
      </section>
    </motion.div>
  );
}
