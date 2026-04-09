import { defineConfig, devices } from '@playwright/test';

// Standard Playwright configuration — replaced the internal helper so the
// project can run tests without the private package.
export default defineConfig({
  // Add your custom playwright configuration overrides here
  // Example:
  // timeout: 60000,
  // use: { baseURL: 'http://localhost:3000' },
});
