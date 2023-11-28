import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.FRONTEND_PORT ? Number(process.env.FRONTEND_PORT) : 3000,
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      exclude: ["node_modules/geolib/es/**"],
    },
  },
});
