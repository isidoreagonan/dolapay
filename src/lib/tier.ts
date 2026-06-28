export type AccountType = "standard" | "enterprise";

export type TierConfig = {
  id: AccountType;
  label: string;
  short: string;
  monthlyLimitXof: number | null; // null = unlimited
  singleTxCapXof: number;
  badgeClass: string;
  icon: string;
  capabilities: {
    payin: boolean;
    paymentLinks: boolean;
    payouts: boolean;
    bulkTransfers: boolean;
    signedWebhooks: boolean;
    vipSupport: boolean;
  };
};

export const TIERS: Record<AccountType, TierConfig> = {
  standard: {
    id: "standard",
    label: "Standard Tier (Plafonné)",
    short: "Standard",
    monthlyLimitXof: 2_000_000,
    singleTxCapXof: 200_000,
    badgeClass: "bg-primary/15 text-primary border border-primary/30",
    icon: "•",
    capabilities: {
      payin: true,
      paymentLinks: true,
      payouts: false,
      bulkTransfers: false,
      signedWebhooks: false,
      vipSupport: false,
    },
  },
  enterprise: {
    id: "enterprise",
    label: "Enterprise Tier (Illimité)",
    short: "Enterprise",
    monthlyLimitXof: null,
    singleTxCapXof: 5_000_000,
    badgeClass:
      "bg-gradient-to-r from-amber-400/20 to-amber-200/10 text-amber-700 dark:text-amber-300 border border-amber-400/40",
    icon: "👑",
    capabilities: {
      payin: true,
      paymentLinks: true,
      payouts: true,
      bulkTransfers: true,
      signedWebhooks: true,
      vipSupport: true,
    },
  },
};

export function getTier(type: AccountType | undefined | null): TierConfig {
  return TIERS[(type ?? "standard") as AccountType] ?? TIERS.standard;
}

export function fmtXof(n: number) {
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(n))} FCFA`;
}
