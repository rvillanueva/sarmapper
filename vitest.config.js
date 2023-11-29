/// <reference types="vitest" />
/// <reference types="vitest/globals" />

import { defineConfig } from "vitest/config";
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tools/setupTests.js",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/e2e/**",
      "**/build/**",
    ],
  },
});
