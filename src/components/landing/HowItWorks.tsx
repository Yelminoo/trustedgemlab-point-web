import { useTranslation } from 'react-i18next';

const steps = [
  { n: '01', titleKey: 'landing.step1Title', bodyKey: 'landing.step1Body' },
  { n: '02', titleKey: 'landing.step2Title', bodyKey: 'landing.step2Body' },
  { n: '03', titleKey: 'landing.step3Title', bodyKey: 'landing.step3Body' },
] as const;

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="border-y border-bg-selected/60 bg-bg-element/50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display mb-10 text-3xl font-semibold sm:text-4xl">{t('landing.howItWorksHeading')}</h2>
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <span className="font-mono text-sm text-primary/60">{s.n}</span>
              <h3 className="mt-2 mb-1.5 text-base font-semibold">{t(s.titleKey)}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{t(s.bodyKey)}</p>
              {i < steps.length - 1 && (
                <span className="pointer-events-none absolute top-2 -right-3 hidden text-text-secondary/30 sm:block">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
