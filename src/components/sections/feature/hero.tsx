
import ticker2 from "@/assets/lottie/512k new.json";
import ticker4 from "@/assets/lottie/alex manda new.json";
import heroStat2 from "@/assets/lottie/edward collins new new.json";
import ticker1 from "@/assets/lottie/progress hours spent.json";
import ticker3 from "@/assets/lottie/sent and recieve w bg fbk framer.json";
import heroLottie from "@/assets/lottie/side glow strokes.json";
import heroStat1 from "@/assets/lottie/your balance 15k.json";

import Container from "@/components/container";
import FeatureTicker from "@/components/ui/feature-ticker";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import Lottie from "lottie-react";

const FeatureHero = () => {
    return (
        <section className="relative overflow-hidden hero-padding-top pb-12 md:pb-20 md:space-y-[113px] space-y-8">
            <Container className="relative z-10">
                <div className="absolute bottom-[-60px] left-5 aspect-[203/188] max-w-[203px] w-full md:block hidden">
                    <Lottie animationData={heroStat1} className="w-full h-full" />
                </div>
                <div className="absolute bottom-[-160px] right-5 aspect-[242/227] max-w-[242px] w-full md:block hidden">
                    <Lottie animationData={heroStat2} className="w-full h-full" />
                </div>
                <StaggerContainer className="flex flex-col items-center text-center max-w-[710px] mx-auto">
                    <AnimateOnView once blur>
                        <h1 className="h1 mb-5">
                            Toutes les fonctionnalités DolaPay en un coup d'œil
                        </h1>
                    </AnimateOnView>

                    <AnimateOnView once blur delay={0.1}>
                        <p className="text-lg text-muted-foreground">
                            Pay-in Mobile Money & Cartes, Bulk Pay-out, liens de paiement sans code et API pour développeurs — tout ce qu'il faut pour encaisser et payer partout en Afrique.
                        </p>
                    </AnimateOnView>
                </StaggerContainer>
            </Container>

            <AnimateOnView y={40} delay={0.3} className="relative w-full">
                <FeatureTicker speed={60} pauseOnHover={true} align="end">
                    <div className="aspect-[245/159] md:max-w-[245px] max-w-[120px] w-full">
                        <Lottie animationData={ticker1} className="w-full h-full" />
                    </div>
                    <div className="aspect-[477/306] md:max-w-[477px] max-w-[240px] w-full">
                        <Lottie animationData={ticker2} className="w-full h-full" />
                    </div>
                    <div className="aspect-[395/269] md:max-w-[395px] max-w-[190px] w-full">
                        <Lottie animationData={ticker3} className="w-full h-full" />
                    </div>
                    <div className="aspect-[318/164] md:max-w-[318px] max-w-[150px] w-full">
                        <Lottie animationData={ticker4} className="w-full h-full" />
                    </div>
                </FeatureTicker>
            </AnimateOnView>
            <div className="absolute top-[75px] inset-x-0 w-full aspect-[1200/750] md:block hidden">
                <Lottie animationData={heroLottie} className="w-full h-full" />
            </div>
        </section>
    )
}

export default FeatureHero
