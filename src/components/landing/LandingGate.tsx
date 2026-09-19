import { navigate } from 'astro:transitions/client';
import { useEffect } from 'react';

import { useAuthStore } from '@/lib/stores/auth-store';

// No UI — mounted once on the landing page. A visitor who's already signed
// in has no reason to see the marketing pitch again, so send them straight
// to their dashboard. Everyone else (including the brief pre-hydration
// window) just sees the landing page render normally underneath this.
export function LandingGate() {
  const { customer, hydrated } = useAuthStore();

  useEffect(() => {
    if (hydrated && customer) {
      navigate('/dashboard');
    }
  }, [hydrated, customer]);

  return null;
}
