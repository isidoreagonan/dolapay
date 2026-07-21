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

  return Response.json({
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
