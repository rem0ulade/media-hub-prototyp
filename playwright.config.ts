import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://127.0.0.1:5173/media-hub-prototyp/",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "npm run dev:api",
      port: 3001,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run dev:web",
      port: 5173,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
