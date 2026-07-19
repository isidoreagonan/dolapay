import { AnimateOnView } from '@/components/ui/motion/animate-on-view'
import { StaggerContainer } from '@/components/ui/motion/stagger'
import Container from '../../container'
import { PricingCard } from '../../ui/pricing-card'

const pricingPlans = [
    {
        id: 1,
        title: "Starter",
        description: "Full-featured banking essentials with no strings attached.",
        price: "$2",
        pricePeriod: "/month",
        features: [
            "1.5% Cash Back Rewards",
            "Hundreds of millions protected by FDIC insurance",
            "Instant ACH transfers for just $1",
            "Domestic wire transfers available for $6",
            "Unlimited virtual card options",
            "International wire transfers at $25",
        ],
        buttonText: "Get Started",
        buttonLink: "/pricing/starter",
        isHighlighted: false,
    },
    {
        id: 2,
        title: "Professional",
        description: "Scale your business with advanced industry-specific capabilities.",
        price: "$5",
        pricePeriod: "/month",
        features: [
            "4% Cash Back Rewards",
            "Hundreds of millions protected by FDIC insurance",
            "Same-day ACH transfers for only $0.5",
            "Domestic wire transfers for a fee of $3",
            "Unlimited access to virtual cards",
            "International wire transfers for $20",
        ],
        buttonText: "Get Started Today!",
        buttonLink: "/pricing/professional",
        isHighlighted: true,
        backgroundImage: "/images/pricing/pricing-bg.webp",
    },
]

const PricingBanner = () => {

    return (
        <section className="hero-padding-top pb-20 bg-[url(/images/common/banner-gradient.webp)] bg-cover bg-center">
            <Container className="md:space-y-20 space-y-8">
                <StaggerContainer className="text-center md:max-w-[540px] max-w-sm mx-auto">
                    <AnimateOnView blur>
                        <h1
                            className="h1 mb-5"
                        >
                            Pricing that Match with you
                        </h1>
                    </AnimateOnView>
                    <AnimateOnView blur delay={0.2}>
                        <p
                            className=""
                        >
                            Access robust banking services for free, with advanced financial workflows starting at just $35/month.
                        </p>
                    </AnimateOnView>
                </StaggerContainer>
                <StaggerContainer>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1058px] mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <AnimateOnView
                                key={plan.id}
                                delay={index * 0.1}
                            >
                                <PricingCard
                                    title={plan.title}
                                    description={plan.description}
                                    price={plan.price}
                                    pricePeriod={plan.pricePeriod}
                                    features={plan.features}
                                    buttonText={plan.buttonText}
                                    buttonLink={plan.buttonLink}
                                    isHighlighted={plan.isHighlighted}
                                    backgroundImage={plan.backgroundImage}
                                />
                            </AnimateOnView>
                        ))}
                    </div>
                </StaggerContainer>
            </Container>
        </section>
    )
}

export default PricingBanner

