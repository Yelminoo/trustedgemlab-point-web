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

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${requireApiUrl()}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.error ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function apiGetAuth<T>(path: string, accessToken: string): Promise<T> {
  const res = await fetch(`${requireApiUrl()}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.error ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function apiMutateAuth<T>(
  method: 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body: unknown,
  accessToken: string,
  extraHeaders?: Record<string, string>
): Promise<T> {
  const res = await fetch(`${requireApiUrl()}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
  const responseBody = await res.json();
  if (!res.ok) {
    throw new ApiError(res.status, responseBody?.error ?? `Request failed with status ${res.status}`);
  }
  return responseBody;
}

// Unauthenticated POST — registration, login, password reset request/confirm.
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${requireApiUrl()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const responseBody = await res.json();
  if (!res.ok) {
    throw new ApiError(res.status, responseBody?.error ?? `Request failed with status ${res.status}`);
  }
  return responseBody;
}
