import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/accept-invite")({
  component: AcceptInvitePage,
});

function AcceptInvitePage() {
  const navigate = useNavigate();

  const { data: userEmail, isLoading: isUserLoading } = useQuery({
    queryKey: ["current-user-email"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.email;
    }
  });

  const { data: pendingInvites, isLoading: isInvitesLoading } = useQuery({
    queryKey: ["pending-invites", userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      // Pour éviter les erreurs de jointure PostgREST complexe sans foreign key explicite,
      // On va juste fetch les ids puis fetch les noms.
      const { data: invites, error } = await supabase
        .from("team_members")
        .select("id, role, owner_id")
        .eq("email", userEmail)
        .eq("status", "pending");
        
      if (error) throw error;
      
      // Enrich with business names
      if (invites && invites.length > 0) {
         const ownerIds = invites.map(i => i.owner_id);
         const { data: profiles } = await supabase
            .from("profiles")
            .select("id, business_name")
            .in("id", ownerIds);
            
         return invites.map(invite => ({
            ...invite,
            business_name: profiles?.find(p => p.id === invite.owner_id)?.business_name || "Une entreprise"
         }));
      }

      return [];
    }
  });

  const acceptMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/team/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ invitationId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'acceptation");
      return data;
    },
    onSuccess: () => {
      toast.success("Invitation acceptée avec succès !");
      navigate({ to: "/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message)
  });

  if (isUserLoading || isInvitesLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!pendingInvites || pendingInvites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] max-w-md mx-auto text-center space-y-4">
        <Users className="w-16 h-16 text-muted-foreground opacity-50" />
        <h1 className="text-2xl font-bold">Aucune invitation</h1>
        <p className="text-muted-foreground">
          Vous n'avez aucune invitation en attente pour <strong>{userEmail}</strong>. 
          Si vous attendiez une invitation, vérifiez que l'expéditeur a utilisé la bonne adresse email.
        </p>
        <Button onClick={() => navigate({ to: "/dashboard" })}>Aller au tableau de bord</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invitations d'équipe</h1>
        <p className="text-sm text-muted-foreground">Vous avez été invité à collaborer sur DolaPay.</p>
      </div>

      <div className="space-y-4">
        {pendingInvites.map((invite) => (
          <Card key={invite.id} className="p-6">
            <h3 className="font-semibold text-lg mb-1">{invite.business_name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Vous a invité avec le rôle : <strong>{invite.role === 'admin' ? 'Administrateur' : invite.role === 'operator' ? 'Opérateur' : 'Lecteur'}</strong>
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => acceptMutation.mutate(invite.id)}
                disabled={acceptMutation.isPending}
                className="w-full"
              >
                {acceptMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Accepter
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
