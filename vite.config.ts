import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

import webExtension, { readJsonFile } from "vite-plugin-web-extension";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    webExtension({
      manifest: () => {
        const pkg = readJsonFile("package.json");
        const manifest = readJsonFile("src/manifest.json");
        return { ...manifest, version: manifest.version }; // syncs version from package.json
      },
      additionalInputs: ["src/blocked-site/index.html"],
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
