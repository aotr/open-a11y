/**
 * Configuration precedence tests — the engine resolves once and adapters
 * consume the same snapshot.
 */
import { afterEach, describe, expect, it } from "vite-plus/test";
import { AccessibilityEngine } from "../src/engine/AccessibilityEngine";
import { createMemoryAdapter } from "../src/storage";
import { createAccessibilityUI } from "../src/ui/wire-up";
import { mergeConfig } from "../src/config/accessibility.config";

afterEach(() => {
  document.querySelectorAll("asw-widget, asw-menu").forEach((el) => el.remove());
  document.body.style.overflow = "";
});

function createEngine(config: ConstructorParameters<typeof AccessibilityEngine>[0]["config"]) {
  return new AccessibilityEngine({ storage: createMemoryAdapter(), config });
}

describe("mergeConfig", () => {
  it("preserves the base position unless an explicit side or position changes it", () => {
    const base = mergeConfig({ position: "top-left" });
    expect(mergeConfig(undefined, base).position).toBe("top-left");
    expect(mergeConfig({ side: "left" }, base).position).toBe("bottom-left");
  });

  it("merges nested brand, label, and feature overrides over a base", () => {
    const base = mergeConfig({ brand: { name: "Base", primary: "#111111" } });
    const merged = mergeConfig(
      {
        brand: { primary: "#222222" },
        labels: { "widget.menuTitle": "Options" },
        features: { tools: { invert: false } },
      },
      base,
    );

    expect(merged.brand.name).toBe("Base");
    expect(merged.brand.primary).toBe("#222222");
    expect(merged.labels["widget.menuTitle"]).toBe("Options");
    expect(merged.features.tools?.invert).toBe(false);
  });
});

describe("Engine configuration", () => {
  it("resolves defaults once and exposes them", () => {
    const engine = createEngine({ enabled: false, position: "top-left" });
    expect(engine.config.enabled).toBe(false);
    expect(engine.config.position).toBe("top-left");
    expect(engine.config.brand.primary).toBeTruthy();
  });

  it("lets direct engine options override the config object", () => {
    const engine = new AccessibilityEngine({
      storage: createMemoryAdapter(),
      lang: "hi",
      position: "top-right",
      offset: [12, 34],
      config: { lang: "en", position: "bottom-left", offset: [1, 2] },
    });

    expect(engine.config.lang).toBe("hi");
    expect(engine.config.position).toBe("top-right");
    expect(engine.config.offset).toEqual([12, 34]);
  });
});

describe("UI configuration consumption", () => {
  it("reads engine brand, position, labels, and language", () => {
    const engine = createEngine({
      position: "top-left",
      offset: [14, 18],
      defaultLanguage: "hi",
      brand: { name: "Acme" },
      labels: { "widget.menuTitle": "Options" },
    });
    const ui = createAccessibilityUI(engine);

    expect(ui.widget.getAttribute("position")).toBe("top-left");
    expect(ui.widget.getAttribute("offset-x")).toBe("14");
    expect(ui.menu.getAttribute("lang")).toBe("hi");
    expect(ui.menu.shadowRoot!.querySelector(".asw-menu-title")!.textContent).toBe("Options");
    expect(ui.menu.shadowRoot!.querySelector(".asw-footer")!.textContent).toBe(
      "Accessibility by Acme",
    );
    expect(ui.widget.getAttribute("button-size")).toBe("56");
    expect(ui.widget.getAttribute("button-size-mobile")).toBe("44");

    ui.destroy();
  });

  it("applies custom desktop/mobile button sizes and brand colors", () => {
    const engine = createEngine({
      buttonSize: 64,
      buttonSizeMobile: 40,
      brand: { primary: "#7c3aed", accent: "#f59e0b" },
    });
    const ui = createAccessibilityUI(engine);

    expect(ui.widget.getAttribute("button-size")).toBe("64");
    expect(ui.widget.getAttribute("button-size-mobile")).toBe("40");
    expect(ui.widget.style.getPropertyValue("--asw-brand-primary")).toBe("#7c3aed");
    expect(ui.widget.style.getPropertyValue("--asw-brand-accent")).toBe("#f59e0b");

    ui.destroy();
  });

  it("lets explicit UI options override the engine config", () => {
    const engine = createEngine({ position: "top-left", offset: [14, 18] });
    const ui = createAccessibilityUI(engine, { position: "bottom-left", offsetX: 4, offsetY: 6 });

    expect(ui.widget.getAttribute("position")).toBe("bottom-left");
    expect(ui.widget.getAttribute("offset-x")).toBe("4");
    expect(ui.widget.getAttribute("offset-y")).toBe("6");

    ui.destroy();
  });

  it("does not mount when the resolved engine config is disabled", () => {
    const engine = createEngine({ enabled: false });
    const ui = createAccessibilityUI(engine);

    expect(document.querySelector("asw-widget")).toBeNull();
    expect(document.querySelector("asw-menu")).toBeNull();
    ui.destroy();
  });
});
