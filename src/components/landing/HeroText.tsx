import { useTranslation } from 'react-i18next';

export function HeroText() {
  const { t } = useTranslation();

  return (
    <div>
      <p
        className="animate-fade-up mb-5 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary uppercase"
        style={{ animationDelay: '0ms' }}>
        <span className="inline-block size-1.5 rounded-full bg-primary" />
        {t('landing.eyebrow')}
      </p>

      <h1
        className="animate-fade-up font-display text-[2.75rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-[4rem]"
        style={{ animationDelay: '60ms' }}>
        {t('landing.heroTitle')}
      </h1>

      <p
        className="animate-fade-up mt-6 max-w-md text-base leading-relaxed text-text-secondary sm:text-lg"
        style={{ animationDelay: '140ms' }}>
        {t('landing.heroSubtitle')}
      </p>

      <div className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '220ms' }}>
        <a
          href="/account?mode=register"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-pressed">
          {t('landing.getStarted')}
        </a>
        <a
          href="/account"
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-6 text-sm font-semibold text-text transition-colors hover:bg-bg-element">
          {t('landing.signIn')}
        </a>
      </div>

      <p
        className="animate-fade-up mt-8 text-xs tracking-[0.15em] text-text-secondary uppercase"
        style={{ animationDelay: '300ms' }}>
        {t('landing.tagline')}
      </p>
    </div>
  );
}
