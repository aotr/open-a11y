/**
 * Line Height — Continuous adjustment for paragraph line spacing.
 */
import { ALL_ELEMENT_SELECTORS } from '../../css/selectors'
import { upsertStylesheet } from '../../css/cssInjector'

export function adjustLineHeight(height: number): void {
  if (typeof document === 'undefined') return

  const clamped = Math.max(1.0, Math.min(3.0, height))
  const rounded = Number(clamped.toFixed(1))

  const toolId = 'asw-line-height'
  const selectors = ALL_ELEMENT_SELECTORS
    .map((sel) => (sel.trim() ? `html.asw-line-height ${sel}` : 'html.asw-line-height'))
    .join(',')
  const css = rounded === 1.0 ? '' : `${selectors}{line-height:${rounded}!important}`

  upsertStylesheet(toolId, css)
  document.documentElement.classList.toggle(toolId, rounded !== 1.0)
}

export default function lineHeight(enable = false): void {
  adjustLineHeight(enable ? 2.0 : 1.0)
}
