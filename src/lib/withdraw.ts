import pmOrange from "@/assets/pm-orange.png.asset.json";
import pmMoov from "@/assets/pm-moov.png.asset.json";
import pmMtn from "@/assets/pm-mtn.png.asset.json";
import pmCeltiis from "@/assets/pm-celtiis.png.asset.json";
import pmFreeMoney from "@/assets/pm-freemoney.png.asset.json";
import pmAirtel from "@/assets/pm-airtel.webp.asset.json";
import pmZamtel from "@/assets/pm-zamtel.png.asset.json";
import pmMpesa from "@/assets/pm-mpesa.png.asset.json";
import pmVodacom from "@/assets/pm-vodacom.png.asset.json";

export const WITHDRAW_COUNTRIES = [
  {
    code: "BJ",
    name: "Bénin",
    flag: "🇧🇯",
    prefix: "229",
    methods: [
      { id: "Moov Money", name: "Moov Money", logoUrl: pmMoov.url, color: "border-blue-500/80 text-blue-600 bg-blue-500/10 dark:bg-blue-500/20" },
      { id: "MTN MoMo", name: "MTN MoMo", logoUrl: pmMtn.url, color: "border-yellow-500/80 text-yellow-600 bg-yellow-500/10 dark:bg-yellow-500/20" },
    ]
  },
  {
    code: "CM",
    name: "Cameroun",
    flag: "🇨🇲",
    prefix: "237",
    methods: [
      { id: "MTN MoMo", name: "MTN MoMo", logoUrl: pmMtn.url, color: "border-yellow-500/80 text-yellow-600 bg-yellow-500/10 dark:bg-yellow-500/20" },
    ]
  },
  {
    code: "CI",
    name: "Côte d'Ivoire",
    flag: "🇨🇮",
    prefix: "225",
    methods: [
      { id: "MTN MoMo", name: "MTN MoMo", logoUrl: pmMtn.url, color: "border-yellow-500/80 text-yellow-600 bg-yellow-500/10 dark:bg-yellow-500/20" },
      { id: "Orange Money", name: "Orange Money", logoUrl: pmOrange.url, color: "border-orange-500/80 text-orange-600 bg-orange-500/10 dark:bg-orange-500/20" },
    ]
  },
  {
    code: "CD",
    name: "RDC",
    flag: "🇨🇩",
    prefix: "243",
    methods: [
      { id: "Airtel Money", name: "Airtel Money", logoUrl: pmAirtel.url, color: "border-red-500/80 text-red-600 bg-red-500/10 dark:bg-red-500/20" },
      { id: "Orange Money", name: "Orange Money", logoUrl: pmOrange.url, color: "border-orange-500/80 text-orange-600 bg-orange-500/10 dark:bg-orange-500/20" },
      { id: "Vodacom M-Pesa", name: "Vodacom M-Pesa", logoUrl: pmVodacom.url, color: "border-red-600/80 text-red-600 bg-red-600/10 dark:bg-red-600/20" },
    ]
  },
  {
    code: "GA",
    name: "Gabon",
    flag: "🇬🇦",
    prefix: "241",
    methods: [
      { id: "Airtel Money", name: "Airtel Money", logoUrl: pmAirtel.url, color: "border-red-500/80 text-red-600 bg-red-500/10 dark:bg-red-500/20" },
    ]
  },
  {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    prefix: "254",
    methods: [
      { id: "M-Pesa", name: "M-Pesa", logoUrl: pmMpesa.url, color: "border-emerald-500/80 text-emerald-600 bg-emerald-500/10 dark:bg-emerald-500/20" },
    ]
  },
  {
    code: "CG",
    name: "Congo",
    flag: "🇨🇬",
    prefix: "242",
    methods: [
      { id: "Airtel Money", name: "Airtel Money", logoUrl: pmAirtel.url, color: "border-red-500/80 text-red-600 bg-red-500/10 dark:bg-red-500/20" },
      { id: "MTN MoMo", name: "MTN MoMo", logoUrl: pmMtn.url, color: "border-yellow-500/80 text-yellow-600 bg-yellow-500/10 dark:bg-yellow-500/20" },
    ]
  },
  {
    code: "RW",
    name: "Rwanda",
    flag: "🇷🇼",
    prefix: "250",
    methods: [
      { id: "Airtel Money", name: "Airtel Money", logoUrl: pmAirtel.url, color: "border-red-500/80 text-red-600 bg-red-500/10 dark:bg-red-500/20" },
      { id: "MTN MoMo", name: "MTN MoMo", logoUrl: pmMtn.url, color: "border-yellow-500/80 text-yellow-600 bg-yellow-500/10 dark:bg-yellow-500/20" },
    ]
  },
  {
    code: "SN",
    name: "Sénégal",
    flag: "🇸🇳",
    prefix: "221",
    methods: [
      { id: "Free Money", name: "Free Money", logoUrl: pmFreeMoney.url, color: "border-red-500/80 text-red-600 bg-red-500/10 dark:bg-red-500/20" },
      { id: "Orange Money", name: "Orange Money", logoUrl: pmOrange.url, color: "border-orange-500/80 text-orange-600 bg-orange-500/10 dark:bg-orange-500/20" },
    ]
  },
  {
    code: "SL",
    name: "Sierra Leone",
    flag: "🇸🇱",
    prefix: "232",
    methods: [
      { id: "Orange Money", name: "Orange Money", logoUrl: pmOrange.url, color: "border-orange-500/80 text-orange-600 bg-orange-500/10 dark:bg-orange-500/20" },
    ]
  },
  {
    code: "UG",
    name: "Ouganda",
    flag: "🇺🇬",
    prefix: "256",
    methods: [
      { id: "Airtel Money", name: "Airtel Money", logoUrl: pmAirtel.url, color: "border-red-500/80 text-red-600 bg-red-500/10 dark:bg-red-500/20" },
      { id: "MTN MoMo", name: "MTN MoMo", logoUrl: pmMtn.url, color: "border-yellow-500/80 text-yellow-600 bg-yellow-500/10 dark:bg-yellow-500/20" },
    ]
  },
  {
    code: "ZM",
    name: "Zambie",
    flag: "🇿🇲",
    prefix: "260",
    methods: [
      { id: "MTN MoMo", name: "MTN MoMo", logoUrl: pmMtn.url, color: "border-yellow-500/80 text-yellow-600 bg-yellow-500/10 dark:bg-yellow-500/20" },
      { id: "Zamtel", name: "Zamtel", logoUrl: pmZamtel.url, color: "border-emerald-500/80 text-emerald-600 bg-emerald-500/10 dark:bg-emerald-500/20" },
    ]
  },
  {
    code: "BF",
    name: "Burkina Faso",
    flag: "🇧🇫",
    prefix: "226",
    methods: [
      { id: "Moov Money", name: "Moov Money", logoUrl: pmMoov.url, color: "border-blue-500/80 text-blue-600 bg-blue-500/10 dark:bg-blue-500/20" },
      { id: "Orange Money", name: "Orange Money", logoUrl: pmOrange.url, color: "border-orange-500/80 text-orange-600 bg-orange-500/10 dark:bg-orange-500/20" },
      { id: "Coris Money", name: "Coris Money", logoUrl: null, color: "border-amber-500/80 text-amber-600 bg-amber-500/10 dark:bg-amber-500/20" },
    ]
  }
];
