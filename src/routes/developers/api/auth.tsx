import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CodeTabs, Lang } from "@/components/developers/CodeTabs";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/developers/api/auth")({
  component: ApiAuthPage,
});

const authSnippets: Record<Lang, string> = {
  curl: \`curl https://api.dola-pay.com/v1/checkout/sessions \\\\
  -H "Authorization: Bearer sk_live_votre_cle_secrete" \\\\
  -H "Content-Type: application/json"\`,
  node: \`// Authentification Bearer Token via Header HTTP
const headers = {
  "Authorization": "Bearer sk_live_votre_cle_secrete",
  "Content-Type": "application/json"
};\`,
};

function ApiAuthPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-4xl md:text-5xl font-bold text-navy tracking-tight mb-4">
        Authentification
      </h1>
      <p className="text-lg text-navy/60 leading-relaxed mb-10">
        Sécurisez vos requêtes vers l'API DolaPay en utilisant vos clés secrètes.
      </p>

      <section className="mt-8">
        <p className="text-navy/80 leading-relaxed mb-6">
          L'API DolaPay utilise des clés d'API (API Keys) pour authentifier les requêtes. Vous pouvez générer et gérer vos clés d'API directement depuis votre <strong>Tableau de bord</strong> dans la section <strong>Clés API</strong>.
        </p>
        
        <p className="text-navy/80 leading-relaxed mb-6">
          Toutes les requêtes d'API doivent être effectuées en <strong>HTTPS</strong>. Vous devez fournir votre clé secrète via l'en-tête HTTP <code>Authorization</code> en utilisant le schéma <code>Bearer</code>.
        </p>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-sm text-amber-900 mt-6 flex gap-4 shadow-sm">
          <ShieldCheck className="h-6 w-6 shrink-0 text-amber-600" />
          <div>
            <h4 className="font-bold mb-1">Garder vos clés secrètes en sécurité</h4>
            <p className="leading-relaxed text-amber-900/80">
              Ne partagez <strong>jamais</strong> vos clés secrètes (celles commençant par <code>sk_live_...</code> ou <code>sk_test_...</code>) dans un code côté client (navigateur, application mobile) ou dans des dépôts publics comme GitHub. Toute personne ayant votre clé secrète peut effectuer des actions en votre nom sur votre compte.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 pt-8 border-t border-border">
        <h2 className="text-2xl font-semibold text-navy tracking-tight mb-4">Exemple d'en-tête</h2>
        <CodeTabs snippets={authSnippets} />
      </section>
    </motion.div>
  );
}
