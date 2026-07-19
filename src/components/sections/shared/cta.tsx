import lottieData from "@/assets/lottie/3 cards.json";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import Lottie from "lottie-react";
import { Link } from "@tanstack/react-router";

const CTA = () => {
    return (
        <section className="relative overflow-hidden pt-20 md:pt-32">
            {/* Background Gradient similar to design (dark with subtle glow) */}
            <div className="absolute inset-0 bg-background" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

            <Container className="relative z-10 space-y-10">
                <StaggerContainer className="text-center">
                    <AnimateOnView
                        blur
                    >
                        <h2 className="h2 md:mb-5 mb-3">
                            Lancez vos paiements DolaPay en moins de 24h
                        </h2>
                    </AnimateOnView>
                    <AnimateOnView blur delay={0.2}>
                        <p className='text-muted-foreground md:mb-10 mb-5'>
                            Rejoignez les startups et marchands qui encaissent déjà en Mobile Money et cartes dans 12 pays africains avec DolaPay.
                        </p>
                    </AnimateOnView>
                    <AnimateOnView>
                        <Button asChild>
                            <Link to="/contact">
                                Créer mon compte
                            </Link>
                        </Button>
                    </AnimateOnView>
                </StaggerContainer>
                <div className="w-full md:h-[288px] h-[140px] max-w-[840px] mx-auto">
                    <div className="aspect-[840/292] w-full">
                        <Lottie
                            animationData={lottieData}
                            loop={true}
                            className="w-full h-full"
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default CTA;
