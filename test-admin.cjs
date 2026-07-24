const { createClient } = require('@supabase/supabase-js');
const s = createClient('https://sdieqwzrggypjpkjiogg.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkaWVxd3pyZ2d5cGpwa2ppb2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNTg5OTcsImV4cCI6MjA5NzYzNDk5N30.IFvtiL64qQUhrmZRit5mSzaLB_YdgfTpdJwc3OSjTJs');

(async () => {
  // We can't query pg_policies directly via REST API usually, but we can try if there's a view or RPC.
  // Actually, we can just use supabase admin to fetch 1 row of payout_batches to see if it works.
  // Wait, I want to fetch pg_policies.
  // Since we don't have direct DB access, I'll just check if payout_batches returns data with the service role key.
  const { data: b } = await s.from("payout_batches").select("id").limit(1);
  console.log("Batches count with anon:", b?.length);
})();
