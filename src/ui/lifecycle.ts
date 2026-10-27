/**
 * One process-wide owner for the mounted widget session.
 *
 * Adapters call createAccessibilityUI; that module registers its controller
 * here. Destroying a session is explicit, idempotent, and safe when a newer
 * session has already replaced it.
 */
export interface AccessibilityUIController {
  widget: HTMLElement;
  menu: HTMLElement;
  destroy: () => void;
}

let activeController: AccessibilityUIController | null = null;

/** The currently mounted UI session, if any. */
export function getActiveAccessibilityUI(): AccessibilityUIController | null {
  return activeController;
}

/** Replace the active session, tearing down the previous one first. */
export function setActiveAccessibilityUI(controller: AccessibilityUIController): void {
  const previous = activeController;
  activeController = controller;
  previous?.destroy();
}

/** Clear the active slot only when it still belongs to this controller. */
export function clearActiveAccessibilityUI(controller: AccessibilityUIController): void {
  if (activeController === controller) activeController = null;
}

/** Tear down the active session without holding a stale controller reference. */
export function destroyActiveAccessibilityUI(): void {
  activeController?.destroy();
}
