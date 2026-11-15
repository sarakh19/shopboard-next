import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

// Unit and component tests (npm test).
export default defineConfig({
  // react(): understands JSX.
  plugins: [react()],
  // Understands the `@/` imports from tsconfig.json (built into Vite).
  resolve: { tsconfigPaths: true },
  test: {
    // A fake browser (document, window) inside Node, so render() works.
    environment: 'jsdom',
    // Runs before every test file: adds the jest-dom matchers.
    setupFiles: ['./vitest.setup.ts'],
    // e2e/ holds Playwright tests; they run with `npm run test:e2e` instead.
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
})
