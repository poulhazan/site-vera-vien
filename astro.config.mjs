import { defineConfig } from 'astro/config';
import PinyAstro from '@pinegrow/piny-astro';

// ─────────────────────────────────────────────────────────────────────────
// GitHub Pages configuration
//
// If you deploy to https://<user>.github.io/<repo>/  → keep `base` set to
//   '/<repo>/' (replace <repo> with your actual repository name) and set
//   `site` to your github.io URL.
//
// If you deploy to a custom domain (e.g. https://veravien.ca) via a CNAME
//   file in /public → set `base` to '/' and `site` to your custom domain.
// ─────────────────────────────────────────────────────────────────────────
export default defineConfig({
  site: 'https://veravien.ca',
  base: '/',
  trailingSlash: 'always',

  integrations: [PinyAstro()],

  vite: {
    server: {
      // Project images live inside a OneDrive-synced folder, which briefly
      // locks files during sync and trips Vite's watcher (EBUSY). These are
      // static assets that don't need hot-reload watching anyway.
      watch: {
        ignored: ['**/public/assets/images/**'],
      },
    },
  },
});