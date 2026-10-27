/**
 * Tests for the base CSS.
 */
import { describe, it, expect } from "vite-plus/test";
import { widgetCSS } from "../src/ui/styles/base.css";

describe("Base CSS", () => {
  it("should contain key selectors", () => {
    expect(widgetCSS).toContain(".asw-menu-btn");
    expect(widgetCSS).toContain(".asw-menu");
    expect(widgetCSS).toContain(".asw-overlay");
    expect(widgetCSS).toContain(".asw-btn");
    expect(widgetCSS).toContain(".asw-items");
    expect(widgetCSS).toContain(".asw-footer");
    expect(widgetCSS).toContain(".asw-adjust-font");
  });

  it("should include CSS custom properties", () => {
    expect(widgetCSS).toContain("--asw-primary");
    expect(widgetCSS).toContain("--asw-bg");
    expect(widgetCSS).toContain("--asw-radius");
  });

  it("should include responsive media queries", () => {
    expect(widgetCSS).toContain("@media");
  });
});
