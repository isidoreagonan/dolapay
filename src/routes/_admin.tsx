import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { UserCircle, Shield, Users, LogOut, CheckSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/login", search: { next: "/admin" } });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();

    if (!profile || (profile.role !== "admin" && profile.role !== "manager")) {
      throw redirect({ to: "/dashboard" }); // Not authorized
    }

    return { role: profile.role, email: session.user.email };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { role, email } = Route.useRouteContext();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-background p-4 flex flex-col hidden md:flex">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Shield className="h-6 w-6 text-indigo-600" />
          <span className="font-bold text-lg tracking-tight">DolaPay Admin</span>
        </div>

        <nav className="flex-1 space-y-1">
          <a href="/admin" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent text-foreground">
            <CheckSquare className="h-4 w-4" /> Vue d'ensemble
          </a>
          <a href="/admin/kyc" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent text-foreground">
            <UserCircle className="h-4 w-4" /> Validations KYC
          </a>
          {role === "admin" && (
            <a href="/admin/team" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent text-foreground">
              <Users className="h-4 w-4" /> Équipe Back-Office
            </a>
          )}
        </nav>

        <div className="mt-auto border-t pt-4 px-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {email?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{email}</p>
              <p className="text-[10px] text-muted-foreground uppercase">{role}</p>
            </div>
          </div>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
