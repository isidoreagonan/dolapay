import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Radio,
  ScrollText,
  LogOut,
  Menu,
  ArrowLeft,
  Sun,
  Moon,
  Command as CommandIcon,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import logoFull from "@/assets/dolapay-logo.png.asset.json";
import { AdminCommandPalette } from "@/components/admin/CommandPalette";
import { useAdminTheme } from "@/components/admin/useAdminTheme";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    let { data: sessionData } = await supabase.auth.getSession();
    let user: any = sessionData?.session?.user;

    if (!user) {
      const { data: uData } = await supabase.auth.getUser();
      user = uData?.user;
    }

    if (!user && (window.location.hash.includes("access_token") || window.location.search.includes("code"))) {
      for (let i = 0; i < 25; i++) {
        await new Promise((r) => setTimeout(r, 150));
        const res = await supabase.auth.getSession();
        if (res.data?.session?.user) {
          user = res.data.session.user;
          break;
        }
        const uRes = await supabase.auth.getUser();
        if (uRes.data?.user) {
          user = uRes.data.user;
          break;
        }
      }
    }

    if (!user) throw redirect({ to: "/auth/sign-in" });
    const email = user.email?.toLowerCase() || "";
    
    // SÉCURITÉ : Vérifier impérativement si l'utilisateur a complété l'onboarding avant d'accéder à l'admin !
    const { data: profile } = await supabase.from("profiles").select("onboarding_completed").eq("id", user.id).maybeSingle();
    if (!profile || profile.onboarding_completed !== true) {
      throw redirect({ to: "/onboarding" });
    }

    if (email === "support@dola-pay.com" || email === "isidoreagonan@gmail.com") return;
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["admin", "compliance_officer"])
      .maybeSingle();
    if (error || !data) throw redirect({ to: "/dashboard" });
  },
  component: AdminLayout,
});

export function useAdminRole() {
  return useQuery({
    queryKey: ["admin-role"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      if (user.email === "isidoreagonan@gmail.com") return "admin";
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
      return data?.role ?? null;
    },
  });
}

export function useAdminEmail() {
  return useQuery({
    queryKey: ["admin-email"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user?.email ?? "";
    },
  });
}

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: email, isLoading: emailLoading } = useAdminEmail();
  const { theme, toggle, isDark } = useAdminTheme();

  // Clear merchant_view flag whenever admin enters the admin area.
  useEffect(() => {
    if (typeof window !== "undefined") sessionStorage.removeItem("merchant_view");
  }, []);

  // Cmd+K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { data: role, isLoading: roleLoading } = useAdminRole();

  if (emailLoading || roleLoading || !email) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-glow animate-pulse">
          <img src={logoFull.url} alt="DolaPay" className="h-10 w-auto object-contain" />
        </div>
        <h2 className="font-display text-lg font-bold text-foreground">Chargement de l'administration...</h2>
        <p className="mt-1 text-xs text-muted-foreground">Vérification de vos privilèges administrateurs en cours.</p>
        <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-primary">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Sécurisation de la session...</span>
        </div>
      </div>
    );
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Déconnecté");
    navigate({ to: "/auth/sign-in", replace: true });
  }

  function openMerchantView() {
    if (typeof window !== "undefined") sessionStorage.setItem("merchant_view", "1");
    navigate({ to: "/dashboard" });
  }

  const nav = [
    { to: "/admin", icon: LayoutDashboard, label: "Vue d'ensemble", exact: true },
    ...(role === "admin" ? [{ to: "/admin/live", icon: Radio, label: "Flux temps réel" }] : []),
    { to: "/admin/merchants", icon: Users, label: "Marchands" },
    { to: "/admin/compliance", icon: ShieldCheck, label: "Conformité KYC" },
    ...(role === "admin" ? [
      { to: "/admin/finance", icon: DollarSign, label: "Finance" },
      { to: "/admin/risk", icon: AlertTriangle, label: "Risques & alertes" },
      { to: "/admin/audit", icon: ScrollText, label: "Journal d'audit" },
      { to: "/admin/team", icon: Users, label: "Équipe" },
    ] : []),
  ];

  const shell = isDark ? "bg-[#0a0a0f] text-slate-100" : "bg-slate-50 text-slate-950";
  const topBar = isDark ? "border-white/10 bg-[#0a0a0f]/90" : "border-slate-200 bg-white/95 shadow-sm";
  const sidebar = "border-blue-900 bg-blue-950 text-slate-300 shadow-2xl";
  const sideMutedCard = "border-blue-800/60 bg-blue-900/30 text-white";
  const muted = "text-blue-300/80";
  const navIdle = "text-blue-100/70 hover:bg-blue-900/50 hover:text-white";
  const navActive = "bg-white text-blue-950 shadow-md";
  const divider = "border-white/10";
  const ghost = isDark ? "border-white/15 text-slate-200 hover:bg-white/5" : "border-slate-200 text-slate-700 hover:bg-slate-100";

  return (
    <div className={cn("admin-shell min-h-screen", shell)} data-theme={theme}>
      <header className={cn("lg:hidden sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3 backdrop-blur", topBar)}>
        <Link to="/admin">
          <img src={logoFull.url} alt="DolaPay" className={cn("h-7", isDark && "invert")} />
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setPaletteOpen(true)} className={cn("rounded-lg border p-2", ghost)} aria-label="Recherche">
            <CommandIcon className="h-4 w-4" />
          </button>
          <button onClick={toggle} className={cn("rounded-lg border p-2", ghost)} aria-label="Thème">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button onClick={() => setOpen(!open)} className={cn("rounded-lg border p-2", ghost)}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex h-screen w-64 transform flex-col px-3 py-5 transition-transform lg:translate-x-0 border-r border-white/10",
            sidebar,
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-6 flex shrink-0 items-center px-2">
            <Link to="/admin">
              <img src={logoFull.url} alt="DolaPay" className="h-7" />
            </Link>
          </div>

          <div className={cn("mb-3 shrink-0 rounded-lg border px-3 py-2", sideMutedCard)}>
            <div className={cn("text-[10px] uppercase tracking-wider", muted)}>Opérateur</div>
            <div className="truncate font-mono text-xs">{email}</div>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              session active · production
            </div>
          </div>

          <button
            onClick={() => setPaletteOpen(true)}
            className="mb-3 flex shrink-0 items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <CommandIcon className="h-3.5 w-3.5" /> Rechercher
            </span>
            <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
              ⌘K
            </kbd>
          </button>

          <nav className="flex-1 space-y-0.5 overflow-y-auto">
            {nav.map((it) => {
              const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
              return (
                <Link
                  key={it.to}
                  to={it.to as "/admin"}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-medium transition-colors",
                    active ? navActive : navIdle,
                  )}
                >
                  <it.icon className="h-4 w-4" /> {it.label}
                </Link>
              );
            })}
          </nav>

          <div className={cn("space-y-1 border-t pt-3", divider)}>
            <button
              onClick={toggle}
              className={cn("flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-xs", navIdle)}
            >
              <span className="flex items-center gap-3">
                {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                {isDark ? "Thème clair" : "Thème sombre"}
              </span>
            </button>
            <button
              onClick={openMerchantView}
              className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs", navIdle)}
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Vue marchand
            </button>
            <button
              onClick={handleSignOut}
              className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs", navIdle)}
            >
              <LogOut className="h-4 w-4" /> Quitter Admin
            </button>
          </div>
        </aside>

        {open && <button onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8 lg:ml-64">
          <Outlet />
        </main>
      </div>

      <AdminCommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} onMerchantView={openMerchantView} />
    </div>
  );
}
