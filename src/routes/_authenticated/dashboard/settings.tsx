import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, CheckCircle2, Clock, XCircle, KeyRound, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "./route";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  component: SettingsPage,
});

type Doc = { id: string; document_type: string; file_path: string; status: string };

const STANDARD_DOCS = [
  { type: "id", label: "Pièce d'identité / Passeport" },
  { type: "selfie", label: "Selfie de vérification" },
  { type: "proof_of_address", label: "Justificatif de domicile" },
] as const;

const ENTERPRISE_DOCS = [
  { type: "rccm", label: "Registre du commerce (RCCM)" },
  { type: "director_id", label: "Pièce d'identité du dirigeant" },
  { type: "bank_details", label: "Coordonnées bancaires" },
] as const;

function SettingsPage() {
  const qc = useQueryClient();
  const { data: profile } = useProfile();

  const { data: docs = [] } = useQuery({
    queryKey: ["my-kyc-docs"],
    queryFn: async (): Promise<Doc[]> => {
      const { data, error } = await supabase
        .from("kyc_documents")
        .select("id,document_type,file_path,status")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Doc[];
    },
  });

  const updateAccountType = useMutation({
    mutationFn: async (account_type: "standard" | "enterprise") => {
      const { error } = await supabase.from("profiles").update({ account_type }).eq("id", profile!.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Type de compte mis à jour"); qc.invalidateQueries({ queryKey: ["my-profile"] }); },
  });

  if (!profile) return null;

  const docsList = profile.account_type === "enterprise" ? ENTERPRISE_DOCS : STANDARD_DOCS;
  const submittedTypes = new Set(docs.map((d) => d.document_type));
  const allSubmitted = docsList.every((d) => submittedTypes.has(d.type));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Compte & Conformité (KYC)</h1>
        <p className="text-sm text-muted-foreground">Téléchargez vos documents pour activer toutes les fonctionnalités.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Statut KYC</div>
            <KycStatusBig status={profile.kyc_status} />
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">{profile.email}</div>
            <div className="text-xs text-muted-foreground">Limite : {new Intl.NumberFormat("fr-FR").format(profile.volume_limit_xof)} XOF</div>
          </div>
        </div>
        {profile.kyc_status === "pending" && allSubmitted && (
          <p className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
            Tous vos documents ont été envoyés. Un agent DolaPay les examinera sous 24-48h.
          </p>
        )}
      </Card>

      {profile.onboarding_completed ? (
        <Card className="p-5">
          <div className="text-sm font-semibold">Documents de conformité</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Vos documents ont été soumis lors de l'onboarding. Pour toute mise à jour, contactez{" "}
            <a href="mailto:compliance@dolapay.com" className="text-primary underline">compliance@dolapay.com</a>.
          </p>
        </Card>
      ) : (
        <Tabs value={profile.account_type} onValueChange={(v) => updateAccountType.mutate(v as "standard" | "enterprise")}>
          <TabsList>
            <TabsTrigger value="standard">Compte Standard</TabsTrigger>
            <TabsTrigger value="enterprise">Compte Entreprise</TabsTrigger>
          </TabsList>

          <TabsContent value="standard" className="mt-4">
            {profile.account_type === "standard" ? (
              <DocList docs={STANDARD_DOCS} existing={docs} userId={profile.id} />
            ) : (
              <Card className="p-4 text-sm text-muted-foreground">Basculer sur ce type recharge vos documents.</Card>
            )}
          </TabsContent>
          <TabsContent value="enterprise" className="mt-4 space-y-4">
            {profile.account_type === "enterprise" ? (
              <>
                <EnterpriseFields profileId={profile.id} />
                <DocList docs={ENTERPRISE_DOCS} existing={docs} userId={profile.id} />
              </>
            ) : (
              <Card className="p-4 text-sm text-muted-foreground">Sélectionnez ce type pour saisir les informations entreprise.</Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      <PasswordSection />
    </div>
  );
}

function PasswordSection() {
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      const providers = (u.app_metadata?.providers as string[] | undefined) ?? [u.app_metadata?.provider as string].filter(Boolean);
      setHasPassword(providers.includes("email"));
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 8) { toast.error("Le mot de passe doit comporter au moins 8 caractères"); return; }
    if (next !== confirm) { toast.error("Les mots de passe ne correspondent pas"); return; }
    setLoading(true);
    if (hasPassword) {
      const { data: u } = await supabase.auth.getUser();
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email: u.user!.email!, password: current });
      if (signInErr) { setLoading(false); toast.error("Mot de passe actuel incorrect"); return; }
    }
    const { error } = await supabase.auth.updateUser({ password: next });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(hasPassword ? "Mot de passe mis à jour" : "Mot de passe défini — vous pouvez désormais vous connecter par e-mail");
    setCurrent(""); setNext(""); setConfirm("");
    setHasPassword(true);
  }

  return (
    <Card className="space-y-4 p-6">
      <div className="flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-primary" />
        <div>
          <div className="text-sm font-semibold">{hasPassword === false ? "Définir un mot de passe" : "Changer le mot de passe"}</div>
          <div className="text-xs text-muted-foreground">
            {hasPassword === false
              ? "Vous vous êtes inscrit via Google. Définissez un mot de passe pour pouvoir vous connecter aussi par e-mail."
              : "Choisissez un nouveau mot de passe sécurisé d'au moins 8 caractères."}
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-3 sm:max-w-md">
        {hasPassword && (
          <Input type="password" placeholder="Mot de passe actuel" value={current} onChange={(e) => setCurrent(e.target.value)} required autoComplete="current-password" />
        )}
        <Input type="password" placeholder="Nouveau mot de passe" value={next} onChange={(e) => setNext(e.target.value)} required autoComplete="new-password" />
        <Input type="password" placeholder="Confirmer le mot de passe" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" />
        <Button type="submit" disabled={loading} className="w-fit">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : hasPassword ? "Mettre à jour" : "Définir le mot de passe"}
        </Button>
      </form>
    </Card>
  );
}

