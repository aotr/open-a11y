/**
 * Text Alignment — Align text to left, center, right, or justify.
 *
 * These are mutually exclusive options, handled like contrast filters.
 * Each alignment is a separate tool, but only one can be active at a time.
 */
import { upsertStylesheet, removeStylesheet } from "../../css/cssInjector";
import { generateCSSFromConfig } from "../../css/cssGenerator";
import type { IToolConfig } from "../../types";
import { TEXT_SELECTORS } from "../../css/selectors";

const TEXT_ALIGN_ID = "asw-text-align-style";
const TEXT_ALIGN_CLASS = "asw-text-align";

export type TextAlignKey =
  | "text-align-left"
  | "text-align-center"
  | "text-align-right"
  | "text-justify";

interface ITextAlignEntry extends IToolConfig {
  id: TextAlignKey;
}

export const TEXT_ALIGNMENTS: Record<TextAlignKey, ITextAlignEntry> = {
  "text-align-left": {
    id: "text-align-left",
    selector: "html",
    childrenSelector: TEXT_SELECTORS,
    styles: {
      "text-align": "left",
    },
  },
  "text-align-center": {
    id: "text-align-center",
    selector: "html",
    childrenSelector: TEXT_SELECTORS,
    styles: {
      "text-align": "center",
    },
  },
  "text-align-right": {
    id: "text-align-right",
    selector: "html",
    childrenSelector: TEXT_SELECTORS,
    styles: {
      "text-align": "right",
    },
  },
  "text-justify": {
    id: "text-justify",
    selector: "html",
    childrenSelector: TEXT_SELECTORS,
    styles: {
      "text-align": "justify",
    },
  },
};

/**
 * Apply a text alignment preset.
 * @param key - One of the TEXT_ALIGNMENTS keys, or false/undefined to clear.
 */
export function enableTextAlignment(key: TextAlignKey | false | undefined): void {
  if (typeof document === "undefined") return;

  if (!key || !TEXT_ALIGNMENTS[key]) {
    removeStylesheet(TEXT_ALIGN_ID);
    document.documentElement.classList.remove(TEXT_ALIGN_CLASS);
    return;
  }

  const align = TEXT_ALIGNMENTS[key];

  const css = generateCSSFromConfig({
    ...align,
    selector: `html.${TEXT_ALIGN_CLASS}`,
  });

  upsertStylesheet(TEXT_ALIGN_ID, css);
  document.documentElement.classList.add(TEXT_ALIGN_CLASS);
}
