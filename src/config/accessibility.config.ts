/**
 * Accessibility Widget Configuration System.
 *
 * Defines the schema, default settings, and helper utilities for customizing
 * the accessibility panel layout, enabling/disabling tools/profiles, and
 * registering action event hook callbacks.
 *
 * Tool and profile defaults are derived from the manifest, so adding a tool
 * never requires editing this file.
 */
import { TOOLS } from '../tools/manifest'
import { PROFILES } from '../profiles'

export interface IAccessibilityFeatures {
  /** Enable/disable specific accessibility tools by their ID */
  tools?: Record<string, boolean>
  /** Enable/disable specific accessibility profiles */
  profiles?: Record<string, boolean>
  /** Enable/disable language switcher buttons and select dropdowns */
  languageChange?: boolean
  /** Enable/disable keyboard shortcuts reference card in UI */
  shortcuts?: boolean
  /** Show/hide the "Hide floating button" toggle in the menu footer (default: true) */
  hideButtonToggle?: boolean
}

export interface IAccessibilityBrand {
  /** Product name shown in the optional footer */
  name?: string
  /** Link for the footer text (optional) */
  url?: string
  /**
   * Footer text override. When omitted, `Accessibility by {name}` is used if
   * `name` is set. Set to an empty string to hide the footer.
   */
  footerText?: string
  /** Primary widget color */
  primary?: string
  /** Darker primary color used in gradients */
  primaryDark?: string
  /** Accent color used for focus rings and active states */
  accent?: string
}

export interface IAccessibilityHooks {
  /**
   * Hook callback triggered after any user interaction in the accessibility widget.
   *
   * @param event - Object detailing the action taken
   * @param event.action - The type of action (e.g. 'toggle-tool', 'apply-profile', 'change-language', 'reset')
   * @param event.id - The identifier of the tool or profile affected
   * @param event.value - The new value (e.g. boolean state, font scale number, language code string)
   * @param event.states - The entire updated accessibility settings state dictionary
   */
  onAction?: (event: {
    action: 'toggle-tool' | 'adjust-font-size' | 'adjust-line-height' | 'adjust-letter-spacing' | 'apply-contrast' | 'apply-text-align' | 'apply-profile' | 'deactivate-profile' | 'change-language' | 'reset'
    id?: string
    value?: unknown
    states: Record<string, unknown>
  }) => void
}

export interface IAccessibilityConfig {
  /** Panel slide direction: 'right' (default) or 'left' */
  side?: 'right' | 'left'
  /** Default language fallback when no storage language exists (default: 'en') */
  defaultLanguage?: string
  /** Initial language (alias to defaultLanguage) */
  lang?: string
  /** Widget button position */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  /** Widget button offset [x, y] in px */
  offset?: [number, number]
  /** Whether to show backdrop blur when panel is open (default: false) */
  blur?: boolean
  /** Master switch — set false to completely disable the accessibility widget (default: true) */
  enabled?: boolean
  /** Diameter of the floating button in px (default: 56) */
  buttonSize?: number
  /** Show/hide the floating accessibility button (default: true) */
  showButton?: boolean
  /** CSS selector for external trigger elements — clicking these toggles the sidebar (default: '') */
  triggerSelector?: string
  /** Optional brand identity and palette. Defaults are neutral. */
  brand?: IAccessibilityBrand
  /**
   * Override any UI string by its i18n key, for example:
   * `{ 'widget.menuTitle': 'Accessibility options' }`
   */
  labels?: Record<string, string>
  /** Feature availability flags */
  features?: IAccessibilityFeatures
  /** Custom event hooks for extending widget capabilities */
  hooks?: IAccessibilityHooks
}

const toolDefaults = Object.fromEntries(TOOLS.map((tool) => [tool.id, true]))
const profileDefaults = Object.fromEntries(Object.keys(PROFILES).map((id) => [id, true]))

/** Default configuration values for the accessibility widget */
export const DEFAULT_ACCESSIBILITY_CONFIG: Required<IAccessibilityConfig> = {
  side: 'right',
  defaultLanguage: 'en',
  lang: 'en',
  position: 'bottom-right',
  offset: [20, 20],
  blur: false,
  enabled: true,
  buttonSize: 56,
  showButton: true,
  triggerSelector: '',
  brand: {
    name: '',
    url: '',
    primary: 'hsl(158, 64%, 35%)',
    primaryDark: 'hsl(158, 64%, 28%)',
    accent: 'hsl(47.9, 95.8%, 53.1%)',
  },
  labels: {},
  features: {
    tools: toolDefaults,
    profiles: profileDefaults,
    languageChange: true,
    shortcuts: true,
    hideButtonToggle: true,
  },
  hooks: {
    onAction: () => {},
  },
}

/** Clone a required config without sharing nested objects. */
function cloneConfig(config: Required<IAccessibilityConfig>): Required<IAccessibilityConfig> {
  return {
    ...config,
    offset: [...config.offset],
    brand: { ...config.brand },
    labels: { ...config.labels },
    features: {
      ...config.features,
      tools: { ...config.features.tools },
      profiles: { ...config.features.profiles },
    },
    hooks: { ...config.hooks },
  }
}

/**
 * Merge explicit overrides on top of an already-resolved base config.
 * Pass the engine's resolved config as `base` to keep one precedence chain.
 */
export function mergeConfig(
  custom?: IAccessibilityConfig,
  base: Required<IAccessibilityConfig> = DEFAULT_ACCESSIBILITY_CONFIG
): Required<IAccessibilityConfig> {
  if (!custom) return cloneConfig(base)

  const resolved = cloneConfig(base)
  const side = custom.side ?? resolved.side

  resolved.side = side
  resolved.defaultLanguage = custom.defaultLanguage ?? custom.lang ?? resolved.defaultLanguage
  resolved.lang = custom.lang ?? custom.defaultLanguage ?? resolved.lang
  resolved.position = custom.position ?? (custom.side
    ? (side === 'left' ? 'bottom-left' : 'bottom-right')
    : resolved.position)
  resolved.offset = custom.offset ?? resolved.offset
  resolved.blur = custom.blur ?? resolved.blur
  resolved.enabled = custom.enabled ?? resolved.enabled
  resolved.buttonSize = custom.buttonSize ?? resolved.buttonSize
  resolved.showButton = custom.showButton ?? resolved.showButton
  resolved.triggerSelector = custom.triggerSelector ?? resolved.triggerSelector
  resolved.brand = { ...resolved.brand, ...custom.brand }
  resolved.labels = { ...resolved.labels, ...custom.labels }
  resolved.features = {
    tools: { ...resolved.features.tools, ...custom.features?.tools },
    profiles: { ...resolved.features.profiles, ...custom.features?.profiles },
    languageChange: custom.features?.languageChange ?? resolved.features.languageChange,
    shortcuts: custom.features?.shortcuts ?? resolved.features.shortcuts,
    hideButtonToggle: custom.features?.hideButtonToggle ?? resolved.features.hideButtonToggle,
  }
  resolved.hooks = { ...resolved.hooks, ...custom.hooks }

  return resolved
}
