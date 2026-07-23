import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { SUPPORTED_COUNTRIES } from "@/lib/supported-countries";
import { cn } from "@/lib/utils";

const BROWSER_KEY = (import.meta as { env: Record<string, string | undefined> }).env
  ?.VITE_GOOGLE_MAPS_API_KEY || (import.meta as { env: Record<string, string | undefined> }).env
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const countryCode = SUPPORTED_COUNTRIES.find((c) => c.name === country)?.code;

  // OSM Autocomplete State
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Google Maps Logic
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

  // OSM Search Logic
  const handleAddressChange = (val: string) => {
    onAddress(val);
    if (BROWSER_KEY) return; // Si Google est actif, on ne fait rien avec OSM

    if (val.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const cc = countryCode ? `&countrycodes=${countryCode.toLowerCase()}` : "";
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}${cc}&addressdetails=1&limit=5`);
        if (!res.ok) throw new Error("OSM Search failed");
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 600); // 600ms debounce
  };

  const handleSelectOsm = (place: any) => {
    onAddress(place.display_name);
    const placeCity = place.address?.city || place.address?.town || place.address?.village || place.address?.state;
    if (placeCity && !city) {
      onCity(placeCity);
    }
    setShowSuggestions(false);
  };

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
        <div className="relative" ref={dropdownRef}>
          <Label className="text-xs font-semibold flex items-center gap-1.5">
            Adresse complète 
            {BROWSER_KEY && ready && <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm">✨ Google Maps</span>}
            {!BROWSER_KEY && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">✨ OpenStreetMap (Gratuit)</span>}
          </Label>
          <div className="relative mt-1">
            <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              className="pl-8 pr-8"
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              onFocus={() => {
                if (!BROWSER_KEY && suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Rue, quartier, numéro…"
              autoComplete="off"
            />
            {!BROWSER_KEY && isSearching && (
              <Loader2 className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
            
            {/* Menu déroulant OpenStreetMap */}
            {!BROWSER_KEY && showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
                <ul className="max-h-60 overflow-auto p-1">
                  {suggestions.map((place) => (
                    <li
                      key={place.place_id}
                      onClick={() => handleSelectOsm(place)}
                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <MapPin className="mr-2 h-3 w-3 shrink-0 text-muted-foreground" />
                      <span className="truncate">{place.display_name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
