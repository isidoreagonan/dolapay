import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Upload, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "./route";
import { getKybLabels, getKycIdLabel } from "@/lib/kyb-documents";

export const Route = createFileRoute("/_authenticated/dashboard/resubmit")({
  component: ResubmitPage,
});

function ResubmitPage() {
  const { data: profile } = useProfile();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const [docs, setDocs] = useState<Record<string, File | null>>({});

  const accountType = profile?.account_type || "standard";
  const country = profile?.country || "BF";
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
        
        if (accountType === "enterprise" && (t === "rccm" || t === "tax_doc")) {
          if (file.type !== "application/pdf") {
             throw new Error(`Le document légal/fiscal (${t}) doit obligatoirement être au format PDF.`);
          }
        }

        const ext = file.name.split(".").pop() ?? "bin";
        const path = `${uid}/${t}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
        if (upErr) throw upErr;
        
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
          kyc_status: "in_compliance_review", 
          kyc_rejection_reason: "[RESSOUMIS]",
          ai_verification_log: uploadedDocs as any,
        } as never)
        .eq("id", uid);
      if (pErr) throw pErr;
    },
    onSuccess: () => {
      toast.success("Dossier resoumis avec succès !");
      qc.invalidateQueries({ queryKey: ["my-profile"] });
      navigate({ to: "/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (profile?.kyc_status !== "rejected") {
    navigate({ to: "/dashboard", replace: true });
    return null;
  }

  const canAdvance = () => {
    if (accountType === "standard") return !!(docs["id"] && docs["selfie"]);
    return !!(docs["id"] && docs["selfie"] && docs["rccm"] && docs["tax_doc"]);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-3 w-3" /> Retour au tableau de bord
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Ressoumission du dossier</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Veuillez fournir de nouveaux documents clairs et lisibles pour lever la restriction sur votre compte.
          </p>
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="space-y-4">
          <div className="space-y-3">
            <DocSlot 
              type="id" 
              label={getKycIdLabel(country).label} 
              hint="Photo ou scan clair de votre pièce d'identité." 
              accept="image/*"
              file={docs["id"] ?? null} 
              onFile={(f) => setDocs({ ...docs, id: f })} 
            />
            <DocSlot 
              type="selfie" 
              label={accountType === "standard" ? "Photo de votre visage (Selfie)" : "Photo du visage du gérant (Selfie)"} 
              hint="Visage bien visible, sans lunettes. Assurez-vous que l'éclairage est bon." 
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
                  hint="Document fiscal officiel récent. Obligatoirement en PDF." 
                  accept="application/pdf"
                  file={docs["tax_doc"] ?? null} 
                  onFile={(f) => setDocs({ ...docs, tax_doc: f })} 
                />
              </>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end">
          <Button type="button" onClick={() => submit.mutate()} disabled={submit.isPending || !canAdvance()}>
            {submit.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
            Soumettre le nouveau dossier
          </Button>
        </div>
      </Card>
    </div>
  );
}

function DocSlot({ type, label, hint, accept, file, onFile }: { type: string; label: string; hint: string; accept: string; file: File | null; onFile: (f: File | null) => void }) {
  return (
    <Card className="flex items-center justify-between p-4">
      <div className="min-w-0 pr-4">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
        {file && <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-300 truncate">✓ {file.name}</div>}
      </div>
      <label className="inline-flex cursor-pointer shrink-0 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-accent">
        <Upload className="h-3 w-3" /> {file ? "Changer" : "Uploader"}
        <input type="file" accept={accept} className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} data-doc-type={type} />
      </label>
    </Card>
  );
}
