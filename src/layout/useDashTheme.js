import { useCallback, useEffect, useState } from "react";

const KEY = "dash-theme";

// Dashboard colour mode: "dark" (default, the original look) or "light". Remembered per browser.
export default function useDashTheme() {
      const [theme, setThemeState] = useState(() => {
            try {
                  const saved = localStorage.getItem(KEY);
                  return saved === "light" || saved === "dark" ? saved : "dark";
            } catch {
                  return "dark";
            }
      });

      const setTheme = useCallback(next => {
            setThemeState(next);
            try { localStorage.setItem(KEY, next); } catch { /* private mode: just not remembered */ }
      }, []);

      // Keep several open dashboard tabs in step.
      useEffect(() => {
            const onStorage = e => { if (e.key === KEY && (e.newValue === "light" || e.newValue === "dark")) setThemeState(e.newValue); };
            window.addEventListener("storage", onStorage);
            return () => window.removeEventListener("storage", onStorage);
      }, []);

      return { theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}
