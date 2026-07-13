import React, { useState } from "react";
import { cn } from "@/lib/utils";

export function FlagIcon({
  code = "",
  flag = "",
  name = "",
  className = "w-5 h-3.5",
}: {
  code?: string;
  flag?: string;
  name?: string;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const cleanCode = code ? code.toLowerCase() : "";

  if (!cleanCode || error) {
    return (
      <span className={cn("inline-block leading-none shrink-0 font-medium text-center", className)}>
        {flag || "🌍"}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w80/${cleanCode}.png`}
      srcSet={`https://flagcdn.com/w160/${cleanCode}.png 2x`}
      alt={name || code.toUpperCase()}
      onError={() => setError(true)}
      className={cn("inline-block object-cover rounded-[3px] shadow-xs shrink-0 border border-black/10 dark:border-white/10", className)}
    />
  );
}
