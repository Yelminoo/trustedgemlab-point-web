import { useTranslation } from 'react-i18next';

import { FeatureIcon } from '@/components/landing/FeatureIconReact';

const features = [
  { icon: 'search', titleKey: 'landing.feature1Title', bodyKey: 'landing.feature1Body' },
  { icon: 'points', titleKey: 'landing.feature2Title', bodyKey: 'landing.feature2Body' },
  { icon: 'card', titleKey: 'landing.feature3Title', bodyKey: 'landing.feature3Body' },
  { icon: 'gift', titleKey: 'landing.feature4Title', bodyKey: 'landing.feature4Body' },
] as const;

export function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-10 max-w-lg">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">{t('landing.featuresHeading')}</h2>
        <p className="mt-3 text-text-secondary">{t('landing.featuresSubheading')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <div
            key={f.icon}
            className="group rounded-2xl border border-bg-selected/60 bg-bg-element p-6 transition-transform hover:-translate-y-0.5">
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FeatureIcon name={f.icon} />
            </div>
            <h3 className="mb-1.5 text-base font-semibold">{t(f.titleKey)}</h3>
            <p className="text-sm leading-relaxed text-text-secondary">{t(f.bodyKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
