import { useEffect, useRef } from 'react';

// Cloudflare Turnstile — bot verification widget for the registration form.
// Renders nothing (registration proceeds without it) if PUBLIC_TURNSTILE_SITE_KEY
// isn't set, matching the backend's own no-op-if-unconfigured fallback for
// the secret half of this (see trusted-gemlab-mobile-backend's
// verifyTurnstile). Get a site key + secret key pair from the Cloudflare
// dashboard (Turnstile -> Add site) for this domain.
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void; 'expired-callback'?: () => void }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

// Module-level, not per-component — the script tag should only ever be
// injected once per page, even if multiple <Turnstile> instances mount.
let scriptLoadPromise: Promise<void> | null = null;
function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile script'));
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

export function Turnstile({ onToken }: { onToken: (token: string | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  // Kept in a ref (not the effect's dependency array) so passing a fresh
  // inline callback on every parent render doesn't tear down and re-render
  // the widget each time — same pattern as QrScanner's onScanRef.
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (token) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
        });
      })
      .catch(() => {
        // Script failed to load (network hiccup, ad-blocker) — registration
        // still works either way if TURNSTILE_SECRET_KEY isn't set
        // server-side; if it IS set, the backend will reject with a clear
        // "Verification failed" error instead of silently hanging here.
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} />;
}
