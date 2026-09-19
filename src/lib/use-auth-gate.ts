import { navigate } from 'astro:transitions/client';
import { useEffect } from 'react';

import { useAuthStore } from '@/lib/stores/auth-store';

// Every page that requires a signed-in session (dashboard, certificates,
// redeem, admin) uses this instead of rendering its own inline "please sign
// in" card — the public landing page (/) is now the one gate all of them
// redirect back to, so there's a single, consistent entry point rather than
// scattered per-page prompts. `ready` stays false during the brief
// hydration window too, so callers render a loading state (not protected
// content, not a flash of the redirect) until the session is confirmed.
export function useAuthGate() {
  const { customer, accessToken, hydrated } = useAuthStore();

  useEffect(() => {
    if (hydrated && !customer) {
      navigate('/');
    }
  }, [hydrated, customer]);

  return { customer, accessToken, hydrated, ready: hydrated && !!customer };
}
