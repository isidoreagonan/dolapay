import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, CheckCircle2, Clock, XCircle, KeyRound, Loader2, User, Shield, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, type Profile } from "./route";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

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

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Paramètres du compte</h1>
        <p className="text-sm text-muted-foreground mt-1">Gérez votre profil personnel, vos documents de conformité et votre sécurité.</p>
      </div>

      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList className="bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-1 h-auto">
          <TabsTrigger value="profil" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 py-2.5 px-4 gap-2">
            <User className="w-4 h-4" /> Profil
          </TabsTrigger>
          <TabsTrigger value="kyc" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 py-2.5 px-4 gap-2">
            <Shield className="w-4 h-4" /> Conformité (KYC)
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 py-2.5 px-4 gap-2">
            <KeyRound className="w-4 h-4" /> Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="m-0">
           <ProfileSettingsTab profile={profile} />
        </TabsContent>

        <TabsContent value="kyc" className="m-0">
           <KycSettingsTab profile={profile} docs={docs} />
        </TabsContent>

        <TabsContent value="security" className="m-0">
           <PasswordSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileSettingsTab({ profile }: { profile: Profile }) {
  const qc = useQueryClient();
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number || "");
  const [companyName, setCompanyName] = useState(profile.company_name || "");
  const [companyWebsite, setCompanyWebsite] = useState(profile.company_website || "");
  const [companyRegistration, setCompanyRegistration] = useState(profile.company_registration_number || "");

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        full_name: fullName,
        phone_number: phoneNumber,
      };
      if (profile.account_type === "enterprise") {
        payload.company_name = companyName;
        payload.company_website = companyWebsite;
        payload.company_registration_number = companyRegistration;
      }
      const { error } = await supabase.from("profiles").update(payload).eq("id", profile.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profil mis à jour avec succès");
      qc.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Erreur lors de la mise à jour");
    }
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); updateProfileMutation.mutate(); }} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Informations Personnelles</h3>
          <p className="text-sm text-muted-foreground mt-1">Gérez vos coordonnées et informations de contact de base.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Adresse Email</Label>
            <Input value={profile.email} disabled className="bg-slate-50/50 dark:bg-slate-900/50 opacity-70" />
            <p className="text-[10px] text-muted-foreground">L'adresse e-mail est liée à votre compte d'authentification.</p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Nom Complet</Label>
            <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Ex: Jean Dupont" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Numéro de Téléphone</Label>
            <Input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Ex: +225 0102030405" />
          </div>
        </div>
      </Card>

      {profile.account_type === "enterprise" && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2"><Building2 className="w-5 h-5 text-primary" /> Informations de l'Entreprise</h3>
            <p className="text-sm text-muted-foreground mt-1">Détails légaux liés à votre compte DolaPay Entreprise.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Nom de l'Entreprise / Raison Sociale</Label>
              <Input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex: Acme Corp" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Numéro d'Immatriculation (RCCM)</Label>
              <Input value={companyRegistration} onChange={e => setCompanyRegistration(e.target.value)} placeholder="Ex: CI-ABJ-2023-B-12345" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Site Web (Optionnel)</Label>
              <Input value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} placeholder="Ex: https://www.votre-site.com" />
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={updateProfileMutation.isPending} className="bg-primary hover:bg-primary/90 text-white font-bold px-8">
          {updateProfileMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
          Enregistrer le profil
        </Button>
      </div>
    </form>
  );
}

