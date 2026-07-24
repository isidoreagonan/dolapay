import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, AlertTriangle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/status/')({
  component: StatusDashboard,
});

interface OperationType {
  operationType: 'DEPOSIT' | 'PAYOUT';
  status: 'OPERATIONAL' | 'DELAYED' | 'CLOSED' | string;
}

interface CorrespondentData {
  correspondent: string;
  operationTypes: OperationType[];
}

interface CountryStatus {
  country: string;
  correspondents: CorrespondentData[];
}

const COUNTRY_NAMES: Record<string, string> = {
  BEN: 'Bénin',
  SEN: 'Sénégal',
  CIV: "Côte d'Ivoire",
  CMR: 'Cameroun',
  RWA: 'Rwanda',
  GHA: 'Ghana',
  NGA: 'Nigeria',
  KEN: 'Kenya',
  ZMB: 'Zambie',
  UGA: 'Ouganda',
  TZA: 'Tanzanie',
  ZWE: 'Zimbabwe',
  ZAF: 'Afrique du Sud',
};

const getStatusConfig = (status: string) => {
  switch (status.toUpperCase()) {
    case 'OPERATIONAL':
      return {
        label: 'Opérationnel',
        icon: CheckCircle2,
        colorClass: 'text-emerald-400',
        bgClass: 'bg-emerald-400/10',
        borderClass: 'border-emerald-400/20',
      };
    case 'DELAYED':
      return {
        label: 'Perturbé',
        icon: AlertTriangle,
        colorClass: 'text-amber-400',
        bgClass: 'bg-amber-400/10',
        borderClass: 'border-amber-400/20',
      };
    case 'CLOSED':
    case 'UNAVAILABLE':
      return {
        label: 'Hors service',
        icon: XCircle,
        colorClass: 'text-rose-500',
        bgClass: 'bg-rose-500/10',
        borderClass: 'border-rose-500/20',
      };
    default:
      return {
        label: status,
        icon: AlertTriangle,
        colorClass: 'text-gray-400',
        bgClass: 'bg-gray-400/10',
        borderClass: 'border-gray-400/20',
      };
  }
};

const formatCorrespondentName = (name: string) => {
  return name.replace(/_/g, ' ').replace('MOMO', 'Mobile Money');
};

