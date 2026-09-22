import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  root: ".",
  publicDir: "public",
  server: {
    port: 5174,
    open: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        privacy: resolve(__dirname, "privacy.html"),
      },
    },
  },
});
