// Server-side integration library for PawaPay API (Africa Mobile Money Aggregator)
// Documentation: https://docs.pawapay.cloud/

export type CorrespondentCode = 
  | "MTN_MOMO_BEN" | "MTN_MOMO_CIV" | "MTN_MOMO_GHA" | "MTN_MOMO_CMR"
  | "ORANGE_BFA" | "ORANGE_SEN" | "ORANGE_CIV" | "ORANGE_CMR"
  | "MOOV_BFA" | "MOOV_BEN" | "MOOV_CIV" | "MOOV_TGO"
  | "WAVE_CIV" | "WAVE_SEN"
  | "AIRTEL_O_COD" | "AIRTEL_ZMB"
  | "VODACOM_MPESA_TZA" | "SAFARICOM_MPESA_KEN" | "TELECEL_BFA";

export interface PawaPayDepositRequest {
  depositId: string;
  amount: string;
  currency: string;
  correspondent: CorrespondentCode | string;
  payer: {
    type: "MSISDN";
    address: string; // E.164 without leading '+' e.g. "22670000000"
  };
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
    address: string;
  };
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
  if (digits.startsWith("226") || digits.length === 8) return "BFA";
  if (digits.startsWith("225") || (digits.length === 10 && /^[0157]/.test(digits))) return "CIV";
  if (digits.startsWith("221") || (digits.length === 9 && /^7[05678]/.test(digits))) return "SEN";
  if (digits.startsWith("229")) return "BEN";
  if (digits.startsWith("228")) return "TGO";
  if (digits.startsWith("233")) return "GHA";
  if (digits.startsWith("237")) return "CMR";
  if (digits.startsWith("243")) return "COD";
  if (digits.startsWith("260")) return "ZMB";
  if (digits.startsWith("255")) return "TZA";
  if (digits.startsWith("254")) return "KEN";
  return "BFA";
}

/**
 * Clean phone number to E.164 digits without '+' sign (e.g. "22670123456")
 */
export function cleanPhoneNumber(phone: string, defaultCountryPrefix?: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  
  const country = defaultCountryPrefix ? (defaultCountryPrefix.length === 3 ? detectCountryFromPhone(defaultCountryPrefix) : defaultCountryPrefix) : detectCountryFromPhone(digits);

  // If already full international length (e.g. 22670123456 = 11 digits, 2250701234567 = 13 digits, 221771234567 = 12 digits)
  if (digits.startsWith("226") && digits.length === 11) return digits;
  if (digits.startsWith("225") && digits.length === 13) return digits;
  if (digits.startsWith("221") && digits.length === 12) return digits;
  if (digits.startsWith("229") && digits.length === 11) return digits;

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
  if (digits.length === 8 && country === "BEN") {
    return `229${digits}`;
  }

  return digits;
}

/**
 * Map generic provider name (MTN, Orange, Moov, Wave, etc.) to PawaPay Correspondent Code
 */
export function getCorrespondentCode(providerName: string, phoneOrCountry = "BFA"): string {
  const normalized = providerName.trim().toUpperCase();
  
  // If exact PawaPay correspondent code already
  const exactCodes = [
    "MTN_MOMO_BEN", "MTN_MOMO_CIV", "MTN_MOMO_GHA", "MTN_MOMO_CMR",
    "ORANGE_BFA", "ORANGE_SEN", "ORANGE_CIV", "ORANGE_CMR",
    "MOOV_BFA", "MOOV_BEN", "MOOV_CIV", "MOOV_TGO",
    "WAVE_CIV", "WAVE_SEN",
    "AIRTEL_O_COD", "AIRTEL_ZMB",
    "VODACOM_MPESA_TZA", "SAFARICOM_MPESA_KEN", "TELECEL_BFA"
  ];
  if (exactCodes.includes(normalized)) return normalized;

  // Determine country (if phoneOrCountry has numbers or is > 3 chars, detect from phone)
  const country = /\d/.test(phoneOrCountry) || phoneOrCountry.length > 3
    ? detectCountryFromPhone(phoneOrCountry)
    : phoneOrCountry.toUpperCase();
  
  if (normalized.includes("ORANGE")) {
    if (country === "SEN") return "ORANGE_SEN";
    if (country === "CIV") return "ORANGE_CIV";
    if (country === "CMR") return "ORANGE_CMR";
    return "ORANGE_BFA";
  }
  if (normalized.includes("MOOV")) {
    if (country === "BEN") return "MOOV_BEN";
    if (country === "CIV") return "MOOV_CIV";
    if (country === "TGO") return "MOOV_TGO";
    return "MOOV_BFA";
  }
  if (normalized.includes("MTN")) {
    if (country === "CIV") return "MTN_MOMO_CIV";
    if (country === "GHA") return "MTN_MOMO_GHA";
    if (country === "CMR") return "MTN_MOMO_CMR";
    return "MTN_MOMO_BEN";
  }
  if (normalized.includes("WAVE")) {
    if (country === "SEN") return "WAVE_SEN";
    return "WAVE_CIV";
  }
  if (normalized.includes("AIRTEL")) {
    if (country === "ZMB") return "AIRTEL_ZMB";
    return "AIRTEL_O_COD";
  }
  if (normalized.includes("MPESA") || normalized.includes("M-PESA")) {
    if (country === "KEN") return "SAFARICOM_MPESA_KEN";
    return "VODACOM_MPESA_TZA";
  }
  if (normalized.includes("TELECEL")) return "TELECEL_BFA";

  // Default fallback for Burkina Faso
  return "ORANGE_BFA";
}

export class PawaPayClient {
  private apiToken: string | undefined;
  private baseUrl: string;

  constructor() {
    this.apiToken = process.env.PAWAPAY_API_TOKEN;
    const isLive = process.env.PAWAPAY_ENVIRONMENT === "production" || process.env.PAWAPAY_ENV === "live";
    this.baseUrl = isLive
      ? "https://api.pawapay.cloud"
      : "https://api.sandbox.pawapay.cloud";
  }

  private async request<T>(endpoint: string, method: string, body?: unknown): Promise<T> {
    if (!this.apiToken) {
      console.warn(`[PawaPay] PAWAPAY_API_TOKEN non défini. Simulation en mode Sandbox pour ${endpoint}`);
      // Return simulated success response
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
      depositId: params.depositId,
      amount: Math.round(params.amount).toString(),
      currency: params.currency || "XOF",
      correspondent,
      payer: {
        type: "MSISDN",
        address: cleanPhone,
      },
      statementDescription: (params.description || "DolaPay Charge").slice(0, 22),
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
      payoutId: params.payoutId,
      amount: Math.round(params.amount).toString(),
      currency: params.currency || "XOF",
      correspondent,
      recipient: {
        type: "MSISDN",
        address: cleanPhone,
      },
      statementDescription: (params.description || "DolaPay Payout").slice(0, 22),
    };

    return this.request<PawaPayPayoutResponse>("/payouts", "POST", payload);
  }
}

export const pawapay = new PawaPayClient();
