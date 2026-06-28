import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { SUPPORTED_COUNTRIES } from "@/lib/supported-countries";

const BROWSER_KEY = (import.meta as { env: Record<string, string | undefined> }).env
  ?.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;

type Props = {
  label?: string;
  country: string;
  city: string;
  address: string;
  onCountry: (v: string) => void;
  onCity: (v: string) => void;
  onAddress: (v: string) => void;
};

let mapsLoading: Promise<void> | null = null;

function loadMaps(key: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const w = window as unknown as { google?: { maps?: unknown } };
  if (w.google?.maps) return Promise.resolve();
  if (mapsLoading) return mapsLoading;
  mapsLoading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&loading=async&v=weekly`;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(s);
  });
  return mapsLoading;
}

export function AddressBlock({ label = "Adresse", country, city, address, onCountry, onCity, onAddress }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);
  const countryCode = SUPPORTED_COUNTRIES.find((c) => c.name === country)?.code;

  useEffect(() => {
    if (!BROWSER_KEY || !inputRef.current) return;
    let cancelled = false;
    loadMaps(BROWSER_KEY)
      .then(async () => {
        if (cancelled || !inputRef.current) return;
        const g = (window as unknown as { google: { maps: { importLibrary: (l: string) => Promise<unknown> } } }).google;
        type PlacesLib = {
          Autocomplete: new (
            input: HTMLInputElement,
            opts: { fields: string[]; componentRestrictions?: { country: string[] } },
          ) => {
            addListener: (e: string, cb: () => void) => void;
            getPlace: () => {
              formatted_address?: string;
              address_components?: Array<{ long_name: string; short_name: string; types: string[] }>;
            };
          };
        };
        const lib = (await g.maps.importLibrary("places")) as PlacesLib;
        const ac = new lib.Autocomplete(inputRef.current, {
          fields: ["formatted_address", "address_components"],
          componentRestrictions: countryCode ? { country: [countryCode.toLowerCase()] } : undefined,
        });
        ac.addListener("place_changed", () => {
          const place = ac.getPlace();
          if (place.formatted_address) onAddress(place.formatted_address);
          const comps = place.address_components ?? [];
          const cityComp = comps.find((c) => c.types.includes("locality"))
            ?? comps.find((c) => c.types.includes("administrative_area_level_2"))
            ?? comps.find((c) => c.types.includes("administrative_area_level_1"));
          if (cityComp && !city) onCity(cityComp.long_name);
        });
        setReady(true);
      })
      .catch(() => setReady(false));
    return () => { cancelled = true; };
  }, [countryCode, city, onAddress, onCity]);

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs font-semibold">{label} — Pays</Label>
        <select
          value={country}
          onChange={(e) => onCountry(e.target.value)}
          className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">— Sélectionnez un pays —</option>
          {SUPPORTED_COUNTRIES.map((c) => (
            <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs font-semibold">Ville</Label>
          <Input className="mt-1" value={city} onChange={(e) => onCity(e.target.value)} placeholder="Ex : Cotonou" />
        </div>
        <div>
          <Label className="text-xs font-semibold">
            Adresse complète {BROWSER_KEY && ready && <span className="ml-1 text-[10px] text-primary">✨ Auto-complétion Google</span>}
          </Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              className="mt-1 pl-8"
              value={address}
              onChange={(e) => onAddress(e.target.value)}
              placeholder="Rue, quartier, numéro…"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
      {!BROWSER_KEY && (
        <p className="text-[11px] text-muted-foreground">
          💡 Astuce : connectez Google Maps dans les intégrations pour activer l'auto-complétion d'adresse.
        </p>
      )}
    </div>
  );
}