function StatusDashboard() {
  const { data: statusData, isLoading, isError, refetch, isFetching } = useQuery<CountryStatus[]>({
    queryKey: ['pawapay-availability'],
    queryFn: async () => {
      const res = await fetch('/api/public/pawapay-availability');
      if (!res.ok) throw new Error('Failed to fetch status');
      return res.json();
    },
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: historyData } = useQuery({
    queryKey: ['pawapay-history'],
    queryFn: async () => {
      const res = await fetch('/api/public/pawapay-history');
      if (!res.ok) return { issues: [] };
      return res.json();
    },
    refetchInterval: 60000 * 15, // 15 mins
  });

  const getGlobalStatus = () => {
    if (!statusData) return { status: 'UNKNOWN', text: 'Vérification en cours...' };
    
    let hasIssues = false;
    let hasOutages = false;

    statusData.forEach(country => {
      country.correspondents.forEach(corr => {
        corr.operationTypes.forEach(op => {
          if (op.status === 'DELAYED') hasIssues = true;
          if (op.status === 'CLOSED') hasOutages = true;
        });
      });
    });

    if (hasOutages) return { status: 'CLOSED', text: 'Certains services sont interrompus' };
    if (hasIssues) return { status: 'DELAYED', text: 'Performances dégradées sur certains réseaux' };
    return { status: 'OPERATIONAL', text: 'Tous les systèmes sont opérationnels' };
  };

  const globalStatus = getGlobalStatus();
  const globalConfig = getStatusConfig(globalStatus.status);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-white/50">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
        <p>Chargement des statuts en temps réel...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 max-w-md text-center backdrop-blur-md">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Erreur de connexion</h2>
          <p className="text-rose-200/80 mb-6">
            Impossible de récupérer l'état des services pour le moment.
          </p>
          <button 
            onClick={() => refetch()}
            className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors font-medium flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Global Status Banner */}
      <div className={cn(
        "relative overflow-hidden rounded-3xl p-8 md:p-10 border backdrop-blur-xl transition-all duration-500",
        globalConfig.bgClass,
        globalConfig.borderClass
      )}>
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <globalConfig.icon className="w-48 h-48" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="relative flex h-4 w-4">
                {globalStatus.status === 'OPERATIONAL' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={cn("relative inline-flex rounded-full h-4 w-4", globalConfig.bgClass.replace('/10', ''))}></span>
              </span>
              <h1 className="text-sm uppercase tracking-widest font-semibold text-white/60">
                Statut Global du Réseau
              </h1>
            </div>
            <h2 className={cn("text-3xl md:text-4xl font-bold tracking-tight", globalConfig.colorClass)}>
              {globalStatus.text}
            </h2>
          </div>
          
          <button 
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-all text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
            {isFetching ? "Actualisation..." : "Actualiser"}
          </button>
        </div>
      </div>

      {/* Country Grids */}
      <div className="space-y-10">
        {statusData?.map((countryData) => {
          // Skip if no correspondents
          if (!countryData.correspondents || countryData.correspondents.length === 0) return null;
          
          return (
            <div key={countryData.country} className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-white/10 pb-2">
                <span className="bg-white/10 px-3 py-1 rounded-lg text-sm font-mono text-white/80">
                  {countryData.country}
                </span>
                {COUNTRY_NAMES[countryData.country] || countryData.country}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {countryData.correspondents.map((corr) => {
                  
                  // Generate history bars
                  const days = Array.from({ length: 30 }).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (29 - i));
                    const dateStr = d.toISOString().split('T')[0];
                    
                    const dayIssues = historyData?.issues?.filter((h: any) => 
                      h.correspondent === corr.correspondent && 
                      h.created_at.startsWith(dateStr)
                    ) || [];
                    
                    let status = 'OPERATIONAL';
                    if (dayIssues.some((i: any) => i.status === 'CLOSED')) status = 'CLOSED';
                    else if (dayIssues.some((i: any) => i.status === 'DELAYED')) status = 'DELAYED';
                    
                    return { date: dateStr, status };
                  });
                  const uptimePercent = days.filter(d => d.status === 'OPERATIONAL').length === 30 ? '100%' : '> 99%';

                  return (
                    <div 
                      key={corr.correspondent} 
                      className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-semibold text-white/90 mb-4 text-lg">
                          {formatCorrespondentName(corr.correspondent)}
                        </div>
                        
                        <div className="space-y-3">
                          {corr.operationTypes.map((op) => {
                            const config = getStatusConfig(op.status);
                            const Icon = config.icon;
                            return (
                              <div key={op.operationType} className="flex justify-between items-center bg-black/20 rounded-xl p-3">
                                <span className="text-sm font-medium text-white/60">
                                  {op.operationType === 'DEPOSIT' ? 'Pay-in (Dépôt)' : 'Pay-out (Retrait)'}
                                </span>
                                <div className={cn("flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-full", config.bgClass, config.colorClass)}>
                                  <Icon className="w-3.5 h-3.5" />
                                  {config.label}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Disponibilité (30 jours)</span>
                          <span className="text-xs font-medium text-emerald-400">{uptimePercent}</span>
                        </div>
                        <div className="flex gap-1 h-6">
                          {days.map((day, i) => (
                            <div 
                              key={i} 
                              className={cn(
                                "flex-1 rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-help",
                                day.status === 'OPERATIONAL' ? 'bg-emerald-500/80' : 
                                day.status === 'DELAYED' ? 'bg-amber-400' : 'bg-rose-500'
                              )}
                              title={`${day.date} : ${day.status}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
