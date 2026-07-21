import { SupabaseClient } from "@supabase/supabase-js";

export async function calculateMargin(
  supabaseAdmin: SupabaseClient,
  amount: number,
  transactionType: "pay-in" | "pay-out",
  provider: string, // e.g. "Orange", "MTN"
  gateway: "pawapay" | "ligdicash"
) {
  // Default values: 1% gateway, 1% dola margin
  let operatorFeePct = 0;
  let gatewayFeePct = gateway === "pawapay" ? 0.01 : 0.01;
  let dolaMarginPct = 0.01; 
  let fixedFee = 0;

  let normalizedProvider = provider.toLowerCase();
  if (normalizedProvider.includes("mtn")) normalizedProvider = "mtn";
  else if (normalizedProvider.includes("moov")) normalizedProvider = "moov";
  else if (normalizedProvider.includes("orange")) normalizedProvider = "orange";
  else if (normalizedProvider.includes("airtel")) normalizedProvider = "airtel";
  else if (normalizedProvider.includes("vodacom")) normalizedProvider = "vodacom";
  else if (normalizedProvider.includes("mpesa") || normalizedProvider.includes("m-pesa")) normalizedProvider = "mpesa";
  else if (normalizedProvider.includes("ethio")) normalizedProvider = "ethio";
  else if (normalizedProvider.includes("telecel")) normalizedProvider = "telecel";
  else if (normalizedProvider.includes("wave")) normalizedProvider = "wave";
  else if (normalizedProvider.includes("halopesa") || normalizedProvider.includes("halo")) normalizedProvider = "halopesa";
  else if (normalizedProvider.includes("zamtel")) normalizedProvider = "zamtel";
  else if (normalizedProvider.includes("tnm")) normalizedProvider = "tnm";
  else if (normalizedProvider.includes("yas")) normalizedProvider = "yas";
  else if (normalizedProvider.includes("at")) normalizedProvider = "at";
  else if (normalizedProvider.includes("free")) normalizedProvider = "free";
  else normalizedProvider = normalizedProvider.split(" ")[0];

  try {
    const { data } = await supabaseAdmin
      .from("fee_structures")
      .select("*")
      .eq("provider", normalizedProvider)
      .eq("gateway", gateway)
      .eq("transaction_type", transactionType)
      .maybeSingle();

    if (data) {
      operatorFeePct = Number(data.operator_fee_percentage) || 0;
      gatewayFeePct = Number(data.gateway_fee_percentage) || 0;
      dolaMarginPct = Number(data.dola_margin_percentage) || 0.01;
      fixedFee = Number(data.fixed_fee) || 0;
    }
  } catch (e) {
    console.error("Error fetching fee structures", e);
  }

  const operator_fee = Math.round(amount * operatorFeePct);
  const gateway_fee = Math.round(amount * gatewayFeePct);
  const dola_margin = Math.round(amount * dolaMarginPct);
  
  const totalFees = operator_fee + gateway_fee + dola_margin + fixedFee;
  
  // For pay-in, net_amount is what the merchant receives (amount - fees).
  // For pay-out, assuming amount is the withdrawal amount from wallet, the fee is deducted from the wallet.
  // We will simply return totalFees and net_amount.
  const net_amount = transactionType === "pay-in" 
    ? amount - totalFees 
    : amount + totalFees;

  return {
    operator_fee,
    gateway_fee,
    dola_margin,
    net_amount,
    totalFees
  };
}
