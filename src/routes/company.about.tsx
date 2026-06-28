import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Target, Sparkles, ShieldCheck, Globe2, Linkedin } from "lucide-react";
import ceoPhoto from "@/assets/ceo-isidore.png.asset.json";

export const Route = createFileRoute("/company/about")({
  head: () => ({
    meta: [
      { title: "À propos — Construire l'Autoroute Financière de l'Afrique | DolaPay" },
      { name: "description", content: "Une API unifiée pour connecter les entreprises du monde entier à plus de 500 millions de portefeuilles Mobile Money africains." },
      { property: "og:title", content: "À propos — DolaPay" },
      { property: "og:description", content: "Construire l'autoroute financière de l'Afrique. Une API unifiée, 500M+ de portefeuilles Mobile Money." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: Sparkles,
    title: "Simplicité Radicale",
    desc: "Si l'intégration prend plus de 10 minutes, nous avons échoué.",
  },
  {
    icon: ShieldCheck,
    title: "Conformité Intransigeante",
    desc: "La sécurité d'abord, le volume ensuite.",
  },
  {
    icon: Globe2,
    title: "Ambition Sans Frontières",
    desc: "Permettre aux marchands africains de conquérir le monde.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-36 sm:pt-44">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="pointer-events-none absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            À propos de DolaPay
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            <span className="text-gradient">Construire l'Autoroute Financière</span>
            <br />
            <span className="text-foreground">de l'Afrique.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Une API unifiée pour connecter les entreprises du monde entier à plus de{" "}
            <span className="font-semibold text-foreground">500 millions de portefeuilles Mobile Money</span> africains.
          </p>
        </div>
      </section>

      {/* Section 1 — Notre Genèse */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Target className="h-3.5 w-3.5" /> Notre Genèse
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Pourquoi DolaPay existe.</h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              L'Afrique est leader mondial de l'adoption du Mobile Money. Pourtant, pour une entreprise digitale ou un
              e-commerçant, encaisser des paiements à travers le continent reste un véritable parcours du combattant.
              Des API fragmentées, des réseaux instables et des barrières réglementaires dans chaque pays freinent la
              croissance économique.
            </p>
            <p>
              <span className="font-semibold text-foreground">DolaPay (Dolapo ECOM LLC)</span> a été fondée avec une
              vision claire et intransigeante : simplifier les paiements africains à une seule ligne de code. Nous
              pensons qu'un entrepreneur à Dakar, Abidjan, Cotonou ou Kinshasa doit pouvoir vendre au monde entier aussi
              facilement qu'une startup dans la Silicon Valley.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 — Confiance Institutionnelle */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-deep via-navy to-primary p-8 text-navy-foreground shadow-glow sm:p-14">
            <div className="absolute inset-0 bg-grid opacity-[0.08]" />
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl animate-float" />
            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" /> Confiance Institutionnelle
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Sécurité bancaire, fiabilité institutionnelle.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-navy-foreground/85 sm:text-lg">
                <p>
                  Nous ne faisons aucun compromis sur la sécurité. Déplacer des fonds exige une précision absolue et une
                  conformité rigoureuse. DolaPay opère sous les standards internationaux les plus stricts de lutte
                  contre le blanchiment d'argent (AML/CFT) et s'appuie sur des partenaires d'infrastructure
                  institutionnels de premier plan comme <span className="font-semibold text-white">pawaPay</span>.
                </p>
                <p>
                  Grâce à nos connexions directes avec les plus grands réseaux bancaires et télécoms, nous garantissons
                  à nos marchands une disponibilité de{" "}
                  <span className="font-semibold text-white">99.99%</span>, une vérification d'identité (KYB/KYC)
                  automatisée en temps réel, et un accès immédiat à{" "}
                  <span className="font-semibold text-white">12 économies majeures</span> du continent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Leadership */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
            <div className="grid gap-0 md:grid-cols-[280px_1fr]">
              <div className="relative overflow-hidden bg-gradient-to-br from-navy-deep via-navy to-primary md:min-h-[360px]">
                <div className="absolute inset-0 bg-grid opacity-[0.1]" />
                <img
                  src={ceoPhoto.url}
                  alt="Isidore Abraham AGONAN, Fondateur & CEO de DolaPay"
                  className="relative h-full max-h-[420px] w-full object-cover object-top md:max-h-none"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-deep/60 to-transparent" />
              </div>
              <div className="p-8 sm:p-10">
                <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  Leadership & Vision
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
                  Isidore Abraham AGONAN
                </h3>
                <div className="mt-1 text-sm font-semibold text-primary">Fondateur & CEO, DolaPay</div>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  Passionné de technologie et expert en infrastructure de paiement, Isidore est dédié à la résolution de
                  la fragmentation financière dans les marchés émergents. Évoluant entre les États-Unis (Dolapo ECOM LLC)
                  et l'écosystème tech africain, il dirige la mission de DolaPay : démocratiser le commerce digital à
                  travers toute l'Afrique.
                </p>
                <a
                  href="https://www.linkedin.com/in/isidore-agonan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                >
                  <Linkedin className="h-4 w-4" />
                  Voir le profil LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — Valeurs */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Nos valeurs fondamentales
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Ce qui nous anime.</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="group rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
