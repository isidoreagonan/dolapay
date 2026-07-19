import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoFull from "@/assets/dolapay-logo.png.asset.json";
import { CountrySelect, PhoneField } from "@/components/auth/CountryPhone";
import { findCountryByCode, findCountryByName, isValidLocalPhone } from "@/lib/supported-countries";

export const Route = createFileRoute("/_authenticated/complete-profile")({
  component: CompleteProfilePage,
});

function CompleteProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data: u } = await supabase.auth.getUser();
        if (!u.user) return;
        const { data: p } = await supabase.from("profiles").select("first_name,last_name,full_name,country,phone").eq("id", u.user.id).maybeSingle();
        if (p?.country && p?.phone) {
          navigate({ to: "/onboarding", replace: true });
          return;
        }
        const meta = u.user.user_metadata ?? {};
        
        const safeSplit = p?.full_name ? p.full_name.split(" ") : [];
        setFirstName(p?.first_name ?? meta.given_name ?? (safeSplit[0] ?? ""));
        setLastName(p?.last_name ?? meta.family_name ?? (safeSplit.slice(1).join(" ") ?? ""));
        
        if (p?.country) {
          const c = findCountryByName(p.country);
          if (c) setCountryCode(c.code);
        }
      } catch (err) {
        console.error("Error loading complete-profile:", err);
      } finally {
        setChecking(false);
      }
    })();
  }, [navigate]);

  const queryClient = useQueryClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const country = findCountryByCode(countryCode);
    if (!country) return toast.error("Sélectionnez votre pays.");
    if (!isValidLocalPhone(country, phone)) {
      return toast.error(`Numéro ${country.name} invalide. Attendu : ${country.phoneLengths.join(" ou ")} chiffres.`);
    }
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setLoading(false); return; }
    const fullName = `${firstName} ${lastName}`.trim();
    const { error } = await supabase.from("profiles").update({
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      country: country.name,
      phone: `${country.dialCode}${phone}`,
    }).eq("id", u.user.id);
    
    setLoading(false);
    if (error) return toast.error(error.message);
    
    // Completely remove the stale cache so /onboarding is forced to show a loading state and fetch fresh data
    queryClient.removeQueries({ queryKey: ["my-profile"] });
    
    toast.success("Profil complété ✓");
    
    // Check if they are already onboarded (e.g. forced admin bypass)
    const { data: p2 } = await supabase.from("profiles").select("onboarding_completed").eq("id", u.user.id).maybeSingle();
    if (p2?.onboarding_completed) {
      navigate({ to: "/dashboard" });
    } else {
      navigate({ to: "/onboarding" });
    }
  }

  if (checking) {
    return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="relative mx-auto grid min-h-screen max-w-md place-items-center px-4 py-16">
        <div className="w-full">
          <div className="mx-auto mb-8 grid place-items-center">
            <img src={logoFull.url} alt="DolaPay" className="h-14 w-auto object-contain" />
          </div>
          <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-elegant backdrop-blur-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary">
              <ShieldCheck className="h-3 w-3" /> Étape obligatoire — Conformité
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Complétez votre profil</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pour ouvrir un compte DolaPay, nous devons connaître votre pays d'opération et un numéro joignable.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <SimpleField label="Prénom" value={firstName} onChange={setFirstName} />
                <SimpleField label="Nom" value={lastName} onChange={setLastName} />
              </div>
              <CountrySelect value={countryCode} onChange={(c) => { setCountryCode(c); setPhone(""); }} />
              <PhoneField countryCode={countryCode} value={phone} onChange={setPhone} />
              <button type="submit" disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.01] hover:bg-primary-glow disabled:opacity-60">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continuer <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground/80">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 focus-within:border-primary">
        <input value={value} onChange={(e) => onChange(e.target.value)} required
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground focus:outline-none" />
      </div>
    </label>
  );
}
