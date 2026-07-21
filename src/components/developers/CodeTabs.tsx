import { useState } from "react";
import { CodeBlock } from "./CodeBlock";

export type Lang = "curl" | "node";

export function CodeTabs({ snippets }: { snippets: Record<Lang, string> }) {
  const [lang, setLang] = useState<Lang>("node");
  
  if (!snippets) return null;
  
  return (
    <div className="mt-8">
      <div className="flex gap-1 mb-2 text-xs border-b border-border pb-2">
        {(["node", "curl"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={\`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 \${lang === l ? "bg-navy text-white shadow-md scale-105" : "text-navy/60 hover:bg-navy/5 hover:text-navy"}\`}
          >
            {l === "node" ? "Node.js" : "cURL / JSON"}
          </button>
        ))}
      </div>
      <CodeBlock code={snippets[lang]} lang={lang === "node" ? "javascript" : "json/shell"} />
    </div>
  );
}
