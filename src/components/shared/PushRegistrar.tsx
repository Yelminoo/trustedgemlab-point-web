import { useEffect, useRef } from 'react';

import { registerForPushNotifications, unregisterPushNotifications } from '@/lib/push-notifications';
import { useAuthStore } from '@/lib/stores/auth-store';

// No UI — mounted once at the root (see BaseLayout.astro), persisted
// across client-side transitions like AuthHydrator/Nav so this only reacts
// to an actual sign-in/sign-out, not every page navigation. Subscribes for
// push notifications right after sign-in and unsubscribes on logout — same
// pattern as mobile-point's own PushNotificationRegistrar, adapted for the
// browser's Push API instead of Expo push tokens.
export function PushRegistrar() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrated = useAuthStore((s) => s.hydrated);
  const prevAccessToken = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    const previous = prevAccessToken.current;
    prevAccessToken.current = accessToken;

    if (accessToken && previous !== accessToken) {
      void registerForPushNotifications(accessToken);
    } else if (!accessToken && previous) {
      void unregisterPushNotifications(previous);
    }
  }, [accessToken, hydrated]);

  return null;
}
