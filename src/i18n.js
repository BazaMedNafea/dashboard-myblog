import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "./locales/en/common.json";
import enHomepage from "./locales/en/homepage.json";
import enFooter from "./locales/en/footer.json";
import arCommon from "./locales/ar/common.json";
import arHomepage from "./locales/ar/homepage.json";
import arFooter from "./locales/ar/footer.json";

// Retrieve the language from localStorage, default to 'en' if not found
const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      homepage: enHomepage,
      footer: enFooter,
    },
    ar: {
      common: arCommon,
      homepage: arHomepage,
      footer: arFooter,
    },
  },
  lng: savedLanguage, // Use the saved language
  fallbackLng: "en", // Fallback language
  ns: ["common", "homepage", "footer"], // Namespaces
  defaultNS: "common", // Default namespace
});