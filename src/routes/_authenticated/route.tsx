import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return { userId: "", userEmail: "" };
    }
    let { data } = await supabase.auth.getSession();
    let user = data?.session?.user;

    // Si le retour OAuth Google contient access_token ou code dans l'URL, attendre que Supabase le traite
    if (!user && (window.location.hash.includes("access_token=") || window.location.search.includes("code="))) {
      for (let i = 0; i < 25; i++) {
        await new Promise((r) => setTimeout(r, 120));
        const res = await supabase.auth.getSession();
        if (res.data?.session?.user) {
          user = res.data.session.user;
          break;
        }
      }
    }

    if (!user) {
      throw redirect({ to: "/auth/sign-in" });
    }
    return { userId: user.id, userEmail: user.email ?? "" };
  },
  component: () => <Outlet />,
});
