// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Sortie 100 % statique (Cloudflare Pages). Pas de backend runtime.
export default defineConfig({
  site: 'https://consensus.pages.dev',
  output: 'static',
  integrations: [mdx()],
});
