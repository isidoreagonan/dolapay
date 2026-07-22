import { useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { SUPPORTED_COUNTRIES, findCountryByCode } from "@/lib/supported-countries";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FlagIcon } from "@/components/ui/flag-icon";
import { cn } from "@/lib/utils";

export function CountrySelect({
  value,
  onChange,
  label = "Pays",
  disabled,
}: {
  value: string;
  onChange: (code: string) => void;
  label?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => findCountryByCode(value), [value]);

  return (
    <div className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-900">{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition-colors hover:border-primary/60 disabled:opacity-60"
          >
            {selected ? (
              <span className="flex items-center gap-2">
                <FlagIcon code={selected.code} flag={selected.flag} name={selected.name} className="w-5 h-3.5" />
                <span className="font-medium">{selected.name}</span>
                <span className="text-xs text-slate-500">{selected.dialCode}</span>
              </span>
            ) : (
              <span className="text-slate-500">Sélectionnez un pays…</span>
            )}
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) max-h-72 overflow-y-auto p-1"
        >
          {SUPPORTED_COUNTRIES.map((c) => {
            const active = c.code === value;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-slate-50",
                  active && "bg-slate-50",
                )}
              >
                <FlagIcon code={c.code} flag={c.flag} name={c.name} className="w-5 h-3.5" />
                <span className="flex-1 font-medium text-slate-900">{c.name}</span>
                <span className="text-xs text-slate-500">{c.dialCode}</span>
                {active && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
      <p className="mt-1 text-[11px] text-slate-500">
        DolaPay couvre 12 marchés africains. Les autres pays seront ajoutés prochainement.
      </p>
    </div>
  );
}

export function PhoneField({
  countryCode,
  value,
  onChange,
  label = "Numéro de téléphone",
}: {
  countryCode: string;
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const country = useMemo(() => findCountryByCode(countryCode), [countryCode]);
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-900">{label}</span>
      <div className="flex items-stretch gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-primary">
        <div className="flex shrink-0 items-center gap-1.5 border-r border-slate-200 pr-3 text-sm font-semibold text-slate-900">
          <FlagIcon code={country?.code} flag={country?.flag} name={country?.name} className="w-5 h-3.5" />
          <span>{country?.dialCode ?? "+ —"}</span>
        </div>
        <input
          type="tel"
          inputMode="numeric"
          placeholder={country ? `${country.phoneLengths[0]} chiffres` : "Sélectionnez d'abord un pays"}
          value={value}
          disabled={!country}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          required
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none disabled:opacity-60"
        />
      </div>
    </label>
  );
}
