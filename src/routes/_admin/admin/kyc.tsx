import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, UserCircle, Building2, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/kyc")({
  component: KYCManagement,
});

function KYCManagement() {
  const qc = useQueryClient();

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["admin_kyc_profiles"],
    queryFn: async () => {
      // Fetch profiles that have documents or are pending
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          kyc_documents (*),
          businesses (*)
        `)
        .in("kyc_status", ["pending", "unverified"])
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ profileId, status }: { profileId: string; status: "verified" | "rejected" }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ kyc_status: status })
        .eq("id", profileId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Statut mis à jour !");
      qc.invalidateQueries({ queryKey: ["admin_kyc_profiles"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  if (isLoading) {
    return <div className="p-8 flex items-center gap-2"><Loader2 className="animate-spin" /> Chargement...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Validations KYC / KYB</h1>
        <p className="text-muted-foreground mt-1">Approuvez manuellement les documents d'identité des marchands.</p>
      </div>

      <div className="space-y-6">
        {profiles?.length === 0 ? (
          <div className="text-center p-12 border rounded-xl bg-muted/20">
            <CheckCircle2 className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium">Aucun dossier en attente.</p>
          </div>
        ) : (
          profiles?.map((p) => {
            const isBiz = p.account_type === "enterprise";
            const biz = p.businesses?.[0];
            const docs = p.kyc_documents || [];

            return (
              <div key={p.id} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 font-bold text-lg">
                    {isBiz ? <Building2 className="text-indigo-500" /> : <UserCircle className="text-emerald-500" />}
                    {isBiz ? (biz?.company_name || p.full_name) : p.full_name}
                  </div>
                  
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p><strong>Email:</strong> {p.email}</p>
                    {isBiz && <p><strong>Numéro Registre:</strong> {biz?.registration_number}</p>}
                    <p><strong>Pays:</strong> {p.country}</p>
                    <p><strong>Statut actuel:</strong> <span className="uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{p.kyc_status}</span></p>
                  </div>
                </div>

                <div className="flex-1 border-l pl-6 space-y-3">
                  <h4 className="font-semibold text-sm">Documents fournis</h4>
                  {docs.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">Aucun document téléversé</p>
                  ) : (
                    <ul className="space-y-2">
                      {docs.map((doc: any) => (
                        <li key={doc.id} className="flex items-center justify-between text-sm bg-muted/40 rounded-lg px-3 py-2">
                          <span className="font-medium truncate max-w-[200px]">{doc.document_type}</span>
                          <a 
                            href={supabase.storage.from("kyc-documents").getPublicUrl(doc.file_path).data.publicUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                          >
                            Ouvrir <ExternalLink className="h-3 w-3" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex flex-col gap-3 justify-center border-l pl-6">
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700" 
                    onClick={() => updateStatus.mutate({ profileId: p.id, status: "verified" })}
                    disabled={updateStatus.isPending}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approuver
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Êtes-vous sûr de vouloir rejeter ce dossier ?")) {
                        updateStatus.mutate({ profileId: p.id, status: "rejected" });
                      }
                    }}
                    disabled={updateStatus.isPending}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Rejeter
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
