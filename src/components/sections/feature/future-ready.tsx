import { AnimateOnView } from '@/components/ui/motion/animate-on-view'
import { StaggerContainer } from '@/components/ui/motion/stagger'
import { Bookmark, Building2, LayoutGrid, Zap } from 'lucide-react'
import Container from '../../container'
import FeatureVideo from './feature-video'

const FutureReadyFinance = () => {
    const features = [
        {
            icon: <Building2 className="w-5 h-5 text-orange-400" />,
            title: "Grow Wealth With Confidence",
            description: "Access high-yield accounts and intelligent features designed to grow your money securely."
        },
        {
            icon: <Zap className="w-5 h-5 text-orange-400" />,
            title: "Move Money Without Delay",
            description: "Enjoy lightning-fast transfers and advanced encryption that protect every transaction."
        },
        {
            icon: <Bookmark className="w-5 h-5 text-orange-400" />,
            title: "Understand Finances Every Week",
            description: "Track spending trends, monitor growth patterns, and make smarter financial decisions using real-time weekly."
        },
        {
            icon: <LayoutGrid className="w-5 h-5 text-orange-400" />,
            title: "Connect Everything You Need",
            description: "Integrate DolaPay effortlessly with essential tools and apps to streamline workflows and keep finances."
        }
    ]

    return (
        <section className="md:py-[60px] py-12">
            <Container className="md:space-y-20 space-y-8">
                <StaggerContainer className="text-center md:max-w-2xl max-w-xs mx-auto">
                    <AnimateOnView blur>
                        <h2 className="h2 md:mb-5 mb-3">
                            Future-Ready Finance
                        </h2>
                    </AnimateOnView>
                    <AnimateOnView blur delay={0.2}>
                        <p className="text-muted-foreground">
                            With DolaPay, you're not just banking—you're building the future of your finances.
                        </p>
                    </AnimateOnView>
                </StaggerContainer>

                <AnimateOnView delay={0.3} blur>
                    <FeatureVideo
                        thumbnail="/images/feature/thumbnail.webp"
                        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    />
                </AnimateOnView>

                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pt-8">
                    {features.map((feature, index) => (
                        <AnimateOnView key={index} delay={0.4 + index * 0.1} blur>
                            <div className="space-y-6">
                                <div className="w-12 h-12 rounded-full bg-orange-950/20 border border-orange-500/10 flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <div className="space-y-3">
                                    <h3 className="h4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </AnimateOnView>
                    ))}
                </StaggerContainer>
            </Container>
        </section>
    )
}

export default FutureReadyFinance
