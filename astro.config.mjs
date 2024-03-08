import { defineConfig } from "astro/config";
import vercelServerless from '@astrojs/vercel/serverless';

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercelServerless(),
  build: {
    inlineStylesheets: "never"
  },
  devToolbar: {
    enabled: false
  },
  vite: {
    css: {
      devSourcemap: true
    }
  },
  integrations: [svelte()]
});
