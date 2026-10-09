import { useTranslation } from 'react-i18next';

export function InstallText() {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="font-display text-3xl font-semibold text-on-primary sm:text-4xl">{t('landing.installHeading')}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-on-primary/80 lg:mx-0">
        {t('landing.installBody')}
      </p>
    </>
  );
}
