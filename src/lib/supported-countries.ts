// Countries DolaPay accepts — strict list of 12 supported African economies.
export type SupportedCountry = {
  code: string; // ISO-3166-1 alpha-2
  name: string;
  dialCode: string;
  flag: string;
  // Acceptable local national number lengths (excluding dial code).
  phoneLengths: number[];
};

export const SUPPORTED_COUNTRIES: SupportedCountry[] = [
  { code: "BJ", name: "Bénin", dialCode: "+229", flag: "🇧🇯", phoneLengths: [10, 8] },
  { code: "CM", name: "Cameroun", dialCode: "+237", flag: "🇨🇲", phoneLengths: [9] },
  { code: "CI", name: "Côte d'Ivoire", dialCode: "+225", flag: "🇨🇮", phoneLengths: [10] },
  { code: "CD", name: "RDC", dialCode: "+243", flag: "🇨🇩", phoneLengths: [9] },
  { code: "GA", name: "Gabon", dialCode: "+241", flag: "🇬🇦", phoneLengths: [7, 8, 9] },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪", phoneLengths: [9, 10] },
  { code: "CG", name: "Congo-Brazzaville", dialCode: "+242", flag: "🇨🇬", phoneLengths: [9] },
  { code: "RW", name: "Rwanda", dialCode: "+250", flag: "🇷🇼", phoneLengths: [9] },
  { code: "SN", name: "Sénégal", dialCode: "+221", flag: "🇸🇳", phoneLengths: [9] },
  { code: "SL", name: "Sierra Leone", dialCode: "+232", flag: "🇸🇱", phoneLengths: [8] },
  { code: "UG", name: "Ouganda", dialCode: "+256", flag: "🇺🇬", phoneLengths: [9] },
  { code: "ZM", name: "Zambie", dialCode: "+260", flag: "🇿🇲", phoneLengths: [9] },
  { code: "BF", name: "Burkina Faso", dialCode: "+226", flag: "🇧🇫", phoneLengths: [8] }
];

export const SUPPORTED_COUNTRY_NAMES = SUPPORTED_COUNTRIES.map((c) => c.name);

export function findCountryByName(name: string) {
  return SUPPORTED_COUNTRIES.find((c) => c.name === name);
}

export function findCountryByCode(code: string) {
  return SUPPORTED_COUNTRIES.find((c) => c.code === code);
}

export function isValidLocalPhone(country: SupportedCountry | undefined, digits: string) {
  if (!country) return false;
  const cleaned = digits.replace(/\D/g, "");
  return country.phoneLengths.includes(cleaned.length);
}
