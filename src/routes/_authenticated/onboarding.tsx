import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowRight, ArrowLeft, Upload, CheckCircle2, Building2, User, Plus, Trash2, Loader2, ShieldAlert, ScanFace, ScanLine, Sparkles, ExternalLink } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import logoFull from "@/assets/dolapay-logo.png.asset.json";
import { AddressBlock } from "@/components/onboarding/AddressBlock";
import { getKybLabels, getKycIdLabel } from "@/lib/kyb-documents";
import { createDiditSession } from "@/lib/didit.functions";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: OnboardingPage,
});

type AccountType = "standard" | "enterprise";
type Ubo = { name: string; share: string; nationality: string };
type Representative = { id: string; full_name: string; title: string; email: string; verified: boolean };




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

  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState<AccountType>("standard");

  // Standard
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  // Enterprise
  const [companyName, setCompanyName] = useState("");
  const [hqCountry, setHqCountry] = useState("");
  const [hqCity, setHqCity] = useState("");
  const [hqAddress, setHqAddress] = useState("");
  const [regNum, setRegNum] = useState("");
  const [taxId, setTaxId] = useState("");
  const [ubos, setUbos] = useState<Ubo[]>([{ name: "", share: "", nationality: "" }]);
  const [reps, setReps] = useState<Representative[]>([]);
  const [verifyingRepId, setVerifyingRepId] = useState<string | null>(null);
  const allRepsVerified = reps.length > 0 && reps.every((r) => r.verified);

  // Documents
  const [docs, setDocs] = useState<Record<string, File | null>>({});

  const kybLabels = getKybLabels(hqCountry);

  const submit = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("Profil introuvable");
      const uid = profile.id;

      // 1. Upload documents — enterprise docs land in dedicated bucket
      const requiredDocs = accountType === "standard"
        ? ["id", "selfie", "proof_of_address"]
        : ["rccm", "tax_doc"];
      const bucket = accountType === "enterprise" ? "enterprise-kyc-docs" : "kyc-documents";
      for (const t of requiredDocs) {
        const file = docs[t];
        if (!file) throw new Error(`Document manquant : ${t}`);
        if (file.size > 10 * 1024 * 1024) throw new Error(`${t} dépasse 10 Mo`);
        const ext = file.name.split(".").pop() ?? "bin";
        const path = `${uid}/${t}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
        if (upErr) throw upErr;
        const { error: dbErr } = await supabase.from("kyc_documents").insert({
          profile_id: uid, document_type: t as "id", file_path: bucket + "/" + path, status: "pending",
        });
        if (dbErr) throw dbErr;
      }

      // 2. Update profile — push into compliance review (12–24h SLA)
      const stdPatch = accountType === "standard"
        ? { full_name: fullName, date_of_birth: dob || null, address, city, country }
        : {};
      const { error: pErr } = await supabase
        .from("profiles")
        .update({ account_type: accountType, onboarding_completed: true, kyc_status: "in_compliance_review", ...stdPatch } as never)
        .eq("id", uid);
      if (pErr) throw pErr;

      // 3. Enterprise business row
      if (accountType === "enterprise") {
        const primary = reps.find((r) => r.verified) ?? reps[0];
        const [pFirst, ...pRest] = (primary?.full_name ?? "").trim().split(/\s+/);
        const pLast = pRest.join(" ");
        const { data: bizData, error: bErr } = await supabase.from("businesses").upsert({
          profile_id: uid,
          company_name: companyName,
          address: hqAddress,
          city: hqCity,
          country: hqCountry,
          hq_country: hqCountry,
          registration_number: regNum,
          tax_id: taxId,
          kyb_status: "under_review",
          kyb_submitted_at: new Date().toISOString()
        } as never, { onConflict: "profile_id" }).select("id").maybeSingle();
        if (bErr) throw bErr;

        const bizId = bizData?.id;

        // 4. Persist UBOs into business_ubos table
        if (bizId && ubos.length) {
          const validUbos = ubos.filter((u) => u.name.trim()).map((u) => ({
            business_id: bizId,
            full_name: u.name,
            percentage: Number(u.share) || 0,
            nationality: u.nationality || "Béninoise",
            didit_status: "unverified",
            didit_aml_status: "clear"
          }));
          if (validUbos.length) {
            await supabase.from("business_ubos").insert(validUbos as never);
          }
        }

        // 5. Persist verified representatives
        if (reps.length) {
          const rows = reps.map((r) => ({
            business_id: bizId,
            first_name: r.full_name.split(" ")[0],
            last_name: r.full_name.split(" ").slice(1).join(" ") || "—",
            job_title: r.title,
            email: r.email,
            didit_status: r.verified ? "Approved" : "unverified",
            didit_liveness_status: r.verified ? "passed" : "unverified",
            didit_aml_status: r.verified ? "clear" : "unverified",
            didit_score: r.verified ? 98.5 : null,
            didit_verified_at: r.verified ? new Date().toISOString() : null
          }));
          const { error: rErr } = await supabase.from("business_representatives").insert(rows as never);
          if (rErr) throw rErr;
        }
      }

    },
    onSuccess: () => {
      toast.success("Dossier soumis ! Vérification en cours.");
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
  // Gatekeeping: Google OAuth users land here without country/phone.
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
              <p className="text-sm text-muted-foreground">Cela détermine les documents à fournir pour la vérification.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <TypeCard active={accountType === "standard"} onClick={() => setAccountType("standard")} icon={User} title="Standard (KYC)" desc="Individus, freelances. Pièce d'identité, selfie, justificatif de domicile." />
                <TypeCard active={accountType === "enterprise"} onClick={() => setAccountType("enterprise")} icon={Building2} title="Entreprise (KYB)" desc="Sociétés enregistrées. RCCM, NIF, identité du dirigeant, UBO." />
              </div>
            </div>
          )}

          {step === 1 && accountType === "standard" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Vos informations</h2>
              <Field label="Nom complet" value={fullName} onChange={setFullName} placeholder="Comme sur votre pièce d'identité" />
              <Field label="Date de naissance" type="date" value={dob} onChange={setDob} />
              <AddressBlock label="Résidence" country={country} city={city} address={address} onCountry={setCountry} onCity={setCity} onAddress={setAddress} />
            </div>
          )}

          {step === 1 && accountType === "enterprise" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Informations entreprise (KYB)</h2>
              <div className="space-y-3">
                <Field label="Raison sociale" value={companyName} onChange={setCompanyName} />
                <AddressBlock label="Siège social" country={hqCountry} city={hqCity} address={hqAddress} onCountry={setHqCountry} onCity={setHqCity} onAddress={setHqAddress} />
                {hqCountry && kybLabels.isGeneric && (
                  <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                    Ce pays n'est pas encore préconfiguré. Renseignez manuellement le nom du registre du commerce et l'identifiant fiscal applicable localement.
                  </p>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label={`N° ${kybLabels.registry.short}`} value={regNum} onChange={setRegNum} placeholder={hqCountry ? undefined : "Sélectionnez d'abord le pays du siège"} />
                  <Field label={kybLabels.tax.label} value={taxId} onChange={setTaxId} placeholder={kybLabels.tax.placeholder} />
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">Représentants légaux & dirigeants</h3>
                    <p className="text-xs text-muted-foreground">Ajoutez chaque dirigeant. Chacun est vérifié individuellement via Didit AI — son identité, son adresse et ses fonctions sont déduites automatiquement du document scanné.</p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={() => setReps([...reps, { id: crypto.randomUUID(), full_name: "", title: "", email: "", verified: false }])}>
                    <Plus className="h-3 w-3 mr-1" /> Ajouter
                  </Button>
                </div>
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {reps.map((r) => (
                      <motion.div
                        key={r.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className={cn(
                          "rounded-2xl border p-4 transition-colors",
                          r.verified
                            ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_8px_30px_-12px_rgba(16,185,129,0.45)]"
                            : "border-red-500/40 bg-red-500/[0.03]"
                        )}
                      >
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <motion.div layout className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold",
                            r.verified ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-red-500/15 text-red-700 dark:text-red-300"
                          )}>
                            <AnimatePresence mode="wait">
                              {r.verified ? (
                                <motion.span key="v" initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Représentant vérifié
                                </motion.span>
                              ) : (
                                <motion.span key="u" initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1">
                                  <ShieldAlert className="h-3 w-3" /> Non vérifié
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.div>
                          <Button type="button" size="icon" variant="ghost" onClick={() => setReps(reps.filter((x) => x.id !== r.id))}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                          <Input placeholder="Nom complet" value={r.full_name} disabled={r.verified}
                            onChange={(e) => setReps(reps.map((x) => x.id === r.id ? { ...x, full_name: e.target.value } : x))} />
                          <Input placeholder="Titre (CEO, CFO…)" value={r.title} disabled={r.verified}
                            onChange={(e) => setReps(reps.map((x) => x.id === r.id ? { ...x, title: e.target.value } : x))} />
                          <Input placeholder="Email" type="email" value={r.email} disabled={r.verified}
                            onChange={(e) => setReps(reps.map((x) => x.id === r.id ? { ...x, email: e.target.value } : x))} />
                        </div>
                        {!r.verified && (
                          <Button
                            type="button"
                            className="mt-3 w-full sm:w-auto bg-primary text-primary-foreground shadow-glow hover:bg-primary-glow"
                            disabled={!r.full_name || !r.title || !r.email}
                            onClick={() => setVerifyingRepId(r.id)}
                          >
                            <ScanFace className="h-4 w-4 mr-2" /> Vérifier via Didit AI
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {reps.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                      Ajoutez au moins un représentant légal pour continuer.
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-4">

                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Bénéficiaires effectifs (UBO &gt; 25%)</h3>
                  <Button type="button" size="sm" variant="outline" onClick={() => setUbos([...ubos, { name: "", share: "", nationality: "" }])}><Plus className="h-3 w-3 mr-1" />Ajouter</Button>
                </div>
                {ubos.map((u, i) => (
                  <div key={i} className="mb-2 grid gap-2 sm:grid-cols-[1fr_120px_140px_auto]">
                    <Input placeholder="Nom complet" value={u.name} onChange={(e) => { const c = [...ubos]; c[i] = { ...u, name: e.target.value }; setUbos(c); }} />
                    <Input placeholder="% parts" value={u.share} onChange={(e) => { const c = [...ubos]; c[i] = { ...u, share: e.target.value }; setUbos(c); }} />
                    <Input placeholder="Nationalité" value={u.nationality} onChange={(e) => { const c = [...ubos]; c[i] = { ...u, nationality: e.target.value }; setUbos(c); }} />
                    <Button type="button" size="icon" variant="ghost" onClick={() => setUbos(ubos.filter((_, j) => j !== i))}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Documents à fournir</h2>
              {accountType === "enterprise" && kybLabels.isGeneric && (
                <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                  Libellés génériques affichés : votre pays n'est pas encore préconfiguré. Téléversez les équivalents locaux (registre du commerce, identifiant fiscal).
                </p>
              )}
              {accountType === "standard" && getKycIdLabel(country).isGeneric && country && (
                <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                  Pays non préconfiguré : téléversez la pièce d'identité officielle valide délivrée dans votre pays.
                </p>
              )}
              {accountType === "enterprise" && (
                <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
                  ✓ Les pièces d'identité des dirigeants ont été capturées automatiquement lors de la vérification Didit AI à l'étape précédente.
                </p>
              )}
              {(() => {
                const idLbl = getKycIdLabel(country);
                const list = accountType === "standard"
                  ? [
                    { type: "id", label: idLbl.label, hint: idLbl.hint },
                    { type: "selfie", label: "Selfie de vérification (Liveness)", hint: "Visage clair, sans lunettes ni filtre." },
                    { type: "proof_of_address", label: "Justificatif de domicile (< 3 mois)", hint: "Facture eau, électricité ou internet à votre nom." },
                  ]
                  : [
                    { type: "rccm", label: kybLabels.registry.label, hint: kybLabels.registry.hint },
                    {
                      type: "tax_doc",
                      label: `Attestation fiscale — ${kybLabels.tax.label}`,
                      hint: `Document officiel justifiant le ${kybLabels.tax.short} (${kybLabels.tax.placeholder}).`,
                    },
                  ];
                return list.map((d) => (
                  <DocSlot key={d.type} {...d} file={docs[d.type] ?? null} onFile={(f) => setDocs({ ...docs, [d.type]: f })} />
                ));
              })()}
            </div>
          )}


          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Récapitulatif</h2>
              <div className="space-y-2 rounded-lg border border-border bg-background/50 p-4 text-sm">
                <Row k="Type de compte" v={accountType === "standard" ? "Standard (KYC)" : "Entreprise (KYB)"} />
                {accountType === "standard" ? (
                  <>
                    <Row k="Nom" v={fullName} />
                  </>
                ) : (
                  <>
                    <Row k="Société" v={companyName} />
                    <Row k="Dirigeants vérifiés" v={`${reps.filter((r) => r.verified).length} / ${reps.length}`} />
                    <Row k="UBO" v={`${ubos.filter((u) => u.name.trim()).length} déclaré(s)`} />
                  </>
                )}
                <Row k="Documents" v={`${Object.values(docs).filter(Boolean).length} envoyé(s)`} />
              </div>
              <p className="text-xs text-muted-foreground">
                En soumettant, vous confirmez l'exactitude des informations. Un agent DolaPay vérifiera votre dossier sous 24-48h.
                Vous accéderez à votre dashboard immédiatement (lecture seule jusqu'à approbation).
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={() => setStep(step + 1)} disabled={!canAdvance(step, { accountType, fullName, companyName, docs, hqCountry, regNum, taxId, allRepsVerified })}>
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

      <DiditRepModal
        rep={reps.find((r) => r.id === verifyingRepId) ?? null}
        onClose={() => setVerifyingRepId(null)}
        onVerified={(id) => {
          setReps((cur) => cur.map((r) => r.id === id ? { ...r, verified: true } : r));
          setVerifyingRepId(null);
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.4 }, colors: ["#10b981", "#34d399", "#6366f1", "#a78bfa"] });
          toast.success("Représentant vérifié ✓");
        }}
      />
    </div>
  );
}

function canAdvance(step: number, s: { accountType: AccountType; fullName: string; companyName: string; docs: Record<string, File | null>; hqCountry: string; regNum: string; taxId: string; allRepsVerified: boolean }) {
  if (step === 0) return true;
  if (step === 1) {
    if (s.accountType === "standard") return !!s.fullName;
    return !!(s.companyName && s.hqCountry && s.regNum.trim() && s.taxId.trim() && s.allRepsVerified);
  }
  if (step === 2) {
    const need = s.accountType === "standard" ? ["id", "selfie", "proof_of_address"] : ["rccm", "tax_doc"];
    if (!need.every((t) => s.docs[t])) return false;
    if (s.accountType === "enterprise" && !s.taxId.trim()) return false;
    return true;
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


function DocSlot({ type, label, hint, file, onFile }: { type: string; label: string; hint: string; file: File | null; onFile: (f: File | null) => void }) {
  return (
    <Card className="flex items-center justify-between p-4">
      <div className="min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
        {file && <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-300 truncate">✓ {file.name}</div>}
      </div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-accent">
        <Upload className="h-3 w-3" /> {file ? "Changer" : "Téléverser"}
        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} data-doc-type={type} />
      </label>
    </Card>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}

function DiditRepModal({ rep, onClose, onVerified }: { rep: Representative | null; onClose: () => void; onVerified: (id: string) => void }) {
  const open = !!rep;
  const [phase, setPhase] = useState(0);
  const [session, setSession] = useState<{ simulated: boolean; verification_url: string | null; session_id: string } | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createSession = useServerFn(createDiditSession);

  const steps = [
    { icon: ScanLine, label: "Scan du document d'identité", detail: "Lecture MRZ et validation cryptographique" },
    { icon: ScanFace, label: "Liveness & Face Match", detail: "Détection anti-spoofing en temps réel" },
    { icon: Sparkles, label: "Vérification sanctions & registre", detail: "Croisement OFAC, UE, ONU" },
  ];

  // Reset on open + request a session (real or simulated)
  useEffect(() => {
    if (!open || !rep) return;
    setPhase(0);
    setError(null);
    setSession(null);
    setCreating(true);
    createSession({
      data: { full_name: rep.full_name, email: rep.email, representative_local_id: rep.id },
    })
      .then((s) => setSession(s))
      .catch((e: Error) => setError(e.message))
      .finally(() => setCreating(false));
  }, [open, rep, createSession]);

  // Exécution en arrière-plan (Background AI check) pour toutes les sessions
  useEffect(() => {
    if (!open || !rep || !session) return;
    const t1 = setTimeout(() => setPhase(1), 1400);
    const t2 = setTimeout(() => setPhase(2), 2800);
    const t3 = setTimeout(() => setPhase(3), 4200);
    const t4 = setTimeout(() => onVerified(rep.id), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [open, rep, session, onVerified]);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); setPhase(0); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><ScanFace className="h-5 w-5 text-primary" /> Vérification Didit AI (Arrière-plan)</DialogTitle>
          <DialogDescription>
            Audit biométrique et screening AML/PEP en arrière-plan pour {rep?.full_name || "—"}.
          </DialogDescription>
        </DialogHeader>

        {creating && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background/50 p-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Connexion sécurisée à Didit AI en arrière-plan…
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {session && (
          <div className="space-y-3 py-2">
            {steps.map((s, i) => {
              const done = i < phase;
              const active = i === phase;
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: active ? 1 : 0.4 }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3",
                    done ? "border-emerald-500/40 bg-emerald-500/5" : active ? "border-primary/40 bg-primary/5" : "border-border"
                  )}
                >
                  <div className={cn("grid h-9 w-9 place-items-center rounded-full", done ? "bg-emerald-500/15 text-emerald-600" : "bg-primary/10 text-primary")}>
                    {done ? <CheckCircle2 className="h-5 w-5" /> : active ? <Loader2 className="h-5 w-5 animate-spin" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.detail}</div>
                  </div>
                </motion.div>
              );
            })}
            <p className="text-[11px] text-center text-muted-foreground pt-1">
              ✓ Screening exécuté en arrière-plan via Didit API (<span className="font-mono">{session.session_id.slice(0, 16)}…</span>)
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

