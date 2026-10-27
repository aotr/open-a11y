import type { AccessibilityEngine, IAccessibilityConfig } from "@aotr/open-a11y";
import { mergeConfig } from "@aotr/open-a11y";

export interface DemoUiState {
  position: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  side: "left" | "right";
  offsetX: number;
  offsetY: number;
  blur: boolean;
  buttonSize: number;
  showButton: boolean;
  primary: string;
  primaryDark: string;
  accent: string;
  footerName: string;
  footerUrl: string;
  footerText: string;
  menuTitle: string;
  language: "en" | "hi";
}

export const DEFAULT_DEMO_STATE: DemoUiState = {
  position: "bottom-right",
  side: "right",
  offsetX: 20,
  offsetY: 20,
  blur: true,
  buttonSize: 56,
  showButton: true,
  primary: "#1f4bd8",
  primaryDark: "#1739a8",
  accent: "#b23a25",
  footerName: "open-a11y demo",
  footerUrl: "https://github.com/aotr/open-a11y",
  footerText: "Accessibility tools by open-a11y",
  menuTitle: "Accessibility options",
  language: "en",
};

export function toDemoConfig(state: DemoUiState): IAccessibilityConfig {
  return mergeConfig({
    position: state.position,
    side: state.side,
    offset: [state.offsetX, state.offsetY],
    blur: state.blur,
    buttonSize: state.buttonSize,
    showButton: state.showButton,
    labels: {
      "widget.menuTitle": state.menuTitle,
    },
    brand: {
      name: state.footerName,
      url: state.footerUrl,
      footerText: state.footerText,
      primary: state.primary,
      primaryDark: state.primaryDark,
      accent: state.accent,
    },
  });
}

export function createDemoCustomizer(
  container: HTMLElement,
  initial: DemoUiState,
  onChange: (state: DemoUiState, key: keyof DemoUiState) => void,
): DemoUiState {
  const state = { ...initial };
  container.innerHTML = `
    <section class="demo-customizer" aria-labelledby="customizer-title">
      <div class="demo-customizer__head">
        <div>
          <p class="demo-kicker">Live configuration</p>
          <h2 id="customizer-title">Make the widget yours</h2>
        </div>
        <button class="demo-reset" type="button" data-action="reset">Reset controls</button>
      </div>
      <div class="demo-customizer__grid">
        <label>Position
          <select data-field="position">
            <option value="bottom-right">Bottom right</option>
            <option value="bottom-left">Bottom left</option>
            <option value="top-right">Top right</option>
            <option value="top-left">Top left</option>
          </select>
        </label>
        <label>Panel side
          <select data-field="side">
            <option value="right">Right</option>
            <option value="left">Left</option>
          </select>
        </label>
        <label>Language
          <select data-field="language">
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </label>
        <label>Button size <output data-output="buttonSize">${state.buttonSize}px</output>
          <input data-field="buttonSize" type="range" min="40" max="72" step="1" value="${state.buttonSize}" />
        </label>
        <label>Offset X <output data-output="offsetX">${state.offsetX}px</output>
          <input data-field="offsetX" type="range" min="8" max="48" step="1" value="${state.offsetX}" />
        </label>
        <label>Offset Y <output data-output="offsetY">${state.offsetY}px</output>
          <input data-field="offsetY" type="range" min="8" max="48" step="1" value="${state.offsetY}" />
        </label>
        <label>Primary color
          <input data-field="primary" type="color" value="${state.primary}" />
        </label>
        <label>Accent color
          <input data-field="accent" type="color" value="${state.accent}" />
        </label>
        <label class="demo-check"><input data-field="blur" type="checkbox" ${state.blur ? "checked" : ""}/> Backdrop blur</label>
        <label class="demo-check"><input data-field="showButton" type="checkbox" ${state.showButton ? "checked" : ""}/> Show floating button</label>
        <label class="demo-wide">Menu title
          <input data-field="menuTitle" type="text" value="${state.menuTitle}" />
        </label>
        <label class="demo-wide">Footer name
          <input data-field="footerName" type="text" value="${state.footerName}" />
        </label>
        <label class="demo-wide">Footer link
          <input data-field="footerUrl" type="url" value="${state.footerUrl}" />
        </label>
        <label class="demo-wide">Footer text
          <input data-field="footerText" type="text" value="${state.footerText}" />
        </label>
      </div>
    </section>
  `;

  const field = <T extends HTMLElement>(name: string) =>
    container.querySelector<T>(`[data-field="${name}"]`)!;
  const output = (name: string) =>
    container.querySelector<HTMLOutputElement>(`[data-output="${name}"]`);

  const sync = (key: keyof DemoUiState) => {
    const el = field(key);
    if (el instanceof HTMLInputElement) {
      state[key] = (
        el.type === "checkbox" ? el.checked : el.type === "range" ? Number(el.value) : el.value
      ) as never;
    } else if (el instanceof HTMLSelectElement) {
      state[key] = el.value as never;
    }
    output(key)?.replaceChildren(String(state[key]));
    onChange({ ...state }, key);
  };

  container.querySelectorAll<HTMLElement>("[data-field]").forEach((el) => {
    el.addEventListener("input", () => sync(el.dataset["field"] as keyof DemoUiState));
    el.addEventListener("change", () => sync(el.dataset["field"] as keyof DemoUiState));
  });

  container
    .querySelector<HTMLButtonElement>('[data-action="reset"]')
    ?.addEventListener("click", () => {
      Object.assign(state, initial);
      for (const [key, value] of Object.entries(state)) {
        const el = field(key);
        if (el instanceof HTMLInputElement) {
          if (el.type === "checkbox") el.checked = Boolean(value);
          else el.value = String(value);
        } else if (el instanceof HTMLSelectElement) {
          el.value = String(value);
        }
        output(key)?.replaceChildren(String(value));
      }
      onChange({ ...state }, "menuTitle");
    });

  // Set initial values after the markup is parsed.
  for (const [key, value] of Object.entries(state)) {
    const el = field(key);
    if (el instanceof HTMLInputElement) {
      if (el.type === "checkbox") el.checked = Boolean(value);
      else el.value = String(value);
    } else if (el instanceof HTMLSelectElement) {
      el.value = String(value);
    }
    output(key)?.replaceChildren(String(value));
  }

  return state;
}

export function mountStateInspector(
  container: HTMLElement,
  engine: AccessibilityEngine,
): () => void {
  const pre = document.createElement("pre");
  pre.className = "demo-state";
  container.replaceChildren(pre);
  const render = () => {
    pre.textContent = JSON.stringify(engine.settings, null, 2);
  };
  render();
  return engine.subscribe(render);
}
