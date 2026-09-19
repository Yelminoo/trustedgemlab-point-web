// True when the page is running as the installed app (opened from the
// home-screen icon), not as an ordinary browser tab. Shared by
// use-install-prompt.ts (to hide the install CTA once installed) and
// LandingGate.tsx (to skip the marketing pitch when launched standalone —
// see that file's comment for why).
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  // iOS Safari has no display-mode media query support for this — it
  // exposes navigator.standalone instead, hence checking both.
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}
