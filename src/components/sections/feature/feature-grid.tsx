import feature3 from "@/assets/lottie/19k-earning.json"
import feature1 from "@/assets/lottie/growth-100.json"
import feature4 from "@/assets/lottie/integrations.json"
import feature2 from "@/assets/lottie/unlimited-cashback.json"

import { AnimateOnView } from '@/components/ui/motion/animate-on-view'
import { StaggerContainer } from '@/components/ui/motion/stagger'
import Lottie from 'lottie-react'
import Container from '../../container'

const features = [
    {
        id: 1,
        title: "Encaissez sur 12 marchés africains",
        description: "MTN, Orange, Moov, Wave, Airtel, M-Pesa et cartes bancaires — une seule intégration.",
        lottieData: feature1,
    },
    {
        id: 2,
        title: "Commission unique, zéro frais caché",
        description: "2% DolaPay + frais réels de l'opérateur local. Transparence absolue, toujours.",
        lottieData: feature2,
    },
    {
        id: 3,
        title: "Bulk Pay-out en temps réel",
        description: "Payez agents, fournisseurs et livreurs en masse, avec réconciliation automatique.",
        lottieData: feature3,
    },
    {
        id: 4,
        title: "API moderne & liens de paiement sans code",
        description: "SDKs propres, webhooks fiables et liens de paiement générés en 10 secondes.",
        lottieData: feature4,
    }
]

const FeatureGrid = () => {

    return (
        <section className="md:py-[60px] py-12">
            <Container className="md:space-y-20 space-y-8">
                <StaggerContainer className="text-center md:max-w-xl max-w-sm mx-auto">
                    <AnimateOnView blur>
                        <h2 className="h2 md:mb-5 mb-3">
                            Une infrastructure pensée pour l'Afrique
                        </h2>
                    </AnimateOnView>
                    <AnimateOnView blur delay={0.2}>
                        <p className="text-muted-foreground">
                            Encaissement multi-opérateurs, décaissement instantané et outils no-code pour propulser vos ventes.
                        </p>
                    </AnimateOnView>
                </StaggerContainer>

                <StaggerContainer>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <AnimateOnView
                                key={feature.id}
                                delay={index * 0.1}
                                className={`h-full`}
                            >
                                <div className="border-0 bg-card rounded-[32px] overflow-hidden">
                                    <div className="w-full">
                                        <Lottie
                                            animationData={feature.lottieData}
                                            loop={true}
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="h4 mb-[9px]">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </AnimateOnView>
                        ))}
                    </div>
                </StaggerContainer>
            </Container>
        </section>
    )
}

export default FeatureGrid
