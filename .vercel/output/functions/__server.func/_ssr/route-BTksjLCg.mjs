import { n as supabase } from "./client-DWb0N0jk.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-BTksjLCg.js
var $$splitComponentImporter = () => import("./route-BKpIBa5n2.mjs");
var Route = createFileRoute("/_authenticated/dashboard")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
function useProfile() {
	return useQuery({
		queryKey: ["my-profile"],
		queryFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return null;
			const { data, error } = await supabase.from("profiles").select("id,email,full_name,account_type,kyc_status,kyc_rejection_reason,volume_limit_xof,onboarding_completed").eq("id", u.user.id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
}
function useIsAdmin() {
	return useQuery({
		queryKey: ["is-admin"],
		queryFn: async () => {
			const { data: sessionData } = await supabase.auth.getSession();
			const user = sessionData?.session?.user;
			if (!user) return false;
			const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
			if (error) return false;
			return !!data;
		}
	});
}
//#endregion
export { useIsAdmin as n, useProfile as r, Route as t };
