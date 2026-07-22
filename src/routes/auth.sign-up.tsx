import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Zap, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logoFull from "@/assets/dolapay-logo.png.asset.json";
import { CountrySelect, PhoneField } from "@/components/auth/CountryPhone";
import { findCountryByCode, isValidLocalPhone } from "@/lib/supported-countries";

export const Route = createFileRoute("/auth/sign-up")({
  head: () => ({
    meta: [
      { title: "Créer un compte — DolaPay" },
      { name: "description", content: "Créez votre compte DolaPay gratuit et commencez à construire." },
      { property: "og:title", content: "Créer un compte — DolaPay" },
      { property: "og:description", content: "Créez votre compte DolaPay gratuit et commencez à construire." },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const country = findCountryByCode(countryCode);
    if (!country) {
      toast.error("Sélectionnez votre pays dans la liste des marchés couverts.");
      return;
    }
    if (!isValidLocalPhone(country, phone)) {
      toast.error(`Numéro ${country.name} invalide. Attendu : ${country.phoneLengths.join(" ou ")} chiffres.`);
      return;
    }
    setLoading(true);
    const fullPhone = `${country.dialCode}${phone}`;
    const fullName = `${firstName} ${lastName}`.trim();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
        data: {
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          country: country.name,
          phone: fullPhone,
        },
      },
    });
    if (error) {
      setLoading(false);
      if (/registered|exists|already/i.test(error.message)) {
        toast.error("Un compte existe déjà avec cet e-mail. Connectez-vous (Google ou mot de passe).");
      } else {
        toast.error(error.message);
      }
      return;
    }
    // Supabase obfuscates duplicates
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      setLoading(false);
      toast.error("Un compte existe déjà avec cet e-mail. Connectez-vous via Google ou avec votre mot de passe.");
      return;
    }
    if (data.session && data.user) {
      await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          country: country.name,
          phone: fullPhone,
        })
        .eq("id", data.user.id);
      try {
        await fetch("/api/public/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "welcome", email, name: fullName }),
        }).catch(() => {});
      } catch {}
      setLoading(false);
      toast.success("Compte créé. Bienvenue !");
      navigate({ to: "/dashboard" });
    } else {
      try {
        await fetch("/api/public/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "welcome", email, name: fullName }),
        }).catch(() => {});
      } catch {}
      setLoading(false);
      toast.success("Vérifiez votre e-mail pour confirmer votre compte.");
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
    setGoogleLoading(false);
    if (error) {
      toast.error("Inscription Google impossible");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-slate-50 relative overflow-hidden">
      {/* Soft blurred background blobs */}
      <div className="absolute left-[-10%] top-[10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply opacity-70 pointer-events-none" />
      <div className="absolute left-[20%] bottom-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-multiply opacity-60 pointer-events-none" />
      
      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        
        {/* Left Side: Branding / Marketing */}
        <div className="hidden lg:flex flex-col justify-center h-full">
          <h1 className="text-[3.5rem] leading-[1.1] font-black text-slate-900 mb-12 tracking-tight">
            Développez vos affaires<br/><span className="text-primary">partout en Afrique.</span>
          </h1>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="mt-1 h-12 w-12 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Déploiement immédiat</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Créez votre compte et générez votre premier lien de paiement en moins de 2 minutes. Aucune attente technique.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="mt-1 h-12 w-12 shrink-0 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Couverture régionale complète</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Bénin, Côte d'Ivoire, Sénégal, Mali... Unifiez tous les réseaux Mobile Money d'Afrique de l'Ouest sous une seule plateforme.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <Link to="/">
              <img src={logoFull.url} alt="DolaPay" className="h-10 w-auto object-contain" />
            </Link>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] w-full max-w-[480px] mx-auto border border-slate-100">
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/">
              <img src={logoFull.url} alt="DolaPay" className="h-10 w-auto object-contain" />
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Créer un compte.</h2>
            <p className="text-sm text-slate-500 mt-2">
              Déjà un compte ? <Link to="/auth/sign-in" className="font-semibold text-primary hover:underline">Se connecter</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field type="text" placeholder="Prénom" value={firstName} onChange={setFirstName} />
              <Field type="text" placeholder="Nom" value={lastName} onChange={setLastName} />
            </div>
            
            <div className="[&>div>button]:h-[46px] [&>div>button]:rounded-xl [&>div>button]:border-slate-200">
              <CountrySelect value={countryCode} onChange={(c) => { setCountryCode(c); setPhone(""); }} />
            </div>
            
            <div className="[&>div>input]:h-[46px] [&>div>input]:rounded-xl [&>div>input]:border-slate-200 [&>div>div]:h-[46px] [&>div>div]:rounded-l-xl [&>div>div]:border-slate-200">
              <PhoneField countryCode={countryCode} value={phone} onChange={setPhone} />
            </div>

            <Field type="email" placeholder="E-mail professionnel" value={email} onChange={setEmail} />
            <Field type="password" placeholder="Mot de passe (6 car. min)" value={password} onChange={setPassword} minLength={6} />

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 rounded-xl shadow-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                S'inscrire
              </button>
            </div>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
            <div className="h-px flex-1 bg-slate-200" /> ou continuer avec <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors disabled:opacity-70"
          >
            {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleG />} Google
          </button>
          
          <p className="text-[10px] text-center text-slate-500 mt-8">
            En vous inscrivant, vous acceptez nos <Link to="/legal/terms" className="hover:underline">Conditions d'utilisation</Link> et notre <Link to="/legal/privacy" className="hover:underline">Politique de confidentialité</Link>.
          </p>
        </div>

      </div>
    </div>
  );
}

function Field({ type, placeholder, value, onChange, minLength }: { type: string; placeholder: string; value: string; onChange: (v: string) => void; minLength?: number }) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        minLength={minLength}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
      />
    </div>
  );
}

function GoogleG() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3l5.7-5.7C34 5.1 29.3 3 24 3 16.1 3 9.3 7.5 6.3 14.7z"/><path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.5-5.2l-6.3-5.3c-1.9 1.3-4.4 2.1-7.2 2.1-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.2 40.4 16 45 24 45z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.3 5.3c-.4.4 6.9-5 6.9-14.9 0-1.2-.1-2.3-.4-3.5z"/></svg>
  );
}
