/**
 * Widget lifecycle tests — one owner for mount/open state and side effects.
 */
import { afterEach, describe, expect, it } from "vite-plus/test";
import { AccessibilityEngine } from "../src/engine/AccessibilityEngine";
import { createMemoryAdapter } from "../src/storage";
import { createAccessibilityUI } from "../src/ui/wire-up";
import { destroyActiveAccessibilityUI, getActiveAccessibilityUI } from "../src/ui/lifecycle";
import type { AswMenu } from "../src/ui/components/asw-menu";
import type { AswWidget } from "../src/ui/components/asw-widget";

afterEach(() => {
  destroyActiveAccessibilityUI();
  document.querySelectorAll("asw-widget, asw-menu").forEach((el) => el.remove());
  document.body.style.overflow = "";
});

function mount() {
  const engine = new AccessibilityEngine({
    storage: createMemoryAdapter(),
    config: { enabled: true },
  });
  const ui = createAccessibilityUI(engine);
  return { engine, ui, menu: ui.menu as AswMenu, widget: ui.widget as AswWidget };
}

describe("Widget lifecycle", () => {
  it("drives scroll lock, ARIA, and button visibility from the menu open state", () => {
    const { menu, widget } = mount();

    menu.setAttribute("open", "true");

    expect(menu.isOpen).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    expect(widget.style.visibility).toBe("hidden");
    expect(widget.getAttribute("aria-expanded")).toBe("true");

    menu.removeAttribute("open");

    expect(menu.isOpen).toBe(false);
    expect(document.body.style.overflow).toBe("");
    expect(widget.style.visibility).toBe("");
    expect(widget.getAttribute("aria-expanded")).toBe("false");
  });

  it("has one active mount and replacing it does not leave a stale controller", () => {
    const first = mount();
    const second = mount();

    expect(document.querySelectorAll("asw-widget")).toHaveLength(1);
    expect(document.querySelectorAll("asw-menu")).toHaveLength(1);
    expect(getActiveAccessibilityUI()?.menu).toBe(second.ui.menu);

    first.ui.destroy();
    expect(second.ui.widget.isConnected).toBe(true);

    destroyActiveAccessibilityUI();
    expect(document.querySelector("asw-widget")).toBeNull();
  });

  it("cleans up window helpers and scroll lock on destroy", () => {
    const { menu, ui } = mount();
    menu.setAttribute("open", "true");

    ui.destroy();

    expect(document.body.style.overflow).toBe("");
    expect((window as unknown as Record<string, unknown>).__aswToggle).toBeUndefined();
  });
});
