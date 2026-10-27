/**
 * Master tool registry — executors plus the manifest metadata.
 */

// Content
export {
  adjustFontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  readableFont,
  highlightLinks,
  highlightTitles,
  hideImages,
  readableFontAlt,
  TEXT_ALIGNMENTS,
  enableTextAlignment,
} from './content'

// Color
export { enableContrast, FILTERS, invert } from './color'

// Readability
export {
  readingGuide,
  readingRuler,
  focusMode,
  readingMask,
  screenReader,
} from './readability'

// Motion
export { stopAnimations, reducedMotion } from './motion'

// Navigation
export { bigCursor, visibleFocus } from './navigation'

// Manifest — single source of truth for tool metadata
export * from './manifest'
