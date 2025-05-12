import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

// Import language files
import en from "./locales/en.json";
import es from "./locales/es.json";
import pt from "./locales/pt.json";

// Define the resources
const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  pt: {
    translation: pt,
  },
};

// Define available languages type
type AvailableLanguages = keyof typeof resources;

// Get the device language
const getDeviceLanguage = (): AvailableLanguages => {
  const deviceLanguage = Localization.getLocales()[0]
    .languageCode as AvailableLanguages;
  return resources[deviceLanguage] ? deviceLanguage : "pt";
};

// Load saved language from AsyncStorage
const loadSavedLanguage = async (): Promise<AvailableLanguages> => {
  try {
    const savedLanguage = await AsyncStorage.getItem("userLanguage");
    return (savedLanguage as AvailableLanguages) || getDeviceLanguage();
  } catch (error) {
    console.error("Error loading saved language:", error);
    return getDeviceLanguage();
  }
};

// Initialize i18n
const initI18n = async () => {
  const savedLanguage = await loadSavedLanguage();

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

// Change language function
export const changeLanguage = async (language: AvailableLanguages) => {
  try {
    await AsyncStorage.setItem("userLanguage", language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error("Error changing language:", error);
  }
};

// Get available languages
export const getAvailableLanguages = (): AvailableLanguages[] => {
  return Object.keys(resources) as AvailableLanguages[];
};

// Initialize i18n
initI18n();

export default i18n;
