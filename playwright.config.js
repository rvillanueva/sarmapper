import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */

  reporter: "html",
  /* Use longer timeouts on CI. */
  timeout: process.env.CI ? 30 * 1000 : 10 * 1000,

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `http://${process.env.HOST || "localhost"}:${
      process.env.PORT || 3000
    }`,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? "on-first-retry" : "retain-on-failure",

    screenshot: "only-on-failure",
    video: process.env.CI ? "on-first-retry" : "retain-on-failure",
  },

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "yarn preview",
    url: `http://127.0.0.1:3000`,
    reuseExistingServer: !process.env.CI,
  },
});
