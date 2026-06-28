import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Trash2, Mail } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/team")({
  component: TeamPage,
});

type Member = {
  id: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  status: "pending" | "active" | "revoked";
  created_at: string;
};

function TeamPage() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Member["role"]>("viewer");

  const { data: members = [] } = useQuery({
    queryKey: ["team-members"],
    queryFn: async (): Promise<Member[]> => {
      const { data, error } = await supabase
        .from("team_members")
        .select("id,email,role,status,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Member[];
    },
  });

  const invite = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Non connecté");
      if (!email) throw new Error("Email requis");
      const { error } = await supabase.from("team_members").insert({
        owner_id: u.user.id,
        email: email.trim().toLowerCase(),
        role,
        status: "pending",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Invitation envoyée");
      setEmail("");
      qc.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const revoke = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").update({ status: "revoked" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Accès révoqué");
      qc.invalidateQueries({ queryKey: ["team-members"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Membre supprimé");
      qc.invalidateQueries({ queryKey: ["team-members"] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Équipe</h1>
        <p className="text-sm text-muted-foreground">Invitez vos collègues à collaborer sur votre compte.</p>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-sm font-semibold">Inviter un membre</h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="collegue@entreprise.com" />
          </div>
          <div>
            <Label>Rôle</Label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Member["role"])}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="viewer">Lecteur</option>
              <option value="operator">Opérateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={() => invite.mutate()} disabled={invite.isPending} className="w-full">
              <UserPlus className="mr-2 h-4 w-4" /> Inviter
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Membre</th>
              <th className="px-4 py-3 text-left">Rôle</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Invité le</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{m.email}</div>
                </td>
                <td className="px-4 py-3 capitalize">{roleLabel(m.role)}</td>
                <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(m.created_at).toLocaleDateString("fr-FR")}</td>
                <td className="px-4 py-3 text-right">
                  {m.status !== "revoked" && (
                    <Button size="sm" variant="outline" onClick={() => revoke.mutate(m.id)} className="mr-2">
                      Révoquer
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => remove.mutate(m.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Aucun membre. Invitez votre première personne.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function roleLabel(r: Member["role"]) {
  return r === "admin" ? "Administrateur" : r === "operator" ? "Opérateur" : "Lecteur";
}

function StatusBadge({ status }: { status: Member["status"] }) {
  const map = {
    pending: "bg-amber-500/15 text-amber-600",
    active: "bg-emerald-500/15 text-emerald-600",
    revoked: "bg-rose-500/15 text-rose-600",
  } as const;
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", map[status])}>{status}</span>;
}
