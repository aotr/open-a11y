/**
 * State transaction tests — one write, one notification, one persistence call.
 */
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { AccessibilityEngine } from "../src/engine/AccessibilityEngine";
import { StateManager } from "../src/state/StateManager";
import type { IStorageAdapter } from "../src/storage/types";

afterEach(() => {
  document.querySelectorAll('style[data-asw], style[id^="asw-"]').forEach((el) => el.remove());
  document.documentElement.className = "";
});

function countingStorage() {
  const set = vi.fn();
  const storage: IStorageAdapter = {
    get: () => null,
    set,
    remove: () => {},
  };
  return { storage, set };
}

describe("Engine state transactions", () => {
  it("notifies and persists once for a tool change, profile, and reset", () => {
    const { storage, set } = countingStorage();
    const engine = new AccessibilityEngine({ storage });
    const listener = vi.fn();
    engine.subscribe(listener);

    engine.toggleTool("font-weight", true);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledTimes(1);

    engine.applyProfile("vision-impaired");
    expect(listener).toHaveBeenCalledTimes(2);
    expect(set).toHaveBeenCalledTimes(2);

    engine.reset();
    expect(listener).toHaveBeenCalledTimes(3);
    expect(set).toHaveBeenCalledTimes(3);
    expect(engine.settings.states).toEqual({});
  });

  it("clears an active profile in the same write as the tool change", () => {
    const { storage, set } = countingStorage();
    const engine = new AccessibilityEngine({ storage });
    engine.applyProfile("vision-impaired");
    set.mockClear();

    engine.toggleTool("big-cursor", false);

    expect(set).toHaveBeenCalledTimes(1);
    expect(engine.settings.states?.activeProfile).toBeNull();
    expect(engine.settings.states?.["big-cursor"]).toBe(false);
  });

  it("only deactivates the profile that is actually active", () => {
    const { storage } = countingStorage();
    const engine = new AccessibilityEngine({ storage });
    engine.applyProfile("vision-impaired");
    const listener = vi.fn();
    engine.subscribe(listener);

    engine.deactivateProfile("seizure-safe");
    expect(listener).not.toHaveBeenCalled();
    expect(engine.settings.states?.activeProfile).toBe("vision-impaired");

    engine.deactivateProfile("vision-impaired");
    expect(listener).toHaveBeenCalledTimes(1);
    expect(engine.settings.states?.activeProfile).toBeNull();
  });
});

describe("State persistence", () => {
  it("surfaces async storage errors through the callback", async () => {
    const onPersistenceError = vi.fn();
    const storage: IStorageAdapter = {
      get: () => null,
      set: () => Promise.reject(new Error("storage unavailable")),
      remove: () => {},
    };
    const manager = new StateManager(storage, undefined, { onPersistenceError });

    manager.setTool("font-weight", true);
    await manager.flushPersistence();

    expect(onPersistenceError).toHaveBeenCalledTimes(1);
  });
});
