/**
 * Language registry — one table for locale metadata and bundled catalogs.
 *
 * Locales are bundled so a published package always contains every supported
 * language. Adding a language means adding one JSON file and one entry here.
 */
import en from "./locales/en.json";
import hi from "./locales/hi.json";

export interface ILanguage {
  code: string;
  label: string;
  nativeLabel: string;
}

interface ILocale extends Omit<ILanguage, "code"> {
  dictionary: Record<string, unknown>;
}

const LOCALES: Record<string, ILocale> = {
  en: {
    label: "English",
    nativeLabel: "English",
    dictionary: en as Record<string, unknown>,
  },
  hi: {
    label: "हिन्दी (Hindi)",
    nativeLabel: "हिन्दी",
    dictionary: hi as Record<string, unknown>,
  },
};

export const LANGUAGES: ILanguage[] = Object.entries(LOCALES).map(([code, locale]) => ({
  code,
  label: locale.label,
  nativeLabel: locale.nativeLabel,
}));

/** Extract just the codes for navigation and selectors */
export const LANGUAGE_CODES = LANGUAGES.map((l) => l.code);

/** Translation dictionary populated at runtime */
export const TRANSLATION_DICTIONARY: Record<string, Record<string, unknown>> = {};

// Pre-load English synchronously so labels always resolve before init completes.
TRANSLATION_DICTIONARY.en = LOCALES.en.dictionary;

/**
 * Load a specific locale's translations.
 * Falls back to English when the locale is not bundled.
 */
export async function loadTranslations(locale: string): Promise<Record<string, unknown>> {
  if (TRANSLATION_DICTIONARY[locale]) {
    return TRANSLATION_DICTIONARY[locale];
  }

  const bundled = LOCALES[locale]?.dictionary;
  if (bundled) {
    TRANSLATION_DICTIONARY[locale] = bundled;
    return bundled;
  }

  return TRANSLATION_DICTIONARY.en;
}
