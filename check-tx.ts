import { supabaseAdmin } from "./src/integrations/supabase/client.server.js";

async function run() {
  const { data: tx, error } = await supabaseAdmin.from("transactions").select("*").order("created_at", { ascending: false }).limit(5);
  console.log("Last 5 transactions:", JSON.stringify(tx, null, 2));
}

run();
