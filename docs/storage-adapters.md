# 💾 Storage Adapters — Persistence Layer

> `src/storage/`

Storage adapters abstract the persistence layer so the accessibility widget works across environments — browser `localStorage`, in-memory (for SSR/testing), or custom backends.

---

## 🔌 Adapter Interface

```ts
// src/storage/types.ts
export interface IStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
```

Any object implementing these three methods can serve as a storage backend.

---

## 💿 localStorage Adapter (`localStorageAdapter.ts`)

The default adapter for browser environments.

```ts
// src/storage/localStorageAdapter.ts
export const localStorageAdapter: IStorageAdapter = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn("Failed to save accessibility settings:", err);
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently ignore
    }
  },
};
```

**Error handling:**

- **`getItem()`**: Returns `null` on error (private browsing blocks localStorage in some browsers)
- **`setItem()`**: Logs a warning on error — doesn't crash the app
- **`removeItem()`**: Silently ignores errors

**Storage key:** `'asw-user-settings'` (defined in `StateManager`)

---

## 🧠 Memory Adapter (`memoryAdapter.ts`)

An in-memory adapter for SSR, testing, and environments without `localStorage`.

```ts
// src/storage/memoryAdapter.ts
export function createMemoryAdapter(): IStorageAdapter {
  const store: Record<string, string> = {};

  return {
    getItem(key: string): string | null {
      return store[key] ?? null;
    },
    setItem(key: string, value: string): void {
      store[key] = value;
    },
    removeItem(key: string): void {
      delete store[key];
    },
  };
}
```

**Factory pattern:** `createMemoryAdapter()` returns a **new instance** every time — each call gets its own isolated store. This prevents test pollution.

**Use cases:**

- **SSR (Server-Side Rendering):** Next.js server-side has no `localStorage`
- **Testing:** Vitest/Jest tests need isolated storage
- **Demo/preview:** Don't persist to user's real localStorage

---

## 🔄 Data Flow

```
StateManager.persist()
  → adapter.setItem('asw-user-settings', JSON.stringify(settings))
    → localStorage.setItem(...)   or   store[key] = value

StateManager.hydrate()
  → adapter.getItem('asw-user-settings')
    → localStorage.getItem(...)   or   store[key]
  → JSON.parse(raw)
  → Merge with defaults
```

---

## 🧪 Testing Pattern

```ts
// In tests:
import { createMemoryAdapter } from "@aotr/open-a11y";

const storage = createMemoryAdapter();
const engine = new AccessibilityEngine({ storage });

// Engine uses in-memory storage — no localStorage pollution
await engine.init();
```

---

## 🔧 Custom Adapter Example

For server-side persistence (e.g., cookies, database):

```ts
const cookieAdapter: IStorageAdapter = {
  getItem(key: string): string | null {
    // Read from cookie
    const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  },
  setItem(key: string, value: string): void {
    // Write to cookie
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000`;
  },
  removeItem(key: string): void {
    document.cookie = `${key}=; path=/; max-age=0`;
  },
};

const engine = new AccessibilityEngine({ storage: cookieAdapter });
```

The adapter pattern makes the engine completely storage-agnostic.
