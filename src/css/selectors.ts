/**
 * Shared CSS selector constants used across accessibility tools.
 *
 * Centralizing selectors ensures consistent targeting and
 * makes it easy to update exclusions (e.g., skip widget UI).
 */

/** Exclude the accessibility widget itself from all tool styles */
export const NOT_WIDGET_SELECTOR = ':not(.asw-widget):not(.asw-menu):not(.asw-container):not(.asw-overlay):not(.asw-btn):not(.asw-rg)'

/** Exclude icon/UI decorative elements */
export const NOT_ICON_SELECTORS = [NOT_WIDGET_SELECTOR]

/** All text-bearing elements (with widget exclusion) */
export const ALL_ELEMENT_SELECTORS = ['', NOT_WIDGET_SELECTOR]

/** Link elements */
export const LINKS_SELECTORS = [
  `a[href]${NOT_WIDGET_SELECTOR}`,
  `a[href]${NOT_WIDGET_SELECTOR} img`,
  `a[href]${NOT_WIDGET_SELECTOR} svg`,
  `a[href]${NOT_WIDGET_SELECTOR} picture`,
]

/** Heading elements */
export const HEADER_SELECTORS = [
  `h1${NOT_WIDGET_SELECTOR}`,
  `h2${NOT_WIDGET_SELECTOR}`,
  `h3${NOT_WIDGET_SELECTOR}`,
  `h4${NOT_WIDGET_SELECTOR}`,
  `h5${NOT_WIDGET_SELECTOR}`,
  `h6${NOT_WIDGET_SELECTOR}`,
]

/** Text content elements for styling */
export const TEXT_SELECTORS = [
  ...HEADER_SELECTORS,
  `p${NOT_WIDGET_SELECTOR}`,
  `span${NOT_WIDGET_SELECTOR}`,
  `li${NOT_WIDGET_SELECTOR}`,
  `td${NOT_WIDGET_SELECTOR}`,
  `th${NOT_WIDGET_SELECTOR}`,
  `label${NOT_WIDGET_SELECTOR}`,
  `a${NOT_WIDGET_SELECTOR}`,
  `button:not(.asw-btn)`,
  `div${NOT_WIDGET_SELECTOR}`,
]

/** All elements for broad-impact tools (big cursor, stop animations) */
export const ALL_SELECTORS = [`*${NOT_WIDGET_SELECTOR}`]
