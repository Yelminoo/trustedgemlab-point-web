import { useEffect } from 'react';

import { useAuthStore } from '@/lib/stores/auth-store';

// No UI — mounted once near the root (see BaseLayout.astro), persisted
// across client-side transitions so this only ever runs once per browser
// tab. Reads the stored session (if any) from localStorage and marks the
// store `hydrated` — every gated page waits on that flag before deciding
// what to render.
export function AuthHydrator() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
