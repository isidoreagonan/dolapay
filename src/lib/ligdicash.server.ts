// Server-side integration library for LigdiCash API (Burkina Faso & West Africa Mobile Money Aggregator)
// Official Partner: LigdiCash SARL & DOLAPO ECOM LLC (DolaPay) - Contract Signed
// Documentation: https://developers.ligdicash.com/

export type LigdiCashMethod = "WALLET" | "ORANGE" | "MOOV" | "TELECEL" | "VIREMENT" | "CHEQUE";

export interface LigdiCashPayinRequest {
  amount: number; // Montant en FCFA (XOF)
  currency?: string; // "xof" (par défaut)
  description: string;
  customer: {
    firstname: string;
    lastname: string;
    email?: string;
    phone: string; // ex: "22670000000"
  };
  customData?: Record<string, any>;
  returnUrl?: string;
  callbackUrl?: string; // Webhook DolaPay
}

export interface LigdiCashPayinResponse {
  response_code: string; // "00" pour succès / initialisé
  response_text: string;
  token?: string; // Jeton de paiement LigdiCash
  response_content?: {
    payment_url?: string;
    token?: string;
    transaction_id?: string;
  };
}

export interface LigdiCashPayoutRequest {
  amount: number;
  currency?: string;
  description: string;
  recipient: {
    phone: string; // ex: "22670000000"
    firstname?: string;
    lastname?: string;
  };
  method: LigdiCashMethod;
  customData?: Record<string, any>;
}

export interface LigdiCashPayoutResponse {
  response_code: string;
  response_text: string;
  transaction_id?: string;
  status?: string;
}

export interface LigdiCashWebhookPayload {
  token?: string;
  transaction_id?: string;
  order_id?: string;
  status: "completed" | "failed" | "pending" | "cancelled" | "COMPLETED" | "FAILED";
  amount: number | string;
  currency?: string;
  custom_data?: Record<string, any> | string;
  operator_id?: string;
  customer_phone?: string;
}

/**
 * Calcul officiel des commissions LigdiCash (Article 6.3 du Contrat signé)
 * Payin Wallet: 1% | Orange/Moov: 2.5%
 * Payout Wallet: 0% | Orange: 1.5% | Moov: 1.5% | Virement/Chèque: 0%
 */
export function calculateLigdiCashFee(
  service: "PAYIN" | "PAYOUT",
  method: LigdiCashMethod,
  amount: number
): { feeRate: number; feeAmount: number; netAmount: number } {
  let feeRate = 0;

  if (service === "PAYIN") {
    if (method === "WALLET") {
      feeRate = 0.01; // 1%
    } else {
      // ORANGE, MOOV, TELECEL
      feeRate = 0.025; // 2,5%
    }
  } else if (service === "PAYOUT") {
    if (method === "WALLET" || method === "VIREMENT" || method === "CHEQUE") {
      feeRate = 0; // 0%
    } else {
      // ORANGE, MOOV
      feeRate = 0.015; // 1,5%
    }
  }

  const feeAmount = Math.round(amount * feeRate);
  const netAmount = amount - feeAmount;

  return { feeRate, feeAmount, netAmount };
}

/**
 * Formate un numéro de téléphone pour le Burkina Faso / LigdiCash (ex: "22670123456")
 */
export function formatLigdiCashPhone(phone: string, defaultPrefix = "226"): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.length === 8 && defaultPrefix === "226") {
    return `226${digits}`;
  }
  return digits;
}

/**
 * Initialiser un paiement (Pay-in) via LigdiCash REST API
 */
export async function createLigdiCashPayin(
  req: LigdiCashPayinRequest,
  config?: { apiKey?: string; authToken?: string; baseUrl?: string }
): Promise<LigdiCashPayinResponse> {
  const apiKey = config?.apiKey || process.env.LIGDICASH_API_KEY;
  const authToken = config?.authToken || process.env.LIGDICASH_AUTH_TOKEN;
  const baseUrl = config?.baseUrl || "https://app.ligdicash.com/pay/v01/redirect/checkout-invoice/create";

  if (!apiKey || !authToken) {
    throw new Error("LigdiCash API Key ou Auth Token manquant.");
  }

  const payload = {
    commande: {
      invoice: {
        total_amount: req.amount,
        currency: req.currency || "xof",
        description: req.description,
        customer: req.customer,
        custom_data: req.customData || {},
        return_url: req.returnUrl || "https://dola-pay.com/dashboard",
        callback_url: req.callbackUrl || "https://dola-pay.com/api/public/ligdicash-webhook",
      },
      store: {
        name: "DolaPay",
        website_url: "https://dola-pay.com",
      },
    },
  };

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
      "Apikey": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`LigdiCash Payin Error (${response.status}): ${errText}`);
  }

  return response.json();
}

/**
 * Initialiser un décaissement (Pay-out) vers Mobile Money via LigdiCash
 */
export async function createLigdiCashPayout(
  req: LigdiCashPayoutRequest,
  config?: { apiKey?: string; authToken?: string; baseUrl?: string }
): Promise<LigdiCashPayoutResponse> {
  const apiKey = config?.apiKey || process.env.LIGDICASH_API_KEY;
  const authToken = config?.authToken || process.env.LIGDICASH_AUTH_TOKEN;
  const baseUrl = config?.baseUrl || "https://app.ligdicash.com/pay/v01/withdrawal/create";

  if (!apiKey || !authToken) {
    throw new Error("LigdiCash API Key ou Auth Token manquant.");
  }

  const payload = {
    withdrawal: {
      amount: req.amount,
      currency: req.currency || "xof",
      description: req.description,
      customer: {
        phone: formatLigdiCashPhone(req.recipient.phone),
        firstname: req.recipient.firstname || "Client",
        lastname: req.recipient.lastname || "DolaPay",
      },
      method: req.method,
      custom_data: req.customData || {},
    },
  };

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
      "Apikey": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`LigdiCash Payout Error (${response.status}): ${errText}`);
  }

  return response.json();
}
