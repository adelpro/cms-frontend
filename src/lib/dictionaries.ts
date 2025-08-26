import type { Locale } from "@/middleware";

// Define the dictionary type based on the structure
export type Dictionary = {
  welcome: string;
  description: string;
  getStarted: string;
  learnMore: string;
  language: string;
  arabic: string;
  english: string;
  switchLanguage: string;
  home: string;
  about: string;
  contact: string;
  loading: string;
  error: string;
  success: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  confirm: string;
  close: string;
  darkMode: string;
  lightMode: string;
  toggleTheme: string;
  theme: string;
};

const dictionaries = {
  ar: () => import("@/dictionaries/ar.json").then((module) => module.default as Dictionary),
  en: () => import("@/dictionaries/en.json").then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale]();
};

// Hook for client-side usage
export function useDictionary(dict: Dictionary) {
  return dict;
}
