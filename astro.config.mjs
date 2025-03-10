// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://c4all.org',
  vite: {
    plugins: [tailwindcss()]
  },
  i18n: {
    locales: ["en", "es"], // Locales you want to support
    defaultLocale: "en", // Default locale (fallback)

    routing: {
      prefixDefaultLocale: true, // Ensures that your default locale is prefixed aswell
    },
  },
});