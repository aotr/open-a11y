/**
 * IToolConfig — Configuration for a single accessibility tool.
 *
 * Each tool is a declarative config: CSS selectors + style properties.
 * The CSS engine converts this into injected <style> elements.
 *
 * Pattern inspired by Sienna Accessibility Widget.
 */
export interface IToolConfig {
  /** Unique tool identifier, e.g. "font-size", "monochrome" */
  id?: string;

  /** Root CSS selector to scope styles under (usually 'html') */
  selector?: string;

  /**
   * Child selectors to apply styles to.
   * Each child selector is combined with the root selector.
   * Example: ['p', 'h1', 'h2'] → "html.asw-tool-id p, html.asw-tool-id h1, ..."
   */
  childrenSelector?: string[];

  /** CSS property-value pairs to apply */
  styles?: Record<string, unknown>;

  /** Raw CSS string appended after generated styles (for @font-face, etc.) */
  css?: string;

  /** Whether the tool is currently enabled */
  enable?: boolean;
}

export default IToolConfig;
