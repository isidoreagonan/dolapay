import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return { userId: "", userEmail: "" };
    }
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;
    if (!user) {
      throw redirect({ to: "/auth/sign-in" });
    }
    return { userId: user.id, userEmail: user.email ?? "" };
  },
  component: () => <Outlet />,
});
