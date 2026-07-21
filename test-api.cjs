const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTxs() {
  const userId = '46179a95-999b-469d-915d-718bae54a844';
  
  // 1. Transactions
  const { data: txs } = await supabase.from('transactions').select('*').or(`profile_id.eq.${userId},merchant_id.eq.${userId}`);
  console.log("TXS:", txs.length);
  
  // 2. Withdrawal Requests
  const { data: wrs } = await supabase.from('withdrawal_requests').select('*').or(`profile_id.eq.${userId},merchant_id.eq.${userId}`);
  console.log("WRS:", wrs.length);
  
  // 3. Payout Batches
  const { data: batches } = await supabase.from('payout_batches').select('*, payout_batch_items(*)').eq('owner_id', userId);
  console.log("BATCHES:", batches.length);
  
  let livePayin = 0;
  let livePayout = 0;
  
  txs.forEach(t => {
    if (t.status === 'success' || t.status === 'completed' || t.status === 'validé') {
      if (t.type === 'pay-out' || t.type === 'withdraw') livePayout += (t.net_amount || t.amount);
      else livePayin += (t.net_amount || t.amount);
    }
  });
  
  batches.forEach(b => {
    b.payout_batch_items.forEach(i => {
      if (i.status === 'success' || i.status === 'completed' || i.status === 'validé') {
        livePayout += (i.amount || b.total_amount);
      }
    });
  });
  
  console.log({ livePayin, livePayout, expectedBalance: livePayin - livePayout });
}

checkTxs();
