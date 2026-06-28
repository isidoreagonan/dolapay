import { Toaster as Sonner, type ToasterProps } from "sonner";
import { Check, AlertTriangle, X, Info, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const Toaster = (props: ToasterProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <Sonner
      theme="dark"
      position={isMobile ? "top-center" : "top-right"}
      offset={isMobile ? 12 : 24}
      gap={10}
      visibleToasts={4}
      icons={{
        success: (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-400/15 ring-1 ring-emerald-300/40">
            <Check className="h-3.5 w-3.5 text-emerald-300" strokeWidth={3} />
          </span>
        ),
        error: (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-rose-400/15 ring-1 ring-rose-300/40">
            <X className="h-3.5 w-3.5 text-rose-300" strokeWidth={3} />
          </span>
        ),
        warning: (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-400/15 ring-1 ring-amber-300/40">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-300" strokeWidth={2.5} />
          </span>
        ),
        info: (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-400/15 ring-1 ring-sky-300/40">
            <Info className="h-3.5 w-3.5 text-sky-300" strokeWidth={2.5} />
          </span>
        ),
        loading: (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 ring-1 ring-white/20">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-white" strokeWidth={2.5} />
          </span>
        ),
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-xl border border-white/[0.08] bg-[rgba(10,16,32,0.78)] py-3 pl-3 pr-9 text-[13px] text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7),0_1px_0_0_rgba(255,255,255,0.05)_inset] backdrop-blur-2xl backdrop-saturate-150",
          title: "font-medium tracking-tight text-white leading-snug",
          description: "text-white/60 text-[12px] leading-relaxed mt-0.5",
          icon: "shrink-0",
          content: "min-w-0 flex-1",
          closeButton:
            "!absolute !top-1/2 !right-2 !left-auto !-translate-y-1/2 !translate-x-0 !h-6 !w-6 !rounded-md !border-0 !bg-transparent !text-white/40 hover:!bg-white/10 hover:!text-white !transition-colors",
          actionButton:
            "!rounded-lg !bg-white !px-3 !py-1.5 !text-xs !font-semibold !text-slate-900 hover:!bg-white/90 !transition",
          cancelButton:
            "!rounded-lg !bg-white/10 !px-3 !py-1.5 !text-xs !font-medium !text-white/80 hover:!bg-white/15 !transition",
          success: "!border-emerald-400/20",
          error: "!border-rose-400/20",
          warning: "!border-amber-400/20",
          info: "!border-sky-400/20",
        },
      }}
      style={
        {
          "--width": isMobile ? "calc(100vw - 24px)" : "380px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
