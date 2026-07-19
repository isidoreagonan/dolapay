import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import { Newsletter } from "@/components/ui/newsletter";

const Hero = () => {
  return (
    <section className="relative flex items-center justify-center overflow-hidden hero-padding-top pb-10 md:pb-0 bg-[url(/images/home/hero-bg.jpg)] bg-cover bg-center">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <StaggerContainer>
            <AnimateOnView blur>
              <h1 className="h1 text-foreground mb-4">
                L'Infrastructure de Paiement qui Propulse l'Afrique
              </h1>
            </AnimateOnView>

            <AnimateOnView blur delay={0.2}>
              <p className="text-body-md max-w-2xl mx-auto mb-5">
                DolaPay unifie Mobile Money, cartes bancaires et payouts instantanés dans une seule plateforme conçue pour les startups, marchands et e-commerçants africains.
              </p>
            </AnimateOnView>

            <AnimateOnView className="flex items-center justify-center mb-16" delay={0.3}>
              <Newsletter />
            </AnimateOnView>
          </StaggerContainer>

          <div className="relative flex items-center justify-center">
            <StaggerContainer className="relative w-full max-w-[840px] flex items-center justify-center">
              <AnimateOnView delay={0.1} className="absolute right-0 top-1/2 -translate-y-1/2 aspect-[429/259] w-[51%] z-0">
                <img
                  src="/images/home/card-2.png"
                  alt="Carte de paiement DolaPay"
                  className="w-full h-full object-cover"
                />
              </AnimateOnView>

              <AnimateOnView delay={0.2} className="aspect-[525/317] w-[63%] z-10 bg-[url('/images/home/card-bg.png')] bg-cover bg-center rounded-[19px]">
                <img
                  src="/images/home/card-1.png"
                  alt="Carte premium DolaPay"
                  className="w-full h-full object-cover"
                />
              </AnimateOnView>

              <AnimateOnView delay={0.3} className="absolute left-0 top-1/2 -translate-y-1/2 aspect-[429/259] w-[51%] z-0">
                <img
                  src="/images/home/card-2.png"
                  alt="Carte de paiement DolaPay"
                  className="w-full h-full object-cover"
                />
              </AnimateOnView>
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
