/**
 * ISettings — User accessibility preferences.
 *
 * Persisted to localStorage, cookies, or server-side DB
 * depending on the storage adapter in use.
 */

/** Individual tool states keyed by tool ID */
export interface ISettingsStates {
  fontSize?: number
  contrast?: string
  [key: string]: unknown
}

/** Top-level settings object */
export interface ISettings {
  /** Language code (ISO 639-1 or BCP 47), e.g. "en", "hi", "zh-Hans" */
  lang?: string

  /** Active tool states */
  states?: ISettingsStates

  /** Last modification timestamp */
  updatedAt?: string
}
