import { subscribeWebPush, unsubscribeWebPush } from '@/lib/api/push';

const VAPID_PUBLIC_KEY = import.meta.env.PUBLIC_VAPID_KEY;

// The browser Push API wants the VAPID public key as a raw Uint8Array, but
// it's generated/distributed as a URL-safe base64 string (see
// trusted-gemlab-mobile-backend's .env.example) — this is the standard
// conversion every Web Push guide uses.
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  // Built via `new Uint8Array(length)` + a loop rather than
  // `Uint8Array.from(...)` — the latter types as
  // `Uint8Array<ArrayBufferLike>` (as of TS 5.7's generic typed arrays),
  // which no longer satisfies PushSubscriptionOptionsInit's stricter
  // `BufferSource` (it excludes SharedArrayBuffer-backed views); this form
  // types as `Uint8Array<ArrayBuffer>` and satisfies it directly.
  const out = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) out[i] = rawData.charCodeAt(i);
  return out;
}

// Remembers what this tab last successfully subscribed, so logout can
// unsubscribe the SAME subscription without needing to re-derive it.
let lastSubscription: PushSubscription | null = null;

// Safari (both iOS and macOS) only supports Web Push for an installed/
// standalone PWA, not an ordinary browser tab — subscribe() will just
// reject there, which registerForPushNotifications already treats as a
// silent no-op (never blocks sign-in over this).
export async function registerForPushNotifications(accessToken: string): Promise<void> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  if (!VAPID_PUBLIC_KEY) {
    console.warn('[push] PUBLIC_VAPID_KEY is not set — skipping web push registration');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    lastSubscription = subscription;
    const json = subscription.toJSON();
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return;
    await subscribeWebPush({ endpoint: json.endpoint, keys: { p256dh: json.keys.p256dh, auth: json.keys.auth } }, accessToken);
  } catch (error) {
    // Never let a push-registration failure block sign-in — this is a
    // best-effort side channel, not a required part of auth.
    console.warn('[push] failed to register for push notifications:', error);
  }
}

export async function unregisterPushNotifications(accessToken: string): Promise<void> {
  const subscription = lastSubscription;
  if (!subscription) return;
  lastSubscription = null;
  try {
    await unsubscribeWebPush(subscription.endpoint, accessToken);
    await subscription.unsubscribe();
  } catch (error) {
    console.warn('[push] failed to unregister push notifications:', error);
  }
}
