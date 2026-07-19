import Container from "@/components/container";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { useParams } from "@tanstack/react-router";

const integrationData: Record<string, {
    name: string;
    description: string;
    overview: string;
    capabilities: string[];
    setup: string;
    security: string;
}> = {
    "ledgerlink": {
        name: "LedgerLink",
        description: "A comprehensive integration platform that securely connects multiple accounting systems.",
        overview: "Our Smart Financial Integrations Suite is designed to simplify the way businesses manage their financial operations by connecting multiple systems into a single seamless platform. It ensures real-time synchronization of data across accounting, payment, and investment tools, reducing manual effort, minimizing errors, and providing a holistic view of your financial ecosystem.",
        capabilities: [
            "Real-time Data Synchronization: Keep all your financial systems up-to-date instantly.",
            "Automated Reconciliation: Reduce manual reconciliation tasks with smart automation.",
            "Multi-Platform Connectivity: Integrate with banking, accounting, ERP, and investment platforms.",
            "Advanced Reporting & Analytics: Gain insights through dashboards, trends, and custom reports.",
            "Secure API Access: Connect external tools safely without compromising sensitive data."
        ],
        setup: "Setting up the integration is simple and requires no extensive technical expertise. Users start by connecting their financial accounts through secure API credentials, followed by configuring synchronization settings based on the systems they want to link.",
        security: "Security and compliance are core priorities of our integration suite. All data transfers are encrypted using industry-standard protocols, and access controls are in place to ensure only authorized personnel can interact with sensitive information."
    },
    "finsync": {
        name: "FinSync",
        description: "An advanced financial synchronization solution designed to pull, validate, and consolidate data from diverse banking.",
        overview: "FinSync unifies banking, card, and treasury data feeds into a single normalized stream. It validates every transaction against your source of truth, resolves duplicates, and pushes clean records to your accounting and reporting stack in real time.",
        capabilities: [
            "Multi-Bank Aggregation: Pull balances and transactions from every connected bank in one feed.",
            "Automatic Validation: Detect duplicates, missing metadata, and mismatched currencies before they reach your books.",
            "Streaming Sync: Push updates to downstream systems with sub-minute latency.",
            "Custom Field Mapping: Map bank statement fields to your chart of accounts without engineering effort.",
            "Immutable Audit Log: Every sync produces a signed record for compliance and reconciliation."
        ],
        setup: "Connect each banking source with a read-only credential or an Open Banking token. FinSync verifies access, backfills up to 24 months of history, then enables live streaming with your chosen destination systems.",
        security: "FinSync is read-only by default. All data is encrypted in transit with TLS 1.3 and at rest with AES-256. Credentials are stored in a hardware-backed vault and never exposed to end users."
    },
    "capitalconnect": {
        name: "CapitalConnect",
        description: "A robust investment-management integration that links brokerage accounts, trading platforms, and portfolio analysis tools.",
        overview: "CapitalConnect centralizes your investment operations by wiring together brokerage feeds, order management systems, and analytics platforms. Positions, trades, and NAV are reconciled continuously so every stakeholder sees the same numbers.",
        capabilities: [
            "Brokerage Aggregation: Consolidate positions and trades from every custodian in a single view.",
            "Real-time NAV: Recalculate portfolio value as prices and corporate actions arrive.",
            "Order Routing: Send orders to your OMS or EMS through a single unified API.",
            "Performance Analytics: Attribute returns by asset class, strategy, and manager.",
            "Regulatory Reporting: Generate the data feeds required for common regulatory filings."
        ],
        setup: "Add each brokerage account with a read-only API key or SFTP feed. Map instruments to your internal security master, then enable the downstream analytics or OMS connectors you want to power.",
        security: "CapitalConnect uses per-tenant encryption keys, IP-restricted API access, and SOC 2-aligned change management. All order-routing paths require explicit approval and are logged with immutable audit trails."
    },
    "wealthbri": {
        name: "WealthBri",
        description: "A highly secure, developer-friendly API framework that enables seamless data sharing between wealth management platforms.",
        overview: "WealthBri is the connective tissue for modern wealth platforms. Its API framework lets advisors, custodians, and planning tools exchange client, account, and holding data without brittle custom integrations.",
        capabilities: [
            "Unified Client Model: One canonical schema for households, accounts, and beneficiaries.",
            "Bi-directional Sync: Push and pull data with any partner platform via a single contract.",
            "Consent Management: Track client permissions for every field a partner can access.",
            "Sandbox Environments: Spin up isolated test tenants with realistic synthetic data.",
            "Webhook Fan-out: Broadcast changes to every subscribed downstream system."
        ],
        setup: "Provision API credentials from the WealthBri console, register the partner endpoints you want to sync with, and select the fields each partner is authorized to receive. Go live once the sandbox handshake succeeds.",
        security: "WealthBri enforces mutual TLS between partners, field-level encryption for PII, and granular consent scopes so a partner only ever sees what the client has approved."
    },
    "equityflow": {
        name: "EquityFlow",
        description: "An integration service that monitors equity transactions, manages shareholder records, and delivers real-time insights.",
        overview: "EquityFlow keeps your cap table, shareholder register, and equity plan administration in sync. Grants, vesting events, and secondary transactions flow into a single ledger that finance, legal, and HR can trust.",
        capabilities: [
            "Cap Table Sync: Mirror your equity ledger across finance, legal, and HR tooling.",
            "Vesting Automation: Trigger events, tax withholding, and notifications on schedule.",
            "409A & Waterfall Support: Model valuations and liquidity scenarios on live data.",
            "Shareholder Portal Feeds: Power self-service portals with real-time balances.",
            "Board & Investor Reporting: Generate consistent packets from a single source of truth."
        ],
        setup: "Import your existing cap table via CSV or connect an equity administration provider. EquityFlow reconciles the data, flags discrepancies, then enables continuous sync with the downstream systems you select.",
        security: "EquityFlow segregates each issuer into its own encrypted tenant, requires MFA for every administrative action, and produces a tamper-evident audit trail suitable for board and auditor review."
    },
    "paystream": {
        name: "PayStream",
        description: "A versatile payment-processing connector that unites multiple gateways, automates cash-flow reconciliation.",
        overview: "PayStream sits in front of every payment processor you use and presents a single unified API. Payouts, refunds, disputes, and settlement files are normalized so your finance team reconciles once, not once per processor.",
        capabilities: [
            "Multi-Gateway Routing: Route each transaction to the optimal processor based on cost or success rate.",
            "Automatic Reconciliation: Match settlements to source transactions and post journal entries automatically.",
            "Dispute Workflow: Centralize chargeback evidence and response deadlines across processors.",
            "Fee Analytics: Break down effective rates by processor, method, and geography.",
            "Failover: Retry declined transactions on a secondary processor within milliseconds."
        ],
        setup: "Add each processor with its API credentials, map their transaction types to PayStream's unified schema, and choose your routing rules. Go live in shadow mode to validate before switching production traffic.",
        security: "PayStream is PCI DSS-aligned. Card data is tokenized at the edge and never traverses your systems. All processor credentials are stored in an HSM-backed vault with per-request decryption."
    },
    "dividend": {
        name: "Dividend",
        description: "A sophisticated treasury-management integration that consolidates banking data, cash positions, and liquidity forecasts.",
        overview: "Dividend gives treasurers a live view of cash across every bank, currency, and entity. Balances, forecasts, and intercompany positions update continuously so you can move money confidently and hit your yield targets.",
        capabilities: [
            "Global Cash Visibility: See every account in every currency in one dashboard.",
            "Liquidity Forecasting: Project cash positions using AR, AP, and historical patterns.",
            "Intercompany Netting: Automate settlement between entities to reduce FX and fees.",
            "Sweep & Invest: Trigger sweeps to money-market or investment accounts on rules you define.",
            "Bank Fee Analysis: Flag anomalous charges and reclaim over-billed fees."
        ],
        setup: "Connect each bank via SWIFT, EBICS, or an Open Banking token. Dividend backfills historical statements, builds your entity and account hierarchy, then activates real-time balance and transaction streams.",
        security: "Dividend enforces read-only access wherever possible, requires dual approval for any payment-initiation flow, and encrypts every credential with per-tenant keys managed in a FIPS 140-2 validated HSM."
    },
    "budgetbe": {
        name: "BudgetBe",
        description: "A dynamic budgeting and forecasting connector that pulls data from ERP, payroll, and expense platforms.",
        overview: "BudgetBe unifies actuals from your ERP, payroll, and expense systems with your planning models. Variance analysis, driver-based forecasts, and department budgets stay accurate without a monthly consolidation sprint.",
        capabilities: [
            "ERP & Payroll Sync: Ingest actuals nightly from every finance system.",
            "Driver-Based Planning: Model revenue and headcount plans against live operating metrics.",
            "Variance Alerts: Notify budget owners when they drift beyond the thresholds you set.",
            "Scenario Modeling: Compare base, upside, and downside plans side-by-side.",
            "Board-Ready Reporting: Generate the packets your CFO already sends, from one source of truth."
        ],
        setup: "Connect your general ledger, payroll, and expense platforms with read-only credentials. Map accounts to your planning dimensions, import your current plan, then invite budget owners to review and refine.",
        security: "BudgetBe restricts data access by role and department, encrypts sensitive compensation data with a separate key, and supports SSO with SAML and OIDC providers."
    },
    "risksphere": {
        name: "RiskSphere",
        description: "A powerful risk-analysis integration that aggregates market data, credit reports, and internal financial metrics.",
        overview: "RiskSphere combines market data, credit intelligence, and your internal exposures into a single risk model. Limits, concentrations, and stress scenarios update continuously so risk teams act before positions become losses.",
        capabilities: [
            "Real-Time Exposure: Aggregate positions across desks, entities, and asset classes.",
            "Credit Intelligence: Blend third-party credit data with your internal payment history.",
            "Limit Monitoring: Enforce per-counterparty and per-portfolio limits with automated alerts.",
            "Stress Testing: Run historical and hypothetical scenarios on live exposures.",
            "Regulatory Metrics: Compute common risk metrics on demand for internal and external reporting."
        ],
        setup: "Connect your position, market data, and counterparty sources. RiskSphere calibrates the risk model to your portfolio, then streams updated exposures and metrics to your dashboards and downstream systems.",
        security: "RiskSphere isolates each customer's data in its own encrypted namespace, applies row-level access controls per user role, and produces a full lineage trail for every metric it publishes."
    },
};

