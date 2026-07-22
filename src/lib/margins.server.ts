import { SupabaseClient } from "@supabase/supabase-js";

export async function calculateMargin(
  supabaseAdmin: SupabaseClient,
  amount: number,
  transactionType: "pay-in" | "pay-out",
  provider: string, // e.g. "Orange", "MTN"
  gateway: "pawapay" | "ligdicash",
  feesPaidBy: "merchant" | "customer" = "merchant"
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

  const totalPct = operatorFeePct + gatewayFeePct + dolaMarginPct;
  let finalAmount = amount;
  let netAmount = amount;
  let operator_fee = 0;
  let gateway_fee = 0;
  let dola_margin = 0;
  let totalFees = 0;

  if (transactionType === "pay-in") {
    if (feesPaidBy === "customer") {
      // Customer absorbs the fee so merchant receives EXACTLY `amount`.
      // finalAmount * (1 - totalPct) - fixedFee = amount
      // finalAmount = (amount + fixedFee) / (1 - totalPct)
      finalAmount = Math.ceil((amount + fixedFee) / (1 - totalPct));
      netAmount = amount;
      totalFees = finalAmount - netAmount; // The exact total difference

      // Distribute fees proportionally to the final amount
      operator_fee = Math.round(finalAmount * operatorFeePct);
      gateway_fee = Math.round(finalAmount * gatewayFeePct);
      dola_margin = Math.round(finalAmount * dolaMarginPct);

      // Adjust any rounding discrepancies to dola_margin to ensure math integrity
      const calculatedTotal = operator_fee + gateway_fee + dola_margin + fixedFee;
      if (calculatedTotal !== totalFees) {
        dola_margin += (totalFees - calculatedTotal);
      }
    } else {
      // Merchant pays the fee
      finalAmount = amount;
      operator_fee = Math.round(amount * operatorFeePct);
      gateway_fee = Math.round(amount * gatewayFeePct);
      dola_margin = Math.round(amount * dolaMarginPct);
      totalFees = operator_fee + gateway_fee + dola_margin + fixedFee;
      netAmount = amount - totalFees;
    }
  } else {
    // For pay-out, fees are always deducted from wallet amount
    finalAmount = amount;
    operator_fee = Math.round(amount * operatorFeePct);
    gateway_fee = Math.round(amount * gatewayFeePct);
    dola_margin = Math.round(amount * dolaMarginPct);
    totalFees = operator_fee + gateway_fee + dola_margin + fixedFee;
    netAmount = amount - totalFees; // Actually for payouts, the wallet is debited amount + totalFees usually? No, the code before did amount + totalFees. Let's keep net_amount as amount + totalFees for pay-outs if that's what was there.
    // Wait, the previous code had: `amount + totalFees` for pay-outs. Let's maintain that behavior.
    netAmount = amount + totalFees;
  }

  return {
    operator_fee,
    gateway_fee,
    dola_margin,
    net_amount: netAmount,
    final_amount: finalAmount,
    totalFees
  };
}
