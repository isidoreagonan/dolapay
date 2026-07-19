
import Container from "@/components/container";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { Calendar, Clock, Users } from "lucide-react";

const stats = [
    {
        label: "Annual Turnover",
        value: "489+",
        icon: Users,
    },
    {
        label: "Profit Margin",
        value: "12,000+",
        icon: Calendar,
    },
    {
        label: "Expense Ratio",
        value: "32,00",
        icon: Clock,
    },
];

const WorldwideStats = () => {
    return (
        <section className="md:py-[60px] py-12">
            <Container className="md:space-y-20 space-y-8">
                <div className="text-center md:max-w-[630px] max-w-xs mx-auto">
                    <AnimateOnView blur>
                        <h2 className="h2 mb-5">
                            Available Worldwide
                        </h2>
                    </AnimateOnView>

                    <AnimateOnView blur delay={0.1}>
                        <p className="text-muted-foreground">
                            Our growth reflects one mission — helping people and companies achieve financial confidence with clarity and ease.
                        </p>
                    </AnimateOnView>
                </div>

                <div className="flex flex-col lg:flex-row justify-between gap-4">
                    {/* Map Feature Column */}
                    <AnimateOnView
                        y={30}
                        once
                        className="lg:w-[40%] rounded-[32px] bg-[#111111] border border-white/5 flex flex-col justify-between overflow-hidden relative group min-h-[460px]"
                    >
                        <div className="relative z-10 pt-[29px] px-6">
                            <h3 className="text-3xl font-semibold text-white leading-tight max-w-[280px]">
                                DolaPay Supports participants and sites
                            </h3>
                        </div>

                        {/* Dot Map Illustration */}
                        <div className="absolute inset-x-0 bottom-0 pointer-events-none p-10 select-none">

                            <div className="relative w-full">
                                {/* SVG Dot Map Placeholder - in a real app this would be a more detailed SVG or Lottie */}
                                <img src="/images/about/map.webp" alt="map" />

                                {/* Brazil Pin */}
                                <div className="absolute left-[15%] top-[50%] flex flex-col items-center gap-1">
                                    <div className="bg-black border border-white/10 rounded-full px-3 py-1 flex items-center gap-2 shadow-2xl">
                                        <span className="text-[10px]">🇧🇷</span>
                                        <span className="text-[10px] text-white/80 font-medium">Brazil</span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                </div>

                                {/* Russia Pin */}
                                <div className="absolute right-[15%] top-[15%] flex flex-col items-center gap-1">
                                    <div className="bg-black border border-white/10 rounded-full px-3 py-1 flex items-center gap-2 shadow-2xl">
                                        <span className="text-[10px]">🇷🇺</span>
                                        <span className="text-[10px] text-white/80 font-medium">Russia</span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                </div>

                                {/* Colombia Pin */}
                                <div className="absolute left-[45%] top-[35%] flex flex-col items-center gap-1">
                                    <div className="bg-black border border-white/10 rounded-full px-3 py-1 flex items-center gap-2 shadow-2xl">
                                        <span className="text-[10px]">🇨🇴</span>
                                        <span className="text-[10px] text-white/80 font-medium">Colombia</span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                </div>
                            </div>
                        </div>
                    </AnimateOnView>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                        {stats.map((stat, index) => (
                            <AnimateOnView
                                key={index}
                                y={30}
                                once
                                delay={0.1 * (index + 1)}
                                className="py-[29px] px-6 rounded-2xl bg-card border border-white/5 flex flex-col md:justify-between md:min-h-[460px] transition-all duration-300 hover:border-white/10 gap-6 md:gap-0"
                            >
                                <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <stat.icon className="w-5 h-5 text-white/80" />
                                </div>

                                <div className="space-y-4">
                                    <h3 className="h3">
                                        {stat.value}
                                    </h3>
                                    <div className="text-muted-foreground text-base">
                                        {stat.label}
                                    </div>
                                </div>
                            </AnimateOnView>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default WorldwideStats;
