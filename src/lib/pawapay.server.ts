// Server-side integration library for PawaPay API (Africa Mobile Money Aggregator)
// Documentation: https://docs.pawapay.cloud/

export type CorrespondentCode = 
  | "MTN_MOMO_BEN" | "MTN_MOMO_CIV" | "MTN_MOMO_GHA" | "MTN_MOMO_CMR" | "MTN_MOMO_COG" | "MTN_MOMO_RWA" | "MTN_MOMO_UGA" | "MTN_MOMO_ZMB"
  | "ORANGE_BFA" | "ORANGE_SEN" | "ORANGE_CIV" | "ORANGE_CMR" | "ORANGE_COD" | "ORANGE_COD_USD" | "ORANGE_SLE" | "ORANGE_MLI"
  | "MOOV_BFA" | "MOOV_BEN" | "MOOV_CIV" | "MOOV_TGO" | "MOOV_MLI"
  | "CELTIIS_BEN" | "FREE_SEN" | "WAVE_CIV" | "WAVE_SEN"
  | "AIRTEL_O_COD" | "AIRTEL_COD_USD" | "AIRTEL_GAB" | "AIRTEL_COG" | "AIRTEL_RWA" | "AIRTEL_UGA" | "AIRTEL_ZMB"
  | "VODACOM_MPESA_TZA" | "SAFARICOM_MPESA_KEN" | "VODACOM_MPESA_COD" | "VODACOM_MPESA_COD_USD"
  | "TELECEL_BFA" | "ZAMTEL_ZMB" | "TMONEY_TGO";

export interface PawaPayDepositRequest {
  depositId: string;
  amount: string;
  currency: string;
  correspondent: CorrespondentCode | string;
  payer: {
    type: "MSISDN";
    address: {
      value: string; // E.164 without leading '+' e.g. "22670000000"
    };
  };
  customerTimestamp: string;
  statementDescription?: string;
}

export interface PawaPayDepositResponse {
  depositId: string;
  status: "ACCEPTED" | "REJECTED" | "DUPLICATE_IGNORED";
  rejectionReason?: {
    rejectionCode: string;
    rejectionMessage: string;
  };
}

export interface PawaPayPayoutRequest {
  payoutId: string;
  amount: string;
  currency: string;
  correspondent: CorrespondentCode | string;
  recipient: {
    type: "MSISDN";
    address: {
      value: string;
    };
  };
  customerTimestamp: string;
  statementDescription?: string;
}

export interface PawaPayPayoutResponse {
  payoutId: string;
  status: "ACCEPTED" | "REJECTED" | "DUPLICATE_IGNORED";
  rejectionReason?: {
    rejectionCode: string;
    rejectionMessage: string;
  };
}

export interface PawaPayWebhookPayload {
  depositId?: string;
  payoutId?: string;
  status: "COMPLETED" | "FAILED";
  amount: string;
  currency: string;
  country: string;
  correspondent: string;
  failureReason?: {
    failureCode: string;
    failureMessage: string;
  };
}

/**
 * Detect ISO country code from E.164 or local phone digits
 */
export function detectCountryFromPhone(phone?: string): string {
  if (!phone) return "BFA";
  const digits = phone.replace(/\D/g, "").replace(/^00/, "");
  if (digits.startsWith("226") || (digits.length === 8 && /^[670]/.test(digits))) return "BFA";
  if (digits.startsWith("225") || (digits.length === 10 && /^[0157]/.test(digits))) return "CIV";
  if (digits.startsWith("221") || (digits.length === 9 && /^7[05678]/.test(digits))) return "SEN";
  if (digits.startsWith("229")) return "BEN";
  if (digits.startsWith("228")) return "TGO";
  if (digits.startsWith("223")) return "MLI";
  if (digits.startsWith("237")) return "CMR";
  if (digits.startsWith("243")) return "COD";
  if (digits.startsWith("241")) return "GAB";
  if (digits.startsWith("242")) return "COG";
  if (digits.startsWith("250")) return "RWA";
  if (digits.startsWith("232")) return "SLE";
  if (digits.startsWith("256")) return "UGA";
  if (digits.startsWith("260")) return "ZMB";
  if (digits.startsWith("255")) return "TZA";
  if (digits.startsWith("254")) return "KEN";
  if (digits.startsWith("233")) return "GHA";
  return "BFA";
}

