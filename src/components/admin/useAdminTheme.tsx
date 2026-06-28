import { useEffect, useState, useCallback } from "react";

type Theme = "dark" | "light";
const KEY = "admin-theme";

export function useAdminTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem(KEY) as Theme) || "dark";
  });

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return { theme, toggle, isDark: theme === "dark" };
}
