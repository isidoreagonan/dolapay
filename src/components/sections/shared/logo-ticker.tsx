
import Container from "@/components/container";
import FeatureTicker from "@/components/ui/feature-ticker";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";

const LogoTicker = () => {

    return (
        <section className="overflow-hidden md:py-[60px] py-12">
            <Container>
                <AnimateOnView y={40} delay={0.3} className="relative w-full">
                    <FeatureTicker speed={20} pauseOnHover={true} gap="12">
                        <div className="aspect-[245/159] max-w-[245px] w-full">
                            <img src="/images/common/brand-1.svg" alt="brand" />
                        </div>
                        <div className="aspect-[245/159] max-w-[245px] w-full">
                            <img src="/images/common/brand-2.svg" alt="brand" />
                        </div>
                        <div className="aspect-[245/159] max-w-[245px] w-full">
                            <img src="/images/common/brand-3.svg" alt="brand" />
                        </div>
                        <div className="aspect-[245/159] max-w-[245px] w-full">
                            <img src="/images/common/brand-4.svg" alt="brand" />
                        </div>
                        <div className="aspect-[245/159] max-w-[245px] w-full">
                            <img src="/images/common/brand-5.svg" alt="brand" />
                        </div>
                    </FeatureTicker>
                </AnimateOnView>
            </Container>
        </section>
    );
};

export default LogoTicker;
