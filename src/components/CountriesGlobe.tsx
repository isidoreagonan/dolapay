import { useEffect, useRef, useState } from "react";

export type GlobeCountry = {
  name: string;
  code: string;
  flag: string;
  currency: string;
  lat: number;
  lng: number;
};

export default function CountriesGlobe({ countries }: { countries: GlobeCountry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState({ w: 560, h: 560 });
  const [GlobeComp, setGlobeComp] = useState<any>(null);
  const [hovered, setHovered] = useState<GlobeCountry | null>(null);

  useEffect(() => {
    setMounted(true);
    import("react-globe.gl").then((m) => setGlobeComp(() => m.default));
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = Math.min(e.contentRect.width, 620);
        setSize({ w, h: w });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    const g = globeRef.current;
    // Auto-rotate
    const controls = g.controls?.();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.enableZoom = false;
    }
    // Center on Africa
    g.pointOfView({ lat: 4, lng: 18, altitude: 1.9 }, 0);
  }, [GlobeComp]);

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-[620px]">
      <div
        className="relative mx-auto"
        style={{ width: size.w, height: size.h }}
      >
        {/* Glow backdrop */}
        <div className="pointer-events-none absolute inset-[-10%] rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.35),transparent_60%)] blur-2xl" />

        {mounted && GlobeComp ? (
          <GlobeComp
            ref={globeRef}
            width={size.w}
            height={size.h}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            atmosphereColor="#4f8cff"
            atmosphereAltitude={0.22}
            pointsData={countries}
            pointLat={(d: any) => d.lat}
            pointLng={(d: any) => d.lng}
            pointColor={() => "#4f8cff"}
            pointAltitude={0.02}
            pointRadius={0.55}
            pointsMerge={false}
            onPointHover={(p: any) => setHovered(p ?? null)}
            htmlElementsData={countries}
            htmlLat={(d: any) => d.lat}
            htmlLng={(d: any) => d.lng}
            htmlAltitude={0.04}
            htmlElement={(d: any) => {
              const el = document.createElement("div");
              el.innerHTML = `
                <div style="transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;gap:2px;pointer-events:auto;cursor:pointer;">
                  <div style="font-size:20px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${d.flag}</div>
                  <div style="width:8px;height:8px;border-radius:9999px;background:#4f8cff;box-shadow:0 0 12px #4f8cff,0 0 4px #fff;"></div>
                </div>`;
              el.title = `${d.name} · ${d.currency}`;
              return el;
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-40 w-40 animate-pulse rounded-full bg-primary/20" />
          </div>
        )}

        {/* Hover label */}
        {hovered && (
          <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-elegant backdrop-blur">
            <span className="mr-1.5">{hovered.flag}</span>
            {hovered.name} <span className="text-muted-foreground">· {hovered.currency}</span>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        Glissez pour faire pivoter · Survolez un repère pour voir le pays
      </div>
    </div>
  );
}
