/**
 * Letter Spacing — Continuous adjustment for word character spacing.
 */
import { ALL_ELEMENT_SELECTORS } from '../../css/selectors'
import { upsertStylesheet } from '../../css/cssInjector'

export function adjustLetterSpacing(spacing: number): void {
  if (typeof document === 'undefined') return

  const clamped = Math.max(0, Math.min(10, spacing))
  const rounded = Math.round(clamped)

  const toolId = 'asw-letter-spacing'
  const selectors = ALL_ELEMENT_SELECTORS
    .map((sel) => (sel.trim() ? `html.asw-letter-spacing ${sel}` : 'html.asw-letter-spacing'))
    .join(',')
  const css = rounded === 0 ? '' : `${selectors}{letter-spacing:${rounded}px!important}`

  upsertStylesheet(toolId, css)
  document.documentElement.classList.toggle(toolId, rounded !== 0)
}

export default function letterSpacing(enable = false): void {
  adjustLetterSpacing(enable ? 2 : 0)
}
