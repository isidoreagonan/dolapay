
import Container from "@/components/container";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import TestimonialCard from "@/components/ui/testimonial-secondary-card";
import { useScroll } from "framer-motion";
import { useRef } from "react";

const testimonials = [
    {
        id: 1,
        title: "Finally found the solution",
        quote: "For years, I felt like I was just guessing when it came to budgeting and saving. This platform gave me the structure and clarity I needed. Within a few months, I had a realistic savings plan, a clear view of my expenses, and the confidence that I was moving toward my goals.",
        author: "Ronald Richards",
        role: "CEO & co-founder",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
        logo: "LOGOIPSUM",
        rotation: -2,
    },
    {
        id: 2,
        title: "Game changer for finance",
        quote: "The real-time insights changed how we look at our burn rate and runway. It's not just a tool; it's like having a CFO in your pocket. The integration with our existing banks was seamless, and the automated reporting saves us hours every week.",
        author: "Jane Cooper",
        role: "Head of Operations",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
        logo: "LOGOIPSUM",
        rotation: 1,
    },
    {
        id: 3,
        title: "Simple and Powerful",
        quote: "I love how clean the interface is. Most financial apps are cluttered and confusing, but DolaPay keeps things focused. The early access cards were a huge help for my startup in the early days. Highly recommend to any growing team.",
        author: "Guy Hawkins",
        role: "Founder at TechFlow",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
        logo: "LOGOIPSUM",
        rotation: -1,
    },
    {
        id: 4,
        title: "The best ROI for our team",
        quote: "The automated workflows for payments and invoicing have reduced our manual workload by 150%. It's reliable, secure, and the support team is incredible. We've seen a massive improvement in our cash flow management since switching.",
        author: "Eleanor Pena",
        role: "Founder at Streamline",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
        logo: "LOGOIPSUM",
        rotation: 2,
    },
];

const AboutTestimonials = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        <section className="relative md:py-[60px] py-12">
            <Container>
                <StaggerContainer className="text-center md:max-w-[630px] max-w-xs mx-auto">
                    <AnimateOnView blur once>
                        <h2 className="h2 mb-5">
                            Trusted by high growth teams
                        </h2>
                    </AnimateOnView>

                    <AnimateOnView blur once delay={0.1}>
                        <p className="text-muted-foreground">
                            Our growth reflects one mission — helping people and companies achieve financial confidence with clarity and ease.
                        </p>
                    </AnimateOnView>
                </StaggerContainer>
            </Container>

            {/* Desktop Wrapper: Scroll-Linked Stacking */}
            <div ref={containerRef} className="hidden lg:block h-[200vh]">
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={testimonial.id}
                            testimonial={testimonial}
                            progress={scrollYProgress}
                            index={index}
                            total={testimonials.length}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile Wrapper: Simple List */}
            <div className="lg:hidden pb-24 mt-8">
                <Container>
                    <div className="flex flex-col gap-6">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="bg-background border border-border rounded-2xl p-6 space-y-8"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-1.5">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="w-2 h-2 rounded-full bg-white/10" />
                                        ))}
                                    </div>
                                    <div className="text-white/40 font-bold tracking-tighter italic uppercase">
                                        {testimonial.logo}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="h3">
                                        {testimonial.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed italic">
                                        "{testimonial.quote}"
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.author}
                                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium text-sm">{testimonial.author}</span>
                                        <span className="text-xs text-muted-foreground">{testimonial.role}</span>
                                    </div>
                                </div>
                            </div>

                        ))}
                    </div>
                </Container>
            </div>
        </section>
    );
};

export default AboutTestimonials;
