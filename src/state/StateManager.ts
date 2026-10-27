/**
 * StateManager — Observable state machine for accessibility preferences.
 *
 * Core responsibilities:
 * 1. Hold current settings (lang, tool states)
 * 2. Notify subscribers on every change
 * 3. Persist to storage adapter automatically
 * 4. Hydrate from storage on initialization
 * 5. Support profile application (batch tool toggles)
 * 6. Support full reset
 *
 * This is framework-agnostic — works in vanilla JS, React, or Blade views.
 */
import type { IStorageAdapter } from '../storage/types'
import type { ISettings, ISettingsStates } from '../types/ISettings'
import { normalizeStates } from '../tools/manifest'

/** Storage key used across all adapters */
export const STORAGE_KEY = 'asw-user-settings'

/** Default settings when nothing is persisted */
const DEFAULT_SETTINGS: ISettings = {
  lang: 'en',
  states: {},
}

export type StateChangeListener = (settings: ISettings) => void

export interface StateManagerOptions {
  /** Called when an async storage adapter rejects a write. */
  onPersistenceError?: (error: unknown) => void
}

export class StateManager {
  private settings: ISettings
  private listeners: Set<StateChangeListener> = new Set()
  private storage: IStorageAdapter
  private options: StateManagerOptions
  private pendingPersistence: Promise<void> = Promise.resolve()

  constructor(storage: IStorageAdapter, initial?: Partial<ISettings>, options: StateManagerOptions = {}) {
    this.storage = storage
    this.options = options
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...initial,
      states: {
        ...DEFAULT_SETTINGS.states,
        ...normalizeStates(initial?.states),
      },
    }
  }

  // ─── Read ────────────────────────────────────────────────

  /** Get a frozen snapshot of current settings */
  getState(): Readonly<ISettings> {
    return Object.freeze({ ...this.settings, states: { ...this.settings.states } })
  }

  /** Check if a specific tool is enabled */
  isToolEnabled(toolId: string): boolean {
    return !!this.settings.states?.[toolId]
  }

  /** Get the value of a specific tool state */
  getToolValue(toolId: string): unknown {
    return this.settings.states?.[toolId]
  }

  // ─── Write ───────────────────────────────────────────────

  /** Toggle or set a single tool state */
  setTool(key: string, value: unknown): void {
    this.setMany({ [key]: value })
  }

  /** Batch-write multiple tool states with a single notify and persist. */
  setMany(states: ISettingsStates): void {
    this.settings.states = {
      ...this.settings.states,
      ...normalizeStates(states),
    }
    this.settings.updatedAt = new Date().toISOString()
    this.notify()
    this.persist()
  }

  /** Change the display language */
  setLanguage(lang: string): void {
    this.settings.lang = lang
    this.settings.updatedAt = new Date().toISOString()
    this.notify()
    this.persist()
  }

  /** Reset all settings to defaults */
  reset(): void {
    this.settings = {
      ...DEFAULT_SETTINGS,
      lang: this.settings.lang, // Preserve language preference
    }
    this.notify()
    this.persist()
  }

  // ─── Subscriptions ──────────────────────────────────────

  /**
   * Subscribe to state changes.
   * Returns an unsubscribe function.
   *
   * @example
   *   const unsub = manager.subscribe((settings) => {
   *     console.log('Settings changed:', settings)
   *   })
   *   // Later: unsub()
   */
  subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  // ─── Persistence ────────────────────────────────────────

  /** Save current settings to the storage adapter. */
  persist(): void {
    const payload = JSON.stringify({
      lang: this.settings.lang,
      states: this.settings.states,
      updatedAt: this.settings.updatedAt,
    })

    try {
      const result = this.storage.set(STORAGE_KEY, payload)
      if (result && typeof (result as Promise<void>).then === 'function') {
        this.pendingPersistence = this.pendingPersistence
          .then(() => result)
          .catch((error) => this.options.onPersistenceError?.(error))
      }
    } catch (error) {
      this.options.onPersistenceError?.(error)
    }
  }

  /** Wait for queued asynchronous writes to settle (useful for tests and shutdown). */
  async flushPersistence(): Promise<void> {
    await this.pendingPersistence
  }

  /**
   * Load settings from the storage adapter.
   * Merges stored settings on top of current defaults.
   */
  async hydrate(): Promise<void> {
    const raw = this.storage.get(STORAGE_KEY)
    const value = raw instanceof Promise ? await raw : raw
    if (value) this.applyStored(value)
  }

  // ─── Internal ───────────────────────────────────────────

  private applyStored(raw: string): void {
    try {
      const stored = JSON.parse(raw) as Partial<ISettings>
      this.settings = {
        ...DEFAULT_SETTINGS,
        lang: stored.lang ?? DEFAULT_SETTINGS.lang,
        states: {
          ...DEFAULT_SETTINGS.states,
          ...normalizeStates(stored.states),
        },
        updatedAt: stored.updatedAt,
      }
      this.notify()
    } catch {
      // Corrupted data — stick with defaults
    }
  }

  private notify(): void {
    const snapshot = this.getState()
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot as ISettings)
      } catch {
        // Prevent one broken listener from blocking others
      }
    })
  }
}
