/**
 * Manifest integrity tests — the manifest is the public contract for tools,
 * config defaults, the web menu, and the React adapter.
 */
import { describe, it, expect } from "vite-plus/test";
import {
  BOOLEAN_TOOLS,
  CONTINUOUS_TOOLS,
  EXCLUSIVE_GROUPS,
  EXCLUSIVE_TOOLS,
  TOOLS,
  TOOL_CATEGORIES,
  getTool,
  isExclusiveTool,
  toolsByCategory,
} from "../src/tools/manifest";
import { DEFAULT_ACCESSIBILITY_CONFIG, mergeConfig } from "../src/config/accessibility.config";
import { PROFILES } from "../src/profiles";
import { translate } from "../src/i18n/translator";
import { LUCIDE_ICONS } from "../src/ui/icons/lucide";
import { AccessibilityEngine } from "../src/engine/AccessibilityEngine";
import { createMemoryAdapter } from "../src/storage";
import { AswMenu } from "../src/ui/components/asw-menu";

describe("Tool manifest", () => {
  it("has unique tool IDs", () => {
    const ids = TOOLS.map((tool) => tool.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every category", () => {
    for (const category of TOOL_CATEGORIES) {
      expect(toolsByCategory(category.id).length).toBeGreaterThan(0);
    }
  });

  it("gives every tool a translated label and a real Lucide icon", () => {
    for (const tool of TOOLS) {
      expect(translate(tool.labelKey, "en")).not.toBe(tool.labelKey);
      expect(LUCIDE_ICONS[tool.icon], `missing icon: ${tool.icon}`).toBeDefined();
    }
  });

  it("has valid continuous ranges and unique state keys", () => {
    const keys = CONTINUOUS_TOOLS.map((tool) => tool.stateKey);
    expect(new Set(keys).size).toBe(keys.length);

    for (const tool of CONTINUOUS_TOOLS) {
      expect(tool.min).toBeLessThan(tool.max);
      expect(tool.defaultValue).toBeGreaterThanOrEqual(tool.min);
      expect(tool.defaultValue).toBeLessThanOrEqual(tool.max);
      expect(tool.step).toBeGreaterThan(0);
      expect(tool.format(tool.defaultValue)).toBeTruthy();
    }
  });

  it("wires every exclusive tool to a group with an apply function", () => {
    for (const tool of EXCLUSIVE_TOOLS) {
      const group = EXCLUSIVE_GROUPS[tool.group.id];
      expect(group).toBeDefined();
      expect(group.stateKey).toBe(tool.group.stateKey);
      expect(typeof group.apply).toBe("function");
    }
  });

  it("has boolean executors for all boolean tools", () => {
    for (const tool of BOOLEAN_TOOLS) {
      expect(typeof tool.executor).toBe("function");
    }
  });
});

describe("Config defaults derived from the manifest", () => {
  it("shows every tool and profile by default", () => {
    for (const tool of TOOLS) {
      expect(DEFAULT_ACCESSIBILITY_CONFIG.features.tools?.[tool.id]).toBe(true);
    }
    for (const id of Object.keys(PROFILES)) {
      expect(DEFAULT_ACCESSIBILITY_CONFIG.features.profiles?.[id]).toBe(true);
    }
  });

  it("lets callers opt individual tools out without dropping the rest", () => {
    const merged = mergeConfig({ features: { tools: { invert: false } } });
    expect(merged.features.tools?.invert).toBe(false);
    expect(merged.features.tools?.["high-contrast"]).toBe(true);
  });

  it("merges UI label overrides and brand footer copy", () => {
    const merged = mergeConfig({
      labels: { "widget.menuTitle": "My accessibility options" },
      brand: { footerText: "Accessibility by Acme", url: "https://acme.test" },
    });
    expect(merged.labels["widget.menuTitle"]).toBe("My accessibility options");
    expect(merged.brand.footerText).toBe("Accessibility by Acme");
    expect(merged.brand.primary).toBe(DEFAULT_ACCESSIBILITY_CONFIG.brand.primary);
  });
});

describe("Menu branding and labels", () => {
  it("renders label overrides and a linked footer", () => {
    const menu = new AswMenu();
    menu.setLabels({ "widget.menuTitle": "My accessibility options" });
    menu.setBrand({ footerText: "Accessibility by Acme", url: "https://acme.test" });
    document.body.appendChild(menu);

    expect(menu.shadowRoot!.querySelector(".asw-menu-title")!.textContent).toBe(
      "My accessibility options",
    );
    const footer = menu.shadowRoot!.querySelector(".asw-footer") as HTMLElement;
    expect(footer.hidden).toBe(false);
    expect(footer.textContent).toBe("Accessibility by Acme");
    expect(footer.querySelector("a")!.getAttribute("href")).toBe("https://acme.test");

    menu.remove();
  });

  it("hides the footer when no footer text or brand name is configured", () => {
    const menu = new AswMenu();
    document.body.appendChild(menu);
    const footer = menu.shadowRoot!.querySelector(".asw-footer") as HTMLElement;
    expect(footer.hidden).toBe(true);

    menu.setBrand({ name: "Acme" });
    expect(footer.hidden).toBe(false);
    expect(footer.textContent).toBe("Accessibility by Acme");

    menu.setBrand({ name: "Acme", footerText: "" });
    expect(footer.hidden).toBe(true);

    menu.remove();
  });
});

describe("Profile presets", () => {
  it("uses canonical control keys and numeric values", () => {
    for (const profile of Object.values(PROFILES)) {
      if ("lineHeight" in profile.states) {
        expect(typeof profile.states.lineHeight).toBe("number");
      }
      if ("letterSpacing" in profile.states) {
        expect(typeof profile.states.letterSpacing).toBe("number");
      }
    }
  });

  it("references known boolean tools, control keys, or exclusive group keys", () => {
    const controlKeys = new Set(CONTINUOUS_TOOLS.map((tool) => tool.stateKey));
    const groupKeys = new Set(Object.values(EXCLUSIVE_GROUPS).map((group) => group.stateKey));
    for (const profile of Object.values(PROFILES)) {
      for (const key of Object.keys(profile.states)) {
        const tool = getTool(key);
        expect(
          (tool !== undefined && !isExclusiveTool(tool)) ||
            controlKeys.has(key as never) ||
            groupKeys.has(key as never),
          `unknown profile state: ${profile.id}.${key}`,
        ).toBe(true);
      }
    }
  });

  it("never stores exclusive tools under their own IDs", () => {
    for (const profile of Object.values(PROFILES)) {
      for (const tool of EXCLUSIVE_TOOLS) {
        expect(profile.states[tool.id], `${profile.id}.${tool.id}`).toBeUndefined();
      }
    }
  });
});

describe("Engine manifest integration", () => {
  it("applies a profile as a complete preset including control defaults", () => {
    const engine = new AccessibilityEngine({ storage: createMemoryAdapter() });
    engine.setFontScale(2);
    engine.toggleTool("invert", true);

    engine.applyProfile("seizure-safe");

    expect(engine.settings.states?.fontSize).toBe(1);
    expect(engine.settings.states?.invert).toBe(false);
    expect(engine.settings.states?.["stop-animations"]).toBe(true);
    expect(engine.settings.states?.activeProfile).toBe("seizure-safe");
  });

  it("clears the active profile when a tool is changed manually", () => {
    const engine = new AccessibilityEngine({ storage: createMemoryAdapter() });
    engine.applyProfile("vision-impaired");
    expect(engine.settings.states?.activeProfile).toBe("vision-impaired");

    engine.toggleTool("big-cursor", false);
    expect(engine.settings.states?.activeProfile).toBeNull();
  });

  it("keeps exclusive groups mutually exclusive under the group key", () => {
    const engine = new AccessibilityEngine({ storage: createMemoryAdapter() });
    engine.toggleTool("high-contrast", true);
    expect(engine.settings.states?.contrast).toBe("high-contrast");

    engine.toggleTool("dark-contrast", true);
    expect(engine.settings.states?.["high-contrast"]).toBeUndefined();
    expect(engine.settings.states?.["dark-contrast"]).toBeUndefined();
    expect(engine.settings.states?.contrast).toBe("dark-contrast");
  });

  it("applies the high-contrast effect from the vision-impaired profile", () => {
    const engine = new AccessibilityEngine({ storage: createMemoryAdapter() });
    engine.applyProfile("vision-impaired");

    expect(engine.settings.states?.contrast).toBe("high-contrast");
    expect(document.documentElement.classList.contains("asw-filter")).toBe(true);
    expect(document.getElementById("asw-filter-style")?.textContent).toContain("contrast(125%)");

    engine.reset();
    expect(document.documentElement.classList.contains("asw-filter")).toBe(false);
  });

  it("migrates legacy exclusive tool-ID state when hydrating", async () => {
    const storage = createMemoryAdapter();
    void storage.set(
      "asw-user-settings",
      JSON.stringify({
        states: { "high-contrast": true },
      }),
    );
    const engine = new AccessibilityEngine({ storage });
    await engine.init();

    expect(engine.settings.states?.contrast).toBe("high-contrast");
    expect(engine.settings.states?.["high-contrast"]).toBeUndefined();
  });
});
