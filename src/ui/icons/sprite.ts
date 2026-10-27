/**
 * Icon sprite — all accessibility widget icons via Lucide.
 *
 * Uses the Lucide icon library (https://lucide.dev) for
 * professionally designed, accessible icons.
 *
 * The `ICONS` record and `renderIcon()` function are kept
 * for backward compatibility. They delegate to Lucide under
 * the hood.
 *
 * Prefer `renderLucideIcon()` from './lucide' for new code.
 */

import { renderLucideIcon } from "./lucide";

/**
 * @deprecated Use `renderLucideIcon(id)` instead.
 * Kept for backward compatibility.
 */
export interface IconDefinition {
  id: string;
  viewBox: string;
  path: string;
}

/**
 * @deprecated Use `renderLucideIcon(id)` instead.
 * Kept for backward compatibility with existing code.
 */
export const ICONS: Record<string, IconDefinition> = {
  // All icons now use Lucide under the hood.
  // The viewBox and path fields are here for backward compat only.
  accessibility: { id: "accessibility", viewBox: "0 0 24 24", path: "" },
  close: { id: "close", viewBox: "0 0 24 24", path: "" },
  reset: { id: "reset", viewBox: "0 0 24 24", path: "" },
  "font-size": { id: "font-size", viewBox: "0 0 24 24", path: "" },
  "font-weight": { id: "font-weight", viewBox: "0 0 24 24", path: "" },
  "line-height": { id: "line-height", viewBox: "0 0 24 24", path: "" },
  "letter-spacing": { id: "letter-spacing", viewBox: "0 0 24 24", path: "" },
  "readable-font": { id: "readable-font", viewBox: "0 0 24 24", path: "" },
  "readable-font-alt": { id: "readable-font-alt", viewBox: "0 0 24 24", path: "" },
  "highlight-links": { id: "highlight-links", viewBox: "0 0 24 24", path: "" },
  "highlight-title": { id: "highlight-title", viewBox: "0 0 24 24", path: "" },
  "hide-images": { id: "hide-images", viewBox: "0 0 24 24", path: "" },
  monochrome: { id: "monochrome", viewBox: "0 0 24 24", path: "" },
  "low-saturation": { id: "low-saturation", viewBox: "0 0 24 24", path: "" },
  "high-saturation": { id: "high-saturation", viewBox: "0 0 24 24", path: "" },
  "high-contrast": { id: "high-contrast", viewBox: "0 0 24 24", path: "" },
  "light-contrast": { id: "light-contrast", viewBox: "0 0 24 24", path: "" },
  "dark-contrast": { id: "dark-contrast", viewBox: "0 0 24 24", path: "" },
  invert: {
    id: "invert",
    viewBox: "0 0 24 24",
    path: "M12 4.81V19.36c-4.08-1.38-7-4.99-7-8.86 0-3.87 2.92-7.48 7-8.31M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z",
  },
  "big-cursor": { id: "big-cursor", viewBox: "0 0 24 24", path: "" },
  "stop-animations": { id: "stop-animations", viewBox: "0 0 24 24", path: "" },
  "reading-guide": { id: "reading-guide", viewBox: "0 0 24 24", path: "" },
  "reading-ruler": { id: "reading-ruler", viewBox: "0 0 24 24", path: "" },
  "reading-mask": { id: "reading-mask", viewBox: "0 0 24 24", path: "" },
  "screen-reader": { id: "screen-reader", viewBox: "0 0 24 24", path: "" },
  "focus-mode": { id: "focus-mode", viewBox: "0 0 24 24", path: "" },
  "visible-focus": { id: "visible-focus", viewBox: "0 0 24 24", path: "" },
  "reduced-motion": { id: "reduced-motion", viewBox: "0 0 24 24", path: "" },
  "seizure-safe": { id: "seizure-safe", viewBox: "0 0 24 24", path: "" },
  "vision-impaired": { id: "vision-impaired", viewBox: "0 0 24 24", path: "" },
  "adhd-friendly": { id: "adhd-friendly", viewBox: "0 0 24 24", path: "" },
  "cognitive-disability": { id: "cognitive-disability", viewBox: "0 0 24 24", path: "" },
  "keyboard-navigation": { id: "keyboard-navigation", viewBox: "0 0 24 24", path: "" },
  "blind-users": { id: "blind-users", viewBox: "0 0 24 24", path: "" },
  "motor-impaired": { id: "motor-impaired", viewBox: "0 0 24 24", path: "" },
  info: { id: "info", viewBox: "0 0 24 24", path: "" },
  plus: { id: "plus", viewBox: "0 0 24 24", path: "" },
  minus: { id: "minus", viewBox: "0 0 24 24", path: "" },
  "text-align-left": { id: "text-align-left", viewBox: "0 0 24 24", path: "" },
  "text-align-center": { id: "text-align-center", viewBox: "0 0 24 24", path: "" },
  "text-align-right": { id: "text-align-right", viewBox: "0 0 24 24", path: "" },
  "text-justify": { id: "text-justify", viewBox: "0 0 24 24", path: "" },
};

/**
 * Render an icon as an SVG HTML string.
 * Now delegates to Lucide for all icon rendering.
 */
export function renderIcon(id: string): string {
  return renderLucideIcon(id);
}
