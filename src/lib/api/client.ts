import { useAuthStore } from '@/lib/stores/auth-store';

// Base URL for trusted-gemlab-mobile-backend — the same standalone backend
// the mobile app talks to (point-backend.trustedgemlab.com). This web app is
// just another client of that one API; it has no backend of its own.
// PUBLIC_ prefix is Vite/Astro's equivalent of Expo's EXPO_PUBLIC_ — required
// for the value to be inlined into the client bundle.
const API_URL = import.meta.env.PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function requireApiUrl(): string {
  if (!API_URL) {
    throw new Error('PUBLIC_API_URL is not set — see .env.example');
  }
  return API_URL;
}

async function parseOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.error ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

// accessTokens only last 15 minutes (see the backend's signAccessToken) —
// this silently exchanges the 7-day refreshToken for a new one via
// POST /customer/refresh whenever a request comes back 401, instead of
// forcing a full re-login every 15 minutes. Deduplicated across concurrent
// requests (several endpoints can all 401 around the same moment) so only
// one refresh call actually goes out; the rest await the same promise.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const { refreshToken, setAccessToken, logout } = useAuthStore.getState();
    if (!refreshToken) {
      logout();
      return null;
    }
    try {
      const res = await fetch(`${requireApiUrl()}/customer/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        // Refresh token itself is invalid/expired (>7 days idle) — there's
        // no recovering from this short of signing in again.
        logout();
        return null;
      }
      const { accessToken } = (await res.json()) as { accessToken: string };
      setAccessToken(accessToken);
      return accessToken;
    } catch {
      // Network error reaching the backend — don't log out over what might
      // just be a dropped connection; the caller's original 401 still
      // surfaces as an error for this one request.
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Shared by apiGetAuth/apiMutateAuth: runs the request, and on a 401,
// attempts exactly one silent refresh-and-retry before giving up.
// `buildInit` is re-invoked with the fresh token so the retry carries it.
async function fetchAuthed<T>(path: string, buildInit: (token: string) => RequestInit, accessToken: string): Promise<T> {
  const res = await fetch(`${requireApiUrl()}${path}`, buildInit(accessToken));
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const retryRes = await fetch(`${requireApiUrl()}${path}`, buildInit(newToken));
      return parseOrThrow<T>(retryRes);
    }
  }
  return parseOrThrow<T>(res);
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${requireApiUrl()}${path}`);
  return parseOrThrow<T>(res);
}

export function apiGetAuth<T>(path: string, accessToken: string): Promise<T> {
  return fetchAuthed<T>(path, (token) => ({ headers: { Authorization: `Bearer ${token}` } }), accessToken);
}

export function apiMutateAuth<T>(
  method: 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body: unknown,
  accessToken: string,
  extraHeaders?: Record<string, string>
): Promise<T> {
  return fetchAuthed<T>(
    path,
    (token) => ({
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...extraHeaders },
      body: JSON.stringify(body),
    }),
    accessToken
  );
}

// Unauthenticated POST — registration, login, password reset request/confirm.
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${requireApiUrl()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseOrThrow<T>(res);
}
