/**
 * Language registry — one table for locale metadata and bundled catalogs.
 *
 * Locales are bundled so a published package always contains every supported
 * language. Adding a language means adding one JSON file and one entry here.
 */
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import bn from "./locales/bn.json";
import mr from "./locales/mr.json";
import ta from "./locales/ta.json";
import te from "./locales/te.json";
import gu from "./locales/gu.json";
import kn from "./locales/kn.json";
import ml from "./locales/ml.json";
import pa from "./locales/pa.json";

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
  bn: {
    label: "বাংলা (Bengali)",
    nativeLabel: "বাংলা",
    dictionary: bn as Record<string, unknown>,
  },
  mr: {
    label: "मराठी (Marathi)",
    nativeLabel: "मराठी",
    dictionary: mr as Record<string, unknown>,
  },
  ta: {
    label: "தமிழ் (Tamil)",
    nativeLabel: "தமிழ்",
    dictionary: ta as Record<string, unknown>,
  },
  te: {
    label: "తెలుగు (Telugu)",
    nativeLabel: "తెలుగు",
    dictionary: te as Record<string, unknown>,
  },
  gu: {
    label: "ગુજરાતી (Gujarati)",
    nativeLabel: "ગુજરાતી",
    dictionary: gu as Record<string, unknown>,
  },
  kn: {
    label: "ಕನ್ನಡ (Kannada)",
    nativeLabel: "ಕನ್ನಡ",
    dictionary: kn as Record<string, unknown>,
  },
  ml: {
    label: "മലയാളം (Malayalam)",
    nativeLabel: "മലയാളം",
    dictionary: ml as Record<string, unknown>,
  },
  pa: {
    label: "ਪੰਜਾਬੀ (Punjabi)",
    nativeLabel: "ਪੰਜਾਬੀ",
    dictionary: pa as Record<string, unknown>,
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
