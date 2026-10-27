/**
 * Contrast & Color Filters — CSS filter-based color adjustments.
 *
 * Supports: dark-contrast, light-contrast, high-contrast,
 * high-saturation, low-saturation, monochrome.
 *
 * Unlike Sienna which handles contrast separately, we unify
 * all color adjustments through a single entry point.
 */
import { upsertStylesheet, removeStylesheet } from '../../css/cssInjector'
import { generateCSSFromConfig } from '../../css/cssGenerator'
import type { IToolConfig } from '../../types'
import { TEXT_SELECTORS } from '../../css/selectors'

const FILTER_ID = 'asw-filter-style'
const FILTER_CLASS = 'asw-filter'

type ContrastKey =
  | 'dark-contrast'
  | 'light-contrast'
  | 'high-contrast'
  | 'high-saturation'
  | 'low-saturation'
  | 'monochrome'

interface IFilterEntry extends IToolConfig {
  id: ContrastKey
}

export const FILTERS: Record<ContrastKey, IFilterEntry> = {
  'dark-contrast': {
    id: 'dark-contrast',
    selector: 'html',
    childrenSelector: TEXT_SELECTORS,
    styles: {
      color: '#FFF',
      fill: '#FFF',
      'background-color': '#000',
    },
  },
  'light-contrast': {
    id: 'light-contrast',
    selector: 'html',
    childrenSelector: TEXT_SELECTORS,
    styles: {
      color: '#000',
      fill: '#000',
      'background-color': '#FFF',
    },
  },
  'high-contrast': {
    id: 'high-contrast',
    selector: 'html',
    styles: {
      filter: 'contrast(125%)',
    },
  },
  'high-saturation': {
    id: 'high-saturation',
    selector: 'html',
    styles: {
      filter: 'saturate(200%)',
    },
  },
  'low-saturation': {
    id: 'low-saturation',
    selector: 'html',
    styles: {
      filter: 'saturate(50%)',
    },
  },
  'monochrome': {
    id: 'monochrome',
    selector: 'html',
    styles: {
      filter: 'grayscale(100%)',
    },
  },
}

/**
 * Apply a contrast/filter preset.
 * @param contrastKey - One of the FILTERS keys, or false/undefined to clear.
 */
export function enableContrast(contrastKey: ContrastKey | false | undefined): void {
  if (typeof document === 'undefined') return

  if (!contrastKey || !FILTERS[contrastKey]) {
    removeStylesheet(FILTER_ID)
    document.documentElement.classList.remove(FILTER_CLASS)
    return
  }

  const filter = FILTERS[contrastKey]

  const css = generateCSSFromConfig({
    ...filter,
    selector: `html.${FILTER_CLASS}`,
  })

  upsertStylesheet(FILTER_ID, css)
  document.documentElement.classList.add(FILTER_CLASS)
}
