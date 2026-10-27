/**
 * Tool manifest — the single source of truth for every accessibility tool.
 *
 * Adding a tool means adding one entry here plus its executor. Config,
 * engine, menu, React adapter and tests all derive from this list.
 *
 * Kinds:
 *   boolean     — on/off tool stored under its own ID
 *   exclusive   — one-of-many tool; the active ID is stored under `group.stateKey`
 *   continuous  — numeric tool stored under `stateKey`
 */
import { adjustFontSize } from "./content/fontSize";
import { adjustLineHeight } from "./content/lineHeight";
import { adjustLetterSpacing } from "./content/letterSpacing";
import fontWeight from "./content/fontWeight";
import readableFont from "./content/readableFont";
import readableFontAlt from "./content/readableFontAlt";
import highlightLinks from "./content/highlightLinks";
import highlightTitles from "./content/highlightTitles";
import hideImages from "./content/hideImages";
import { enableTextAlignment } from "./content/textAlignment";
import { enableContrast } from "./color/contrast";
import invert from "./color/invert";
import stopAnimations from "./motion/stopAnimations";
import reducedMotion from "./motion/reducedMotion";
import bigCursor from "./navigation/bigCursor";
import visibleFocus from "./navigation/visibleFocus";
import readingGuide from "./readability/readingGuide";
import readingRuler from "./readability/readingRuler";
import readingMask from "./readability/readingMask";
import focusMode from "./readability/focusMode";
import screenReader from "./readability/screenReader";

export type ToolCategory = "content" | "color" | "text-align" | "tools";

interface BaseTool {
  /** Stable tool ID, also the state key for boolean tools */
  id: string;
  category: ToolCategory;
  /** Lucide icon ID */
  icon: string;
  /** Dot-notation i18n key for the label */
  labelKey: string;
  /** Dot-notation i18n key for the description */
  descKey?: string;
}

export interface BooleanTool extends BaseTool {
  kind: "boolean";
  executor: (enable: boolean) => void;
}

export interface ExclusiveTool extends BaseTool {
  kind: "exclusive";
  /** Exclusive group this tool belongs to */
  group: ExclusiveGroup;
}

export interface ContinuousTool extends BaseTool {
  kind: "continuous";
  stateKey: "fontSize" | "lineHeight" | "letterSpacing";
  apply: (value: number) => void;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  format: (value: number) => string;
}

export type Tool = BooleanTool | ExclusiveTool | ContinuousTool;

export interface ExclusiveGroup {
  id: "contrast" | "text-align";
  /** State key that stores the active tool ID (or false when none) */
  stateKey: "contrast" | "textAlign";
  apply: (id: string | false) => void;
}

export const EXCLUSIVE_GROUPS: Record<string, ExclusiveGroup> = {
  contrast: {
    id: "contrast",
    stateKey: "contrast",
    apply: (id) => enableContrast(id as Parameters<typeof enableContrast>[0]),
  },
  "text-align": {
    id: "text-align",
    stateKey: "textAlign",
    apply: (id) => enableTextAlignment(id as Parameters<typeof enableTextAlignment>[0]),
  },
};

const content = (tool: Omit<BaseTool, "category">): BaseTool => ({
  ...tool,
  category: "content",
});

