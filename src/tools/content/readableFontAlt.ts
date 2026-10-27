/**
 * Readable Font Alt (Lexend) — Loads Lexend font and applies it.
 *
 * Lexend is a variable font designed for reading efficiency,
 * proven to improve reading speed and comprehension for dyslexic
 * and struggling readers.
 */
import { injectToolCSS } from "../../css/cssInjector";
import type { IToolConfig } from "../../types";
import { ALL_ELEMENT_SELECTORS, TEXT_SELECTORS } from "../../css/selectors";

const readableFontAltConfig: IToolConfig = {
  id: "readable-font-alt",
  selector: "html",
  childrenSelector: [...ALL_ELEMENT_SELECTORS, ...TEXT_SELECTORS],
  styles: {
    "font-family": "Lexend, Tahoma, Arial, Helvetica, sans-serif",
  },
  css: `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap');`,
};

export default function readableFontAlt(enable = false): void {
  injectToolCSS({ ...readableFontAltConfig, enable });
}
