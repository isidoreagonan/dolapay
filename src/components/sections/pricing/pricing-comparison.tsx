import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

const features = [
    { name: "Cash Back Rewards", starter: "1.5%", professional: "4%" },
    { name: "FDIC Insurance", starter: "Yes", professional: "Yes" },
    { name: "ACH Transfers", starter: "Instant ACH transfers for $1", professional: "Same-day ACH transfers for $0.50" },
    { name: "Domestic Wire Transfers", starter: "$6", professional: "$3" },
    { name: "Virtual Card Options", starter: "Unlimited virtual card options", professional: "Unlimited access to virtual cards" },
    { name: "International Wire Transfers", starter: "$25", professional: "$20" },
    { name: "Multi-user Access", starter: "No", professional: "Yes" },
    { name: "Priority Customer Support", starter: "No", professional: "Yes" },
    { name: "Monthly Spending Reports", starter: "Basic", professional: "Advanced with insights" },
];

const PricingComparison = () => {
    return (
        <section className="md:py-[60px] py-12">
            <Container className="md:space-y-20 space-y-8">
                <StaggerContainer className="text-center md:max-w-[500px] max-w-xs mx-auto">
                    <AnimateOnView blur once>
                        <h2 className="h2 md:mb-5 mb-3">
                            Compare Plans
                        </h2>
                    </AnimateOnView>

                    <AnimateOnView blur once delay={0.1}>
                        <p className="text-muted-foreground">
                            Enjoy high-yield accounts, unlimited 2% cashback cards for Pro customers, and flexible working capital to power your business.
                        </p>
                    </AnimateOnView>
                </StaggerContainer>

                {/* Desktop View */}
                <div className="hidden lg:block relative">
                    <div className="relative">
                        <div className="overflow-hidden">
                            <div className="grid grid-cols-3 gap-x-5">
                                {/* Header Row */}
                                <div className="p-4 flex items-end text-muted-foreground mb-[10px]">
                                    Features
                                </div>
                                <div className="p-10 rounded-[20px] border-border bg-[url(/images/pricing/comparison-bg.webp)] bg-cover mb-[10px]">
                                    <h3 className="text-2xl font-semibold text-white mb-8">Starter Package</h3>
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-full py-6 border-white/10 bg-white/5 text-white"
                                        asChild>
                                        <Link to="/contact">Book Your Session</Link>
                                    </Button>
                                </div>
                                <div className="p-10 rounded-[20px] bg-[url(/images/pricing/comparison-bg.webp)] bg-cover mb-[10px]">
                                    <h3 className="text-2xl font-semibold text-white mb-8">Professional Package</h3>
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-full py-6 border-white/10 bg-white/5 text-white"
                                        asChild
                                    >
                                        <Link to="/contact">Book Your Session</Link>
                                    </Button>
                                </div>

                                {/* Feature Rows */}
                                {features.map((feature, idx) => (
                                    <div key={idx} className="contents group">
                                        <div className={cn(
                                            "p-4 text-muted-foreground border-t border-border transition-colors group-hover:bg-white/[0.02]"
                                        )}>
                                            {feature.name}
                                        </div>
                                        <div className={cn(
                                            "p-4 text-muted-foreground border-t border-border transition-colors group-hover:bg-white/[0.02] text-center lg:text-left",
                                            idx === 0 && "border-t-0"
                                        )}>
                                            {feature.starter}
                                        </div>
                                        <div className={cn(
                                            "p-4 text-muted-foreground border-t border-border transition-colors group-hover:bg-white/[0.02] text-center lg:text-left",
                                            idx === 0 && "border-t-0"
                                        )}>
                                            {feature.professional}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden flex flex-col gap-12">
                    {/* Starter Plan */}
                    <div className="space-y-6">
                        <div className="p-8 rounded-[32px] bg-[#0A0A0A] border border-white/10">
                            <h3 className="text-2xl font-semibold text-white mb-6">Starter Package</h3>
                            <Button variant="outline" className="w-full rounded-full py-6 border-white/10 bg-white/5 hover:bg-white/10 text-white">
                                Book Your Session
                            </Button>
                        </div>
                        <div className="space-y-4 px-4">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex justify-between items-center py-4 border-b border-[#151515]">
                                    <span className="text-white/40 text-sm">{feature.name}</span>
                                    <span className="text-white text-sm text-right max-w-[60%] font-medium">{feature.starter}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Professional Plan */}
                    <div className="space-y-6">
                        <div className="p-8 rounded-[32px] bg-[#0A0A0A] border border-white/10">
                            <h3 className="text-2xl font-semibold text-white mb-6">Professional Package</h3>
                            <Button variant="outline" className="w-full rounded-full py-6 border-white/10 bg-white/5 hover:bg-white/10 text-white">
                                Book Your Session
                            </Button>
                        </div>
                        <div className="space-y-4 px-4">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex justify-between items-center py-4 border-b border-[#151515]">
                                    <span className="text-white/40 text-sm">{feature.name}</span>
                                    <span className="text-white text-sm text-right max-w-[60%] font-medium">{feature.professional}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default PricingComparison;
