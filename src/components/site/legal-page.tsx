import PageShell from "@/components/site/page-shell";
import PageHero from "@/components/site/page-hero";
import { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  canonicalUrl: string;
  eyebrow: string;
  heading: ReactNode;
  intro: string;
  sections: { title: string; body: ReactNode }[];
}

const LegalPage = ({ title, description, canonicalUrl, eyebrow, heading, intro, sections }: Props) => (
  <PageShell title={title} description={description} canonicalUrl={canonicalUrl}>
    <PageHero eyebrow={eyebrow} title={heading} description={intro} />
    <section className="pb-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6 space-y-10">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="text-xl md:text-2xl font-semibold text-navy">{s.title}</h2>
            <div className="mt-3 text-navy/70 leading-relaxed space-y-3">{s.body}</div>
          </div>
        ))}
        <p className="text-sm text-navy/50 pt-6 border-t border-border">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
    </section>
  </PageShell>
);

export default LegalPage;
