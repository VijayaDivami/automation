import { defineConfig } from '@playwright/test'

const BASE_URL = 'http://localhost:5000'

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  reporter: [['html', { open: 'never' }], ['list']],
  webServer: {
    command: '.venv/bin/python server.py',
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 300_000, // first run may download the model
  },
  use: {
    baseURL: BASE_URL,
    trace: 'on',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
})
