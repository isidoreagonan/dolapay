import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { Newsletter } from "@/components/ui/newsletter";
import Container from "../../container";

const EarlyAccessContent = () => {
    return (
        <section className="min-h-screen flex items-center justify-center bg-[url(/images/common/banner-gradient.webp)] bg-cover">
            <Container className="lg:space-y-[60px] md:space-y-10 space-y-4">
                <div className="text-center max-w-[581px] mx-auto">
                    <h1 className="h2 text-white mb-8">
                        Exciting new features are on the way
                    </h1>
                    <p className="">
                        Exciting new features are on the way! DolaPay is continuously evolving to provide you with the most advanced, secure, and seamless payment solutions.
                    </p>
                </div>
                <AnimateOnView
                    className="max-w-[470px] mx-auto w-full"
                    delay={0.3}
                >
                    <Newsletter />
                </AnimateOnView>
            </Container>
        </section>
    )
}

export default EarlyAccessContent