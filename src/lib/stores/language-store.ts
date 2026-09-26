import { create } from 'zustand';

import i18next, { type AppLanguage, SUPPORTED_LANGUAGES } from '@/i18n';

const LANGUAGE_KEY = 'tgl_language';

interface LanguageState {
  language: AppLanguage;
  hydrated: boolean;
  hydrate: () => void;
  setLanguage: (language: AppLanguage) => void;
}

function isSupportedLanguage(value: string | null): value is AppLanguage {
  return SUPPORTED_LANGUAGES.includes(value as AppLanguage);
}

// English/Myanmar toggle — mirrors mobile-point's language-store.ts. No
// stored choice yet on first visit falls back to the browser's own language
// (navigator.language) if it's Burmese, English otherwise; after that the
// explicit choice always wins.
export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  hydrated: false,

  hydrate: () => {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    let language: AppLanguage;
    if (isSupportedLanguage(stored)) {
      language = stored;
    } else {
      language = navigator.language?.startsWith('my') ? 'my' : 'en';
    }
    void i18next.changeLanguage(language);
    set({ language, hydrated: true });
  },

  setLanguage: (language) => {
    localStorage.setItem(LANGUAGE_KEY, language);
    void i18next.changeLanguage(language);
    set({ language });
  },
}));
