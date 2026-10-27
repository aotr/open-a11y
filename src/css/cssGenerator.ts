/**
 * cssGenerator — Converts IToolConfig objects into CSS strings.
 *
 * This is the pure-function core: takes a config, returns a CSS string.
 * No DOM interaction — that's the injector's job.
 */
import type { IToolConfig } from "../types";

/** CSS properties that need vendor prefixes */
const browserPrefixes = ["-o-", "-ms-", "-moz-", "-webkit-", ""];
const propertiesNeedPrefix = new Set(["filter", "transform", "transition", "animation"]);

/**
 * Generate a CSS rule string from a styles object.
 * Handles vendor prefixes for properties that need them.
 *
 * @example
 *   generateCSS({ color: '#fff', filter: 'grayscale(100%)' })
 *   // → "color:#fff;filter:grayscale(100%);-o-filter:grayscale(100%);..."
 */
export function generateCSS(styles: Record<string, unknown>): string {
  return Object.entries(styles)
    .map(([property, value]) => {
      if (propertiesNeedPrefix.has(property)) {
        return browserPrefixes.map((prefix) => `${prefix}${property}:${String(value)}`).join(";");
      }
      return `${property}:${String(value)}`;
    })
    .join(";");
}

/**
 * Wrap a CSS string in a selector block.
 *
 * @example
 *   wrapCSSToSelector({ selector: 'html.asw-tool', childrenSelector: ['p', 'h1'], css: 'color:red' })
 *   // → "html.asw-tool p,html.asw-tool h1{color:red}"
 */
export interface IWrapCSSToSelectorArgs {
  selector: string;
  childrenSelector?: string[];
  css: string;
}

export function wrapCSSToSelector({
  selector,
  childrenSelector = [""],
  css,
}: IWrapCSSToSelectorArgs): string {
  if (!css) return "";

  const selectors = childrenSelector
    .map((child) => {
      const trimmed = child.trim();
      return trimmed ? `${selector} ${trimmed}` : selector;
    })
    .join(",");

  return `${selectors}{${css}}`;
}

/**
 * Convert a full IToolConfig into a CSS string ready for injection.
 * Combines generated styles with any raw CSS from the config.
 */
export function generateCSSFromConfig(config: IToolConfig): string {
  let output = "";

  if (config) {
    // CSS requires @import rules before every other rule. Raw CSS often carries
    // font imports, so hoist them instead of appending them after tool styles.
    const imports: string[] = [];
    const rawCss = (config.css ?? "").replace(
      /@import\s+(?:url\([^)]*\)|"[^"]*"|'[^']*')[^;]*;/g,
      (match) => {
        imports.push(match);
        return "";
      },
    );

    // Generate CSS from styles object
    if (config.styles && Object.keys(config.styles).length > 0) {
      output += generateCSS(config.styles);
    }

    // Wrap in selector if needed
    if (output.length > 0 && config.selector) {
      output = wrapCSSToSelector({
        selector: config.selector,
        childrenSelector: config.childrenSelector,
        css: output,
      });
    }

    // Append any raw CSS after the imports.
    output += rawCss;
    output = imports.join("") + output;
  }

  return output;
}
