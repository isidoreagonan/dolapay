import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Radio,
  Users,
  ShieldCheck,
  ScrollText,
  DollarSign,
  AlertTriangle,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Merchant = { id: string; email: string; full_name: string | null };

export function AdminCommandPalette({
  open,
  onOpenChange,
  onMerchantView,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onMerchantView: () => void;
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const { data: merchants = [] } = useQuery({
    queryKey: ["palette-merchants", search],
    enabled: open,
    queryFn: async (): Promise<Merchant[]> => {
      let q = supabase.from("profiles").select("id,email,full_name").limit(8);
      if (search.trim().length >= 2) {
        const s = `%${search.trim()}%`;
        q = q.or(`email.ilike.${s},full_name.ilike.${s}`);
      } else {
        q = q.order("created_at", { ascending: false });
      }
      const { data } = await q;
      return (data ?? []) as Merchant[];
    },
  });

  const go = (path: string) => {
    onOpenChange(false);
    navigate({ to: path as "/admin" });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Rechercher un marchand, naviguer, exécuter une action…" value={search} onValueChange={setSearch} />
      <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>

        {merchants.length > 0 && (
          <CommandGroup heading="Marchands">
            {merchants.map((m) => (
              <CommandItem
                key={m.id}
                value={`${m.email} ${m.full_name ?? ""}`}
                onSelect={() => go(`/admin/merchants/${m.id}`)}
              >
                <Building2 className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="text-sm">{m.full_name || m.email}</span>
                  <span className="text-xs text-muted-foreground">{m.email}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => go("/admin")}><LayoutDashboard className="mr-2 h-4 w-4" /> Vue d'ensemble</CommandItem>
          <CommandItem onSelect={() => go("/admin/live")}><Radio className="mr-2 h-4 w-4" /> Flux temps réel</CommandItem>
          <CommandItem onSelect={() => go("/admin/merchants")}><Users className="mr-2 h-4 w-4" /> Marchands</CommandItem>
          <CommandItem onSelect={() => go("/admin/compliance")}><ShieldCheck className="mr-2 h-4 w-4" /> Conformité KYC</CommandItem>
          <CommandItem onSelect={() => go("/admin/finance")}><DollarSign className="mr-2 h-4 w-4" /> Finance</CommandItem>
          <CommandItem onSelect={() => go("/admin/risk")}><AlertTriangle className="mr-2 h-4 w-4" /> Risques & alertes</CommandItem>
          <CommandItem onSelect={() => go("/admin/audit")}><ScrollText className="mr-2 h-4 w-4" /> Journal d'audit</CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => { onOpenChange(false); onMerchantView(); }}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Basculer en vue marchand
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
