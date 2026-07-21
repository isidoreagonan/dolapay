import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/developers/api/")({
  component: ApiIntroductionPage,
});

function ApiIntroductionPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-4xl md:text-5xl font-bold text-navy tracking-tight mb-4">
        Introduction
      </h1>
      <p className="text-lg text-navy/60 leading-relaxed mb-10">
        Bienvenue dans la documentation officielle de l'API DolaPay. Notre API vous permet d'encaisser facilement les paiements Mobile Money et cartes bancaires à travers l'Afrique francophone.
      </p>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-navy tracking-tight mb-4">Base URL (Endpoints)</h2>
        <p className="text-navy/80 leading-relaxed mb-6">
          L'API DolaPay est conçue autour des principes <strong>REST</strong>. Notre API accepte des requêtes codées en JSON, retourne des réponses en JSON, et utilise les codes HTTP standards pour indiquer le succès ou l'échec d'une opération.
        </p>

        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 shadow-sm">
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <span className="mt-0.5 rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600 border border-emerald-500/20 shadow-sm">LIVE</span>
              <div>
                <code className="text-navy font-mono text-[15px] font-bold">https://api.dola-pay.com/v1</code>
                <p className="text-sm text-navy/60 mt-1.5 leading-relaxed">Pour les transactions réelles en production. L'argent sera débité des comptes de vos clients.</p>
              </div>
            </li>
            
            <li className="w-full h-px bg-primary/10"></li>
            
            <li className="flex items-start gap-4">
              <span className="mt-0.5 rounded bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-600 border border-blue-500/20 shadow-sm">TEST</span>
              <div>
                <code className="text-navy font-mono text-[15px] font-bold">https://sandbox.dola-pay.com/v1</code>
                <p className="text-sm text-navy/60 mt-1.5 leading-relaxed">L'environnement Sandbox (Bac à sable) pour vos tests d'intégration. Utilisez vos clés API de test. Aucun paiement réel ne sera effectué.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-12 pt-8 border-t border-border">
        <h2 className="text-2xl font-semibold text-navy tracking-tight mb-4">Format des requêtes</h2>
        <p className="text-navy/80 leading-relaxed">
          Toutes les requêtes vers l'API DolaPay doivent inclure l'en-tête suivant pour indiquer que vous envoyez du JSON :
        </p>
        <div className="mt-4 bg-muted p-4 rounded-xl border border-border font-mono text-sm text-navy">
          Content-Type: application/json
        </div>
      </section>
    </motion.div>
  );
}
