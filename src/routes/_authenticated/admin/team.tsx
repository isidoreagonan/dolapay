import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Mail, Loader2, Users, Crown, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAdminRole } from "./route";

export const Route = createFileRoute("/_authenticated/admin/team")({
  component: TeamPage,
});

function TeamPage() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("compliance_officer");
  
  const { data: myRole } = useAdminRole();

  const { data: team = [], isLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("id, role, created_at, profiles!inner(id, full_name, email)");
      if (error) throw error;
      return data ?? [];
    },
  });

  const invite = useMutation({
    mutationFn: async () => {
      if (!email.trim() || !email.includes("@")) throw new Error("Email invalide");
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/admin/invite-manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ email, role })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de l'invitation");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Invitation envoyée !");
      setEmail("");
      qc.invalidateQueries({ queryKey: ["admin-team"] });
    },
    onError: (e: Error) => toast.error(e.message)
  });

  if (myRole !== "admin") {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-slate-400">
        <ShieldCheck className="h-10 w-10 mb-4 opacity-50" />
        <p>Accès restreint aux Super Administrateurs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-white/10 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="h-6 w-6 text-emerald-400" /> Équipe DolaPay
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Gérez les accès de votre équipe de conformité et des opérateurs financiers.
        </p>
      </header>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Inviter un membre</h2>
        <div className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Email de l'employé</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="prenom@dolapay.co" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 border-white/10 bg-black/20 text-white"
              />
            </div>
          </div>
          <div className="w-full sm:w-64 space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Rôle d'accès</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="border-white/10 bg-black/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compliance_officer">Compliance Officer (Conformité uniquement)</SelectItem>
                <SelectItem value="admin">Super Admin (Accès total)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white whitespace-nowrap"
            onClick={() => invite.mutate()}
            disabled={invite.isPending || !email}
          >
            {invite.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "Envoyer l'invitation"}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/[0.01]">
          <h2 className="text-sm font-semibold text-white">Membres actifs</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-500">Chargement...</div>
        ) : team.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">Aucun membre dans l'équipe pour le moment.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.02] text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Employé</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rôle système</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {team.map((t: any) => (
                <tr key={t.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{t.profiles?.full_name || "—"}</td>
                  <td className="px-4 py-3 text-slate-400">{t.profiles?.email || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      t.role === "admin" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    )}>
                      {t.role === "admin" ? <Crown className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                      {t.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
