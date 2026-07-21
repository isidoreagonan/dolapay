// Single source of truth for DolaPay's transparent "Cost-Plus" pricing.
// Headline model: DolaPay platform fee + real operator fee (no hidden markup).

export type PayinOperator = {
  id: string;
  network: string;
  country: string;
  countryCode: string; // ISO-2
  currency: "XOF" | "XAF" | "KES" | "RWF" | "UGX" | "ZMW" | "GHS" | "TZS" | "CDF";
  /** Real operator collection fee charged by the MNO, expressed as a fraction (0.01 = 1%). */
  operatorFee: number;
  /** Real operator payout/disbursement fee. */
  payoutFee: number;
};

export const PAYIN_OPERATORS: PayinOperator[] = [
  // West Africa — XOF / GHS
  { id: "mtn_bj", network: "MTN", country: "Bénin", countryCode: "BJ", currency: "XOF", operatorFee: 0.012, payoutFee: 0.005 },
  { id: "moov_bj", network: "Moov", country: "Bénin", countryCode: "BJ", currency: "XOF", operatorFee: 0.012, payoutFee: 0.0 },
  { id: "mtn_ci", network: "MTN", country: "Côte d'Ivoire", countryCode: "CI", currency: "XOF", operatorFee: 0.008, payoutFee: 0.003 },
  { id: "orange_ci", network: "Orange", country: "Côte d'Ivoire", countryCode: "CI", currency: "XOF", operatorFee: 0.015, payoutFee: 0.01 },
  { id: "moov_ci", network: "Moov", country: "Côte d'Ivoire", countryCode: "CI", currency: "XOF", operatorFee: 0.012, payoutFee: 0.005 },
  { id: "orange_sn", network: "Orange", country: "Sénégal", countryCode: "SN", currency: "XOF", operatorFee: 0.01, payoutFee: 0.008 },
  { id: "free_sn", network: "Free", country: "Sénégal", countryCode: "SN", currency: "XOF", operatorFee: 0.01, payoutFee: 0.005 },
  { id: "orange_bf", network: "Orange", country: "Burkina Faso", countryCode: "BF", currency: "XOF", operatorFee: 0.015, payoutFee: 0.008 },
  { id: "moov_bf", network: "Moov", country: "Burkina Faso", countryCode: "BF", currency: "XOF", operatorFee: 0.012, payoutFee: 0.005 },

  // Central Africa — XAF / CDF
  { id: "mtn_cm", network: "MTN", country: "Cameroun", countryCode: "CM", currency: "XAF", operatorFee: 0.0075, payoutFee: 0.003 },
  { id: "orange_cm", network: "Orange", country: "Cameroun", countryCode: "CM", currency: "XAF", operatorFee: 0.0077, payoutFee: 0.0 },
  { id: "vodacom_cd", network: "Vodacom", country: "RDC", countryCode: "CD", currency: "CDF", operatorFee: 0.015, payoutFee: 0.01 },

  // East / Southern Africa
  { id: "mpesa_ke", network: "M-Pesa", country: "Kenya", countryCode: "KE", currency: "KES", operatorFee: 0.015, payoutFee: 0.01 },
  { id: "mtn_rw", network: "MTN", country: "Rwanda", countryCode: "RW", currency: "RWF", operatorFee: 0.021, payoutFee: 0.012 },
  { id: "airtel_rw", network: "Airtel", country: "Rwanda", countryCode: "RW", currency: "RWF", operatorFee: 0.015, payoutFee: 0.0 },
  { id: "mtn_ug", network: "MTN", country: "Ouganda", countryCode: "UG", currency: "UGX", operatorFee: 0.02, payoutFee: 0.01 },
  { id: "airtel_ug", network: "Airtel", country: "Ouganda", countryCode: "UG", currency: "UGX", operatorFee: 0.015, payoutFee: 0.01 },
  { id: "airtel_zm", network: "Airtel", country: "Zambie", countryCode: "ZM", currency: "ZMW", operatorFee: 0.012, payoutFee: 0.008 },
];

export const PLATFORM_FEES = {
  payinStandard: 0.02, // 2%
  payinEnterprise: 0.015, // 1.5% > 50M FCFA/mois
  payout: 0.01, // 1% + network
  walletToWallet: 0, // free instant settlement
  card: { rate: 0.025, flatXof: 100 }, // 2.5% + 100 FCFA + bank interchange
  enterpriseThresholdXof: 50_000_000,
};

export type FeeBreakdown = {
  volume: number;
  operatorFee: number;
  platformFee: number;
  total: number;
  net: number;
  tier: "standard" | "enterprise";
  platformRate: number;
  operatorRate: number;
  competitor: number;
  savings: number;
};

const COMPETITOR_FLAT_RATE = 0.035; // benchmark traditional aggregator (~3.5% all-in)

export function computePayinFees(volume: number, operator: PayinOperator): FeeBreakdown {
  const tier: "standard" | "enterprise" =
    volume >= PLATFORM_FEES.enterpriseThresholdXof ? "enterprise" : "standard";
  const platformRate = tier === "enterprise" ? PLATFORM_FEES.payinEnterprise : PLATFORM_FEES.payinStandard;
  const operatorRate = operator.operatorFee;
  const operatorFee = volume * operatorRate;
  const platformFee = volume * platformRate;
  const total = operatorFee + platformFee;
  const competitor = volume * COMPETITOR_FLAT_RATE;
  return {
    volume,
    operatorFee,
    platformFee,
    total,
    net: volume - total,
    tier,
    platformRate,
    operatorRate,
    competitor,
    savings: competitor - total,
  };
}

export function fmtMoney(n: number, currency = "FCFA") {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n))} ${currency}`;
}

export function fmtPct(rate: number) {
  return `${(rate * 100).toLocaleString("fr-FR", { maximumFractionDigits: 2 })}%`;
}
