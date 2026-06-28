//#region node_modules/.nitro/vite/services/ssr/assets/supported-countries-CoIgmV1m.js
var SUPPORTED_COUNTRIES = [
	{
		code: "BJ",
		name: "Bénin",
		dialCode: "+229",
		flag: "🇧🇯",
		phoneLengths: [10, 8]
	},
	{
		code: "CI",
		name: "Côte d'Ivoire",
		dialCode: "+225",
		flag: "🇨🇮",
		phoneLengths: [10]
	},
	{
		code: "SN",
		name: "Sénégal",
		dialCode: "+221",
		flag: "🇸🇳",
		phoneLengths: [9]
	},
	{
		code: "CM",
		name: "Cameroun",
		dialCode: "+237",
		flag: "🇨🇲",
		phoneLengths: [9]
	},
	{
		code: "CD",
		name: "RDC",
		dialCode: "+243",
		flag: "🇨🇩",
		phoneLengths: [9]
	},
	{
		code: "BF",
		name: "Burkina Faso",
		dialCode: "+226",
		flag: "🇧🇫",
		phoneLengths: [8]
	},
	{
		code: "KE",
		name: "Kenya",
		dialCode: "+254",
		flag: "🇰🇪",
		phoneLengths: [9]
	},
	{
		code: "RW",
		name: "Rwanda",
		dialCode: "+250",
		flag: "🇷🇼",
		phoneLengths: [9]
	},
	{
		code: "ZM",
		name: "Zambie",
		dialCode: "+260",
		flag: "🇿🇲",
		phoneLengths: [9]
	},
	{
		code: "GH",
		name: "Ghana",
		dialCode: "+233",
		flag: "🇬🇭",
		phoneLengths: [9]
	},
	{
		code: "UG",
		name: "Ouganda",
		dialCode: "+256",
		flag: "🇺🇬",
		phoneLengths: [9]
	},
	{
		code: "TZ",
		name: "Tanzanie",
		dialCode: "+255",
		flag: "🇹🇿",
		phoneLengths: [9]
	}
];
SUPPORTED_COUNTRIES.map((c) => c.name);
function findCountryByName(name) {
	return SUPPORTED_COUNTRIES.find((c) => c.name === name);
}
function findCountryByCode(code) {
	return SUPPORTED_COUNTRIES.find((c) => c.code === code);
}
function isValidLocalPhone(country, digits) {
	if (!country) return false;
	const cleaned = digits.replace(/\D/g, "");
	return country.phoneLengths.includes(cleaned.length);
}
//#endregion
export { isValidLocalPhone as i, findCountryByCode as n, findCountryByName as r, SUPPORTED_COUNTRIES as t };
