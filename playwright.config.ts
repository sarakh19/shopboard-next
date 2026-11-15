import { defineConfig, devices } from '@playwright/test'

const PORT = 3000
const BASE_URL = `http://localhost:${PORT}`

// End-to-end tests (npm run test:e2e): a real browser clicks through the app.
export default defineConfig({
  testDir: './e2e',
  // The dev server compiles each page the first time it is opened.
  timeout: 60_000,
  use: {
    // page.goto('/products') opens http://localhost:3000/products.
    baseURL: BASE_URL,
    // Keep a trace of the first retry to see what went wrong.
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Starts the app before the tests. If it is already running (npm run dev
  // in another terminal), Playwright uses it instead of starting a second one.
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
