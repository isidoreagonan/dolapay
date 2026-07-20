import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fix() {
  const { data: profile } = await supabase.from('profiles').select('id').eq('email', 'isidoreagonan@gmail.com').single();
  if (!profile) {
    console.log("No profile");
    return;
  }
  
  const { data: txs } = await supabase.from('transactions').select('amount, net_amount').eq('profile_id', profile.id).eq('status', 'success').eq('type', 'payment_link');
  let payinNet = 0;
  txs.forEach(t => {
    payinNet += Number(t.net_amount || t.amount);
  });
  
  await supabase.from('wallets').update({ balance: payinNet }).eq('profile_id', profile.id);
  await supabase.from('profiles').update({ balance: payinNet, wallet_balance: payinNet }).eq('id', profile.id);
  console.log("Fixed wallet to", payinNet);
}
fix();
