// pm2 process definition for production — mirrors
// trusted-gemlab-mobile-backend's ecosystem.config.js (same fork-mode
// reasoning applies here too, see that file's comment).
//
// Runs `astro preview`, Astro's own production static-file server, rather
// than having nginx serve dist/ directly — kept consistent with how the
// backend runs (a managed pm2 process nginx reverse-proxies to) rather than
// mixing two different serving strategies across the two apps.
//
// No --env-file needed here (unlike the backend): this is a static build —
// every PUBLIC_* env var is already baked into the built HTML/JS during
// `npm run build`, there's no server-side runtime env access happening.
module.exports = {
  apps: [
    {
      name: 'trusted-gemlab-web',
      script: 'node_modules/.bin/astro',
      args: 'preview --port 4322 --host 127.0.0.1',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
