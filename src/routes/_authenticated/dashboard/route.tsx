import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  ListOrdered,
  LinkIcon,
  KeyRound,
  Settings as SettingsIcon,
  ShieldCheck,
  LogOut,
  Menu,
  Send,
  Users,
  Lock as LockIcon,
  Crown,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { getTier } from "@/lib/tier";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import logoFull from "@/assets/dolapay-logo.png.asset.json";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardLayout,
});

export type KycStatus = "pending" | "in_compliance_review" | "approved" | "rejected" | "frozen";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  account_type: "standard" | "enterprise";
  kyc_status: KycStatus;
  kyc_rejection_reason: string | null;
  volume_limit_xof: number;
  onboarding_completed: boolean;
};

export function useProfile() {
  return useQuery({
    queryKey: ["my-profile"],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<Profile | null> => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;

      const userEmail = u.user.email?.toLowerCase() || "";
      const isMasterAdmin = userEmail === "support@dolapay.co" || userEmail === "isidoreagonan@gmail.com";

      let data: any = null;
      try {
        const res = await supabase
          .from("profiles")
          .select("*")
          .eq("id", u.user.id)
          .maybeSingle();
        data = res.data;

        if (!data && userEmail) {
          const resEmail = await supabase
            .from("profiles")
            .select("*")
            .ilike("email", userEmail)
            .maybeSingle();
          data = resEmail.data;
        }
      } catch (e) {
        console.warn("Erreur lecture profil SQL:", e);
      }

      let profileData = (data || {}) as Partial<Profile>;
      const isOnboarded = profileData.onboarding_completed === true;

      // SÉCURITÉ : Si l'utilisateur n'a pas terminé l'onboarding, AUCUN passe-droit ni auto-approbation !
      if (!isOnboarded) {
        const fallbackName = profileData.full_name || u.user.user_metadata?.full_name || u.user.user_metadata?.name || userEmail.split("@")[0] || "Utilisateur";
        const pendingProfile: Profile = {
          id: u.user.id,
          email: u.user.email || userEmail,
          full_name: fallbackName,
          account_type: "standard",
          kyc_status: "pending", // Strictement dévérifié ("pending")
          kyc_rejection_reason: profileData.kyc_rejection_reason || null,
          volume_limit_xof: 2000000,
          onboarding_completed: false, // Strictement non onboardé
        };

        try {
          if (!data) {
            supabase.from("profiles").upsert({
              id: pendingProfile.id,
              email: pendingProfile.email,
              full_name: pendingProfile.full_name,
              account_type: "standard",
              kyc_status: "pending",
              volume_limit_xof: 2000000,
              onboarding_completed: false,
            }).then(() => {
              try {
                fetch("/api/public/send-notification", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ type: "welcome", email: pendingProfile.email, name: pendingProfile.full_name }),
                }).catch(() => {});
              } catch {}
            });
          }
        } catch (_) {}

        return pendingProfile;
      }

      // Si l'utilisateur a COMPLÉTÉ l'onboarding et que c'est le fondateur (Master Admin)
      if (isMasterAdmin) {
        const founderName = userEmail.includes("support") ? "DolaPay Support" : "AGONAN ISIDORE ABRAHAM";
        return {
          id: u.user.id,
          email: u.user.email || userEmail,
          full_name: profileData.full_name || u.user.user_metadata?.full_name || u.user.user_metadata?.name || founderName,
          account_type: "enterprise",
          kyc_status: "approved",
          kyc_rejection_reason: null,
          volume_limit_xof: 999999999999,
          onboarding_completed: true,
        };
      }

      const fallbackName = profileData.full_name || u.user.user_metadata?.full_name || u.user.user_metadata?.name || userEmail.split("@")[0] || "Utilisateur";

      const resolvedProfile: Profile = {
        id: u.user.id,
        email: u.user.email || userEmail,
        full_name: fallbackName,
        account_type: profileData.account_type || "standard",
        kyc_status: profileData.kyc_status || "pending",
        kyc_rejection_reason: profileData.kyc_rejection_reason || null,
        volume_limit_xof: profileData.volume_limit_xof || 2000000,
        onboarding_completed: true,
      };

      return resolvedProfile;
    },
  });
}


