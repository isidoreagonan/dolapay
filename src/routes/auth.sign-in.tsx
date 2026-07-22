import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Zap, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logoFull from "@/assets/dolapay-logo.png.asset.json";

export const Route = createFileRoute("/auth/sign-in")({
  head: () => ({
    meta: [
      { title: "Connexion — DolaPay" },
      { name: "description", content: "Connectez-vous à votre tableau de bord DolaPay." },
      { property: "og:title", content: "Connexion — DolaPay" },
      { property: "og:description", content: "Connectez-vous à votre tableau de bord DolaPay." },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [magicLinkMode, setMagicLinkMode] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (magicLinkMode) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + "/dashboard",
        },
      });
      setLoading(false);
      if (error) {
        toast.error(error.message || "Impossible d'envoyer le lien magique.");
        return;
      }
      setMagicSent(true);
      toast.success("Lien de connexion envoyé par e-mail !");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      const msg = error.message || (typeof error === 'object' && Object.keys(error).length > 0 ? JSON.stringify(error) : "Identifiants incorrects ou mot de passe invalide.");
      if (msg.toLowerCase().includes("invalid login credentials") || msg === "{}") {
        toast.error("Identifiants incorrects. Si ce compte a été créé via Google, utilisez la connexion Google.");
      } else {
        toast.error(msg);
      }
      return;
    }
    toast.success("Connexion réussie");
    navigate({ to: "/dashboard" });
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
      toast.error("Connexion Google impossible");
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
            Paiements simplifiés.<br/><span className="text-primary">Croissance accélérée.</span>
          </h1>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="mt-1 h-12 w-12 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Acceptez Mobile Money et Cartes</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Encaissez via MTN, Moov, Orange et cartes bancaires avec une seule intégration. Plus de frictions pour vos clients.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="mt-1 h-12 w-12 shrink-0 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Sécurité de niveau bancaire</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Transactions cryptées, conformité stricte et lutte anti-fraude. Nous protégeons vos revenus.
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
            <h2 className="text-2xl font-bold text-slate-900">Heureux de vous revoir.</h2>
            <p className="text-sm text-slate-500 mt-2">
              Nouveau sur DolaPay ? <Link to="/auth/sign-up" className="font-semibold text-primary hover:underline">Créer un compte</Link>
            </p>
          </div>

          {magicSent ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-6 text-center">
              <p className="font-semibold text-emerald-600">Lien magique envoyé !</p>
              <p className="mt-2 text-sm text-slate-500">Vérifiez votre boîte de réception (et vos spams) pour vous connecter instantanément.</p>
              <button type="button" onClick={() => setMagicSent(false)} className="mt-4 text-sm font-medium text-primary hover:underline">
                Réessayer avec un autre e-mail / mot de passe
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field type="email" placeholder="E-mail" value={email} onChange={setEmail} />
              
              {!magicLinkMode && (
                <Field type="password" placeholder="Mot de passe" value={password} onChange={setPassword} />
              )}

              <div className="flex items-center justify-between mt-1">
                <button
                  type="button"
                  onClick={() => setMagicLinkMode(!magicLinkMode)}
                  className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
                >
                  {magicLinkMode ? "Connexion par mot de passe" : "Mot de passe oublié / Lien magique ?"}
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 rounded-xl shadow-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {magicLinkMode ? "Recevoir le lien magique" : "Se connecter"}
                </button>
              </div>
            </form>
          )}

          <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
            <div className="h-px flex-1 bg-border" /> ou continuer avec <div className="h-px flex-1 bg-border" />
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
            En vous connectant, vous acceptez nos <Link to="/legal/terms" className="hover:underline">Conditions d'utilisation</Link> et notre <Link to="/legal/privacy" className="hover:underline">Politique de confidentialité</Link>.
          </p>
        </div>

      </div>
    </div>
  );
}

function Field({ type, placeholder, value, onChange }: { type: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
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
