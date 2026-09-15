import { QueryClient } from '@tanstack/react-query';

// One shared instance per browser tab — created lazily so it's never
// instantiated during Astro's build-time SSR pass.
let client: QueryClient | null = null;

export function getQueryClient(): QueryClient {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: { retry: 1, refetchOnWindowFocus: false },
      },
    });
  }
  return client;
}
