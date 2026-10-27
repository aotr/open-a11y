import { AccessibilityEngine, localStorageAdapter } from "@aotr/open-a11y";

export const engine = new AccessibilityEngine({ storage: localStorageAdapter });
