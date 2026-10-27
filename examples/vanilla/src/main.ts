import "../../shared/demo.css";
import {
  AccessibilityEngine,
  createAccessibilityUI,
  localStorageAdapter,
  type AccessibilityUIController,
} from "@aotr/open-a11y";
import {
  DEFAULT_DEMO_STATE,
  createDemoCustomizer,
  mountStateInspector,
  toDemoConfig,
  type DemoUiState,
} from "../../shared/customizer";

const engine = new AccessibilityEngine({ storage: localStorageAdapter });
await engine.init();

let controller: AccessibilityUIController | null = null;

function mountWidget(state: DemoUiState): void {
  controller?.destroy();
  controller = createAccessibilityUI(engine, { config: toDemoConfig(state) });
}

const customizer = document.getElementById("customizer")!;
const statePanel = document.getElementById("state")!;
mountStateInspector(statePanel, engine);

const state = createDemoCustomizer(customizer, DEFAULT_DEMO_STATE, (next, key) => {
  if (key === "language") {
    void engine.setLanguage(next.language);
    return;
  }
  mountWidget(next);
});

void engine.setLanguage(state.language);
mountWidget(state);