function KycStatusBig({ status }: { status: string }) {
  const m: Record<string, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
    pending: { label: "En attente de vérification", cls: "text-amber-600 dark:text-amber-300", Icon: Clock },
    approved: { label: "Compte approuvé", cls: "text-emerald-600 dark:text-emerald-300", Icon: CheckCircle2 },
    rejected: { label: "Dossier rejeté", cls: "text-rose-600 dark:text-rose-300", Icon: XCircle },
    frozen: { label: "Compte gelé", cls: "text-slate-500", Icon: XCircle },
  };
  const { label, cls, Icon } = m[status] ?? m.pending;
  return <div className={cn("mt-1 flex items-center gap-2 text-lg font-semibold", cls)}><Icon className="h-5 w-5" /> {label}</div>;
}

function DocList({ docs, existing, userId }: { docs: readonly { type: string; label: string }[]; existing: Doc[]; userId: string }) {
  return (
    <div className="grid gap-3">
      {docs.map((d) => {
        const ex = existing.find((e) => e.document_type === d.type);
        return <DocUpload key={d.type} type={d.type} label={d.label} existing={ex} userId={userId} />;
      })}
    </div>
  );
}

function DocUpload({ type, label, existing, userId }: { type: string; label: string; existing?: Doc; userId: string }) {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${userId}/${type}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("kyc-documents").upload(path, file, { upsert: true });
    if (upErr) { setUploading(false); toast.error(upErr.message); return; }
    const { error: dbErr } = await supabase.from("kyc_documents").insert({
      profile_id: userId,
      document_type: type as "id",
      file_path: path,
      status: "pending",
    });
    setUploading(false);
    if (dbErr) { toast.error(dbErr.message); return; }
    toast.success("Document téléversé");
    qc.invalidateQueries({ queryKey: ["my-kyc-docs"] });
  }

  return (
    <Card className="flex items-center justify-between p-4">
      <div>
        <div className="text-sm font-semibold">{label}</div>
        {existing ? (
          <div className="text-xs text-muted-foreground">Statut : <span className="font-semibold">{existing.status}</span></div>
        ) : (
          <div className="text-xs text-muted-foreground">Aucun document encore</div>
        )}
      </div>
      <label className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-accent",
        uploading && "opacity-60",
      )}>
        <Upload className="h-3 w-3" /> {existing ? "Remplacer" : "Téléverser"}
        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          disabled={uploading}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
        />
      </label>
    </Card>
  );
}

function EnterpriseFields({ profileId }: { profileId: string }) {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["my-business"],
    queryFn: async () => {
      const { data, error } = await supabase.from("businesses").select("*").maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const [companyName, setCompanyName] = useState("");
  const [regNum, setRegNum] = useState("");
  const [taxId, setTaxId] = useState("");
  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("businesses").upsert({
        profile_id: profileId,
        company_name: companyName || data?.company_name || "",
        registration_number: regNum || data?.registration_number,
        tax_id: taxId || data?.tax_id,
      }, { onConflict: "profile_id" });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Entreprise enregistrée"); qc.invalidateQueries({ queryKey: ["my-business"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Card className="space-y-3 p-6">
      <div className="text-sm font-semibold">Informations entreprise</div>
      <Input placeholder={data?.company_name || "Raison sociale"} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
      <Input placeholder={data?.registration_number || "N° d'immatriculation (RCCM)"} value={regNum} onChange={(e) => setRegNum(e.target.value)} />
      <Input placeholder={data?.tax_id || "Identifiant fiscal"} value={taxId} onChange={(e) => setTaxId(e.target.value)} />
      <Button onClick={() => save.mutate()} disabled={save.isPending}>Enregistrer</Button>
    </Card>
  );
}