/**
 * Clean phone number to E.164 digits without '+' sign (e.g. "22670123456")
 */
export function cleanPhoneNumber(phone: string, defaultCountryPrefix?: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  
  const country = defaultCountryPrefix ? (defaultCountryPrefix.length === 3 ? detectCountryFromPhone(defaultCountryPrefix) : defaultCountryPrefix) : detectCountryFromPhone(digits);

  // If already full international length
  if (digits.startsWith("226") && digits.length === 11) return digits;
  if (digits.startsWith("225") && digits.length === 13) return digits;
  if (digits.startsWith("221") && digits.length === 12) return digits;
  if (digits.startsWith("229") && (digits.length === 11 || digits.length === 13)) return digits;
  if (digits.startsWith("237") && digits.length === 12) return digits;
  if (digits.startsWith("243") && digits.length >= 11) return digits;
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("241") && digits.length === 11) return digits;

  // Local phone auto-prefixing based on detected or default country
  if (digits.length === 8 && (country === "BFA" || !digits.startsWith("2"))) {
    return `226${digits}`;
  }
  if (digits.length === 10 && country === "CIV") {
    return `225${digits}`;
  }
  if (digits.length === 9 && country === "SEN") {
    return `221${digits}`;
  }
  if ((digits.length === 8 || digits.length === 10) && country === "BEN") {
    return `229${digits}`;
  }
  if (digits.length === 9 && country === "CMR") {
    return `237${digits}`;
  }

  return digits;
}

/**
 * Map generic provider name (MTN, Orange, Moov, Wave, etc.) to PawaPay Correspondent Code
 */
