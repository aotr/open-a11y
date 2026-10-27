/**
 * memoryAdapter — In-memory storage for SSR and testing.
 *
 * Used during server-side rendering (Next.js) where
 * localStorage and cookies are unavailable.
 * Data is lost when the process exits.
 */
import type { IStorageAdapter } from "./types";

export function createMemoryAdapter(): IStorageAdapter {
  const store = new Map<string, string>();

  return {
    get(key: string): string | null {
      return store.get(key) ?? null;
    },

    set(key: string, value: string): void {
      store.set(key, value);
    },

    remove(key: string): void {
      store.delete(key);
    },
  };
}
