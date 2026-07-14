import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeCtx = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Read saved theme on mount (client-only) to avoid SSR hydration mismatch.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("balivio-theme") as Theme | null;
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      const next: Theme = saved ?? (prefersDark ? "dark" : "light");
      setTheme(next);
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      window.localStorage.setItem("balivio-theme", theme);
    } catch {
      // ignore
    }
  }, [theme, mounted]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return <ThemeContext.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}