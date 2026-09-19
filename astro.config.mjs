// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    // `astro preview` (Vite's preview server underneath) rejects any
    // request whose Host header it doesn't recognize by default — a
    // DNS-rebinding protection. nginx reverse-proxies point.trustedgemlab.com
    // to this process (see ecosystem.config.cjs), forwarding that exact
    // Host header, so it needs to be explicitly allow-listed rather than
    // relying on the localhost-only default.
    preview: {
      allowedHosts: ['point.trustedgemlab.com']
    }
  }
});