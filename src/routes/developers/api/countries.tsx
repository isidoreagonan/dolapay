import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Globe, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/developers/api/countries")({
  component: ApiCountriesPage,
});

const COUNTRIES = [
  { code: "BFA", name: "Burkina Faso", prefix: "226", operators: ["Orange", "MOOV"], gateway: "Redirection Web" },
  { code: "BEN", name: "Bénin", prefix: "229", operators: ["MTN", "MOOV"], gateway: "USSD Push (Direct)" },
  { code: "CIV", name: "Côte d'Ivoire", prefix: "225", operators: ["Orange", "MTN"], gateway: "USSD Push (Direct)" },
  { code: "CMR", name: "Cameroun", prefix: "237", operators: ["MTN"], gateway: "USSD Push (Direct)" },
  { code: "COD", name: "RD Congo", prefix: "243", operators: ["Orange", "Airtel", "Vodacom"], gateway: "USSD Push (Direct)" },
  { code: "COG", name: "Congo", prefix: "242", operators: ["MTN", "Airtel"], gateway: "USSD Push (Direct)" },
  { code: "GAB", name: "Gabon", prefix: "241", operators: ["Airtel"], gateway: "USSD Push (Direct)" },
  { code: "KEN", name: "Kenya", prefix: "254", operators: ["Safaricom"], gateway: "USSD Push (Direct)" },
  { code: "RWA", name: "Rwanda", prefix: "250", operators: ["MTN", "Airtel"], gateway: "USSD Push (Direct)" },
  { code: "SEN", name: "Sénégal", prefix: "221", operators: ["Orange", "Free"], gateway: "USSD Push (Direct)" },
  { code: "SLE", name: "Sierra Leone", prefix: "232", operators: ["Orange"], gateway: "USSD Push (Direct)" },
  { code: "UGA", name: "Ouganda", prefix: "256", operators: ["MTN", "Airtel"], gateway: "USSD Push (Direct)" },
  { code: "ZMB", name: "Zambie", prefix: "260", operators: ["MTN", "Zamtel"], gateway: "USSD Push (Direct)" },
];

function ApiCountriesPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Globe className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">
          Couverture & Pays
        </h1>
      </div>
      
      <p className="text-lg text-navy/60 leading-relaxed mb-6 mt-4">
        DolaPay vous permet d'accepter des paiements Mobile Money dans 13 pays africains. L'API détecte automatiquement le pays grâce à l'indicatif téléphonique que vous fournissez dans vos requêtes.
      </p>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm mt-8">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-navy font-semibold border-b border-border">
            <tr>
              <th className="p-4">Pays</th>
              <th className="p-4">Indicatif</th>
              <th className="p-4">Code(s) Opérateur(s)</th>
              <th className="p-4">Méthode de Paiement (API)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {COUNTRIES.map((country) => (
              <tr key={country.code} className="hover:bg-muted/30">
                <td className="p-4 font-medium text-navy">{country.name}</td>
                <td className="p-4">
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-navy/80">+{country.prefix}</code>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {country.operators.map(op => (
                      <span key={op} className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded border border-primary/10">
                        {op}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {country.gateway}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
