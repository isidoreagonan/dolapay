const { createClient } = require('@supabase/supabase-js');
// Get the keys from .env
require('dotenv').config({ path: 'C:/Users/DELL/Desktop/DOLAPAY/.env' });
const s = createClient('https://sdieqwzrggypjpkjiogg.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  console.log('Fetching payout batches...');
  const { data: batches, error: bErr } = await s.from('payout_batches').select('*, payout_batch_items(*)');
  if (bErr) { console.error(bErr); return; }
  
  let count = 0;
  for (const b of batches) {
    if (b.payout_batch_items) {
      for (const item of b.payout_batch_items) {
        const { data: tx } = await s.from('transactions').select('id').eq('id', item.id).maybeSingle();
        if (!tx) {
          console.log('Missing tx found! Inserting ID:', item.id);
          const amt = Number(item.amount || b.total_amount || 0);
          const st = amt === 101 ? 'failed' : ((item.status === 'completed' || item.status === 'success' || item.status === 'validé') ? 'success' : (item.status === 'failed' || item.status === 'rejected' ? 'failed' : 'pending'));
          
          const payload = {
            id: item.id,
            profile_id: b.owner_id,
            amount: amt,
            net_amount: amt,
            currency: 'XOF',
            type: 'pay-out',
            status: st,
            description: 'Retrait Mobile Money - ' + (item.provider || 'MOMO') + ' (' + (item.recipient_phone || 'N/A') + ')',
            gateway: 'pawapay',
            provider: item.provider || 'MOMO',
            payment_method: item.provider || 'MOMO',
            customer_phone: item.recipient_phone || 'N/A',
            created_at: item.created_at || b.created_at
          };
          
          const { error: insertErr } = await s.from('transactions').insert(payload);
          if (insertErr) {
            console.error('Error inserting', item.id, insertErr);
          } else {
            console.log('Successfully inserted', item.id);
            count++;
          }
        }
      }
    }
  }
  console.log('Done! Inserted', count, 'missing transactions.');
})();
