import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./locales/en.json"
import nl from "./locales/nl.json"

const supportedLanguages = ["en", "nl"] as const
type SupportedLanguage = typeof supportedLanguages[number]

function detectBrowserLanguage(): SupportedLanguage {
  const browserLang =
    navigator.languages?.[0] ||
    navigator.language ||
    "en"

  const normalized = browserLang.split("-")[0]

  if (supportedLanguages.includes(normalized as SupportedLanguage)) {
    return normalized as SupportedLanguage
  }

  return "en"
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      nl: { translation: nl },
    },
    lng: detectBrowserLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
