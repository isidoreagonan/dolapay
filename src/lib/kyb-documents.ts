// Country-specific KYB document and tax-ID labels.
// Keyed by the country NAME as it appears in SUPPORTED_COUNTRIES.

export type KybLabels = {
  registry: { label: string; short: string; hint: string };
  tax: { label: string; short: string; placeholder: string };
  isGeneric?: boolean;
};

const FRANCOPHONE_RCCM = "Registre du commerce (RCCM)";

export const KYB_LABELS: Record<string, KybLabels> = {
  "Bénin": {
    registry: { label: FRANCOPHONE_RCCM, short: "RCCM", hint: "Document officiel à jour délivré par le greffe." },
    tax: { label: "Numéro IFU (Identifiant Fiscal Unique)", short: "IFU", placeholder: "Ex. 3201900000000" },
  },
  "Cameroun": {
    registry: { label: FRANCOPHONE_RCCM, short: "RCCM", hint: "Document officiel à jour délivré par le greffe." },
    tax: { label: "Numéro NIU (Numéro d'Identifiant Unique)", short: "NIU", placeholder: "Ex. M0000000000000A" },
  },
  "Côte d'Ivoire": {
    registry: { label: FRANCOPHONE_RCCM, short: "RCCM", hint: "Document officiel à jour délivré par le greffe." },
    tax: { label: "Numéro NCC (Numéro de Compte Contribuable)", short: "NCC", placeholder: "Ex. 0000000 A" },
  },
  "Sénégal": {
    registry: { label: FRANCOPHONE_RCCM, short: "RCCM", hint: "Document officiel à jour délivré par le greffe." },
    tax: { label: "Numéro NINEA", short: "NINEA", placeholder: "Ex. 000000000 2 G 3" },
  },
  "Gabon": {
    registry: { label: FRANCOPHONE_RCCM, short: "RCCM", hint: "Document officiel à jour délivré par le greffe." },
    tax: { label: "Numéro NIF (Numéro d'Identification Fiscale)", short: "NIF", placeholder: "Ex. 000000 X" },
  },
  "RDC": {
    registry: { label: "RCCM (ou ID NAT)", short: "RCCM", hint: "RCCM ou Identification Nationale (ID NAT) valide." },
    tax: { label: "Numéro Impôt (NIF)", short: "NIF", placeholder: "Ex. A0000000X" },
  },
  "Congo": {
    registry: { label: FRANCOPHONE_RCCM, short: "RCCM", hint: "Document officiel à jour délivré par le greffe." },
    tax: { label: "Numéro NIU (Numéro d'Identification Unique)", short: "NIU", placeholder: "Ex. P2020000000000" },
  },
  "Kenya": {
    registry: { label: "Certificate of Incorporation (CR12)", short: "CoI", hint: "Issued by the Registrar of Companies." },
    tax: { label: "KRA PIN (Kenya Revenue Authority)", short: "KRA PIN", placeholder: "Ex. P000000000X" },
  },
  "Rwanda": {
    registry: { label: "Certificate of Incorporation (RDB)", short: "CoI", hint: "Issued by the Rwanda Development Board." },
    tax: { label: "TIN (Tax Identification Number)", short: "TIN", placeholder: "Ex. 100000000" },
  },
  "Ouganda": {
    registry: { label: "Certificate of Incorporation (URSB)", short: "CoI", hint: "Issued by the Uganda Registration Services Bureau." },
    tax: { label: "TIN (Tax Identification Number)", short: "TIN", placeholder: "Ex. 1000000000" },
  },
  "Zambie": {
    registry: { label: "Certificate of Incorporation (PACRA)", short: "CoI", hint: "Issued by PACRA." },
    tax: { label: "TPIN (Taxpayer Identification Number)", short: "TPIN", placeholder: "Ex. 1000000000" },
  },
  "Sierra Leone": {
    registry: { label: "Certificate of Incorporation", short: "CoI", hint: "Issued by the Corporate Affairs Commission." },
    tax: { label: "TIN (National Revenue Authority)", short: "TIN", placeholder: "Ex. 10000000-0" },
  },
};

const GENERIC_LABELS: KybLabels = {
  registry: {
    label: "Registre du commerce / Certificate of Incorporation",
    short: "Registre",
    hint: "Document officiel d'enregistrement de la société (équivalent local du RCCM ou Certificate of Incorporation).",
  },
  tax: {
    label: "Identifiant fiscal local (IFU / NIF / TIN / PIN…)",
    short: "ID fiscal",
    placeholder: "Saisissez l'identifiant fiscal délivré dans votre pays",
  },
  isGeneric: true,
};

export function getKybLabels(country: string | undefined | null): KybLabels {
  if (!country) return GENERIC_LABELS;
  return KYB_LABELS[country] ?? GENERIC_LABELS;
}

// Per-country individual ID document labels (KYC).
const KYC_ID: Record<string, { label: string; hint: string }> = {
  "Bénin": { label: "CNI béninoise ou Passeport", hint: "Carte Nationale d'Identité (CNI) ou passeport en cours de validité." },
  "Cameroun": { label: "CNI camerounaise ou Passeport", hint: "Carte Nationale d'Identité (CNI) ou passeport en cours de validité." },
  "Côte d'Ivoire": { label: "CNI ivoirienne (CNIB) ou Passeport", hint: "Carte Nationale d'Identité Biométrique ou passeport valide." },
  "Sénégal": { label: "CNI sénégalaise ou Passeport", hint: "Carte Nationale d'Identité (CEDEAO) ou passeport valide." },
  "Gabon": { label: "CNI gabonaise ou Passeport", hint: "Carte Nationale d'Identité ou passeport valide." },
  "RDC": { label: "Carte d'électeur, CNI ou Passeport", hint: "Carte d'électeur (CENI), CNI ou passeport en cours de validité." },
  "Congo": { label: "CNI congolaise ou Passeport", hint: "Carte Nationale d'Identité ou passeport valide." },
  "Kenya": { label: "National ID or Passport", hint: "Kenyan National ID card or a valid passport." },
  "Rwanda": { label: "National ID (Indangamuntu) or Passport", hint: "Rwandan National ID or a valid passport." },
  "Ouganda": { label: "National ID (NIN) or Passport", hint: "Ugandan National ID or a valid passport." },
  "Zambie": { label: "NRC or Passport", hint: "National Registration Card or a valid passport." },
  "Sierra Leone": { label: "National ID or Passport", hint: "National ID card or a valid passport." },
};

export function getKycIdLabel(country: string | undefined | null): { label: string; hint: string; isGeneric?: boolean } {
  if (!country) return { label: "Pièce d'identité (CNI ou Passeport)", hint: "Recto-verso en couleurs, lisible.", isGeneric: true };
  return KYC_ID[country] ?? { label: `Pièce d'identité officielle (${country})`, hint: "CNI, passeport ou équivalent local en cours de validité.", isGeneric: true };
}


