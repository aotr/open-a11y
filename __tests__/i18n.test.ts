/**
 * Unit tests for i18n system.
 */
import { describe, it, expect } from "vite-plus/test";
import { LANGUAGES, loadTranslations } from "../src/i18n/languages";
import { translate } from "../src/i18n/translator";
import { AswMenu } from "../src/ui/components/asw-menu";

// Pre-load English for synchronous tests
import en from "../src/i18n/locales/en.json";
import hi from "../src/i18n/locales/hi.json";
import bn from "../src/i18n/locales/bn.json";
import mr from "../src/i18n/locales/mr.json";
import ta from "../src/i18n/locales/ta.json";
import te from "../src/i18n/locales/te.json";
import gu from "../src/i18n/locales/gu.json";
import kn from "../src/i18n/locales/kn.json";
import ml from "../src/i18n/locales/ml.json";
import pa from "../src/i18n/locales/pa.json";
import { TRANSLATION_DICTIONARY } from "../src/i18n/languages";
TRANSLATION_DICTIONARY["en"] = en;

const LOCALE_FILES = { en, hi, bn, mr, ta, te, gu, kn, ml, pa };

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("Languages", () => {
  it("should register all bundled locales", () => {
    expect(LANGUAGES.map((language) => language.code)).toEqual([
      "en",
      "hi",
      "bn",
      "mr",
      "ta",
      "te",
      "gu",
      "kn",
      "ml",
      "pa",
    ]);
  });

  it("each language should have code and label", () => {
    LANGUAGES.forEach((lang) => {
      expect(lang.code).toBeDefined();
      expect(lang.label).toBeDefined();
      expect(lang.nativeLabel).toBeDefined();
    });
  });
});

describe("Translator", () => {
  it("should translate dot-notation keys", () => {
    const result = translate("widget.menuTitle", "en");
    expect(result).toBe("Accessibility Menu");
  });

  it("should fall back to key when translation missing", () => {
    const result = translate("nonexistent.key", "en");
    expect(result).toBe("nonexistent.key");
  });

  it("should fall back to custom fallback value", () => {
    const result = translate("nonexistent.key", "en", "Default Text");
    expect(result).toBe("Default Text");
  });

  it("should translate tool names", () => {
    expect(translate("tools.fontSize", "en")).toBe("Font Size");
    expect(translate("tools.bigCursor", "en")).toBe("Big Cursor");
    expect(translate("tools.monochrome", "en")).toBe("Monochrome");
  });

  it("should translate profile names", () => {
    expect(translate("profiles.seizureSafe", "en")).toBe("Seizure Safe");
    expect(translate("profiles.visionImpaired", "en")).toBe("Vision Impaired");
  });

  it("should translate the font-size label in every bundled locale", async () => {
    const expected: Record<string, string> = {
      en: "Font Size",
      hi: "फ़ॉन्ट आकार",
      bn: "ফন্টের আকার",
      mr: "फॉन्ट आकार",
      ta: "எழுத்துரு அளவு",
      te: "ఫాంట్ పరిమాణం",
      gu: "ફોન્ટ સાઇઝ",
      kn: "ಫಾಂಟ್ ಗಾತ್ರ",
      ml: "ഫോണ്ട് വലുപ്പം",
      pa: "ਫੌਂਟ ਆਕਾਰ",
    };

    for (const [code, label] of Object.entries(expected)) {
      await loadTranslations(code);
      expect(translate("tools.fontSize", code), code).toBe(label);
    }
  });

  it("keeps every catalog aligned with the English keys", () => {
    const englishKeys = flattenKeys(en).sort();

    for (const [code, dictionary] of Object.entries(LOCALE_FILES)) {
      expect(flattenKeys(dictionary).sort(), code).toEqual(englishKeys);
    }
  });

  it("cycles the menu language toggle through every bundled language", () => {
    const menu = new AswMenu();
    document.body.appendChild(menu);

    const seen: string[] = [];
    menu.addEventListener("asw:language", (event) => {
      const { lang } = (event as CustomEvent<{ lang: string }>).detail;
      seen.push(lang);
      menu.setAttribute("lang", lang);
    });

    const toggle = menu.shadowRoot!.querySelector(".asw-menu-lang-toggle") as HTMLButtonElement;

    LANGUAGES.forEach(() => toggle.click());

    expect(seen).toEqual([...LANGUAGES.slice(1).map((language) => language.code), "en"]);
    expect(menu.shadowRoot!.querySelector(".asw-lang-text")!.textContent).toBe("EN");

    menu.remove();
  });
});
