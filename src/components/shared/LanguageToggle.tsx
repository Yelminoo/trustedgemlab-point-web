import type { AppLanguage } from '@/i18n';
import { useLanguageStore } from '@/lib/stores/language-store';

// Each option is labeled in its own language (not the current UI language)
// — mirrors mobile-point's LanguageToggle — so a speaker of the other
// language can always find and tap their own option, even if the app is
// currently showing a language they don't read.
const OPTIONS: { value: AppLanguage; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'my', label: 'မြန်မာ' },
];

export function LanguageToggle() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  return (
    <div className="flex overflow-hidden rounded-lg border border-bg-selected">
      {OPTIONS.map((opt) => {
        const selected = language === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setLanguage(opt.value)}
            className={`px-2 py-1 text-xs font-medium ${selected ? 'bg-primary text-on-primary' : 'text-text-secondary'}`}>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
