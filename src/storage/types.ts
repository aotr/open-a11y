/**
 * IStorageAdapter — Pluggable persistence interface.
 *
 * Different environments need different storage:
 * - Browser: localStorage
 * - SSR (Next.js server): in-memory
 * - SSR hydration: cookies
 * - Laravel: API-backed DB
 *
 * All adapters implement this interface so the StateManager
 * doesn't care where preferences are stored.
 */
export interface IStorageAdapter {
  /** Retrieve a stored value by key */
  get(key: string): string | null | Promise<string | null>

  /** Persist a value by key */
  set(key: string, value: string): void | Promise<void>

  /** Remove a stored value by key */
  remove(key: string): void | Promise<void>
}