export function getCorrespondentCode(providerName: string, phoneOrCountry = "BFA"): string {
  const normalized = providerName.trim().toUpperCase();
  
  const exactCodes = [
    "MTN_MOMO_BEN", "MTN_MOMO_CIV", "MTN_MOMO_GHA", "MTN_MOMO_CMR", "MTN_MOMO_COG", "MTN_MOMO_RWA", "MTN_MOMO_UGA", "MTN_MOMO_ZMB",
    "ORANGE_BFA", "ORANGE_SEN", "ORANGE_CIV", "ORANGE_CMR", "ORANGE_COD", "ORANGE_COD_USD", "ORANGE_SLE", "ORANGE_MLI",
    "MOOV_BFA", "MOOV_BEN", "MOOV_CIV", "MOOV_TGO", "MOOV_MLI",
    "CELTIIS_BEN", "FREE_SEN", "WAVE_CIV", "WAVE_SEN",
    "AIRTEL_O_COD", "AIRTEL_COD_USD", "AIRTEL_GAB", "AIRTEL_COG", "AIRTEL_RWA", "AIRTEL_UGA", "AIRTEL_ZMB",
    "VODACOM_MPESA_TZA", "SAFARICOM_MPESA_KEN", "VODACOM_MPESA_COD", "VODACOM_MPESA_COD_USD",
    "TELECEL_BFA", "ZAMTEL_ZMB", "TMONEY_TGO"
  ];
  if (exactCodes.includes(normalized)) return normalized;

  // Determine country
  const country = /\d/.test(phoneOrCountry) || phoneOrCountry.length > 3
    ? detectCountryFromPhone(phoneOrCountry)
    : phoneOrCountry.toUpperCase();
  
  // 1. CELTIIS
  if (normalized.includes("CELTIIS")) return "CELTIIS_BEN";

  // 2. FREE MONEY
  if (normalized.includes("FREE")) return "FREE_SEN";

  // 3. TELECEL
  if (normalized.includes("TELECEL")) return "TELECEL_BFA";

  // 4. ZAMTEL
  if (normalized.includes("ZAMTEL")) return "ZAMTEL_ZMB";

  // 5. TMONEY / T-MONEY
  if (normalized.includes("TMONEY") || normalized.includes("T-MONEY")) return "TMONEY_TGO";

  // 6. ORANGE
  if (normalized.includes("ORANGE")) {
    if (country === "SEN") return "ORANGE_SEN";
    if (country === "CIV") return "ORANGE_CIV";
    if (country === "CMR") return "ORANGE_CMR";
    if (country === "COD") return "ORANGE_COD";
    if (country === "SLE") return "ORANGE_SLE";
    if (country === "MLI") return "ORANGE_MLI";
    return "ORANGE_BFA";
  }

  // 7. MOOV
  if (normalized.includes("MOOV")) {
    if (country === "BEN") return "MOOV_BEN";
    if (country === "CIV") return "MOOV_CIV";
    if (country === "TGO") return "MOOV_TGO";
    if (country === "MLI") return "MOOV_MLI";
    return "MOOV_BFA";
  }

  // 8. MTN / MOMO
  if (normalized.includes("MTN") || normalized.includes("MOMO")) {
    if (country === "CIV") return "MTN_MOMO_CIV";
    if (country === "GHA") return "MTN_MOMO_GHA";
    if (country === "CMR") return "MTN_MOMO_CMR";
    if (country === "COG") return "MTN_MOMO_COG";
    if (country === "RWA") return "MTN_MOMO_RWA";
    if (country === "UGA") return "MTN_MOMO_UGA";
    if (country === "ZMB") return "MTN_MOMO_ZMB";
    return "MTN_MOMO_BEN";
  }

  // 9. WAVE
  if (normalized.includes("WAVE")) {
    if (country === "SEN") return "WAVE_SEN";
    return "WAVE_CIV";
  }

  // 10. AIRTEL
  if (normalized.includes("AIRTEL")) {
    if (country === "ZMB") return "AIRTEL_ZMB";
    if (country === "GAB") return "AIRTEL_GAB";
    if (country === "COG") return "AIRTEL_COG";
    if (country === "RWA") return "AIRTEL_RWA";
    if (country === "UGA") return "AIRTEL_UGA";
    return "AIRTEL_O_COD";
  }

  // 11. MPESA / M-PESA / VODACOM
  if (normalized.includes("MPESA") || normalized.includes("M-PESA") || normalized.includes("VODACOM")) {
    if (country === "KEN") return "SAFARICOM_MPESA_KEN";
    if (country === "COD") return "VODACOM_MPESA_COD";
    return "VODACOM_MPESA_TZA";
  }

  return "ORANGE_BFA";
}

export class PawaPayClient {
  private apiToken: string | undefined;
  private baseUrl: string;

  constructor() {
    this.apiToken = process.env.PAWAPAY_API_TOKEN;
    const isLive = process.env.PAWAPAY_ENVIRONMENT === "production" || 
                   process.env.PAWAPAY_ENV === "live" || 
                   process.env.NODE_ENV === "production" || 
                   process.env.VERCEL_ENV === "production" ||
                   (process.env.PAWAPAY_ENVIRONMENT !== "sandbox" && process.env.PAWAPAY_ENV !== "sandbox");
    this.baseUrl = isLive
      ? "https://api.pawapay.cloud"
      : "https://api.sandbox.pawapay.cloud";
  }

