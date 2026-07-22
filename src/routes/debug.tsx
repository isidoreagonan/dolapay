import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/debug")({
  component: DebugPage,
});

function DebugPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["debug-txs"],
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const { data: txs } = await supabase.from("transactions").select("*").gte("created_at", since).order("created_at", { ascending: false }).limit(10000);
      const { data: wrs } = await supabase.from("withdrawal_requests").select("*").gte("created_at", since).limit(10000);
      const { data: oldWrs } = await supabase.from("withdrawals").select("*").gte("created_at", since).limit(10000);
      const { data: batches } = await supabase.from("payout_batches").select("*, payout_batch_items(*)").gte("created_at", since).limit(10000);
      
      return { txs, wrs, oldWrs, batches };
    },
  });

  if (isLoading) return <div className="p-10 text-white">Loading debug data...</div>;
  if (error) return <div className="p-10 text-white text-red-500">Error: {(error as any).message}</div>;

  return (
    <div className="p-10 bg-black text-white min-h-screen font-mono text-sm">
      <h1 className="text-2xl mb-4 font-bold">Debug Dump (Last 30 Days)</h1>
      <pre className="whitespace-pre-wrap break-words">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
