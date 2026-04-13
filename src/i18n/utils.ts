import it from "./it.json";
import en from "./en.json";

const translations = { it, en } as const;

export type Locale = keyof typeof translations;
export type TranslationKey = typeof it;

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split("/");
  if (lang === "en") return "en";
  return "it";
}

export function t(locale: Locale): TranslationKey {
  return translations[locale];
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "it" ? "en" : "it";
}

export function getLocalePath(locale: Locale): string {
  return `/${locale}/`;
}
