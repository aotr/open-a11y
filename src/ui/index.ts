/**
 * asw-ui barrel — shared framework-agnostic UI components.
 *
 * Exports:
 * - Web Components: AswWidget, AswMenu, AswToggle, AswSlider
 * - Icon system: ICONS, renderIcon (backward compat), renderLucideIcon (preferred)
 * - Base CSS: widgetCSS
 * - Engine wiring: createAccessibilityUI
 */

export { AswWidget } from "./components/asw-widget";
export { AswMenu } from "./components/asw-menu";
export { AswToggle } from "./components/asw-toggle";
export { AswSlider } from "./components/asw-slider";
export { ICONS, renderIcon } from "./icons/sprite";
export { renderLucideIcon, LUCIDE_ICONS } from "./icons/lucide";
export type { IconDefinition } from "./icons/sprite";
export { widgetCSS } from "./styles/base.css";
export { createAccessibilityUI } from "./wire-up";
export {
  getActiveAccessibilityUI,
  destroyActiveAccessibilityUI,
  type AccessibilityUIController,
} from "./lifecycle";
