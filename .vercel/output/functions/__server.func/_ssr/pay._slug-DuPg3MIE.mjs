import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pay._slug-DuPg3MIE.js
var $$splitComponentImporter = () => import("./pay._slug-FZ8F5VUC.mjs");
var Route = createFileRoute("/pay/$slug")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: ({ params }) => ({ meta: [
		{ title: `Paiement · DolaPay` },
		{
			name: "description",
			content: `Réglez en toute sécurité via DolaPay (${params.slug}).`
		},
		{
			name: "robots",
			content: "noindex"
		}
	] })
});
//#endregion
export { Route as t };
