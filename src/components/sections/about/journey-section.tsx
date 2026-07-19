
import Container from "@/components/container";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const journeyTabs = [
    {
        title: "The Beginning",
        description: "We introduced our platform with tools designed to simplify saving, budgeting, and managing money effectively.",
        year: "2021",
        subtitle: "Launch",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200", // Using a placeholder unsplash image
    },
    {
        title: "Rapid Growth",
        description: "Our user base tripled within the first year as we expanded our features to include early access credit cards.",
        year: "2022",
        subtitle: "Expansion",
        image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200",
    },
    {
        title: "Building Community",
        description: "We launched our social features, allowing users to share financial tips and growth strategies with each other.",
        year: "2023",
        subtitle: "Connection",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
    },
    {
        title: "Future Horizons",
        description: "Integrating AI-driven insights to help users make even smarter financial decisions for long-term wealth.",
        year: "2024",
        subtitle: "Innovation",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    },
];

const JourneySection = () => {
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTab((prev) => (prev + 1) % journeyTabs.length);
        }, 5000); // Change tab every 5 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-12 md:py-[60px]">
            <Container className="md:space-y-20 space-y-12">
                <StaggerContainer className="text-center md:max-w-[630px] max-w-xs mx-auto">
                    <AnimateOnView blur once>
                        <h2 className="h2 md:mb-5 mb-3">
                            The Journey Behind Our Growth
                        </h2>
                    </AnimateOnView>

                    <AnimateOnView blur once delay={0.1}>
                        <p className="text-muted-foreground">
                            Our growth reflects one mission — helping people and companies achieve financial confidence with clarity and ease.
                        </p>
                    </AnimateOnView>
                </StaggerContainer>

                <div className="relative bg-card md:rounded-[40px] rounded-lg border border-border p-6 md:p-12 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-12 gap-8 items-center">
                        {/* Left Content */}
                        <div className="flex flex-col h-full justify-between py-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="space-y-3"
                                >
                                    <h3 className="h4">
                                        {journeyTabs[activeTab].title}
                                    </h3>
                                    <p className="text-muted-foreground text-body-md leading-relaxed max-w-md">
                                        {journeyTabs[activeTab].description}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="md:mt-12 mt-8 flex flex-col-reverse md:flex-col md:gap-8 gap-2">
                                {/* Dots Pagination */}
                                <div className="flex gap-3 p-2 bg-white/5 w-fit rounded-full border border-white/10">
                                    {journeyTabs.map((_, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "h-2 rounded-full transition-all duration-500",
                                                activeTab === index ? "w-8 bg-white" : "w-2 bg-white/20"
                                            )}
                                        />
                                    ))}
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    >
                                        <div className="h3 mb-2">
                                            {journeyTabs[activeTab].year}
                                        </div>
                                        <div className="text-lg text-muted-foreground font-medium">
                                            {journeyTabs[activeTab].subtitle}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative aspect-[4/3] md:aspect-[16/10] lg:aspect-square overflow-hidden md:rounded-[32px] rounded-lg">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    className="absolute inset-0"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                                    <img
                                        src={journeyTabs[activeTab].image}
                                        alt={journeyTabs[activeTab].title}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default JourneySection;
