import { useEffect, useState } from 'react';

import { useInstallPrompt } from '@/lib/use-install-prompt';

const DISMISSED_KEY = 'tgl-install-dismissed';

// Sits right under the nav on every page — dismissible (remembered per
// browser), and hides itself the moment the app is already installed or
// running standalone, so it never nags someone who's already done it.
// Chrome/Edge/Android get a real one-tap install; everyone else (iOS
// Safari, Firefox, desktop Safari) gets routed to /install for the manual
// steps, since their browsers never expose a native prompt to trigger.
export function InstallBanner() {
  const { canPrompt, installed, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(true); // starts hidden — see effect below

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISSED_KEY) === '1');
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, '1');
    setDismissed(true);
  }

  if (installed || dismissed) return null;

  return (
    <div className="border-b border-primary/20 bg-primary/5">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <img src="/logo.svg" alt="" className="hidden size-6 shrink-0 sm:block" />
        <p className="min-w-0 flex-1 truncate text-sm text-text">
          <span className="font-medium">Get the app.</span>{' '}
          <span className="text-text-secondary">Install Trusted Gemlab for one-tap access.</span>
        </p>
        {canPrompt ? (
          <button
            onClick={() => promptInstall()}
            className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary hover:bg-primary-pressed">
            Install
          </button>
        ) : (
          <a
            href="/install"
            className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary hover:bg-primary-pressed">
            How to install
          </a>
        )}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-selected">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
