import { defineConfig } from "astro/config";
import vercelServerless from '@astrojs/vercel/serverless';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercelServerless(),
  build: {
    inlineStylesheets: "never",
  },
  devToolbar: { enabled: false },
  integrations: [
    // partytown(),
    mdx(),
  ],
  vite: {
    css: {
      devSourcemap: true,
    },
  },
});
