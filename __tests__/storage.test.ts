/**
 * Unit tests for storage adapters.
 */
import { describe, it, expect } from "vite-plus/test";
import { createMemoryAdapter } from "../src/storage/memoryAdapter";

describe("MemoryAdapter", () => {
  it("should store and retrieve values", () => {
    const adapter = createMemoryAdapter();
    void adapter.set("key", "value");
    expect(adapter.get("key")).toBe("value");
  });

  it("should return null for missing keys", () => {
    const adapter = createMemoryAdapter();
    expect(adapter.get("nonexistent")).toBeNull();
  });

  it("should remove values", () => {
    const adapter = createMemoryAdapter();
    void adapter.set("key", "value");
    void adapter.remove("key");
    expect(adapter.get("key")).toBeNull();
  });

  it("should overwrite values", () => {
    const adapter = createMemoryAdapter();
    void adapter.set("key", "old");
    void adapter.set("key", "new");
    expect(adapter.get("key")).toBe("new");
  });
});