export function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<boolean> => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) return false;
      const email = user.email?.toLowerCase() || "";
      
      // SÉCURITÉ : Vérifier impérativement si l'utilisateur a complété l'onboarding dans la base !
      const { data: profile } = await supabase.from("profiles").select("onboarding_completed").eq("id", user.id).maybeSingle();
      if (!profile || profile.onboarding_completed !== true) {
        return false;
      }

      if (email === "support@dolapay.co" || email === "isidoreagonan@gmail.com") return true;
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (error) return false;
        return !!data;
      } catch (e) {
        return false;
      }
    },
  });
}

function DashboardLayout() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [open, setOpen] = useState(false);
  const [showPayoutsModal, setShowPayoutsModal] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // IMPORTANT : Tous les hooks React (useEffect, useState) DOIVENT être appelés AVANT tout return conditionnel pour éviter les crashs de rendu !
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        if (window.location.hash === "#" || window.location.hash.includes("access_token") || window.location.hash.includes("error_description")) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      }, 300);
    }
    if (profile && !profile.onboarding_completed) {
      navigate({ to: "/onboarding", replace: true });
      return;
    }
    // Admins are auto-redirected to /admin UNLESS they explicitly chose merchant view.
    if (isAdmin && typeof window !== "undefined" && sessionStorage.getItem("merchant_view") !== "1") {
      navigate({ to: "/admin", replace: true });
    }
  }, [profile, isAdmin, navigate]);

  if (profileLoading || adminLoading || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-glow animate-pulse">
          <img src={logoFull.url} alt="DolaPay" className="h-10 w-auto object-contain" />
        </div>
        <h2 className="font-display text-lg font-bold text-foreground">Chargement sécurisé de votre espace...</h2>
        <p className="mt-1 text-xs text-muted-foreground">Vérification chiffrée de votre profil, de vos permissions et de votre niveau de compte.</p>
        <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-primary">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Synchronisation des données...</span>
        </div>
      </div>
    );
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Déconnecté");
    navigate({ to: "/auth/sign-in", replace: true });
  }

  const tier = getTier(profile?.account_type);
  const payoutsLocked = !tier.capabilities.payouts;

  const navItems: { to: string; icon: typeof LayoutDashboard; label: string; exact?: boolean; locked?: boolean; lockedTip?: string }[] = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Vue d'ensemble", exact: true },
    { to: "/dashboard/wallet", icon: Wallet, label: "Portefeuille" },
    { to: "/dashboard/transactions", icon: ListOrdered, label: "Transactions" },
    { to: "/dashboard/payment-links", icon: LinkIcon, label: "Liens de paiement" },
    {
      to: "/dashboard/payouts",
      icon: Send,
      label: "Décaissements en masse",
      locked: payoutsLocked,
      lockedTip: "Passez à l'Enterprise Tier pour débloquer les décaissements automatisés vers des tiers.",
    },
    { to: "/dashboard/team", icon: Users, label: "Équipe" },
    ...(profile?.account_type === "enterprise"
      ? [{ to: "/dashboard/api-keys", icon: KeyRound, label: "Clés API" }]
      : []),
    { to: "/dashboard/verify", icon: ShieldCheck, label: profile?.kyc_status === "approved" ? "Vérifié" : "Vérification" },
    { to: "/dashboard/settings", icon: SettingsIcon, label: "Compte & KYC" },
    ...(isAdmin ? [{ to: "/admin", icon: Crown, label: "Système Admin" }] : []),
  ];

  const locked = profile && profile.kyc_status !== "approved";

  return (
    <TooltipProvider delayDuration={150}>
    <div className="min-h-screen bg-background">
      {/* Mobile topbar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur">
        <Link to="/dashboard"><img src={logoFull.url} alt="DolaPay" className="h-7" /></Link>
        <button onClick={() => setOpen(!open)} className="rounded-lg border border-border p-2"><Menu className="h-5 w-5" /></button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex h-screen w-72 transform flex-col border-r border-border bg-card/95 px-4 py-6 backdrop-blur-xl transition-transform lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <Link to="/dashboard" className="mb-6 flex shrink-0 items-center">
            <img src={logoFull.url} alt="DolaPay" className="h-8" />
          </Link>

          <div className="mb-6 shrink-0 rounded-xl border border-border bg-background/50 p-3">
            <div className="text-xs text-muted-foreground">Connecté en tant que</div>
            <div className="truncate text-sm font-semibold">{profile?.full_name || profile?.email}</div>
            {profile?.id && (
              <button
                type="button"
                onClick={() => {
                  const accId = `acc_${profile.id.replace(/-/g, "").slice(0, 16)}`;
                  navigator.clipboard?.writeText(accId);
                  toast.success("Identifiant copié");
                }}
                className="mt-1 block truncate font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                title="Cliquer pour copier"
              >
                acc_{profile.id.replace(/-/g, "").slice(0, 16)}
              </button>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", tier.badgeClass)}>
                <span>{tier.icon}</span> {tier.short} Tier
              </span>
              <KycBadge status={profile?.kyc_status ?? "pending"} />
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map((it) => {
              const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
              const linkClass = cn(
                "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground shadow" : "text-foreground/80 hover:bg-accent",
                it.locked && !active && "opacity-70",
              );
              const inner = (
                <>
                  <span className="flex items-center gap-3"><it.icon className="h-4 w-4" /> {it.label}</span>
                  {it.locked && <LockIcon className="h-3.5 w-3.5 opacity-80" />}
                </>
              );
              if (it.locked) {
                return (
                  <Tooltip key={it.to}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => { setOpen(false); setShowPayoutsModal(true); }}
                        className={cn(linkClass, "w-full text-left")}
                      >
                        {inner}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{it.lockedTip}</TooltipContent>
                  </Tooltip>
                );
              }
              return (
                <Link
                  key={it.to}
                  to={it.to as "/dashboard"}
                  onClick={() => {
                    if (it.to === "/admin" && typeof window !== "undefined") {
                      sessionStorage.removeItem("merchant_view");
                    }
                    setOpen(false);
                  }}
                  className={linkClass}
                >
                  {inner}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleSignOut}
            className="mt-4 flex shrink-0 items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </aside>

        {/* Overlay */}
        {open && <button onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm lg:hidden" />}

        {/* Main */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-10 lg:ml-72">
          {locked && profile?.kyc_status === "pending" && pathname !== "/dashboard/settings" && pathname !== "/dashboard/admin" && pathname !== "/dashboard/verify" && pathname !== "/dashboard" && (
            <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200">
              <strong>Vérification en cours.</strong> Complétez votre dossier KYC dans{" "}
              <Link to="/dashboard/settings" className="underline">Compte & KYC</Link>. Certaines fonctionnalités sont verrouillées tant que votre compte n'est pas approuvé.
            </div>
          )}
          <Outlet />
        </main>
      </div>

      <Dialog open={showPayoutsModal} onOpenChange={setShowPayoutsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-amber-500" /> Fonctionnalité Enterprise</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Passez à l'<strong>Enterprise Tier</strong> pour débloquer les décaissements automatisés vers des
            tiers, les virements en masse et les webhooks signés.
          </p>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPayoutsModal(false)}>Plus tard</Button>
            <Button asChild><Link to="/dashboard/settings">Demander la mise à niveau</Link></Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}

function KycBadge({ status }: { status: KycStatus }) {
  const map: Record<KycStatus, { label: string; cls: string }> = {
    pending: { label: "En attente", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-300" },
    in_compliance_review: { label: "En examen", cls: "bg-primary/15 text-primary" },
    approved: { label: "Approuvé", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" },
    rejected: { label: "Rejeté", cls: "bg-rose-500/15 text-rose-600 dark:text-rose-300" },
    frozen: { label: "Gelé", cls: "bg-slate-500/15 text-slate-500" },
  };
  const m = map[status];
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", m.cls)}>{m.label}</span>;
}
