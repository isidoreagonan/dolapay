import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, ArrowLeft, Upload, CheckCircle2, Building2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import logoFull from "@/assets/dolapay-logo.png.asset.json";
import { AddressBlock } from "@/components/onboarding/AddressBlock";
import { getKybLabels, getKycIdLabel } from "@/lib/kyb-documents";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: OnboardingPage,
});

type AccountType = "standard" | "enterprise";

function OnboardingPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      return data;
    },
  });

  const [draft] = useState(() => {
    try {
      const s = localStorage.getItem("dola_onboard_draft");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const [step, setStep] = useState(draft?.step ?? 0);
  const [accountType, setAccountType] = useState<AccountType>(draft?.accountType ?? "standard");

  // Standard / Enterprise Info
  const [fullName, setFullName] = useState(draft?.fullName ?? "");
  const [country, setCountry] = useState(draft?.country ?? "");
  const [city, setCity] = useState(draft?.city ?? "");
  const [address, setAddress] = useState(draft?.address ?? "");

  // Enterprise Only
  const [companyName, setCompanyName] = useState(draft?.companyName ?? "");
  const [regNum, setRegNum] = useState(draft?.regNum ?? "");
  const [taxId, setTaxId] = useState(draft?.taxId ?? "");

  // Documents
  const [docs, setDocs] = useState<Record<string, File | null>>({});

  useEffect(() => {
    try {
      localStorage.setItem("dola_onboard_draft", JSON.stringify({
        step, accountType, fullName, country, city, address, companyName, regNum, taxId
      }));
    } catch { /* ignore */ }
  }, [step, accountType, fullName, country, city, address, companyName, regNum, taxId]);

  const kybLabels = getKybLabels(country);

  const submit = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("Profil introuvable");
      const uid = profile.id;

      const requiredDocs = accountType === "standard" 
        ? ["id", "selfie"] 
        : ["id", "selfie", "rccm", "tax_doc"];

      const bucket = "kyc-documents";

      const uploadedDocs = [];

      for (const t of requiredDocs) {
        const file = docs[t];
        if (!file) throw new Error(`Document manquant : ${t}`);
        if (file.size > 10 * 1024 * 1024) throw new Error(`${t} dépasse 10 Mo`);
        
        // Strict verification: Enterprise rccm and tax_doc MUST be PDF
        if (accountType === "enterprise" && (t === "rccm" || t === "tax_doc")) {
          if (file.type !== "application/pdf") {
             throw new Error(`Le document légal/fiscal (${t}) doit obligatoirement être au format PDF.`);
          }
        }

        const ext = file.name.split(".").pop() ?? "bin";
        // The file name will hold the real document type
        const path = `${uid}/${t}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
        if (upErr) throw upErr;
        
        // Add to our JSON array instead of inserting into the problematic kyc_documents table
        uploadedDocs.push({
          id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          profile_id: uid,
          document_type: t,
          file_path: bucket + "/" + path,
          status: "pending"
        });
      }

      const { error: pErr } = await supabase
        .from("profiles")
        .update({ 
          account_type: accountType, 
          onboarding_completed: true, 
          kyc_status: "in_compliance_review", 
          ai_verification_log: uploadedDocs as any,
          full_name: fullName, 
          address, 
          city, 
          country 
        } as never)
        .eq("id", uid);
      if (pErr) throw pErr;

      if (accountType === "enterprise") {
        const { error: bErr } = await supabase.from("businesses").upsert({
          profile_id: uid,
          company_name: companyName,
          registration_number: regNum,
          tax_id: taxId,
        }, { onConflict: "profile_id" });
        if (bErr) throw bErr;
      }

      try {
        await fetch("/api/public/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "welcome", profileId: uid }),
        });
      } catch {}
    },
    onSuccess: () => {
      try { localStorage.removeItem("dola_onboard_draft"); } catch {}
      toast.success("Dossier soumis ! Accès au tableau de bord.");
      qc.invalidateQueries({ queryKey: ["my-profile"] });
      navigate({ to: "/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (profile?.onboarding_completed) {
    navigate({ to: "/dashboard", replace: true });
    return null;
  }
  if (profile && (!profile.country || !profile.phone)) {
    navigate({ to: "/complete-profile", replace: true });
    return null;
  }

  const steps = ["Type de compte", "Informations", "Documents", "Récapitulatif"];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <img src={logoFull.url} alt="DolaPay" className="h-8" />
          <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth/sign-in" }); }} className="text-xs text-muted-foreground hover:underline">Se déconnecter</button>
        </div>

        <Stepper steps={steps} current={step} />

        <Card className="mt-6 p-6 sm:p-8">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Choisissez votre type de compte</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <TypeCard active={accountType === "standard"} onClick={() => setAccountType("standard")} icon={User} title="Standard" desc="Individu ou Freelance. Juste votre nom et pièce d'identité." />
                <TypeCard active={accountType === "enterprise"} onClick={() => setAccountType("enterprise")} icon={Building2} title="Entreprise" desc="Société enregistrée. Nom de l'entreprise, RCCM et NIF." />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Informations de base</h2>
              
              {accountType === "enterprise" && (
                <Field label="Nom de l'entreprise" value={companyName} onChange={setCompanyName} placeholder="Raison sociale" />
              )}
              
              <Field label={accountType === "standard" ? "Votre nom complet" : "Nom complet du gérant"} value={fullName} onChange={setFullName} placeholder="Comme sur votre pièce d'identité" />
              
              <AddressBlock label={accountType === "standard" ? "Résidence" : "Pays d'enregistrement"} country={country} city={city} address={address} onCountry={setCountry} onCity={setCity} onAddress={setAddress} />

              {accountType === "enterprise" && country && (
                <div className="grid gap-3 sm:grid-cols-2 mt-4 pt-4 border-t border-border">
                  <Field label={`N° ${kybLabels.registry.short}`} value={regNum} onChange={setRegNum} />
                  <Field label={kybLabels.tax.label} value={taxId} onChange={setTaxId} />
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Téléversement des documents</h2>
              <p className="text-sm text-muted-foreground">Veuillez fournir des documents clairs et lisibles. Pour les entreprises, les documents légaux doivent être au format PDF.</p>
              
              <div className="space-y-3">
                <DocSlot 
                  type="id" 
                  label={getKycIdLabel(country).label} 
                  hint="Photo ou scan clair." 
                  accept="image/*"
                  file={docs["id"] ?? null} 
                  onFile={(f) => setDocs({ ...docs, id: f })} 
                />
                <DocSlot 
                  type="selfie" 
                  label={accountType === "standard" ? "Photo de votre visage (Selfie)" : "Photo du visage du gérant (Selfie)"} 
                  hint="Visage bien visible, sans lunettes." 
                  accept="image/*"
                  file={docs["selfie"] ?? null} 
                  onFile={(f) => setDocs({ ...docs, selfie: f })} 
                />

                {accountType === "enterprise" && (
                  <>
                    <DocSlot 
                      type="rccm" 
                      label={`Document d'immatriculation (${kybLabels.registry.short})`} 
                      hint="Document officiel d'enregistrement. Obligatoirement en PDF." 
                      accept="application/pdf"
                      file={docs["rccm"] ?? null} 
                      onFile={(f) => setDocs({ ...docs, rccm: f })} 
                    />
                    <DocSlot 
                      type="tax_doc" 
                      label={`Attestation Fiscale (${kybLabels.tax.label})`} 
                      hint="Document fiscal officiel. Obligatoirement en PDF." 
                      accept="application/pdf"
                      file={docs["tax_doc"] ?? null} 
                      onFile={(f) => setDocs({ ...docs, tax_doc: f })} 
                    />
                  </>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Récapitulatif</h2>
              <div className="space-y-2 rounded-lg border border-border bg-background/50 p-4 text-sm">
                <Row k="Type" v={accountType === "standard" ? "Standard" : "Entreprise"} />
                {accountType === "enterprise" && <Row k="Entreprise" v={companyName} />}
                <Row k={accountType === "standard" ? "Nom" : "Gérant"} v={fullName} />
                <Row k="Pays" v={country} />
                <Row k="Documents attachés" v={`${Object.values(docs).filter(Boolean).length} documents`} />
              </div>
              <p className="text-xs text-muted-foreground">
                Dès la soumission, vous accéderez à votre tableau de bord. Vos fonctionnalités seront bloquées (Statut: En attente) jusqu'à ce que notre équipe de conformité valide vos documents.
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={() => setStep(step + 1)} disabled={!canAdvance(step, { accountType, fullName, companyName, docs, country, regNum, taxId })}>
                Continuer <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="button" onClick={() => submit.mutate()} disabled={submit.isPending}>
                {submit.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                Soumettre mon dossier
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function canAdvance(step: number, s: { accountType: AccountType; fullName: string; companyName: string; docs: Record<string, File | null>; country: string; regNum: string; taxId: string }) {
  if (step === 0) return true;
  if (step === 1) {
    if (!s.fullName || !s.country) return false;
    if (s.accountType === "enterprise") return !!(s.companyName && s.regNum.trim() && s.taxId.trim());
    return true;
  }
  if (step === 2) {
    if (s.accountType === "standard") return !!(s.docs["id"] && s.docs["selfie"]);
    return !!(s.docs["id"] && s.docs["selfie"] && s.docs["rccm"] && s.docs["tax_doc"]);
  }
  return true;
}

function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => (
        <div key={label} className="flex flex-1 items-center gap-2">
          <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold", i <= current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{i + 1}</div>
          <div className={cn("hidden text-xs font-medium sm:block", i <= current ? "text-foreground" : "text-muted-foreground")}>{label}</div>
          {i < steps.length - 1 && <div className={cn("h-px flex-1", i < current ? "bg-primary" : "bg-border")} />}
        </div>
      ))}
    </div>
  );
}

function TypeCard({ active, onClick, icon: Icon, title, desc }: { active: boolean; onClick: () => void; icon: typeof User; title: string; desc: string }) {
  return (
    <button type="button" onClick={onClick} className={cn("rounded-2xl border p-5 text-left transition-all", active ? "border-primary bg-primary/5 shadow-glow" : "border-border hover:border-primary/50")}>
      <Icon className="mb-3 h-6 w-6 text-primary" />
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
    </button>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <Label className="text-xs font-semibold">{label}</Label>
      <Input className="mt-1" type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function DocSlot({ type, label, hint, accept, file, onFile }: { type: string; label: string; hint: string; accept: string; file: File | null; onFile: (f: File | null) => void }) {
  return (
    <Card className="flex items-center justify-between p-4">
      <div className="min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
        {file && <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-300 truncate">✓ {file.name}</div>}
      </div>
      <label className="inline-flex cursor-pointer shrink-0 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-accent ml-4">
        <Upload className="h-3 w-3" /> {file ? "Changer" : "Uploader"}
        <input type="file" accept={accept} className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} data-doc-type={type} />
      </label>
    </Card>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium text-right">{v}</span></div>;
}
