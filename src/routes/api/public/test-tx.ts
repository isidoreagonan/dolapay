import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

async function handleTestTx() {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  const userId = "46179a95-999b-469d-915d-718bae54a844";

  // Wipe the ghost balance from user_metadata
  const uRes = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { wallet_balance: 0 }
  });

  const { data: uData } = await supabaseAdmin.auth.admin.getUserById(userId);
  const { data: latestWrs } = await supabaseAdmin.from("withdrawal_requests").select("*").eq("profile_id", userId).order("created_at", { ascending: false }).limit(5);

  return Response.json({
    uError: uRes.error,
    metadata: uData?.user?.user_metadata,
    latestWrs
  });
}

export const Route = createFileRoute("/api/public/test-tx")({
  server: {
    handlers: {
      GET: handleTestTx,
    },
  },
});
