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

/** Same path under another locale. Home stays `/it/` or `/en/`. */
export function withLocale(pathname: string, locale: Locale): string {
  const parts = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean);
  if (parts[0] === "it" || parts[0] === "en") parts[0] = locale;
  else parts.unshift(locale);
  return `/${parts.join("/")}/`;
}
