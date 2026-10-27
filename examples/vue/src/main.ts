import { createApp } from "vue";
import "../../shared/demo.css";
import App from "./App.vue";
import { createAccessibilityPlugin } from "@aotr/open-a11y/vue";
import { AccessibilityEngine, localStorageAdapter } from "@aotr/open-a11y";

const engine = new AccessibilityEngine({ storage: localStorageAdapter });

createApp(App).use(createAccessibilityPlugin(engine)).mount("#app");
