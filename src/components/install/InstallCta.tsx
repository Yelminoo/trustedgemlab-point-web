import { useInstallPrompt } from '@/lib/use-install-prompt';

// The one and only install call-to-action in the whole app — lives in its
// own section on the landing page (see index.astro). Chrome/Edge/Android
// get a real one-tap install via the native prompt; everyone else (iOS
// Safari, Firefox, desktop Safari — none of which ever fire
// beforeinstallprompt) gets sent to /install for the manual steps. Renders
// nothing once the app is already installed — no point pitching twice.
export function InstallCta() {
  const { canPrompt, installed, promptInstall } = useInstallPrompt();

  if (installed) {
    return <p className="text-sm font-medium text-on-primary">✓ Already installed on this device.</p>;
  }

  if (canPrompt) {
    return (
      <button
        onClick={() => promptInstall()}
        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-on-primary px-7 text-sm font-semibold text-primary transition-opacity hover:opacity-90">
        Install Now
      </button>
    );
  }

  return (
    <a
      href="/install"
      className="inline-flex min-h-12 items-center justify-center rounded-xl bg-on-primary px-7 text-sm font-semibold text-primary transition-opacity hover:opacity-90">
      How to Install
    </a>
  );
}