export const TOOLS: Tool[] = [
  // ── Content ──────────────────────────────────────────────────────────
  {
    ...content({
      id: "font-size",
      icon: "font-size",
      labelKey: "tools.fontSize",
      descKey: "tools.fontSizeDesc",
    }),
    kind: "continuous",
    stateKey: "fontSize",
    apply: adjustFontSize,
    min: 0.1,
    max: 2,
    step: 0.1,
    defaultValue: 1,
    format: (value) => `${Math.round(value * 100)}%`,
  },
  {
    ...content({
      id: "line-height",
      icon: "line-height",
      labelKey: "tools.lineHeight",
      descKey: "tools.lineHeightDesc",
    }),
    kind: "continuous",
    stateKey: "lineHeight",
    apply: adjustLineHeight,
    min: 1,
    max: 3,
    step: 0.2,
    defaultValue: 1,
    format: (value) => `${value.toFixed(1)}x`,
  },
  {
    ...content({
      id: "letter-spacing",
      icon: "letter-spacing",
      labelKey: "tools.letterSpacing",
      descKey: "tools.letterSpacingDesc",
    }),
    kind: "continuous",
    stateKey: "letterSpacing",
    apply: adjustLetterSpacing,
    min: 0,
    max: 10,
    step: 1,
    defaultValue: 0,
    format: (value) => `${value}px`,
  },
  {
    ...content({
      id: "font-weight",
      icon: "font-weight",
      labelKey: "tools.fontWeight",
      descKey: "tools.fontWeightDesc",
    }),
    kind: "boolean",
    executor: fontWeight,
  },
  {
    ...content({
      id: "readable-font",
      icon: "readable-font",
      labelKey: "tools.readableFont",
      descKey: "tools.readableFontDesc",
    }),
    kind: "boolean",
    executor: readableFont,
  },
  {
    ...content({
      id: "readable-font-alt",
      icon: "readable-font-alt",
      labelKey: "tools.readableFontAlt",
      descKey: "tools.readableFontAltDesc",
    }),
    kind: "boolean",
    executor: readableFontAlt,
  },
  {
    ...content({
      id: "highlight-links",
      icon: "highlight-links",
      labelKey: "tools.highlightLinks",
      descKey: "tools.highlightLinksDesc",
    }),
    kind: "boolean",
    executor: highlightLinks,
  },
  {
    ...content({
      id: "highlight-title",
      icon: "highlight-title",
      labelKey: "tools.highlightTitles",
      descKey: "tools.highlightTitlesDesc",
    }),
    kind: "boolean",
    executor: highlightTitles,
  },
  {
    ...content({
      id: "hide-images",
      icon: "hide-images",
      labelKey: "tools.hideImages",
      descKey: "tools.hideImagesDesc",
    }),
    kind: "boolean",
    executor: hideImages,
  },

  // ── Color ────────────────────────────────────────────────────────────
  {
    id: "monochrome",
    category: "color",
    icon: "monochrome",
    labelKey: "tools.monochrome",
    descKey: "tools.monochromeDesc",
    kind: "exclusive",
    group: EXCLUSIVE_GROUPS.contrast,
  },
  {
    id: "low-saturation",
    category: "color",
    icon: "low-saturation",
    labelKey: "tools.lowSaturation",
    descKey: "tools.lowSaturationDesc",
    kind: "exclusive",
    group: EXCLUSIVE_GROUPS.contrast,
  },
  {
    id: "high-saturation",
    category: "color",
    icon: "high-saturation",
    labelKey: "tools.highSaturation",
    descKey: "tools.highSaturationDesc",
    kind: "exclusive",
    group: EXCLUSIVE_GROUPS.contrast,
  },
  {
    id: "high-contrast",
    category: "color",
    icon: "high-contrast",
    labelKey: "tools.highContrast",
    descKey: "tools.highContrastDesc",
    kind: "exclusive",
    group: EXCLUSIVE_GROUPS.contrast,
  },
  {
    id: "light-contrast",
    category: "color",
    icon: "light-contrast",
    labelKey: "tools.lightContrast",
    descKey: "tools.lightContrastDesc",
    kind: "exclusive",
    group: EXCLUSIVE_GROUPS.contrast,
  },
  {
    id: "dark-contrast",
    category: "color",
    icon: "dark-contrast",
    labelKey: "tools.darkContrast",
    descKey: "tools.darkContrastDesc",
    kind: "exclusive",
    group: EXCLUSIVE_GROUPS.contrast,
  },

  // ── Text alignment ───────────────────────────────────────────────────
  {
    id: "text-align-left",
    category: "text-align",
    icon: "text-align-left",
    labelKey: "tools.textAlignLeft",
    descKey: "tools.textAlignLeftDesc",
    kind: "exclusive",
    group: EXCLUSIVE_GROUPS["text-align"],
  },
  {
    id: "text-align-center",
    category: "text-align",
    icon: "text-align-center",
    labelKey: "tools.textAlignCenter",
    descKey: "tools.textAlignCenterDesc",
    kind: "exclusive",
    group: EXCLUSIVE_GROUPS["text-align"],
  },
  {
    id: "text-align-right",
    category: "text-align",
    icon: "text-align-right",
    labelKey: "tools.textAlignRight",
    descKey: "tools.textAlignRightDesc",
    kind: "exclusive",
    group: EXCLUSIVE_GROUPS["text-align"],
  },
  {
    id: "text-justify",
    category: "text-align",
    icon: "text-justify",
    labelKey: "tools.textJustify",
    descKey: "tools.textJustifyDesc",
    kind: "exclusive",
    group: EXCLUSIVE_GROUPS["text-align"],
  },

  // ── Tools ────────────────────────────────────────────────────────────
  {
    id: "big-cursor",
    category: "tools",
    icon: "big-cursor",
    labelKey: "tools.bigCursor",
    descKey: "tools.bigCursorDesc",
    kind: "boolean",
    executor: bigCursor,
  },
  {
    id: "stop-animations",
    category: "tools",
    icon: "stop-animations",
    labelKey: "tools.stopAnimations",
    descKey: "tools.stopAnimationsDesc",
    kind: "boolean",
    executor: stopAnimations,
  },
  {
    id: "reading-guide",
    category: "tools",
    icon: "reading-guide",
    labelKey: "tools.readingGuide",
    descKey: "tools.readingGuideDesc",
    kind: "boolean",
    executor: readingGuide,
  },
  {
    id: "reading-ruler",
    category: "tools",
    icon: "reading-ruler",
    labelKey: "tools.readingRuler",
    descKey: "tools.readingRulerDesc",
    kind: "boolean",
    executor: readingRuler,
  },
  {
    id: "focus-mode",
    category: "tools",
    icon: "focus-mode",
    labelKey: "tools.focusMode",
    descKey: "tools.focusModeDesc",
    kind: "boolean",
    executor: focusMode,
  },
  {
    id: "visible-focus",
    category: "tools",
    icon: "visible-focus",
    labelKey: "tools.visibleFocus",
    descKey: "tools.visibleFocusDesc",
    kind: "boolean",
    executor: visibleFocus,
  },
  {
    id: "invert",
    category: "tools",
    icon: "invert",
    labelKey: "tools.invert",
    descKey: "tools.invertDesc",
    kind: "boolean",
    executor: invert,
  },
  {
    id: "reduced-motion",
    category: "tools",
    icon: "reduced-motion",
    labelKey: "tools.reducedMotion",
    descKey: "tools.reducedMotionDesc",
    kind: "boolean",
    executor: reducedMotion,
  },
  {
    id: "reading-mask",
    category: "tools",
    icon: "reading-mask",
    labelKey: "tools.readingMask",
    descKey: "tools.readingMaskDesc",
    kind: "boolean",
    executor: readingMask,
  },
  {
    id: "screen-reader",
    category: "tools",
    icon: "screen-reader",
    labelKey: "tools.screenReader",
    descKey: "tools.screenReaderDesc",
    kind: "boolean",
    executor: screenReader,
  },
];

