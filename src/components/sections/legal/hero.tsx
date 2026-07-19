import Container from "@/components/container";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";

interface PlanHeroProps {
  title: string;
  description: string;
}

const LegalHero = ({ title, description }: PlanHeroProps) => {
  return (
    <section className="hero-padding-top pb-20">
      <Container className="relative z-10">
        {/* Main headline */}
        <AnimateOnView once blur className="text-center max-w-4xl mx-auto" delay={0.2}>
          <h1 className="h1 text-white mb-6">
            {title}
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            {description}
          </p>
        </AnimateOnView>
      </Container>
    </section>
  );
};

export default LegalHero;

