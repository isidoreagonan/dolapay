//#region node_modules/.nitro/vite/services/ssr/assets/tier-NT1-wYki.js
var TIERS = {
	standard: {
		id: "standard",
		label: "Standard Tier (Plafonné)",
		short: "Standard",
		monthlyLimitXof: 2e6,
		singleTxCapXof: 2e5,
		badgeClass: "bg-primary/15 text-primary border border-primary/30",
		icon: "•",
		capabilities: {
			payin: true,
			paymentLinks: true,
			payouts: false,
			bulkTransfers: false,
			signedWebhooks: false,
			vipSupport: false
		}
	},
	enterprise: {
		id: "enterprise",
		label: "Enterprise Tier (Illimité)",
		short: "Enterprise",
		monthlyLimitXof: null,
		singleTxCapXof: 5e6,
		badgeClass: "bg-gradient-to-r from-amber-400/20 to-amber-200/10 text-amber-700 dark:text-amber-300 border border-amber-400/40",
		icon: "👑",
		capabilities: {
			payin: true,
			paymentLinks: true,
			payouts: true,
			bulkTransfers: true,
			signedWebhooks: true,
			vipSupport: true
		}
	}
};
function getTier(type) {
	return TIERS[type ?? "standard"] ?? TIERS.standard;
}
function fmtXof(n) {
	return `${new Intl.NumberFormat("fr-FR").format(Math.round(n))} FCFA`;
}
//#endregion
export { getTier as n, fmtXof as t };
