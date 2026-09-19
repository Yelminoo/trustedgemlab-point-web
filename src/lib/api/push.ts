import { apiMutateAuth } from '@/lib/api/client';

export interface WebPushSubscriptionPayload {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export function subscribeWebPush(subscription: WebPushSubscriptionPayload, accessToken: string) {
  return apiMutateAuth<{ ok: true }>('POST', '/customer/web-push/subscribe', subscription, accessToken);
}

export function unsubscribeWebPush(endpoint: string, accessToken: string) {
  return apiMutateAuth<{ ok: true }>('DELETE', '/customer/web-push/subscribe', { endpoint }, accessToken);
}
