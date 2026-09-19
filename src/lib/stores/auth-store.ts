import { create } from 'zustand';

import type { CustomerUser } from '@/lib/api/auth';

// Web has no secure keychain equivalent to expo-secure-store — the access
// token lives in localStorage like any ordinary web app session. This is a
// deliberate, lower bar than the mobile app's Keystore/Keychain-backed
// storage; acceptable here since this is a standard browser session, not a
// device credential store.
const STORAGE_KEY = 'tgl_customer_session';

interface StoredSession {
  customer: CustomerUser;
  accessToken: string;
}

interface AuthState {
  customer: CustomerUser | null;
  accessToken: string | null;
  hydrated: boolean;
  // Explicit, hand-rolled hydration instead of zustand's `persist`
  // middleware — that middleware's rehydrate() lifecycle turned out not to
  // reliably resolve on every load in testing (some page loads never
  // reached `hydrated: true`, leaving every gated page stuck on its
  // loading skeleton forever). This is the same plain
  // read-localStorage-in-an-effect pattern mobile-point's own auth-store
  // uses, which has no such issue — simpler to reason about and verify.
  hydrate: () => void;
  setSession: (customer: CustomerUser, accessToken: string) => void;
  updateCustomer: (patch: Partial<CustomerUser>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  customer: null,
  accessToken: null,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return; // AuthHydrator is a persisted island, so this only ever needs to run once anyway
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as StoredSession;
        set({ customer: stored.customer, accessToken: stored.accessToken, hydrated: true });
        return;
      }
    } catch {
      // Corrupt/unparseable stored session — fall through and treat as
      // signed out rather than leaving the app stuck loading forever.
    }
    set({ hydrated: true });
  },

  setSession: (customer, accessToken) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ customer, accessToken }));
    set({ customer, accessToken });
  },

  updateCustomer: (patch) => {
    const { customer, accessToken } = get();
    if (!customer || !accessToken) return;
    const next = { ...customer, ...patch };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ customer: next, accessToken }));
    set({ customer: next });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ customer: null, accessToken: null });
  },
}));
