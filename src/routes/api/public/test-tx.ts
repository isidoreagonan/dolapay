import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

async function handleTestTx() {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  const userId = "46179a95-999b-469d-915d-718bae54a844";

  const wRes = await supabaseAdmin.from("wallets").select("*").eq("profile_id", userId);
  
  // Wipe the manual balance
  const uRes = await supabaseAdmin.from("wallets").update({ balance: 0 }).eq("profile_id", userId);

  return Response.json({
    wallets: wRes.data,
    wError: wRes.error,
    uError: uRes.error
  });
}

export const Route = createFileRoute("/api/public/test-tx")({
  server: {
    handlers: {
      GET: handleTestTx,
    },
  },
});