function KycSettingsTab({ profile, docs }: { profile: Profile; docs: Doc[] }) {
  const qc = useQueryClient();
  const updateAccountType = useMutation({
    mutationFn: async (account_type: "standard" | "enterprise") => {
      const { error } = await supabase.from("profiles").update({ account_type }).eq("id", profile.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Type de compte mis à jour"); qc.invalidateQueries({ queryKey: ["my-profile"] }); },
  });

  const docsList = profile.account_type === "enterprise" ? ENTERPRISE_DOCS : STANDARD_DOCS;
  const submittedTypes = new Set(docs.map((d) => d.document_type));
  const allSubmitted = docsList.every((d) => submittedTypes.has(d.type));

  const maxLimit = profile.account_type === "enterprise" ? 5000000 : 500000;
  const percent = Math.min(100, Math.max(0, (profile.volume_limit_xof / maxLimit) * 100));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card className="p-6 relative overflow-hidden border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -z-10 -mr-10 -mt-10"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Statut KYC actuel</div>
            <KycStatusBig status={profile.kyc_status} />
            {profile.kyc_status === "pending" && allSubmitted && (
              <p className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300 font-medium">
                Vos documents sont en cours d'analyse par notre équipe (24-48h).
              </p>
            )}
          </div>
          <div className="md:text-right flex-1 md:max-w-xs w-full bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 md:text-right">Limite d'envoi / mois</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mb-2 md:text-right tracking-tight">
              {new Intl.NumberFormat("fr-FR").format(profile.volume_limit_xof)} <span className="text-xs font-bold text-muted-foreground">XOF</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-2">
              <span>0 XOF</span>
              <span>{new Intl.NumberFormat("fr-FR").format(maxLimit)} XOF MAX</span>
            </div>
          </div>
        </div>
      </Card>

      {profile.onboarding_completed ? (
        <Card className="p-6 border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <div className="text-base font-bold text-emerald-900 dark:text-emerald-100">Documents validés</div>
          </div>
          <p className="text-sm text-emerald-800/80 dark:text-emerald-200/80 leading-relaxed">
            Vos documents de conformité ont été soumis et approuvés avec succès. 
            Si vous avez besoin de mettre à jour vos informations légales ou d'augmenter vos limites, veuillez contacter notre équipe à l'adresse <a href="mailto:compliance@dola-pay.com" className="font-bold underline hover:text-emerald-900 dark:hover:text-white">compliance@dola-pay.com</a>.
          </p>
        </Card>
      ) : (
        <Card className="p-6">
           <div className="mb-6">
              <h3 className="text-lg font-bold">Soumission des documents</h3>
              <p className="text-sm text-muted-foreground mt-1">Veuillez fournir les documents ci-dessous pour vérifier votre identité et débloquer les fonctionnalités de votre compte.</p>
           </div>
           
           <Tabs value={profile.account_type} onValueChange={(v) => updateAccountType.mutate(v as "standard" | "enterprise")}>
            <TabsList className="mb-6">
              <TabsTrigger value="standard">Compte Standard</TabsTrigger>
              <TabsTrigger value="enterprise">Compte Entreprise</TabsTrigger>
            </TabsList>

            <TabsContent value="standard" className="mt-0">
              {profile.account_type === "standard" ? (
                <DocList docs={STANDARD_DOCS} existing={docs} userId={profile.id} />
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-sm text-muted-foreground text-center font-medium bg-slate-50/50 dark:bg-slate-900/50">Basculer sur ce type de compte rechargera la liste des documents requis.</div>
              )}
            </TabsContent>
            <TabsContent value="enterprise" className="mt-0 space-y-4">
              {profile.account_type === "enterprise" ? (
                <DocList docs={ENTERPRISE_DOCS} existing={docs} userId={profile.id} />
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-sm text-muted-foreground text-center font-medium bg-slate-50/50 dark:bg-slate-900/50">Sélectionnez ce type pour accéder à la liste des documents requis pour les entreprises.</div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      )}
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
    <Card className="space-y-6 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <KeyRound className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold">{hasPassword === false ? "Définir un mot de passe" : "Modifier le mot de passe"}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {hasPassword === false
              ? "Vous vous êtes inscrit via Google. Définissez un mot de passe pour pouvoir vous connecter aussi par e-mail sans Google."
              : "Choisissez un nouveau mot de passe sécurisé d'au moins 8 caractères pour protéger l'accès à votre compte."}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
        {hasPassword && (
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Mot de passe actuel</Label>
            <Input type="password" placeholder="••••••••" value={current} onChange={(e) => setCurrent(e.target.value)} required autoComplete="current-password" />
          </div>
        )}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Nouveau mot de passe</Label>
          <Input type="password" placeholder="••••••••" value={next} onChange={(e) => setNext(e.target.value)} required autoComplete="new-password" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Confirmer le mot de passe</Label>
          <Input type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" />
        </div>
        <Button type="submit" disabled={loading} className="w-full mt-2 font-bold">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : hasPassword ? "Mettre à jour le mot de passe" : "Définir le mot de passe"}
        </Button>
      </form>
    </Card>
  );
}

function KycStatusBig({ status }: { status: string }) {
  const m: Record<string, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
    pending: { label: "En attente d'approbation", cls: "text-amber-600 dark:text-amber-400", Icon: Clock },
    approved: { label: "Compte approuvé", cls: "text-emerald-600 dark:text-emerald-400", Icon: CheckCircle2 },
    rejected: { label: "Dossier rejeté", cls: "text-rose-600 dark:text-rose-400", Icon: XCircle },
    frozen: { label: "Compte gelé", cls: "text-slate-500", Icon: XCircle },
  };
  const { label, cls, Icon } = m[status] ?? m.pending;
  return <div className={cn("mt-1 flex items-center gap-2 text-xl font-black tracking-tight", cls)}><Icon className="h-6 w-6" /> {label}</div>;
}

function DocList({ docs, existing, userId }: { docs: readonly { type: string; label: string }[]; existing: Doc[]; userId: string }) {
  return (
    <div className="grid gap-4">
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
    toast.success("Document téléversé avec succès");
    qc.invalidateQueries({ queryKey: ["my-kyc-docs"] });
  }

  const isPending = existing?.status === "pending";
  const isApproved = existing?.status === "approved";

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-900/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
      <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", 
          isApproved ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
          isPending ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
          "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        )}>
          {isApproved ? <CheckCircle2 className="w-5 h-5" /> : 
           isPending ? <Clock className="w-5 h-5" /> : 
           <Upload className="w-5 h-5" />}
        </div>
        <div>
          <div className="text-sm font-bold">{label}</div>
          {existing ? (
            <div className="text-[11px] font-medium mt-0.5 text-muted-foreground flex items-center gap-1">
              Statut : <span className={cn(
                "uppercase tracking-wider",
                isApproved ? "text-emerald-600 dark:text-emerald-400" :
                isPending ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"
              )}>{existing.status === "pending" ? "En attente" : existing.status === "approved" ? "Approuvé" : "Rejeté"}</span>
            </div>
          ) : (
            <div className="text-[11px] font-medium mt-0.5 text-slate-400">À fournir obligatoirement</div>
          )}
        </div>
      </div>
      <label className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-all",
        uploading && "opacity-60 cursor-not-allowed",
      )}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 text-primary" />} 
        {existing ? "Remplacer" : "Importer"}
        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          disabled={uploading}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
        />
      </label>
    </div>
  );
}