const IntegrationDetails = () => {
    const { slug } = useParams<{ slug: string }>();
    const data = slug ? integrationData[slug] || integrationData["finsync"] : integrationData["finsync"];

    return (
        <div className="hero-padding-top">
            <Container className="md:space-y-20 space-y-12">
                {/* Header Section */}
                <div className="text-center">
                    <AnimateOnView blur once>
                        <h1 className="h1 md:mb-5 mb-3">
                            {data.name}
                        </h1>
                        <p className="text-muted-foreground text-lg md:max-w-2xl max-w-sm mx-auto md:mb-8 mb-6">
                            {data.description}
                        </p>
                        <div className="text-white text-xl font-medium">
                            {data.name} + DolaPay
                        </div>
                    </AnimateOnView>
                </div>

                {/* Content Sections */}
                <div className="md:space-y-20 space-y-8 max-w-[1062px] mx-auto">
                    <AnimateOnView y={20} blur once delay={0.2}>
                        <section>
                            <h2 className="h3 md:mb-5 mb-3">Overview</h2>
                            <p className="text-muted-foreground">
                                {data.overview}
                            </p>
                        </section>
                    </AnimateOnView>

                    <AnimateOnView y={20} blur once delay={0.3}>
                        <section>
                            <h2 className="h3 md:mb-5 mb-3">Key Capabilities</h2>
                            <p className="text-muted-foreground mb-8">
                                These capabilities allow organizations to operate efficiently, gain clear visibility into their finances, and ensure that all critical financial processes run smoothly without constant manual intervention.
                            </p>
                            <ul className="space-y-4">
                                {data.capabilities.map((cap, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-3 flex-shrink-0" />
                                        {cap}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </AnimateOnView>

                    <AnimateOnView y={20} blur once delay={0.4}>
                        <section>
                            <h2 className="h3 md:mb-5 mb-3">Setup instruction</h2>
                            <p className="text-muted-foreground">
                                {data.setup}
                            </p>
                        </section>
                    </AnimateOnView>

                    <AnimateOnView y={20} blur once delay={0.5}>
                        <section>
                            <h2 className="h3 md:mb-5 mb-3">Security & Compliance</h2>
                            <p className="text-muted-foreground">
                                {data.security}
                            </p>
                        </section>
                    </AnimateOnView>
                </div>
            </Container>
        </div>
    );
};

export default IntegrationDetails;
