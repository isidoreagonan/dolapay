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

    // 1. Échange explicite et immédiat si code OAuth (PKCE) est présent dans l'URL
    if (!user && window.location.search.includes("code=")) {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          const { data: exData } = await supabase.auth.exchangeCodeForSession(code);
          if (exData?.session?.user) {
            user = exData.session.user;
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch (err) {
        console.error("[Auth] Erreur échange code OAuth:", err);
      }
    }

    // 2. Échange explicite si access_token (Implicit) est présent dans le hash
    if (!user && window.location.hash.includes("access_token=")) {
      try {
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");
        if (access_token && refresh_token) {
          const { data: sessData } = await supabase.auth.setSession({ access_token, refresh_token });
          if (sessData?.session?.user) {
            user = sessData.session.user;
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch (err) {
        console.error("[Auth] Erreur setSession depuis hash:", err);
      }
    }

    // 3. Boucle de secours robuste (attente résolution asynchrone Supabase JS)
    if (!user && (window.location.hash.includes("access_token") || window.location.search.includes("code") || window.location.hash.includes("error"))) {
      for (let i = 0; i < 35; i++) {
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

    // 4. Ultime vérification directe au serveur si localStorage était vide
    if (!user) {
      const { data: uData } = await supabase.auth.getUser();
      if (uData?.user) {
        user = uData.user;
      }
    }

    if (!user) {
      throw redirect({ to: "/auth/sign-in" });
    }
    return { userId: user.id, userEmail: user.email ?? "" };
  },
  component: () => <Outlet />,
});
