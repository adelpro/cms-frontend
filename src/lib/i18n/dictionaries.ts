import type { Locale, Dictionary } from './types';

const dictionaries = {
  ar: () => import("@/dictionaries/ar.json").then((module) => module.default as Dictionary),
  en: () => import("@/dictionaries/en.json").then((module) => module.default as Dictionary),
};

/**
 * Get dictionary for a locale with error handling
 */
export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  try {
    return await dictionaries[locale]();
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}`, error);
    // Fallback to English if Arabic fails, or return default if English fails
    if (locale === 'ar') {
      try {
        return await dictionaries.en();
      } catch (fallbackError) {
        console.error('Failed to load fallback dictionary', fallbackError);
        // Return minimal dictionary to prevent app crash
        return getMinimalDictionary();
      }
    }
    return getMinimalDictionary();
  }
};

/**
 * Minimal dictionary for emergency fallback
 */
function getMinimalDictionary(): Dictionary {
  return {
    welcome: "Welcome",
    description: "A modern CMS application",
    getStarted: "Get Started",
    learnMore: "Learn More",
    language: "Language",
    arabic: "العربية",
    english: "English",
    switchLanguage: "Switch Language",
    home: "Home",
    about: "About",
    contact: "Contact",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",
    close: "Close",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    toggleTheme: "Toggle Theme",
    theme: "Theme",
  };
}

/**
 * Preload dictionaries for better performance
 */
export async function preloadDictionaries(): Promise<void> {
  try {
    await Promise.all([
      dictionaries.ar(),
      dictionaries.en(),
    ]);
  } catch (error) {
    console.warn('Failed to preload some dictionaries', error);
  }
}
