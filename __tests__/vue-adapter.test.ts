/**
 * Vue adapter integration tests.
 */
import { afterEach, describe, expect, it } from "vite-plus/test";
import { defineComponent, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { AccessibilityEngine } from "../src/engine/AccessibilityEngine";
import { createMemoryAdapter } from "../src/storage/memoryAdapter";
import {
  A11yWidget,
  createAccessibilityPlugin,
  useAccessibility,
  type AccessibilityVueContext,
} from "../src/vue";
import { destroyActiveAccessibilityUI } from "../src/ui/lifecycle";

afterEach(() => {
  destroyActiveAccessibilityUI();
  document.querySelectorAll("asw-widget, asw-menu").forEach((el) => el.remove());
  document.body.style.overflow = "";
});

function createTestEngine() {
  return new AccessibilityEngine({ storage: createMemoryAdapter() });
}

function contextFixture() {
  let context: AccessibilityVueContext | null = null;
  const Component = defineComponent({
    setup() {
      context = useAccessibility();
      return () => null;
    },
  });
  return { Component, getContext: () => context! };
}

describe("Vue adapter", () => {
  it("provides the engine context and reactive settings", async () => {
    const engine = createTestEngine();
    const { Component, getContext } = contextFixture();
    const wrapper = mount(Component, {
      global: { plugins: [createAccessibilityPlugin(engine)] },
    });

    expect(getContext().engine).toBe(engine);
    expect(getContext().settings.value.lang).toBe("en");

    getContext().toggleTool("font-weight", true);
    await nextTick();
    expect(getContext().settings.value.states?.["font-weight"]).toBe(true);

    wrapper.unmount();
  });

  it("throws when the composable is used without the plugin", () => {
    const { Component } = contextFixture();
    expect(() => mount(Component)).toThrow(
      "useAccessibility() must be used after app.use(createAccessibilityPlugin(engine))",
    );
  });

  it("mounts and destroys the widget through A11yWidget", async () => {
    const engine = createTestEngine();
    const App = defineComponent({
      components: { A11yWidget },
      template: "<A11yWidget />",
    });
    const wrapper = mount(App, {
      global: { plugins: [createAccessibilityPlugin(engine)] },
    });

    await nextTick();
    expect(document.querySelectorAll("asw-widget")).toHaveLength(1);

    wrapper.unmount();
    expect(document.querySelectorAll("asw-widget")).toHaveLength(0);
  });

  it("can auto-mount from the plugin and tears down on unmount", () => {
    const engine = createTestEngine();
    const { Component } = contextFixture();
    const wrapper = mount(Component, {
      global: {
        plugins: [
          createAccessibilityPlugin(engine, {
            showWidgetOnMount: true,
            widgetOptions: { position: "top-left", config: { buttonSize: 48 } },
          }),
        ],
      },
    });

    const widget = document.querySelector("asw-widget");
    expect(widget?.getAttribute("position")).toBe("top-left");
    expect(widget?.getAttribute("button-size")).toBe("48");

    wrapper.unmount();
    expect(document.querySelectorAll("asw-widget")).toHaveLength(0);
  });

  it("exposes profile and reset actions", async () => {
    const engine = createTestEngine();
    const { Component, getContext } = contextFixture();
    const wrapper = mount(Component, {
      global: { plugins: [createAccessibilityPlugin(engine)] },
    });

    getContext().applyProfile("vision-impaired");
    await nextTick();
    expect(getContext().states.value.contrast).toBe("high-contrast");
    expect(getContext().states.value.activeProfile).toBe("vision-impaired");

    getContext().reset();
    await nextTick();
    expect(getContext().states.value).toEqual({});

    wrapper.unmount();
  });
});
