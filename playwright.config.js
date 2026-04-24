import { defineConfig } from '@playwright/test';

/**
 * Playwright config for HungerWood frontend.
 *
 * Spawns a Vite preview build on :3099 and assumes a backend is reachable
 * at the URL in the env (.env.test or default 5099). Customer-visible pages
 * that don't need auth (Home, Grocery Home, Category) are testable today;
 * auth-gated paths require the backend OTP-bypass mode (E2E_BYPASS_OTP=true)
 * which is documented in e2e/README.md and enabled by setting that env on
 * the backend.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false, // single browser keeps things deterministic against the live backend
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['junit', { outputFile: 'playwright-results.xml' }]] : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3099',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: process.env.E2E_NO_SERVER
    ? undefined
    : {
        command: 'npm run preview -- --port 3099',
        url: 'http://localhost:3099',
        timeout: 60_000,
        reuseExistingServer: !process.env.CI,
      },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
