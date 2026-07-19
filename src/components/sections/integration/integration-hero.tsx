import Container from "@/components/container";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import { Box, CircleDollarSign, Database, Hexagon, Plus, Settings, Sparkles, Sun, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";


const integrations = [
    {
        id: "ledgerlink",
        name: "LedgerLink",
        description: "A comprehensive integration platform that securely connects multiple accounting systems, enabling continuous real-time updates.",
        icon: <Database className="w-6 h-6 text-blue-400" />,
        color: "bg-blue-500/10",
    },
    {
        id: "finsync",
        name: "FinSync",
        description: "An advanced financial synchronization solution designed to pull, validate, and consolidate data from diverse banking.",
        icon: <Zap className="w-6 h-6 text-emerald-400" />,
        color: "bg-emerald-500/10",
    },
    {
        id: "capitalconnect",
        name: "CapitalConnect",
        description: "A robust investment-management that links brokerage accounts, trading platforms, and portfolio analysis tools.",
        icon: <CircleDollarSign className="w-6 h-6 text-orange-400" />,
        color: "bg-orange-500/10",
    },
    {
        id: "wealthbri",
        name: "WealthBri",
        description: "Highly secure, developer-friendly API framework that enables seamless data sharing between wealth management platforms.",
        icon: <Sun className="w-6 h-6 text-yellow-400" />,
        color: "bg-yellow-500/10",
    },
    {
        id: "equityflow",
        name: "EquityFlow",
        description: "An integration service that monitors equity transactions, manages shareholder records, and delivers real-time insights.",
        icon: <Sparkles className="w-6 h-6 text-rose-400" />,
        color: "bg-rose-500/10",
    },
    {
        id: "paystream",
        name: "PayStream",
        description: "A versatile payment-processing connector that unites multiple gateways, automates cash-flow reconciliation.",
        icon: <Hexagon className="w-6 h-6 text-purple-400" />,
        color: "bg-purple-500/10",
    },
    {
        id: "dividend",
        name: "Dividend",
        description: "A sophisticated treasury-management integration that consolidates banking data, cash positions, and liquidity forecast.",
        icon: <Box className="w-6 h-6 text-green-400" />,
        color: "bg-green-500/10",
    },
    {
        id: "budgetbe",
        name: "BudgetBe",
        description: "A dynamic budgeting and forecasting connector that pulls data from ERP, payroll, and expense platforms.",
        icon: <Plus className="w-6 h-6 text-blue-300" />,
        color: "bg-blue-300/10",
    },
    {
        id: "risksphere",
        name: "RiskSphere",
        description: "A powerful risk-analysis integration that aggregates market data, credit reports, and internal financial metrics.",
        icon: <Settings className="w-6 h-6 text-pink-400" />,
        color: "bg-pink-500/10",
    },
];

const IntegrationHero = () => {
    return (
        <section className="hero-padding-top pb-20 bg-[url(/images/common/banner-gradient.webp)] bg-cover">
            <Container className="md:space-y-20 space-y-8">
                {/* Hero Section */}
                <StaggerContainer className="max-w-[540px] mx-auto text-center">
                    <AnimateOnView blur>
                        <h1 className="h1 md:mb-5 mb-3">
                            Smart Financial Integrations Suite
                        </h1>
                    </AnimateOnView>
                    <AnimateOnView blur delay={0.2}>
                        <p className="text-lg">
                            A comprehensive platform that seamlessly connects your financial system, manage your finances efficiently and effectively.
                        </p>
                    </AnimateOnView>
                </StaggerContainer>

                {/* Integration Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {integrations.map((item, index) => (
                        <AnimateOnView
                            key={item.id}
                            y={20}
                            blur
                            once
                            delay={index * 0.1}
                        >
                            <Link
                                to={`/integration/${item.id}`}
                                className="group block bg-card border border-border md:rounded-[32px] rounded-lg md:p-10 p-6 hover:border-white/10 transition-all duration-300"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                                    {item.icon}
                                </div>
                                <h3 className="h3 mb-4">{item.name}</h3>
                                <p className="text-muted-foreground text-sm">
                                    {item.description}
                                </p>
                            </Link>
                        </AnimateOnView>
                    ))}
                </div>
            </Container>
        </section>
    )
}

export default IntegrationHero;
