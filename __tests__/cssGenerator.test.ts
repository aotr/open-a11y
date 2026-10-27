/**
 * Unit tests for CSS Generator — the pure-function core of the widget.
 */
import { describe, it, expect } from "vite-plus/test";
import { generateCSS, generateCSSFromConfig, wrapCSSToSelector } from "../src/css/cssGenerator";
import type { IToolConfig } from "../src/types/IToolConfig";

describe("generateCSS", () => {
  it("should generate CSS from a simple styles object", () => {
    const result = generateCSS({ color: "red", "font-size": "16px" });
    expect(result).toContain("color:red");
    expect(result).toContain("font-size:16px");
  });

  it("should add vendor prefixes for filter property", () => {
    const result = generateCSS({ filter: "grayscale(100%)" });
    expect(result).toContain("-webkit-filter:grayscale(100%)");
    expect(result).toContain("-moz-filter:grayscale(100%)");
    expect(result).toContain("filter:grayscale(100%)");
  });

  it("should handle empty styles object", () => {
    const result = generateCSS({});
    expect(result).toBe("");
  });

  it("should handle transition with prefixes", () => {
    const result = generateCSS({ transition: "none" });
    expect(result).toContain("-webkit-transition:none");
    expect(result).toContain("transition:none");
  });
});

describe("wrapCSSToSelector", () => {
  it("should wrap CSS in a selector block", () => {
    const result = wrapCSSToSelector({
      selector: "html.asw-test",
      childrenSelector: ["p", "h1"],
      css: "color:red",
    });
    expect(result).toBe("html.asw-test p,html.asw-test h1{color:red}");
  });

  it("should handle empty childrenSelector", () => {
    const result = wrapCSSToSelector({
      selector: "html.asw-test",
      css: "color:red",
    });
    expect(result).toBe("html.asw-test{color:red}");
  });

  it("should return empty string for empty CSS", () => {
    const result = wrapCSSToSelector({
      selector: "html.asw-test",
      childrenSelector: ["p"],
      css: "",
    });
    expect(result).toBe("");
  });
});

describe("generateCSSFromConfig", () => {
  it("should generate CSS from a full tool config", () => {
    const config: IToolConfig = {
      id: "test-tool",
      selector: "html",
      childrenSelector: ["*"],
      styles: { color: "red" },
    };
    const result = generateCSSFromConfig(config);
    expect(result).toContain("html *");
    expect(result).toContain("color:red");
  });

  it("should append raw CSS from config", () => {
    const config: IToolConfig = {
      id: "test-tool",
      selector: "html",
      styles: { color: "red" },
      css: "@font-face{font-family:Test;}",
    };
    const result = generateCSSFromConfig(config);
    expect(result).toContain("@font-face");
    expect(result).toContain("color:red");
  });

  it("should return empty string for empty config", () => {
    const result = generateCSSFromConfig({});
    expect(result).toBe("");
  });
});
