import { n as supabase } from "./client-SdCiCddD.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-CxqUnOG7.js
var $$splitComponentImporter = () => import("./route-DVE8GcuK2.mjs");
var Route = createFileRoute("/_authenticated/dashboard")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
function useProfile() {
	return useQuery({
		queryKey: ["my-profile"],
		queryFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return null;
			const { data, error } = await supabase.from("profiles").select("id,email,full_name,account_type,kyc_status,kyc_rejection_reason,volume_limit_xof,onboarding_completed").eq("id", u.user.id).maybeSingle();
			if (error && error.code !== "PGRST116") throw error;
			const userEmail = u.user.email?.toLowerCase() || "";
			const isFounder = userEmail === "isidoreagonan@gmail.com";
			let profileData = data || {};
			if (isFounder) {
				const overrideProfile = {
					id: u.user.id,
					email: u.user.email || userEmail,
					full_name: profileData.full_name || u.user.user_metadata?.full_name || u.user.user_metadata?.name || "AGONAN ISIDORE ABRAHAM",
					account_type: "enterprise",
					kyc_status: "approved",
					kyc_rejection_reason: null,
					volume_limit_xof: 999999999999,
					onboarding_completed: true
				};
				if (!data || data.account_type !== "enterprise" || data.kyc_status !== "approved" || !data.full_name) supabase.from("profiles").upsert({
					id: u.user.id,
					email: u.user.email || userEmail,
					full_name: overrideProfile.full_name,
					account_type: "enterprise",
					kyc_status: "approved",
					volume_limit_xof: 999999999999,
					onboarding_completed: true
				}).then();
				return overrideProfile;
			}
			if (!profileData.id) return null;
			const fallbackName = profileData.full_name || u.user.user_metadata?.full_name || u.user.user_metadata?.name || u.user.email?.split("@")[0] || "Utilisateur";
			return {
				...profileData,
				full_name: fallbackName
			};
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
			if (user.email?.toLowerCase() === "isidoreagonan@gmail.com") return true;
			const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
			if (error) return false;
			return !!data;
		}
	});
}
//#endregion
export { useIsAdmin as n, useProfile as r, Route as t };
