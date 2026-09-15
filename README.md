# trusted-gemlab-web

The web counterpart to `mobile-point` (the Expo app) — same feature set (customer points/wallet, member card, certificate lookup, free-certificate redemption, and an Admin area), same backend (`trusted-gemlab-mobile-backend`), built with [Astro](https://astro.build) + React islands + Tailwind CSS v4.

This project has **no backend of its own** — it's a pure client of `trusted-gemlab-mobile-backend`'s existing API (`PUBLIC_API_URL`, see `.env.example`). CORS on that backend is already open (`origin: true`), so no backend changes were needed to stand this up.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in PUBLIC_API_URL if it differs from the default
npm run dev
```

## Structure

- `src/pages/*.astro` — one file per route (`/`, `/account`, `/certificates`, `/redeem`, `/admin`). Each renders a single top-level React island (`client:load`) for that page's interactive content, wrapped by `src/layouts/BaseLayout.astro`.
- `src/lib/api/*` — ported near 1:1 from `mobile-point/src/api/*`, swapping `EXPO_PUBLIC_*` env vars for Vite's `PUBLIC_*` and RN `fetch` quirks for browser `fetch`.
- `src/lib/stores/auth-store.ts` — Zustand + `persist`, backed by `localStorage` (not `expo-secure-store` — see the file's own comment on why that's an acceptable, lower bar here).
- `src/components/{account,home,certificates,admin,shared}/` — React components, grouped by the page that owns them; `shared/` holds cross-cutting UI primitives (`ui.tsx`), `QrScanner` (wraps `html5-qrcode`, used by both the customer cert-scan flow and Admin's member-scan flow), and `Modal`.

## Scope decisions from the initial build

- **No i18n yet.** `mobile-point` ships English + Burmese via `react-i18next`; this app is English-only for now, with strings hardcoded in components rather than wired through a translation layer. Revisit if Burmese support is needed here too — the locale JSON in `mobile-point/src/i18n/locales/` is the source to port from.
- **No Face ID / biometric equivalent.** Not meaningful on the web; password auth only.
- **No dark-mode toggle UI.** Dark mode still works — `src/styles/global.css` follows `prefers-color-scheme` automatically — there's just no manual override control like the mobile app's theme toggle.
- **Idempotency-key protection** for the two admin mutation routes (issuing points, reviewing certificate requests) is wired the same way as the mobile app — see `src/lib/idempotency-key.ts` and its usage in `MemberDetail.tsx`/`RequestsView.tsx`.
