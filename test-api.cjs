const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY
);

async function run() {
  const userId = '46179a95-999b-469d-915d-718bae54a844';
  
  const payoutId = "f56b9c99-0a30-4e20-802c-7389146039ea";
  const { data, error } = await supabase.from('transactions').insert({
    id: payoutId,
    profile_id: userId,
    amount: 300,
    net_amount: 303,
    operator_fee: 0,
    gateway_fee: 3,
    dola_margin: 0,
    gateway: "pawapay",
    provider: "pawapay",
    currency: "XOF",
    type: "pay-out",
    status: "processing",
    description: `[RETRAIT_UI] BEN_MTN · 2290157385885`,
    payment_method: "MTN MoMo",
    customer_phone: "2290157385885",
  }).select('*');
    
  if (error) {
    console.error("Error inserting:", error);
  } else {
    console.log("Transactions inserted:", JSON.stringify(data, null, 2));
  }
}

run();
