import { navigate } from 'astro:transitions/client';
import { useEffect } from 'react';

import { isStandalone } from '@/lib/is-standalone';
import { useAuthStore } from '@/lib/stores/auth-store';

// No UI — mounted once on the landing page.
//
// A visitor who's already signed in has no reason to see the marketing
// pitch again, so send them straight to their dashboard.
//
// Separately: the manifest's start_url already points installed-app
// launches at /dashboard, but iOS Safari has historically been
// inconsistent about honoring that (older versions just reopen whatever
// URL "Add to Home Screen" was tapped from) — so this checks
// display-mode/navigator.standalone directly as a robust fallback. Anyone
// who already installed the app doesn't need the "why you should install
// this" pitch either; landing straight on sign-in is the right experience
// for a returning, already-committed user, regardless of which URL the OS
// actually opened.
export function LandingGate() {
  const { customer, hydrated } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;
    if (customer) {
      navigate('/dashboard');
    } else if (isStandalone()) {
      navigate('/account');
    }
  }, [hydrated, customer]);

  return null;
}
