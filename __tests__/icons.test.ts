/**
 * Tests for the icon sprite system (Lucide-powered).
 */
import { describe, it, expect } from "vite-plus/test";
import { ICONS, renderIcon } from "../src/ui/icons/sprite";
import { renderLucideIcon, LUCIDE_ICONS } from "../src/ui/icons/lucide";

describe("Icon Sprites", () => {
  it("should have all expected icons in ICONS registry", () => {
    const expectedIds = [
      "accessibility",
      "close",
      "reset",
      "font-size",
      "font-weight",
      "line-height",
      "letter-spacing",
      "readable-font",
      "readable-font-alt",
      "highlight-links",
      "underline-links",
      "highlight-title",
      "hide-images",
      "monochrome",
      "low-saturation",
      "high-saturation",
      "high-contrast",
      "light-contrast",
      "dark-contrast",
      "invert",
      "big-cursor",
      "stop-animations",
      "reading-guide",
      "reading-ruler",
      "reading-mask",
      "focus-mode",
      "visible-focus",
      "reduced-motion",
      "screen-reader",
      "text-align-left",
      "text-align-center",
      "text-align-right",
      "text-justify",
      "seizure-safe",
      "vision-impaired",
      "adhd-friendly",
      "cognitive-disability",
      "keyboard-navigation",
      "blind-users",
      "motor-impaired",
      "plus",
      "minus",
      "info",
    ];

    expectedIds.forEach((id) => {
      expect(ICONS[id]).toBeDefined();
      expect(ICONS[id].viewBox).toBe("0 0 24 24");
      // path is empty — icons are rendered via Lucide, not raw paths
    });

    expect(Object.keys(ICONS).length).toBe(expectedIds.length);
  });

  it("should have all expected icons in Lucide registry", () => {
    const expectedIds = [
      "accessibility",
      "close",
      "reset",
      "font-size",
      "font-weight",
      "line-height",
      "letter-spacing",
      "readable-font",
      "readable-font-alt",
      "highlight-links",
      "underline-links",
      "highlight-title",
      "hide-images",
      "monochrome",
      "low-saturation",
      "high-saturation",
      "high-contrast",
      "light-contrast",
      "dark-contrast",
      "invert",
      "big-cursor",
      "stop-animations",
      "reading-guide",
      "reading-ruler",
      "reading-mask",
      "focus-mode",
      "visible-focus",
      "reduced-motion",
      "screen-reader",
      "text-align-left",
      "text-align-center",
      "text-align-right",
      "text-justify",
      "seizure-safe",
      "vision-impaired",
      "adhd-friendly",
      "cognitive-disability",
      "keyboard-navigation",
      "blind-users",
      "motor-impaired",
      "plus",
      "minus",
      "info",
    ];

    expectedIds.forEach((id) => {
      expect(LUCIDE_ICONS[id]).toBeDefined();
    });
  });

  it("renderIcon should return SVG markup (Lucide)", () => {
    const svg = renderIcon("accessibility");
    expect(svg).toContain("<svg");
    expect(svg).toContain('viewBox="0 0 24 24"');
    // Lucide icons use stroke-based rendering
    expect(svg).toContain('stroke="currentColor"');
  });

  it("renderIcon should return empty string for unknown icon", () => {
    expect(renderIcon("nonexistent")).toBe("");
  });

  it("renderLucideIcon should return valid SVG", () => {
    const svg = renderLucideIcon("plus", 24);
    expect(svg).toContain("<svg");
    expect(svg).toContain('width="24"');
    expect(svg).toContain('height="24"');
  });
});
