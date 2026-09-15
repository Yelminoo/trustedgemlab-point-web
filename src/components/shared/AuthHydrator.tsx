import { useEffect } from 'react';

import { useAuthStore } from '@/lib/stores/auth-store';

// No UI — mounted once near the root (see BaseLayout.astro). Triggers
// zustand persist's rehydration exactly once on the client, after the
// initial (always-signed-out) server-rendered HTML has already painted, to
// avoid a hydration mismatch. Every page that needs auth state waits on
// `hydrated` before deciding what to render (see useRequireAuth/useAuth).
export function AuthHydrator() {
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
  }, []);

  return null;
}
