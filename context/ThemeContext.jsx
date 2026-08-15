/**
 * ThemeContext.jsx
 *
 * Reads the brand colours out of companyData, converts them to
 * CSS custom properties and injects them on <html> so that EVERY
 * component that uses var(--color-primary) etc. automatically
 * picks up the right brand palette without any prop-drilling.
 */

import { createContext, useContext, useEffect, useMemo } from "react";
import { buildTheme, themeToCssVars } from "@/lib/theme";

// ── Context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export function ThemeProvider({ companyData, children }) {
  const theme = useMemo(() => buildTheme(companyData), [companyData]);
  const cssVars = useMemo(() => themeToCssVars(theme), [theme]);

  // console.log("ThemeProvider: companyData", companyData);

  // Inject CSS variables onto <html> so they cascade to every element
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(cssVars).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
    });
    // Update body background to match brand bg
    document.body.style.background = theme.bg;
    document.body.style.color = theme.bodyText;
  }, [cssVars, theme]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

export default ThemeContext;
