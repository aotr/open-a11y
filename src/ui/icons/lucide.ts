/**
 * Lucide icon integration for open-a11y.
 *
 * Maps accessibility tool IDs to Lucide icons. Uses tree-shakeable
 * named imports so only the icons actually used are bundled.
 *
 * Each icon is rendered as an SVG string for use in web component
 * Shadow DOM template literals.
 *
 * @see https://lucide.dev/icons
 */

import {
  Accessibility,
  X,
  RotateCcw,
  Type,
  Bold,
  StretchVertical,
  LetterText,
  BookOpenText,
  Link,
  Underline,
  Heading1,
  Palette,
  Droplet,
  Droplets,
  Contrast,
  Sun,
  Moon,
  Circle,
  MousePointer2,
  PauseCircle,
  BookMarked,
  Ruler,
  ScanEye,
  Eye,
  Gauge,
  ShieldCheck,
  Glasses,
  Brain,
  Puzzle,
  Keyboard,
  EyeOff,
  Plus,
  Minus,
  Globe,
  Info,
  Hand,
  ImageOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Ear,
  ScanLine,
} from "lucide";

/**
 * Convert a LucideIconNode to an SVG HTML string.
 *
 * Lucide core exports icons as arrays of [tag, attrs] tuples.
 * Each tuple represents an SVG child element (path, circle, rect, etc.).
 * No wrapper extraction needed — icons are the raw node arrays.
 */
type LucideIconNode = [string, Record<string, string>];

function iconNodeToSvg(icon: LucideIconNode[], size = 24): string {
  const childStrings = icon
    .map(([childTag, childAttrs]) => {
      const attrString = Object.entries(childAttrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      return `<${childTag} ${attrString}/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${childStrings}</svg>`;
}

/** Map of accessibility tool ID → Lucide icon SVG string generator */
export const LUCIDE_ICONS: Record<string, () => string> = {
  // ── Widget chrome ──
  accessibility: () => iconNodeToSvg(Accessibility as unknown as LucideIconNode[]),
  close: () => iconNodeToSvg(X as unknown as LucideIconNode[]),
  reset: () => iconNodeToSvg(RotateCcw as unknown as LucideIconNode[]),
  language: () => iconNodeToSvg(Globe as unknown as LucideIconNode[]),

  // ── Content tools ──
  "font-size": () => iconNodeToSvg(Type as unknown as LucideIconNode[]),
  "font-weight": () => iconNodeToSvg(Bold as unknown as LucideIconNode[]),
  "line-height": () => iconNodeToSvg(StretchVertical as unknown as LucideIconNode[]),
  "letter-spacing": () => iconNodeToSvg(LetterText as unknown as LucideIconNode[]),
  "readable-font": () => iconNodeToSvg(BookOpenText as unknown as LucideIconNode[]),
  "readable-font-alt": () => iconNodeToSvg(BookOpenText as unknown as LucideIconNode[]),
  "highlight-links": () => iconNodeToSvg(Link as unknown as LucideIconNode[]),
  "underline-links": () => iconNodeToSvg(Underline as unknown as LucideIconNode[]),
  "highlight-title": () => iconNodeToSvg(Heading1 as unknown as LucideIconNode[]),

  // ── Content tools (new) ──
  "hide-images": () => iconNodeToSvg(ImageOff as unknown as LucideIconNode[]),

  // ── Color / contrast tools ──
  monochrome: () => iconNodeToSvg(Palette as unknown as LucideIconNode[]),
  "low-saturation": () => iconNodeToSvg(Droplet as unknown as LucideIconNode[]),
  "high-saturation": () => iconNodeToSvg(Droplets as unknown as LucideIconNode[]),
  "high-contrast": () => iconNodeToSvg(Contrast as unknown as LucideIconNode[]),
  "light-contrast": () => iconNodeToSvg(Sun as unknown as LucideIconNode[]),
  "dark-contrast": () => iconNodeToSvg(Moon as unknown as LucideIconNode[]),
  invert: () => iconNodeToSvg(Circle as unknown as LucideIconNode[]),

  // ── Navigation tools ──
  "big-cursor": () => iconNodeToSvg(MousePointer2 as unknown as LucideIconNode[]),
  "visible-focus": () => iconNodeToSvg(Eye as unknown as LucideIconNode[]),

  // ── Motion tools ──
  "stop-animations": () => iconNodeToSvg(PauseCircle as unknown as LucideIconNode[]),
  "reduced-motion": () => iconNodeToSvg(Gauge as unknown as LucideIconNode[]),

  // ── Readability tools ──
  "reading-guide": () => iconNodeToSvg(BookMarked as unknown as LucideIconNode[]),
  "reading-ruler": () => iconNodeToSvg(Ruler as unknown as LucideIconNode[]),
  "focus-mode": () => iconNodeToSvg(ScanEye as unknown as LucideIconNode[]),

  // ── Readability tools (new) ──
  "reading-mask": () => iconNodeToSvg(ScanLine as unknown as LucideIconNode[]),
  "screen-reader": () => iconNodeToSvg(Ear as unknown as LucideIconNode[]),

  // ── Profiles ──
  "seizure-safe": () => iconNodeToSvg(ShieldCheck as unknown as LucideIconNode[]),
  "vision-impaired": () => iconNodeToSvg(Glasses as unknown as LucideIconNode[]),
  "adhd-friendly": () => iconNodeToSvg(Brain as unknown as LucideIconNode[]),
  "cognitive-disability": () => iconNodeToSvg(Puzzle as unknown as LucideIconNode[]),
  "keyboard-navigation": () => iconNodeToSvg(Keyboard as unknown as LucideIconNode[]),
  "blind-users": () => iconNodeToSvg(EyeOff as unknown as LucideIconNode[]),
  "motor-impaired": () => iconNodeToSvg(Hand as unknown as LucideIconNode[]),

  // ── Info / tooltip ──
  info: () => iconNodeToSvg(Info as unknown as LucideIconNode[]),

  // ── Controls ──
  plus: () => iconNodeToSvg(Plus as unknown as LucideIconNode[]),
  minus: () => iconNodeToSvg(Minus as unknown as LucideIconNode[]),

  // ── Text Alignment ──
  "text-align-left": () => iconNodeToSvg(AlignLeft as unknown as LucideIconNode[]),
  "text-align-center": () => iconNodeToSvg(AlignCenter as unknown as LucideIconNode[]),
  "text-align-right": () => iconNodeToSvg(AlignRight as unknown as LucideIconNode[]),
  "text-justify": () => iconNodeToSvg(AlignJustify as unknown as LucideIconNode[]),
};

/** Render a Lucide icon as an SVG HTML string by its tool ID */
export function renderLucideIcon(id: string, size = 24): string {
  const factory = LUCIDE_ICONS[id];
  if (!factory) return "";
  return factory()
    .replace(/width="24"/, `width="${size}"`)
    .replace(/height="24"/, `height="${size}"`);
}
