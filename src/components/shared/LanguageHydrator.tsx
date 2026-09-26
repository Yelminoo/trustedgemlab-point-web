import { useEffect } from 'react';

import { useLanguageStore } from '@/lib/stores/language-store';

// No UI — mounted once near the root (see BaseLayout.astro), persisted
// across client-side transitions so this only ever runs once per browser
// tab, same pattern as AuthHydrator. Applies the saved/detected language to
// the shared i18next instance before anything renders text.
export function LanguageHydrator() {
  const hydrate = useLanguageStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