  private async request<T>(endpoint: string, method: string, body?: unknown): Promise<T> {
    if (!this.apiToken) {
      console.warn(`[PawaPay] PAWAPAY_API_TOKEN non défini. Simulation en mode Sandbox pour ${endpoint}`);
      if (method === "GET" && endpoint.startsWith("/deposits/")) {
        const id = endpoint.split("/")[2] || "simulated_dep";
        return [{ depositId: id, status: "ACCEPTED" }] as unknown as T;
      }
      if (endpoint.includes("/deposits")) {
        return {
          depositId: (body as PawaPayDepositRequest)?.depositId || "simulated_dep",
          status: "ACCEPTED",
        } as unknown as T;
      }
      if (endpoint.includes("/payouts")) {
        return {
          payoutId: (body as PawaPayPayoutRequest)?.payoutId || "simulated_payout",
          status: "ACCEPTED",
        } as unknown as T;
      }
      return {} as T;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiToken}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[PawaPay API Error] ${method} ${endpoint} - Status ${response.status}: ${errText}`);
      throw new Error(`PawaPay API Error (${response.status}): ${errText}`);
    }

    return response.json() as Promise<T>;
  }

  private cleanStatementDescription(text?: string, fallback = "DolaPay"): string {
    if (!text) return fallback;
    const unaccented = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const alphanumeric = unaccented.replace(/[^a-zA-Z0-9\s]/g, " ");
    const cleaned = alphanumeric.replace(/\s+/g, " ").trim().slice(0, 22).trim();
    return cleaned.length > 0 ? cleaned : fallback;
  }

  async initiateDeposit(params: {
    depositId: string;
    amount: number;
    currency: string;
    phone: string;
    provider: string;
    description?: string;
  }): Promise<PawaPayDepositResponse> {
    const cleanPhone = cleanPhoneNumber(params.phone);
    const correspondent = getCorrespondentCode(params.provider, params.phone);

    const payload: PawaPayDepositRequest = {
      depositId: params.depositId && params.depositId.length === 36 ? params.depositId : crypto.randomUUID(),
      amount: Math.round(params.amount).toString(),
      currency: params.currency || "XOF",
      correspondent,
      payer: {
        type: "MSISDN",
        address: {
          value: cleanPhone,
        },
      },
      customerTimestamp: new Date().toISOString(),
      statementDescription: this.cleanStatementDescription(params.description, "DolaPay Deposit"),
    };

    return this.request<PawaPayDepositResponse>("/deposits", "POST", payload);
  }

  async initiatePayout(params: {
    payoutId: string;
    amount: number;
    currency: string;
    phone: string;
    provider: string;
    description?: string;
  }): Promise<PawaPayPayoutResponse> {
    const cleanPhone = cleanPhoneNumber(params.phone);
    const correspondent = getCorrespondentCode(params.provider, params.phone);

    const payload: PawaPayPayoutRequest = {
      payoutId: params.payoutId && params.payoutId.length === 36 ? params.payoutId : crypto.randomUUID(),
      amount: Math.round(params.amount).toString(),
      currency: params.currency || "XOF",
      correspondent,
      recipient: {
        type: "MSISDN",
        address: {
          value: cleanPhone,
        },
      },
      customerTimestamp: new Date().toISOString(),
      statementDescription: this.cleanStatementDescription(params.description, "DolaPay Payout"),
    };

    return this.request<PawaPayPayoutResponse>("/payouts", "POST", payload);
  }

  async getDepositStatus(depositId: string): Promise<{
    depositId: string;
    status: "ACCEPTED" | "SUBMITTED" | "COMPLETED" | "FAILED";
    failureReason?: {
      failureCode?: string;
      failureMessage?: string;
    } | null;
  } | null> {
    try {
      const res = await this.request<any>(`/deposits/${encodeURIComponent(depositId)}`, "GET");
      if (Array.isArray(res) && res.length > 0) {
        return res[0];
      }
      if (res && !Array.isArray(res) && res.status) {
        return res;
      }
      return null;
    } catch (e) {
      console.warn(`[PawaPay] getDepositStatus failed for ${depositId}:`, e);
      return null;
    }
  }
}

export const pawapay = new PawaPayClient();
