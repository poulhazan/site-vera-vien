import { defineConfig } from 'astro/config';
import PinyAstro from '@pinegrow/piny-astro';

// Deployed on Vercel (vercel.com, connected to this GitHub repo) with the
// custom domain veravien.com configured in the Vercel project settings.
export default defineConfig({
  site: 'https://veravien.com',
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