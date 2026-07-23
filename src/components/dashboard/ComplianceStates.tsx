import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldAlert, Clock, Sparkles, X, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ComplianceReviewScreen({ isResubmission = false }: { isResubmission?: boolean }) {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <Card className="relative w-full max-w-xl overflow-hidden border-primary/30 bg-card/60 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="relative">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-primary/15 ring-8 ring-primary/5">
            <span className="absolute h-20 w-20 animate-ping rounded-full bg-primary/30" />
            <Clock className="relative h-9 w-9 text-primary" />
          </div>
          <Badge className="mb-3 bg-primary/15 text-primary hover:bg-primary/20">Conformité · AML/CFT</Badge>
          <h1 className="text-2xl font-bold tracking-tight">
            {isResubmission ? "Révision du dossier en cours" : "Examen de conformité en cours"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {isResubmission 
              ? "Vos nouveaux documents ont été transmis à notre équipe de conformité de manière sécurisée. Nous les analysons manuellement."
              : "Votre dossier d'identité a été reçu de manière sécurisée. Notre moteur de risque automatisé et notre département juridique procèdent aux vérifications AML standard."}
            <br />
            <span className="font-medium text-foreground">Délai estimé : 12 à 24 heures.</span>
          </p>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Progression</span>
              <span>75%</span>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-primary/10">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary/70 to-primary" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Vous recevrez un email dès l'approbation. Aucune action n'est requise de votre part.
          </p>
        </div>
      </Card>
      <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}`}</style>
    </div>
  );
}

export function RejectedScreen({ reason }: { reason?: string | null }) {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <Card className="w-full max-w-xl overflow-hidden border-rose-500/40 bg-card/60 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-rose-500/15 ring-8 ring-rose-500/5">
          <ShieldAlert className="h-8 w-8 text-rose-500" />
        </div>
        <div className="text-center">
          <Badge variant="destructive" className="mb-3">Action requise</Badge>
          <h1 className="text-2xl font-bold tracking-tight">Vérification non aboutie</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Votre vérification d'identité n'a pas pu être validée par notre équipe conformité.
          </p>
        </div>

        <Alert variant="destructive" className="mt-6 border-rose-500/40 bg-rose-500/10 text-left">
          <AlertTitle className="font-semibold">Motif du refus</AlertTitle>
          <AlertDescription>
            {reason?.trim() || "Pièce d'identité expirée ou image floue. Veuillez soumettre des documents lisibles et en cours de validité."}
          </AlertDescription>
        </Alert>

        <Button asChild size="lg" className="mt-6 w-full bg-rose-600 text-white hover:bg-rose-700">
          <Link to="/dashboard/resubmit">
            <RefreshCw className="h-4 w-4 mr-2" /> Soumettre à nouveau les documents
          </Link>
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Besoin d'aide ? Écrivez-nous à <a href="mailto:compliance@dola-pay.com" className="underline">compliance@dola-pay.com</a>
        </p>
      </Card>
    </div>
  );
}

export function ApprovedBanner({ storageKey = "dolapay.approved.banner" }: { storageKey?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setOpen(window.localStorage.getItem(storageKey) !== "dismissed");
  }, [storageKey]);
  if (!open) return null;
  return (
    <div className={cn(
      "relative mb-6 overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-primary/5 to-emerald-500/10 p-4 shadow-sm backdrop-blur",
    )}>
      <div className="flex items-start gap-3 pr-8">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">Bienvenue sur DolaPay Live !</div>
          <div className="text-xs text-muted-foreground">Vos plafonds de transaction ont été mis à jour. Vous pouvez encaisser et opérer en production.</div>
        </div>
      </div>
      <button
        onClick={() => { window.localStorage.setItem(storageKey, "dismissed"); setOpen(false); }}
        aria-label="Fermer"
        className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-background/60"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
