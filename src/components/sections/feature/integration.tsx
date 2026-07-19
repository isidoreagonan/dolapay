import featureIntegration from '@/assets/lottie/feature-integration.json'
import { AnimateOnView } from '@/components/ui/motion/animate-on-view'
import { StaggerContainer } from '@/components/ui/motion/stagger'
import Lottie from 'lottie-react'
import Container from '../../container'

const FeatureIntegration = () => {

    return (
        <section className="md:py-[60px] py-12 bg-background">
            <Container className="md:space-y-16 space-y-8">
                <AnimateOnView>
                    <Lottie animationData={featureIntegration} />
                </AnimateOnView>
                <StaggerContainer className="text-center md:max-w-none max-w-xs mx-auto">
                    <AnimateOnView blur>
                        <h2 className="h2 md:mb-5 mb-3">
                            Connected Finance, Effortless Control
                        </h2>
                    </AnimateOnView>
                    <AnimateOnView blur delay={0.2}>
                        <p className="text-muted-foreground">
                            Link DolaPay to your favorite business tools and take charge of your finances
                        </p>
                    </AnimateOnView>
                </StaggerContainer>
            </Container>
        </section>
    )
}

export default FeatureIntegration
