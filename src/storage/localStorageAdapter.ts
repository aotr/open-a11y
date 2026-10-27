/**
 * localStorageAdapter — Browser-native persistence via localStorage.
 *
 * Synchronous, immediate, works offline.
 * Used as the default adapter in browser environments.
 */
import type { IStorageAdapter } from "./types";

export const localStorageAdapter: IStorageAdapter = {
  get(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      // localStorage may be unavailable (private browsing, quota exceeded)
      return null;
    }
  },

  set(key: string, value: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Silently fail — preferences are ephemeral in this case
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Silently fail
    }
  },
};
