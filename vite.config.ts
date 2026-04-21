import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

import webExtension, { readJsonFile } from 'vite-plugin-web-extension';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    webExtension({
      manifest: () => {
        const pkg = readJsonFile('package.json');
        const manifest = readJsonFile('src/manifest.json');
        return { ...manifest, version: pkg.version }; // syncs version from package.json
      },
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
  
})
