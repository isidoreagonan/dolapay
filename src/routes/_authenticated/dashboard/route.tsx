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
  Webhook,
  Lock as LockIcon,
  Crown,
  Wallet,
  PanelLeftClose,
  PanelLeftOpen,
  Building,
  Code2,
  Globe,
  Sun,
  Moon,
  Bell,
  User,
  CreditCard,
  ChevronDown
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { getTier } from "@/lib/tier";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import logoFull from "@/assets/dolapay-logo.png.asset.json";
import { useWorkspace } from "@/contexts/WorkspaceContext";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardLayout,
});

export type KycStatus = "pending" | "in_compliance_review" | "approved" | "rejected" | "frozen";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  company_name: string | null;
  company_website: string | null;
  company_registration_number: string | null;
  account_type: "standard" | "enterprise";
  kyc_status: KycStatus;
  kyc_rejection_reason: string | null;
  volume_limit_xof: number;
  onboarding_completed: boolean;
};

export function useProfile() {
  const workspaceContext = useWorkspace();
  const targetId = workspaceContext?.currentWorkspace?.id;

  return useQuery({
    queryKey: ["my-profile", targetId],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!targetId,
    queryFn: async (): Promise<Profile | null> => {
      if (!targetId) return null;
      
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;

      const userEmail = u.user.email?.toLowerCase() || "";
      const isMasterAdmin = userEmail === "isidoreagonan@gmail.com";

      let data: any = null;
      try {
        const res = await supabase
          .from("profiles")
          .select("*")
          .eq("id", targetId)
          .maybeSingle();
        data = res.data;

        if (!data && targetId === u.user.id) {
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
          const isNewUser = new Date().getTime() - new Date(u.user.created_at).getTime() < 15000; // Created less than 15 seconds ago
          if (!data || isNewUser) {
            // For new users (even if trigger created profile), ensure we send the welcome email
            const doUpsert = !data;
            if (doUpsert) {
              await supabase.from("profiles").upsert({
                id: pendingProfile.id,
                email: pendingProfile.email,
                full_name: pendingProfile.full_name,
                account_type: "standard",
                kyc_status: "pending",
                volume_limit_xof: 2000000,
                onboarding_completed: false,
              });
            }
            
            // Try sending welcome email once
            try {
              // We only want to send it once. We can use a localStorage flag to prevent duplicates if they reload quickly
              const emailSentFlag = `welcome_email_sent_${u.user.id}`;
              if (!localStorage.getItem(emailSentFlag)) {
                localStorage.setItem(emailSentFlag, "true");
                await fetch("/api/public/send-notification", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ type: "welcome", email: pendingProfile.email, name: pendingProfile.full_name }),
                }).catch(() => {});
              }
            } catch {}
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
      
      if (email === "support@dola-pay.com" || email === "isidoreagonan@gmail.com") return true;
      
      // SÉCURITÉ : Vérifier impérativement si l'utilisateur a complété l'onboarding dans la base !
      const { data: profile } = await supabase.from("profiles").select("onboarding_completed").eq("id", user.id).maybeSingle();
      if (!profile || profile.onboarding_completed !== true) {
        return false;
      }

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPayoutsModal, setShowPayoutsModal] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { currentWorkspace, workspaces, setWorkspace, isLoading: workspaceLoading } = useWorkspace();

  // IMPORTANT : Tous les hooks React (useEffect, useState) DOIVENT être appelés AVANT tout return conditionnel pour éviter les crashs de rendu !
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        if (window.location.hash === "#" || window.location.hash.includes("access_token") || window.location.hash.includes("error_description")) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      }, 300);
    }
    
    const isWorkspaceReady = !workspaceLoading && (workspaces.length === 0 || !!currentWorkspace);

    if (isWorkspaceReady && !profileLoading && !profile) {
      supabase.auth.signOut().then(() => {
        window.location.href = "/auth/sign-in";
      });
      return;
    }

    if (profile && !profile.onboarding_completed) {
      navigate({ to: "/onboarding", replace: true });
      return;
    }
    
    // GATING GLOBAL: Si KYC n'est pas approuvé, bloquer l'accès aux autres pages
    if (profile && profile.kyc_status !== "approved" && profile.onboarding_completed) {
      if (pathname !== "/dashboard" && pathname !== "/dashboard/" && !pathname.startsWith("/dashboard/settings") && !pathname.startsWith("/dashboard/verify") && !pathname.startsWith("/dashboard/resubmit")) {
        navigate({ to: "/dashboard", replace: true });
        return;
      }
    }

    // Admins are auto-redirected to /admin UNLESS they explicitly chose merchant view.
    if (isAdmin && typeof window !== "undefined" && sessionStorage.getItem("merchant_view") !== "1") {
      navigate({ to: "/admin", replace: true });
    }
  }, [profile, isAdmin, navigate, pathname]);

  if (profileLoading || adminLoading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
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
    ...(currentWorkspace?.role === "owner" ? [{ to: "/dashboard/team", icon: Users, label: "Équipe" }] : []),
    ...(profile?.account_type === "enterprise" && (currentWorkspace?.role === "owner" || currentWorkspace?.role === "admin")
      ? [
          { to: "/dashboard/api-keys", icon: KeyRound, label: "Clés API" },
          { to: "/dashboard/webhooks", icon: Webhook, label: "Webhooks" },
        ]
      : []),
    ...(currentWorkspace?.role === "owner" ? [{ to: "/dashboard/settings", icon: SettingsIcon, label: "Compte & KYC" }] : []),
    ...(isAdmin ? [{ to: "/admin", icon: Crown, label: "Système Admin" }] : []),
  ];

  const locked = profile && profile.kyc_status !== "approved";

  return (
    <TooltipProvider delayDuration={150}>
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex h-screen transform flex-col border-r border-blue-900 bg-blue-950 px-4 py-6 text-slate-300 transition-all duration-300 shadow-2xl",
            isCollapsed ? "w-20" : "w-72",
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <div className="mb-6 flex shrink-0 items-center justify-between">
            <Link to="/dashboard" className={cn("flex items-center", isCollapsed && "hidden")}>
              <img src={logoFull.url} alt="DolaPay" className="h-8" />
            </Link>
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-blue-300 hover:bg-white/10 hover:text-white transition-colors",
                isCollapsed && "mx-auto"
              )}
              title={isCollapsed ? "Déplier le menu" : "Réduire le menu"}
            >
              {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </button>
          </div>

          {!isCollapsed && (
            <div className="mb-6 shrink-0 rounded-xl border border-blue-800/60 bg-blue-900/30 p-3">
              <div className="text-xs text-blue-300/80 mb-1">Espace de travail</div>
              
              {workspaces.length > 1 ? (
                <select 
                  className="w-full bg-blue-950/80 border border-blue-800 text-sm font-semibold text-white rounded-md p-1.5 focus:outline-none"
                  value={currentWorkspace?.id || ""}
                  onChange={(e) => setWorkspace(e.target.value)}
                >
                  {workspaces.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} {w.role === 'owner' ? '' : `(${w.role})`}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="truncate text-sm font-semibold text-white">
                  {currentWorkspace?.name || profile?.full_name || profile?.email}
                </div>
              )}

              {currentWorkspace?.role === "owner" && profile?.id && (
                <button
                  type="button"
                  onClick={() => {
                    const accId = `acc_${profile.id.replace(/-/g, "").slice(0, 16)}`;
                    navigator.clipboard?.writeText(accId);
                    toast.success("Identifiant copié");
                  }}
                  className="mt-2 block truncate font-mono text-[10px] text-blue-300/60 transition-colors hover:text-white"
                  title="Cliquer pour copier"
                >
                  acc_{profile.id.replace(/-/g, "").slice(0, 16)}
                </button>
              )}
              {currentWorkspace?.role !== "owner" && (
                <div className="mt-2 block truncate font-mono text-[10px] text-amber-300/80">
                  Mode Collaboration
                </div>
              )}
              
              {currentWorkspace?.role === "owner" && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", tier.badgeClass)}>
                    <span>{tier.icon}</span> {tier.short} Tier
                  </span>
                  <KycBadge status={profile?.kyc_status ?? "pending"} />
                </div>
              )}
            </div>
          )}

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map((it) => {
              const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
              const linkClass = cn(
                "flex items-center justify-between gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-white text-blue-950 shadow-md" : "text-blue-100/70 hover:bg-blue-900/50 hover:text-white",
                it.locked && !active && "opacity-50",
              );
              const inner = (
                <>
                  <span className="flex items-center gap-3">
                    <it.icon className={cn("shrink-0 transition-all duration-300", isCollapsed ? "h-5 w-5 mx-auto" : "h-4 w-4")} /> 
                    {!isCollapsed && <span className="truncate">{it.label}</span>}
                  </span>
                  {it.locked && !isCollapsed && <LockIcon className="h-3.5 w-3.5 opacity-80 shrink-0" />}
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
            className={cn(
              "mt-4 flex shrink-0 items-center rounded-xl border border-white/10 text-sm font-medium text-white/80 hover:bg-white/5 transition-all duration-300",
              isCollapsed ? "justify-center p-2.5 mx-auto" : "gap-3 px-3 py-2.5 w-full"
            )}
            title={isCollapsed ? "Déconnexion" : undefined}
          >
            <LogOut className={cn("shrink-0", isCollapsed ? "h-5 w-5" : "h-4 w-4")} /> 
            {!isCollapsed && "Déconnexion"}
          </button>
          
        </aside>

        {/* Overlay */}
        {open && <button onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm lg:hidden" />}

        {/* Main */}
        <main className={cn("min-w-0 flex-1 flex flex-col transition-all duration-300", isCollapsed ? "lg:ml-20" : "lg:ml-72")}>
          <TopBar profile={profile as Profile} open={open} setOpen={setOpen} />
          
          <div className="flex-1 px-4 py-6 sm:px-8 sm:py-10">
            {locked && profile?.kyc_status === "pending" && pathname !== "/dashboard/settings" && pathname !== "/dashboard/admin" && pathname !== "/dashboard/verify" && pathname !== "/dashboard" && (
              <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200">
                <strong>Vérification en cours.</strong> Complétez votre dossier KYC dans{" "}
                <Link to="/dashboard/settings" className="underline">Compte & KYC</Link>. Certaines fonctionnalités sont verrouillées tant que votre compte n'est pas approuvé.
              </div>
            )}
            <Outlet />
          </div>
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
    rejected: { label: "Rejeté", cls: "bg-red-500/15 text-red-600 dark:text-red-400" },
    frozen: { label: "Gelé", cls: "bg-red-500/15 text-red-600 dark:text-red-400" },
  };
  const m = map[status] || map.pending;
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", m.cls)}>{m.label}</span>;
}

function TopBar({ profile, open, setOpen }: { profile: Profile | null, open: boolean, setOpen: (v: boolean) => void }) {
  const { theme = "system", setTheme } = useTheme();
  const navigate = useNavigate();

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Déconnecté");
    navigate({ to: "/auth/sign-in", replace: true });
  }

  const initials = profile?.full_name?.substring(0, 2).toUpperCase() || profile?.email?.substring(0, 2).toUpperCase() || "DP";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-4 sm:px-6 bg-white/70 dark:bg-card/70 backdrop-blur-xl border-b border-border shadow-[0_1px_12px_rgba(0,0,0,0.03)] dark:shadow-none">
      {/* Left part */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger & Logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <button onClick={() => setOpen(!open)} className="rounded-lg border border-border p-2 text-foreground hover:bg-muted transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/dashboard"><img src={logoFull.url} alt="DolaPay" className="h-6" /></Link>
        </div>

        {/* Environment selector (Hidden on mobile) */}
        <div className="hidden lg:flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2 text-xs font-semibold rounded-xl bg-white/50 dark:bg-muted/50 border-border shadow-sm hover:bg-muted text-foreground transition-all">
                <Building className="h-4 w-4 text-primary" />
                <span>DolaPay Live</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 rounded-xl shadow-lg border-border/50">
              <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Environnement</DropdownMenuLabel>
              <DropdownMenuItem className="text-xs cursor-pointer font-medium text-primary">
                <Building className="h-4 w-4 mr-2" /> Live (Production)
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer text-muted-foreground" disabled>
                <Code2 className="h-4 w-4 mr-2" /> Sandbox (Bientôt)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Right part: Actions and Profile */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Call to action */}
        <Button 
          asChild 
          size="sm" 
          className="hidden sm:flex h-9 text-xs font-bold rounded-xl bg-primary text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all duration-200 mr-2"
        >
          <Link to="/dashboard/payment-links/new">
            Créer un lien
          </Link>
        </Button>

        <div className="h-6 w-px bg-border hidden sm:block mx-1" />

        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-navy/60 dark:text-muted-foreground hover:bg-navy/5 dark:hover:bg-muted hidden sm:flex transition-colors">
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-32 rounded-xl shadow-lg border-border/50">
            <DropdownMenuItem onClick={() => toast("Déjà en Français", { description: "Vous utilisez déjà la version française du tableau de bord." })} className="text-xs font-bold flex items-center gap-2 cursor-pointer text-foreground">
              <span>🇫🇷</span> Français
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Bientôt disponible", { description: "La version anglaise est en cours de préparation et sera bientôt disponible." })} className="text-xs flex items-center gap-2 cursor-pointer text-muted-foreground">
              <span className="opacity-50">🇬🇧</span> English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-navy/60 dark:text-muted-foreground hover:bg-navy/5 dark:hover:bg-muted transition-colors relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-card animate-pulse" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 rounded-2xl p-0 shadow-xl border-border/50">
            <div className="p-4 border-b border-border bg-muted/20">
              <h4 className="font-bold text-sm text-foreground">Notifications</h4>
            </div>
            <div className="max-h-64 overflow-y-auto p-2 space-y-1">
              <div className="p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer border border-primary/10">
                <p className="text-xs font-semibold text-foreground mb-1">🎉 Compte Approuvé</p>
                <p className="text-[11px] text-muted-foreground">Votre compte DolaPay est prêt à recevoir des paiements.</p>
                <p className="text-[10px] text-muted-foreground/70 mt-2">Il y a 2 heures</p>
              </div>
              <div className="p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                <p className="text-xs font-semibold text-foreground mb-1">💸 Nouveau paiement reçu</p>
                <p className="text-[11px] text-muted-foreground">Vous avez reçu 15 000 FCFA via Wave.</p>
                <p className="text-[10px] text-muted-foreground/70 mt-2">Hier</p>
              </div>
            </div>
            <div className="p-2 border-t border-border">
              <Button variant="ghost" size="sm" className="w-full text-xs text-primary font-medium hover:bg-primary/10">
                Tout marquer comme lu
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2.5 pl-2 pr-1 rounded-full hover:bg-navy/5 dark:hover:bg-muted transition-all border border-transparent hover:border-border">
              <div className="hidden md:flex flex-col items-end text-left">
                <span className="text-xs font-bold leading-none text-navy dark:text-foreground">{profile?.full_name || "Commerçant"}</span>
                <span className="text-[10px] font-medium text-primary leading-none mt-1.5">{profile?.account_type === "enterprise" ? "Entreprise" : "Standard"}</span>
              </div>
              <Avatar className="h-7 w-7 ring-2 ring-white dark:ring-card shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-[10px] font-bold">{initials}</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3 w-3 opacity-50 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl shadow-xl border-border/50 mt-2">
            <DropdownMenuLabel className="font-normal flex items-start gap-3 p-4 bg-muted/20 rounded-t-xl text-foreground">
              <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-card shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-sm font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 text-foreground">
                <p className="text-sm font-bold leading-none text-foreground">{profile?.full_name}</p>
                <p className="text-[11px] leading-tight text-muted-foreground truncate w-36">{profile?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-2">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-xs py-2.5 font-medium text-foreground">
                  <Link to="/dashboard/settings"><User className="mr-3 h-4 w-4 text-muted-foreground" /> Mon profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-xs py-2.5 font-medium text-foreground">
                  <Link to="/dashboard/wallet"><CreditCard className="mr-3 h-4 w-4 text-muted-foreground" /> Mon Portefeuille</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-xs py-2.5 font-medium text-foreground">
                  <Link to="/dashboard/settings"><SettingsIcon className="mr-3 h-4 w-4 text-muted-foreground" /> Paramètres</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => { e.preventDefault(); setTheme(theme === "dark" ? "light" : "dark"); }} 
                className="cursor-pointer rounded-lg text-xs py-2.5 font-medium flex items-center justify-between text-foreground"
              >
                <div className="flex items-center">
                  {theme === "dark" ? <Moon className="mr-3 h-4 w-4 text-blue-400" /> : <Sun className="mr-3 h-4 w-4 text-amber-500" />}
                  <span>Mode {theme === "dark" ? "Sombre" : "Clair"}</span>
                </div>
                <div className="flex w-8 h-4 bg-muted rounded-full p-0.5 border border-border shadow-inner transition-all">
                  <div className={cn("w-3 h-3 bg-foreground rounded-full shadow-sm transition-transform", theme === "dark" ? "translate-x-4 bg-primary" : "")} />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 dark:text-red-400 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-500/10 cursor-pointer rounded-lg text-xs py-2.5 font-medium">
                <LogOut className="mr-3 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}
