import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/company/about")({ component: About });
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Globe2, Sparkles, Zap, ShieldCheck } from "lucide-react";
import PageShell from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";

const values = [
  { icon: Sparkles, title: "Excellence absolue", desc: "Chaque ligne de code, chaque pixel, chaque interaction est pensé pour offrir une expérience sans friction." },
  { icon: ShieldCheck, title: "Confiance & Sécurité", desc: "Nous protégeons les flux financiers de nos marchands avec les standards de sécurité les plus stricts au monde." },
  { icon: Zap, title: "Vitesse d'exécution", desc: "Dans un monde qui va vite, nous construisons des solutions performantes qui répondent instantanément." },
  { icon: Globe2, title: "Vision panafricaine", desc: "Nous construisons un pont financier unifiant les économies locales pour propulser le commerce global." },
];

const stats = [
  { kpi: "10+", label: "Pays couverts à l'échelle continentale" },
  { kpi: "99.99%", label: "De disponibilité de notre API" },
  { kpi: "< 2s", label: "Temps de traitement moyen" },
  { kpi: "24/7", label: "Support technique dédié" },
];

function About() {
  return (
    <PageShell
    title="À propos de DolaPay — Redéfinir le paiement"
    description="Découvrez la vision et l'équipe derrière DolaPay, l'infrastructure de paiement nouvelle génération."
    canonicalUrl="/company/about"
  >
    {/* Hero Section */}
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative mx-auto max-w-5xl px-4 md:px-6 text-center z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border text-sm font-semibold text-navy mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" /> Notre Vision
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-navy tracking-tight leading-[1.1]">
            Nous construisons l'<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">avenir du commerce</span> en Afrique.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-navy/60 max-w-3xl mx-auto leading-relaxed">
            DolaPay n'est pas juste un agrégateur de paiement. C'est une infrastructure financière moderne, conçue pour éliminer la complexité et propulser la croissance des entreprises ambitieuses.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Story & Stats Bento Grid */}
    <section className="py-24 bg-white relative">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="lg:col-span-2 rounded-[2.5rem] bg-slate-50 p-10 md:p-14 border border-border relative overflow-hidden"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight mb-6">Notre histoire</h2>
            <div className="space-y-6 text-lg text-navy/70 leading-relaxed relative z-10">
              <p>
                L'écosystème du paiement en Afrique a longtemps été fragmenté, complexe et opaque. Les entreprises devaient choisir entre des solutions locales limitées ou des acteurs internationaux inadaptés aux réalités du terrain.
              </p>
              <p>
                <strong>DolaPay est née d'une ambition claire :</strong> créer le standard d'or du paiement africain. Une plateforme où la technologie de pointe rencontre une profonde compréhension des marchés locaux.
              </p>
              <p>
                Aujourd'hui, nous fournissons aux startups, PME et grandes entreprises les outils dont elles ont besoin pour accepter des paiements, gérer leurs revenus et s'étendre au-delà des frontières, avec une élégance technique inégalée.
              </p>
            </div>
            {/* Decorative element */}
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-full pointer-events-none" />
          </motion.div>

          <div className="flex flex-col gap-6">
            {stats.map((s, i) => (
              <motion.div 
                key={s.label}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex-1 rounded-[2rem] bg-white border border-border p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-center"
              >
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-navy to-navy/60 tracking-tight">
                  {s.kpi}
                </div>
                <div className="mt-2 text-sm font-medium text-navy/60 uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">L'ADN de DolaPay</h2>
          <p className="text-lg text-slate-400">Les principes qui guident chacune de nos décisions, chaque ligne de code et chaque interaction avec nos clients.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-[2rem] bg-white/5 border border-white/10 p-10 hover:bg-white/10 transition-colors"
            >
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <v.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{v.title}</h3>
              <p className="text-slate-400 leading-relaxed text-lg">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-32 bg-white text-center">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <Globe2 className="h-12 w-12 text-primary mx-auto mb-8" />
        <h2 className="text-4xl md:text-5xl font-black text-navy tracking-tight mb-6">
          Prêt à accélérer votre croissance ?
        </h2>
        <p className="text-xl text-navy/60 mb-10">
          Rejoignez les entreprises les plus innovantes qui font déjà confiance à DolaPay.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-base">
            <Link to="/auth/sign-up" className="flex items-center gap-2">Créer un compte gratuitement <ArrowRight className="h-5 w-5" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-full border-border text-navy hover:bg-slate-50 text-base">
            <Link to="/contact">Contacter les ventes</Link>
          </Button>
        </div>
      </div>
    </section>
  </PageShell>
  );
}

export default About;
