import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CustomerUser } from '@/lib/api/auth';

// Web has no secure keychain equivalent to expo-secure-store — the access
// token lives in localStorage like any ordinary web app session. This is a
// deliberate, lower bar than the mobile app's Keystore/Keychain-backed
// storage; acceptable here since this is a standard browser session, not a
// device credential store.
interface AuthState {
  customer: CustomerUser | null;
  accessToken: string | null;
  hydrated: boolean;
  setSession: (customer: CustomerUser, accessToken: string) => void;
  updateCustomer: (patch: Partial<CustomerUser>) => void;
  logout: () => void;
}

// A no-op Storage-like object used only during Astro's build-time SSR pass
// (client:load components still run once on the server to produce initial
// HTML) — real `localStorage` doesn't exist in that Node environment.
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      customer: null,
      accessToken: null,
      hydrated: false,

      setSession: (customer, accessToken) => set({ customer, accessToken }),

      updateCustomer: (patch) => {
        const current = get().customer;
        if (!current) return;
        set({ customer: { ...current, ...patch } });
      },

      logout: () => set({ customer: null, accessToken: null }),
    }),
    {
      name: 'tgl_customer_session',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : noopStorage)),
      // Rehydration is triggered manually (see AuthHydrator) rather than
      // automatically on store creation, so the very first client render
      // matches the server-rendered (always-signed-out) HTML exactly —
      // auto-rehydrating here would read localStorage during the initial
      // render and mismatch against what was server-rendered.
      skipHydration: true,
      partialize: (state) => ({ customer: state.customer, accessToken: state.accessToken }),
      // Runs after rehydration completes, success or failure (e.g. corrupt
      // JSON in localStorage) — either way, stop treating the session as
      // "still loading" so gated UI can render its signed-out state.
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hydrated: true });
      },
    }
  )
);
