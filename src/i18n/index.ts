import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import my from './locales/my.json';

export type AppLanguage = 'en' | 'my';
export const SUPPORTED_LANGUAGES: AppLanguage[] = ['en', 'my'];

// Mirrors mobile-point's own src/i18n/index.ts exactly (same resources
// structure, same fixed 'en' initial language — the actual startup
// language is applied by language-store.ts's hydrate(), same as there).
// A single global i18next instance (not scoped per-component or per-
// island) — every client:load island on a page imports this same module,
// so they all share one language state and react to the same
// changeLanguage() call, even though each island is its own separate React
// root.
i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    my: { translation: my },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }, // React already escapes
  returnNull: false,
});

export default i18next;
