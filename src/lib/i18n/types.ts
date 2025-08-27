export type Locale = 'ar' | 'en';

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

export interface LocaleContextType {
  locale: Locale;
  dict: Dictionary;
  isRTL: boolean;
}
