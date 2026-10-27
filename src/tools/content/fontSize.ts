/**
 * Font Size — Adjustable text scaling via CSS custom property.
 *
 * Instead of injecting per-element font-size rules (which would be massive),
 * we set --asw-font-scale on :root and let site CSS multiply by it.
 * Also injects a stylesheet for elements that ignore custom properties.
 */
import { upsertStylesheet } from '../../css/cssInjector'

/**
 * Apply font scaling.
 * @param scale - Value between 0.1 (10%) and 2.0 (200%), where 1.0 = 100%
 */
export function adjustFontSize(scale: number): void {
  if (typeof document === 'undefined') return

  const clamped = Math.max(0.1, Math.min(2.0, scale))
  const rounded = Number(clamped.toFixed(2))

  // Set CSS custom property for sites that support it
  document.documentElement.style.setProperty('--asw-font-scale', String(rounded))

  const toolId = 'asw-font-size'
  const percent = Math.round(rounded * 100)
  const css = rounded === 1.0 ? '' : `html.asw-font-size{font-size:${percent}%!important}`

  upsertStylesheet(toolId, css)
  document.documentElement.classList.toggle(toolId, rounded !== 1.0)
}
