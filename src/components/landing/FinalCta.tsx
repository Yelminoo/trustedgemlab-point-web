import { useTranslation } from 'react-i18next';

export function FinalCta() {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="font-display text-balance text-3xl font-semibold text-on-primary sm:text-4xl">{t('landing.finalCtaTitle')}</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm text-on-primary/80">{t('landing.finalCtaBody')}</p>
      <a
        href="/account?mode=register"
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-on-primary px-7 text-sm font-semibold text-primary transition-opacity hover:opacity-90">
        {t('landing.finalCtaButton')}
      </a>
    </>
  );
}
