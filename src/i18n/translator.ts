/**
 * Translator — Resolves dot-notation translation keys to localized strings.
 *
 * English is bundled synchronously, so labels always resolve before
 * initTranslations() completes. Other locales are bundled as well; the async
 * signature is kept for adapters that load remote catalogs later.
 *
 * @example
 *   translate('tools.fontSize', 'en') // → "Font Size"
 *   translate('tools.fontSize', 'hi') // → "फ़ॉन्ट आकार"
 */
import { TRANSLATION_DICTIONARY, loadTranslations } from "./languages";

/** Resolve a dot-path like 'tools.fontSize' from a nested object */
function resolve(obj: unknown, path: string): unknown {
  const parts = path.split(".");
  let current = obj;
  for (const p of parts) {
    if (current && typeof current === "object" && p in current) {
      current = (current as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Synchronous translate — uses the loaded dictionary, then English, then the
 * key itself.
 */
export function translate(key: string, locale: string = "en", fallback?: string): string {
  const dict = TRANSLATION_DICTIONARY[locale];
  if (dict) {
    const val = resolve(dict, key);
    if (typeof val === "string") return val;
  }

  if (locale !== "en") return translate(key, "en", fallback);

  return fallback ?? key;
}

/**
 * Translate with a template replacement.
 *
 * @example
 *   translateWith('Font Size: {0}%', ['120']) // → "Font Size: 120%"
 */
export function translateWith(key: string, replacements: string[], locale: string = "en"): string {
  let text = translate(key, locale);
  replacements.forEach((rep, i) => {
    text = text.replace(`{${i}}`, rep);
  });
  return text;
}

/**
 * Preload translations for a locale into the dictionary.
 * Call this during app initialization.
 */
export async function initTranslations(locale: string = "en"): Promise<void> {
  await loadTranslations(locale);
}

/**
 * Get the default locale from the HTML lang attribute or fall back to 'en'.
 */
export function getDefaultLanguage(): string {
  if (typeof document === "undefined") return "en";
  const htmlLang = document.documentElement.lang;
  if (htmlLang && htmlLang.length >= 2) {
    return htmlLang.slice(0, 2).toLowerCase();
  }
  return "en";
}
