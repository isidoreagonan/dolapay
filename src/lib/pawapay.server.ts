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
 * Clean phone number to E.164 digits without '+' sign (e.g. "22670123456")
 */
export function cleanPhoneNumber(phone: string, defaultCountryPrefix = "226"): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  // If 8 digits (Burkina Faso local format), prepend 226
  if (digits.length === 8 && defaultCountryPrefix === "226") {
    return `226${digits}`;
  }
  return digits;
}

/**
 * Map generic provider name (MTN, Orange, Moov, Wave, etc.) to PawaPay Correspondent Code
 */
export function getCorrespondentCode(providerName: string, country = "BFA"): string {
  const normalized = providerName.trim().toUpperCase();
  
  if (normalized.includes("ORANGE")) {
    if (country === "SEN") return "ORANGE_SEN";
    if (country === "CIV") return "ORANGE_CIV";
    return "ORANGE_BFA";
  }
  if (normalized.includes("MOOV")) {
    if (country === "BEN") return "MOOV_BEN";
    if (country === "CIV") return "MOOV_CIV";
    return "MOOV_BFA";
  }
  if (normalized.includes("MTN")) {
    if (country === "CIV") return "MTN_MOMO_CIV";
    if (country === "GHA") return "MTN_MOMO_GHA";
    return "MTN_MOMO_BEN";
  }
  if (normalized.includes("WAVE")) {
    if (country === "SEN") return "WAVE_SEN";
    return "WAVE_CIV";
  }
  if (normalized.includes("AIRTEL")) return "AIRTEL_O_COD";
  if (normalized.includes("MPESA") || normalized.includes("M-PESA")) return "VODACOM_MPESA_TZA";
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
    const correspondent = getCorrespondentCode(params.provider);

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
    const correspondent = getCorrespondentCode(params.provider);

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
