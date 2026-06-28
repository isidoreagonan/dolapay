import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Mail, Lock, User, Loader2 } from "lucide-react";
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
    // Supabase obfuscates duplicates: returns a user with an empty identities array.
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
      setLoading(false);
      toast.success("Compte créé. Bienvenue !");
      navigate({ to: "/dashboard" });
    } else {
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
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -bottom-40 left-[-10%] h-[420px] w-[420px] rounded-full bg-primary-glow/15 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-md place-items-center px-4 py-16">
        <div className="w-full">
          <Link to="/" className="mx-auto mb-8 grid place-items-center">
            <img src={logoFull.url} alt="DolaPay" className="h-14 w-auto object-contain drop-shadow-[0_4px_20px_rgba(99,102,241,0.35)]" />
          </Link>

          <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-elegant backdrop-blur-xl">
            <h1 className="font-display text-2xl font-bold text-foreground">Créez votre compte</h1>
            <p className="mt-1 text-sm text-muted-foreground">Commencez à encaisser partout en Afrique en quelques minutes.</p>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-60"
            >
              {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleG />} S'inscrire avec Google
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field icon={User} type="text" placeholder="Jean" label="Prénom" value={firstName} onChange={setFirstName} />
                <Field icon={User} type="text" placeholder="Dupont" label="Nom" value={lastName} onChange={setLastName} />
              </div>
              <CountrySelect value={countryCode} onChange={(c) => { setCountryCode(c); setPhone(""); }} />
              <PhoneField countryCode={countryCode} value={phone} onChange={setPhone} />
              <Field icon={Mail} type="email" placeholder="vous@entreprise.com" label="E-mail professionnel" value={email} onChange={setEmail} />
              <Field icon={Lock} type="password" placeholder="Au moins 6 caractères" label="Mot de passe" value={password} onChange={setPassword} />
              <button
                type="submit"
                disabled={loading}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.01] hover:bg-primary-glow disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Créer un compte <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <Link to="/auth/sign-in" className="font-semibold text-primary hover:underline">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, type, placeholder, label, value, onChange }: { icon: React.ComponentType<{ className?: string }>; type: string; placeholder: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground/80">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 focus-within:border-primary">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={type === "password" ? 6 : undefined}
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
      </div>
    </label>
  );
}

function GoogleG() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3l5.7-5.7C34 5.1 29.3 3 24 3 16.1 3 9.3 7.5 6.3 14.7z"/><path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.5-5.2l-6.3-5.3c-1.9 1.3-4.4 2.1-7.2 2.1-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.2 40.4 16 45 24 45z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.3 5.3c-.4.4 6.9-5 6.9-14.9 0-1.2-.1-2.3-.4-3.5z"/></svg>
  );
}
