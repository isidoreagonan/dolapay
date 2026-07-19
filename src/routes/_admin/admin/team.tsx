import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, Users } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/team")({
  beforeLoad: ({ context }) => {
    if (context.role !== "admin") {
      throw new Error("Seul l'administrateur principal peut accéder à cette page.");
    }
  },
  component: TeamManagement,
});

function TeamManagement() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    
    try {
      const res = await fetch("/api/admin/invite-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");
      
      toast.success("Invitation envoyée avec succès !");
      setEmail("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Gestion de l'équipe</h1>
        <p className="text-muted-foreground mt-1">Invitez des gérants pour vérifier les documents KYC (Back-Office uniquement).</p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 max-w-md">
        <div className="flex items-center gap-2 font-semibold mb-4 text-lg">
          <Users className="h-5 w-5 text-indigo-500" />
          Inviter un Gérant
        </div>
        
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Adresse e-mail du futur gérant</label>
            <Input 
              type="email" 
              placeholder="agent@dolapay.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full font-semibold">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
            Envoyer l'invitation magique
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
          Cette personne recevra un e-mail officiel de DolaPay lui permettant de créer son mot de passe. 
          Une fois connectée, elle n'aura accès <strong>qu'à ce Back-Office</strong> (pas au compte utilisateur normal).
        </p>
      </div>
    </div>
  );
}
