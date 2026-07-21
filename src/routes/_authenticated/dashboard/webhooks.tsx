import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Webhook, RefreshCw, KeyRound, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "./route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/webhooks")({
  component: WebhooksPage,
});

type WebhookEndpoint = {
  id: string;
  url: string;
  secret: string;
  active: boolean;
  created_at: string;
};

function WebhooksPage() {
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});

  const { data: webhooks, isLoading } = useQuery({
    queryKey: ["webhooks"],
    queryFn: async (): Promise<WebhookEndpoint[]> => {
      const { data, error } = await supabase
        .from("webhook_endpoints")
        .select("*")
        .order("created_at", { ascending: false });
      if (error && error.code !== "42P01") throw error; // Ignore table missing for now if not applied
      return (data as WebhookEndpoint[]) || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (url: string) => {
      // Generate a whsec_ secret
      const secret = `whsec_${crypto.randomUUID().replace(/-/g, "")}`;
      const { error } = await supabase.from("webhook_endpoints").insert({
        profile_id: profile?.id,
        url,
        secret,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Webhook ajouté avec succès");
      setNewUrl("");
      setShowAdd(false);
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
    onError: (err: any) => toast.error(err.message || "Erreur lors de l'ajout"),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from("webhook_endpoints")
        .update({ active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Statut mis à jour");
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("webhook_endpoints").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Webhook supprimé");
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
  });

  if (profile?.account_type !== "enterprise") {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <Webhook className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Fonctionnalité Enterprise</h2>
        <p className="mt-2 max-w-md text-slate-500 dark:text-slate-400">
          Les webhooks sont réservés aux comptes Enterprise. Veuillez mettre à niveau votre compte pour utiliser cette fonctionnalité.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Webhooks</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Recevez des notifications HTTP en temps réel lors des événements sur votre compte (paiements, décaissements).
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un Webhook
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><RefreshCw className="h-6 w-6 animate-spin text-primary" /></div>
      ) : webhooks?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 py-20 text-center">
          <Webhook className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Aucun webhook</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ajoutez une URL pour commencer à recevoir des événements.</p>
          <Button onClick={() => setShowAdd(true)} variant="outline" className="mt-6 gap-2">
            <Plus className="h-4 w-4" /> Ajouter
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks?.map((wh) => (
            <div key={wh.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${wh.active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="font-mono text-sm font-medium text-slate-900 dark:text-slate-200">{wh.url}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Secret de signature :</span>
                  <code className="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                    {showSecret[wh.id] ? wh.secret : "whsec_••••••••••••••••••••••••••••"}
                  </code>
                  <button onClick={() => setShowSecret(s => ({ ...s, [wh.id]: !s[wh.id] }))} className="text-primary hover:underline ml-1">
                    {showSecret[wh.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => toggleMutation.mutate({ id: wh.id, active: !wh.active })}
                  disabled={toggleMutation.isPending}
                >
                  {wh.active ? "Désactiver" : "Activer"}
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => confirm("Supprimer ce webhook ?") && deleteMutation.mutate(wh.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un point de terminaison Webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">URL du point de terminaison</label>
              <Input
                placeholder="https://votre-site.com/api/webhooks/dolapay"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                type="url"
              />
              <p className="text-xs text-muted-foreground">Les requêtes POST seront envoyées à cette adresse.</p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => {
                if (!newUrl.startsWith("https://") && !newUrl.startsWith("http://")) {
                  toast.error("L'URL doit commencer par http:// ou https://");
                  return;
                }
                addMutation.mutate(newUrl);
              }}
              disabled={addMutation.isPending || !newUrl}
            >
              Créer le webhook
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
