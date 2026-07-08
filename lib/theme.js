/**
 * theme.js
 * Extracts brand colors from companyData and derives a full
 * CSS-variable palette. All values fall back to the original
 * "Good Day" defaults so the UI never looks broken.
 */

// ── Default palette (original hardcoded values) ─────────────────────────────
const DEFAULTS = {
  primary: "#51A19D",      // Teal – buttons, active states
  primaryHover: "#3D7D7A", // Deeper Teal for hover feedback
  secondary: "#222827",    // Charcoal – headings, dark text
  accent: "#94C15B",       // Lime Green – badges, highlights
  bg: "#F5FAF9",           // Fresh minty off-white page background
  surface: "#FFFFFF",      // Card / panel background
  border: "#E1ECEB",       // Light teal-tinted border
  muted: "#708280",        // Secondary text / subtitles
  bodyText: "#3F4948",     // Dark graphite body text
  danger: "#dc3545",       // Error / remove actions
  success: "#198754",      // Order success green
};

/**
 * Normalise a raw hex value coming from the API.
 * Handles: "#abc", "abc", "#aabbcc", "aabbcc"
 */
function normaliseHex(raw) {
  if (!raw || typeof raw !== "string") return null;
  const s = raw.trim().replace(/^#/, "");
  // 3-char shorthand → 6-char
  if (/^[0-9a-f]{3}$/i.test(s)) {
    return "#" + s.split("").map((c) => c + c).join("");
  }
  if (/^[0-9a-f]{6}$/i.test(s)) {
    return "#" + s;
  }
  return null;
}

/**
 * Convert a hex colour to "r g g" triplet (space-separated)
 * so Tailwind's opacity modifier bg-primary/20 still works.
 */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

/**
 * Simple luminance check – returns true for "light" colours
 * so we can decide whether text on top should be dark or white.
 */
function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Perceived luminance
  return (0.299 * r + 0.587 * g + 0.114 * b) > 160;
}

/**
 * Build the full theme object from companyData.
 *
 * PRIMARY source  → companyData.theme.brand_colors
 *   {
 *     main             → --color-primary   (buttons, active states)
 *     hover            → --color-primary-hover
 *     primary          → --color-accent    (highlights, badges)
 *     secondary        → --color-secondary (headings, dark fills)
 *     primary_text     → text on primary-bg
 *     secondary_text   → text on secondary-bg
 *     primary_button   → alias for main (used when main is absent)
 *     secondary_button → secondary button colour
 *   }
 *
 * FALLBACK source → flat fields on companyData / companyData.attributes
 *   brand_color / primary_color / theme_color / color / hex_color …
 */
export function buildTheme(companyData) {
  const cd = companyData || {};

  // ── 1. Read from company.theme.brand_colors (the canonical source) ─────────
  const bc = cd.theme?.brand_colors || {};

  // ── 2. Flat-field fallbacks (legacy / other API shapes) ───────────────────
  const attrs = cd.attributes || cd.settings || {};

  const flatPrimary =
    cd.brand_color || cd.primary_color || cd.theme_color ||
    cd.color || cd.colour || cd.hex_color ||
    attrs.brand_color || attrs.primary_color || attrs.theme_color ||
    attrs.color || attrs.colour || null;

  const flatSecondary =
    cd.secondary_color || cd.dark_color || cd.header_color ||
    attrs.secondary_color || attrs.dark_color || null;

  const flatAccent =
    cd.accent_color || cd.highlight_color || cd.badge_color ||
    attrs.accent_color || attrs.highlight_color || null;

  const flatBg =
    cd.background_color || cd.bg_color ||
    attrs.background_color || attrs.bg_color || null;

  // ── 3. Resolve – brand_colors takes priority over flat fields ─────────────
  //  main / primary_button  → our "primary" colour (buttons, active rings)
  const rawPrimary   = bc.main || bc.primary_button || flatPrimary;
  //  hover                  → hover shade of primary
  const rawHover     = bc.hover || null;
  //  secondary              → our "secondary" colour (headings, dark text areas)
  const rawSecondary = bc.secondary || flatSecondary;
  //  primary (brand_colors.primary) → our "accent" colour (badges, highlights)
  const rawAccent    = bc.primary || flatAccent;
  //  background_color       → page bg
  const rawBg        = flatBg;
  //  explicit text colours provided by the API
  const rawPrimaryText   = bc.primary_text   || null;
  const rawSecondaryText = bc.secondary_text || null;

  // ── 4. Normalise hex values ───────────────────────────────────────────────
  const primary   = normaliseHex(rawPrimary)   || DEFAULTS.primary;
  const secondary = normaliseHex(rawSecondary) || DEFAULTS.secondary;
  const accent    = normaliseHex(rawAccent)    || DEFAULTS.accent;
  const bg        = normaliseHex(rawBg)        || DEFAULTS.bg;

  // Hover: use API-provided value first, then auto-lighten primary, then default
  const primaryHover =
    normaliseHex(rawHover) ||
    (normaliseHex(rawPrimary) ? lighten(primary, 15) : DEFAULTS.primaryHover);

  // Text colours: trust API values when provided, otherwise derive from luminance
  const primaryText =
    normaliseHex(rawPrimaryText) ||
    (isLight(primary) ? DEFAULTS.secondary : "#FFFFFF");

  const secondaryText =
    normaliseHex(rawSecondaryText) ||
    (isLight(secondary) ? DEFAULTS.secondary : "#FFFFFF");

  const accentText = isLight(accent) ? DEFAULTS.secondary : "#FFFFFF";

  return {
    primary,
    primaryHover,
    primaryText,
    primaryRgb: hexToRgb(primary),

    secondary,
    secondaryText,
    secondaryRgb: hexToRgb(secondary),

    accent,
    accentText,
    accentRgb: hexToRgb(accent),

    bg,
    bgRgb: hexToRgb(bg),

    // Static tokens (unchanged regardless of company)
    surface: DEFAULTS.surface,
    border: DEFAULTS.border,
    muted: DEFAULTS.muted,
    bodyText: DEFAULTS.bodyText,
    danger: DEFAULTS.danger,
    success: DEFAULTS.success,
  };
}


/**
 * Convert a theme object into a flat record of CSS custom property
 * name → value pairs ready to be set on document.documentElement.
 */
export function themeToCssVars(theme) {
  return {
    "--color-primary": theme.primary,
    "--color-primary-hover": theme.primaryHover,
    "--color-primary-text": theme.primaryText,
    "--color-primary-rgb": theme.primaryRgb,

    "--color-secondary": theme.secondary,
    "--color-secondary-text": theme.secondaryText,
    "--color-secondary-rgb": theme.secondaryRgb,

    "--color-accent": theme.accent,
    "--color-accent-text": theme.accentText,
    "--color-accent-rgb": theme.accentRgb,

    "--color-bg": theme.bg,
    "--color-bg-rgb": theme.bgRgb,

    "--color-surface": theme.surface,
    "--color-border": theme.border,
    "--color-muted": theme.muted,
    "--color-body": theme.bodyText,
    "--color-danger": theme.danger,
    "--color-success": theme.success,
  };
}

// ── Internal helpers ─────────────────────────────────────────────────────────
function lighten(hex, amount) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
