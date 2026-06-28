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
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) throw redirect({ to: "/auth/sign-in" });
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (error || !data) throw redirect({ to: "/dashboard" });
  },
  component: AdminLayout,
});

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
  const { data: email } = useAdminEmail();
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
    { to: "/admin/live", icon: Radio, label: "Flux temps réel" },
    { to: "/admin/merchants", icon: Users, label: "Marchands" },
    { to: "/admin/compliance", icon: ShieldCheck, label: "Conformité KYC" },
    { to: "/admin/finance", icon: DollarSign, label: "Finance" },
    { to: "/admin/risk", icon: AlertTriangle, label: "Risques & alertes" },
    { to: "/admin/audit", icon: ScrollText, label: "Journal d'audit" },
  ];

  const shell = isDark ? "bg-[#0a0a0f] text-slate-100" : "bg-slate-50 text-slate-950";
  const topBar = isDark ? "border-white/10 bg-[#0a0a0f]/90" : "border-slate-200 bg-white/95 shadow-sm";
  const sidebar = isDark ? "border-white/10 bg-[#0d0d14]" : "border-slate-200 bg-white shadow-[12px_0_40px_-32px_rgba(15,23,42,0.45)]";
  const sideMutedCard = isDark
    ? "border-white/10 bg-white/[0.03] text-slate-200"
    : "border-slate-200 bg-slate-50 text-slate-700";
  const muted = isDark ? "text-slate-500" : "text-slate-500";
  const navIdle = isDark ? "text-slate-400 hover:bg-white/5 hover:text-slate-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
  const navActive = isDark ? "bg-white/10 text-white" : "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100";
  const divider = isDark ? "border-white/10" : "border-slate-200";
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
            "fixed inset-y-0 left-0 z-50 flex h-screen w-64 transform flex-col border-r px-3 py-5 transition-transform lg:translate-x-0",
            sidebar,
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <Link to="/admin" className="mb-4 flex shrink-0 items-center gap-2 px-2">
            <img src={logoFull.url} alt="DolaPay" className={cn("h-7", isDark && "invert")} />
            <span className="rounded-md border border-amber-400/40 bg-amber-400/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-300">
              Admin
            </span>
          </Link>

          <div className={cn("mb-3 shrink-0 rounded-lg border px-3 py-2", sideMutedCard)}>
            <div className={cn("text-[10px] uppercase tracking-wider", muted)}>Opérateur</div>
            <div className="truncate font-mono text-xs">{email}</div>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-500 dark:text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              session active · production
            </div>
          </div>

          <button
            onClick={() => setPaletteOpen(true)}
            className={cn(
              "mb-3 flex shrink-0 items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs",
              ghost,
            )}
          >
            <span className="flex items-center gap-2">
              <CommandIcon className="h-3.5 w-3.5" /> Rechercher
            </span>
            <kbd className={cn("rounded border px-1.5 py-0.5 font-mono text-[10px]", isDark ? "border-white/15 bg-white/5" : "border-slate-200 bg-slate-50")}>
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
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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
              <LogOut className="h-3.5 w-3.5" /> Déconnexion
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