export const TOOLS_BY_ID: Record<string, Tool> = Object.fromEntries(
  TOOLS.map((tool) => [tool.id, tool]),
);

export const BOOLEAN_TOOLS = TOOLS.filter((tool): tool is BooleanTool => tool.kind === "boolean");
export const EXCLUSIVE_TOOLS = TOOLS.filter(
  (tool): tool is ExclusiveTool => tool.kind === "exclusive",
);
export const CONTINUOUS_TOOLS = TOOLS.filter(
  (tool): tool is ContinuousTool => tool.kind === "continuous",
);

export const TOOL_CATEGORIES: { id: ToolCategory; labelKey: string }[] = [
  { id: "content", labelKey: "categories.content" },
  { id: "color", labelKey: "categories.color" },
  { id: "text-align", labelKey: "categories.textAlign" },
  { id: "tools", labelKey: "categories.tools" },
];

export function getTool(id: string): Tool | undefined {
  return TOOLS_BY_ID[id];
}

/**
 * Normalize persisted/profile state to the canonical runtime vocabulary.
 *
 * Exclusive tools are stored under their group's `stateKey`, not under the
 * individual tool ID. This keeps older saved states working while ensuring
 * profiles and the engine speak the same language.
 */
export function normalizeStates(states: Record<string, unknown> = {}): Record<string, unknown> {
  const normalized = { ...states };

  for (const tool of EXCLUSIVE_TOOLS) {
    if (!(tool.id in normalized)) continue;

    const value = normalized[tool.id];
    delete normalized[tool.id];

    if (value === true && !normalized[tool.group.stateKey]) {
      normalized[tool.group.stateKey] = tool.id;
    }
  }

  return normalized;
}

export function toolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((tool) => tool.category === category);
}

export function isBooleanTool(tool: Tool | undefined): tool is BooleanTool {
  return tool?.kind === "boolean";
}

export function isExclusiveTool(tool: Tool | undefined): tool is ExclusiveTool {
  return tool?.kind === "exclusive";
}

export function isContinuousTool(tool: Tool | undefined): tool is ContinuousTool {
  return tool?.kind === "continuous";
}
