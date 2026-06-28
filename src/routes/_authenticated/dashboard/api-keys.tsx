import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, Copy, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "./route";

export const Route = createFileRoute("/_authenticated/dashboard/api-keys")({
  component: ApiKeysPage,
});

type Key = { id: string; label: string; prefix: string; created_at: string; revoked_at: string | null };

function ApiKeysPage() {
  const qc = useQueryClient();
  const { data: profile } = useProfile();
  const [label, setLabel] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);

  const { data: keys = [] } = useQuery({
    queryKey: ["my-api-keys"],
    queryFn: async (): Promise<Key[]> => {
      const { data, error } = await supabase
        .from("api_keys")
        .select("id,label,prefix,created_at,revoked_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Key[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Non connecté");
      const raw = "dp_live_" + crypto.randomUUID().replace(/-/g, "");
      const prefix = raw.slice(0, 12);
      // Simple hash via Web Crypto SHA-256
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
      const hashed = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
      const { error } = await supabase.from("api_keys").insert({
        profile_id: u.user.id,
        label,
        prefix,
        hashed_key: hashed,
      });
      if (error) throw error;
      return raw;
    },
    onSuccess: (raw) => {
      setNewKey(raw);
      setLabel("");
      qc.invalidateQueries({ queryKey: ["my-api-keys"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const revoke = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("api_keys").update({ revoked_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Clé révoquée"); qc.invalidateQueries({ queryKey: ["my-api-keys"] }); },
  });

  if (profile?.account_type !== "enterprise") {
    return (
      <Card className="p-8 text-center">
        <KeyRound className="mx-auto h-8 w-8 text-muted-foreground" />
        <h2 className="mt-3 text-lg font-semibold">Réservé aux comptes Entreprise</h2>
        <p className="mt-1 text-sm text-muted-foreground">Passez au compte Entreprise dans les paramètres pour accéder à l'API.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clés API</h1>
        <p className="text-sm text-muted-foreground">Créez des clés pour intégrer DolaPay à vos applications.</p>
      </div>

      <Card className="p-6">
        <form
          onSubmit={(e) => { e.preventDefault(); create.mutate(); }}
          className="grid gap-3 sm:grid-cols-[1fr_auto]"
        >
          <Input placeholder="Libellé (ex: production-server)" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Button type="submit" disabled={create.isPending}><KeyRound className="h-4 w-4 mr-2" />Générer</Button>
        </form>

        {newKey && (
          <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Copiez cette clé maintenant — elle ne sera plus jamais affichée.</div>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-background px-3 py-2 font-mono text-xs">{newKey}</code>
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(newKey); toast.success("Copié"); }}><Copy className="h-3 w-3" /></Button>
            </div>
            <Button size="sm" variant="ghost" className="mt-2" onClick={() => setNewKey(null)}>J'ai sauvegardé la clé</Button>
          </div>
        )}
      </Card>

      <div className="grid gap-3">
        {keys.map((k) => (
          <Card key={k.id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-semibold">{k.label}</div>
              <div className="font-mono text-xs text-muted-foreground">{k.prefix}…••••••••</div>
            </div>
            {k.revoked_at ? (
              <span className="text-xs text-muted-foreground">Révoquée</span>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => revoke.mutate(k.id)}>
                <Trash2 className="h-3 w-3 mr-1" /> Révoquer
              </Button>
            )}
          </Card>
        ))}
        {keys.length === 0 && <p className="text-sm text-muted-foreground">Aucune clé encore.</p>}
      </div>
    </div>
  );
}
