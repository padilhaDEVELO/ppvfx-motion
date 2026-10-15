import { defineConfig, devices } from '@playwright/test';

// Testa o build de produção (dist/) servido localmente com a mesma base do GitHub Pages.
const PORTA = 4329;
const ORIGEM = `http://127.0.0.1:${PORTA}`;

export default defineConfig({
  testDir: 'tests',
  outputDir: 'test-results/artefatos',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: 'test-results/relatorio', open: 'never' }]],
  use: {
    baseURL: `${ORIGEM}/ppvfx-motion/`,
    trace: 'retain-on-failure',
    locale: 'pt-BR',
  },
  webServer: {
    command: `npx astro preview --host 127.0.0.1 --port ${PORTA}`,
    url: `${ORIGEM}/ppvfx-motion/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'celular-android', use: { ...devices['Pixel 7'] } },
    { name: 'celular-iphone', use: { ...devices['iPhone 14'] } },
  ],
});
