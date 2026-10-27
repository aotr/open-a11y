/**
 * Reading Ruler — A horizontal line that follows the cursor.
 *
 * Similar to reading guide but shows a single ruler line
 * instead of opaque masking bars. Good for ADHD users.
 */
const RULER_CLASS = "asw-reading-ruler";

let onMouseMove: ((e: MouseEvent) => void) | null = null;

export default function readingRuler(enable = false): void {
  if (typeof document === "undefined") return;

  let ruler = document.querySelector(`.${RULER_CLASS}`) as HTMLElement | null;

  if (enable) {
    if (!ruler) {
      ruler = document.createElement("div");
      ruler.classList.add(RULER_CLASS);
      Object.assign(ruler.style, {
        position: "fixed",
        left: "0",
        right: "0",
        width: "100%",
        height: "3px",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        zIndex: "999999",
        pointerEvents: "none",
        transition: "top 0.05s ease-out",
      });
      document.body.appendChild(ruler);

      onMouseMove = (e: MouseEvent) => {
        ruler!.style.top = `${e.clientY}px`;
      };

      document.addEventListener("mousemove", onMouseMove, { passive: true });
    }
  } else {
    ruler?.remove();
    if (onMouseMove) {
      document.removeEventListener("mousemove", onMouseMove);
      onMouseMove = null;
    }
  }
}
