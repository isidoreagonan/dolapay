import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  return (
    <div className="rounded-2xl bg-[#050B24] border border-white/10 overflow-hidden shadow-lg mt-4">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
        <span className="text-xs text-white/50 font-mono">{lang}</span>
        <button onClick={copy} className="text-xs text-white/60 hover:text-white flex items-center gap-1.5 transition-colors">
          {copied ? <><Check className="h-3.5 w-3.5" /> Copié</> : <><Copy className="h-3.5 w-3.5" /> Copier</>}
        </button>
      </div>
      <pre className="p-5 text-[13px] leading-relaxed font-mono text-white/85 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
