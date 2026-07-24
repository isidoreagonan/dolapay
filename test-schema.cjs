const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://sdieqwzrggypjpkjiogg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkaWVxd3pyZ2d5cGpwa2ppb2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNTg5OTcsImV4cCI6MjA5NzYzNDk5N30.IFvtiL64qQUhrmZRit5mSzaLB_YdgfTpdJwc3OSjTJs"
);

async function test() {
  const { data: txs } = await supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(20);
  const { data: wrs } = await supabase.from("withdrawal_requests").select("*").order("created_at", { ascending: false }).limit(20);
  const { data: oldWrs } = await supabase.from("withdrawals").select("*").order("created_at", { ascending: false }).limit(20);
  
  console.log("=== TRANSACTIONS ===");
  if (txs) txs.filter(t => t.amount == 200 || t.amount == 300).forEach(t => console.log(t.id, t.amount, t.type, t.status, t.created_at));
  
  console.log("\n=== WITHDRAWAL REQUESTS ===");
  if (wrs) wrs.filter(t => t.amount == 200 || t.amount == 300).forEach(t => console.log(t.id, t.amount, t.status, t.created_at));

  console.log("\n=== WITHDRAWALS ===");
  if (oldWrs) oldWrs.filter(t => t.amount == 200 || t.amount == 300).forEach(t => console.log(t.id, t.amount, t.status, t.created_at));
}

test();
