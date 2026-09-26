import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useAuthStore } from '@/lib/stores/auth-store';

const links = [
  { href: '/dashboard', key: 'nav.home' },
  { href: '/reports', key: 'nav.reports' },
  { href: '/redeem', key: 'nav.redeem' },
];

// Nav is persisted across client-side transitions (see BaseLayout), so its
// own `window.location` doesn't update on navigation the way a fresh page
// load would — astro:page-load fires after every transition (including the
// first) specifically so persisted islands like this can re-sync to it.
function usePathname() {
  const [pathname, setPathname] = useState(() => (typeof window !== 'undefined' ? window.location.pathname : ''));
  useEffect(() => {
    const onLoad = () => setPathname(window.location.pathname);
    document.addEventListener('astro:page-load', onLoad);
    return () => document.removeEventListener('astro:page-load', onLoad);
  }, []);
  return pathname;
}

export function Nav() {
  const { t } = useTranslation();
  const { customer, hydrated, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = customer?.isAdmin ?? false;
  // Signed-out visitors only ever see the marketing landing page and
  // sign-in — there's nothing behind Reports/Redeem/Admin for them to
  // go to, so showing those links would just bounce them back to /.
  const showAppLinks = hydrated && !!customer;

  function linkClass(href: string) {
    const active = pathname === href;
    return `text-sm font-medium ${active ? 'text-primary' : 'text-text-secondary hover:text-text'}`;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-bg-selected bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
        <a href="/" className="mr-auto flex items-center gap-2.5">
          <img src="/logo.svg" alt="" className="size-11 shrink-0" />
          <span className="flex items-baseline gap-1.5">
            <span className="font-mono text-xl font-bold text-primary">Trusted</span>
            <span className="hidden text-sm text-text-secondary sm:inline">Gemological Laboratory</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 sm:flex">
          {showAppLinks &&
            links.map((l) => (
              <a key={l.href} href={l.href} className={linkClass(l.href)}>
                {t(l.key)}
              </a>
            ))}
          {showAppLinks && isAdmin && (
            <a href="/admin" className={linkClass('/admin')}>
              {t('nav.admin')}
            </a>
          )}
          {!hydrated ? null : customer ? (
            <div className="flex items-center gap-3">
              <a href="/account" className={linkClass('/account')}>
                {customer.email}
              </a>
              <button
                onClick={() => logout()}
                className="rounded-lg bg-bg-selected px-3 py-1.5 text-sm font-medium text-text hover:opacity-80">
                {t('nav.logOut')}
              </button>
            </div>
          ) : (
            <a
              href="/account"
              className="rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-on-primary hover:bg-primary-pressed">
              {t('nav.signIn')}
            </a>
          )}
          <LanguageToggle />
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 sm:hidden">
          <LanguageToggle />
          <ThemeToggle />
          {(showAppLinks || (hydrated && !customer)) && (
            <button
              className="flex size-9 items-center justify-center rounded-lg text-text"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-bg-selected px-4 py-3 sm:hidden">
          {showAppLinks &&
            links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${pathname === l.href ? 'bg-bg-element text-primary' : 'text-text'}`}>
                {t(l.key)}
              </a>
            ))}
          {showAppLinks && isAdmin && (
            <a
              href="/admin"
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium ${pathname === '/admin' ? 'bg-bg-element text-primary' : 'text-text'}`}>
              {t('nav.admin')}
            </a>
          )}
          {hydrated && customer ? (
            <>
              <a
                href="/account"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-text hover:bg-bg-element">
                {customer.email}
              </a>
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger hover:bg-bg-element">
                {t('nav.logOut')}
              </button>
            </>
          ) : hydrated ? (
            <a href="/account" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-primary">
              {t('nav.signIn')}
            </a>
          ) : null}
        </nav>
      )}
    </header>
  );
}
