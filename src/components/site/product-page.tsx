import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/site/page-shell";
import PageHero from "@/components/site/page-hero";

interface Feature { icon: LucideIcon; title: string; desc: string; }

interface Props {
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  bullets: string[];
  features: Feature[];
  ctaHint?: string;
  children?: React.ReactNode;
}

const ProductPage = (p: Props) => (
  <PageShell title={p.seoTitle} description={p.seoDescription} canonicalUrl={p.canonicalUrl}>
    <PageHero
      eyebrow={p.eyebrow}
      title={p.title}
      description={p.description}
    >
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg" className="rounded-xl bg-primary hover:bg-primary/90">
          <Link to="/auth/sign-up" className="flex items-center gap-2">Commencer gratuitement <ArrowRight className="h-4 w-4" /></Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-xl border-navy/15 text-navy hover:bg-navy/5">
          <Link to="/docs">Voir la doc</Link>
        </Button>
      </div>
    </PageHero>

    <section className="pb-16">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="rounded-3xl bg-navy text-white p-8 md:p-10 shadow-glow">
          <ul className="grid sm:grid-cols-2 gap-4">
            {p.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-white/85">
                <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-electric-glow" />
                </div>
                <span className="text-sm md:text-base">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-[#F5F8FF]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-5">
          {p.features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl bg-white border border-border p-7 shadow-soft"
            >
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 text-lg font-semibold text-navy">{f.title}</div>
              <div className="mt-1.5 text-sm text-navy/60 leading-relaxed">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {p.children}



    <section className="py-20 text-center">
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-navy tracking-tight">Prêt à démarrer ?</h2>
        <p className="mt-4 text-navy/60">{p.ctaHint || "Créez un compte gratuit et intégrez DolaPay en moins de 10 minutes."}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-xl bg-primary hover:bg-primary/90">
            <Link to="/auth/sign-up">Créer un compte</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl border-navy/15 text-navy hover:bg-navy/5">
            <Link to="/contact">Parler à un expert</Link>
          </Button>
        </div>
      </div>
    </section>
  </PageShell>
);

export default ProductPage;
