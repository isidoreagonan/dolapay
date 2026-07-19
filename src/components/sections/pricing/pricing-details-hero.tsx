
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface PricingDetailsHeroProps {
    heading: string;
    subheadline: string;
    aboutText: string;
    features: string[];
    planName: string;
    price: string;
    priceSuffix?: string;
    cardDescription: string;
    backgroundImage?: string;
}

const PricingDetailsHero = ({
    heading,
    subheadline,
    aboutText,
    features,
    planName,
    price,
    priceSuffix = "/month",
    cardDescription,
    backgroundImage,
}: PricingDetailsHeroProps) => {
    return (
        <section className="relative hero-padding-top pb-20 bg-[url(/images/common/banner-gradient.webp)] bg-cover bg-center">
            <Container className="md:space-y-20 space-y-12">
                <StaggerContainer className="text-center max-w-[540px] mx-auto relative z-10">
                    <AnimateOnView blur>
                        <h1 className="h1 mb-5">
                            {heading}
                        </h1>
                    </AnimateOnView>

                    <AnimateOnView blur delay={0.1}>
                        <p>
                            {subheadline}
                        </p>
                    </AnimateOnView>
                </StaggerContainer>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    {/* Left Column: Details */}
                    <div className="space-y-16">
                        <AnimateOnView y={20} once delay={0.2} className="md:space-y-6 space-y-3">
                            <h2 className="h3">About The Plan</h2>
                            <p className="text-muted-foreground">
                                {aboutText}
                            </p>
                        </AnimateOnView>

                        <div className="md:space-y-8 space-y-4">
                            <AnimateOnView y={20} once delay={0.3}>
                                <h2 className="h3">What's included in the plan?</h2>
                            </AnimateOnView>

                            <ul className="space-y-4">
                                {features.map((feature, index) => (
                                    <AnimateOnView
                                        key={index}
                                        once
                                        delay={0.4 + index * 0.05}
                                        className="flex items-center gap-3"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                        <span className="text-muted-foreground font-normal">{feature}</span>
                                    </AnimateOnView>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Price Card */}
                    <AnimateOnView
                        scale
                        blur
                        once
                        delay={0.3}
                        className="relative lg:sticky lg:top-32"
                    >
                        <div className="relative bg-card rounded-[34px] border border-white/10 pt-12 px-8 pb-8 overflow-hidden">
                            {backgroundImage && (
                                <div className="absolute inset-0 z-10">
                                    <img src={backgroundImage} alt="pricing" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="space-y-10 relative z-20">
                                <h3 className="h2">{planName}</h3>


                                <div className="relative z-10 space-y-3">
                                    <div className="flex items-baseline gap-1">
                                        <span className="h1 text-white tracking-tighter">{price}</span>
                                        <span className="h5 text-muted-foreground">{priceSuffix}</span>
                                    </div>
                                    <p className="text-muted-foreground text-lg">
                                        {cardDescription}
                                    </p>
                                </div>
                                <Button className="w-full hover:scale-[1.02]" asChild>
                                    <Link to="/contact">
                                        Get Started Today!
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </AnimateOnView>
                </div>
            </Container>
        </section>
    );
};

export default PricingDetailsHero;
