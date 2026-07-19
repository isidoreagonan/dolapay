import Container from "@/components/container"
import { AnimateOnView } from "@/components/ui/motion/animate-on-view"
import TestimonialSlider from "@/components/ui/testimonial-slider"

const Testimonials = () => {

    return (
        <section className="py-12 md:py-[60px]">
            <Container className="">
                <AnimateOnView
                    blur
                >
                    <h2 className="h2 mb-5 text-center">
                        Ils ont propulsé leur croissance avec DolaPay
                    </h2>
                </AnimateOnView>
                <TestimonialSlider />
            </Container>
        </section>
    )
}

export default Testimonials
