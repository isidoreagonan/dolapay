import spinningLogo from '@/assets/lottie/big spinning logo.json'
import { AnimateOnView } from '@/components/ui/motion/animate-on-view'
import { StaggerContainer } from '@/components/ui/motion/stagger'
import Lottie from 'lottie-react'
import Container from '../../container'

const FeatureGrowth = () => {

    return (
        <section className="md:py-[60px] py-12">
            <Container className="md:space-y-20 space-y-8">
                <StaggerContainer className="text-center md:max-w-none max-w-xs mx-auto">
                    <AnimateOnView blur>
                        <h2 className="h2 md:mb-5 mb-3">
                            Smarter Banking, Built for Growth
                        </h2>
                    </AnimateOnView>
                    <AnimateOnView blur delay={0.2}>
                        <p className="text-muted-foreground">
                            Discover the powerful tools that make DolaPay the future of finance.
                        </p>
                    </AnimateOnView>
                </StaggerContainer>
                <AnimateOnView>
                    <Lottie animationData={spinningLogo} />
                </AnimateOnView>
            </Container>
        </section>
    )
}

export default FeatureGrowth
