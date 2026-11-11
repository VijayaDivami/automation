import path from 'path';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  reporter: [['html', { open: 'never' }], ['list']],
  webServer: {
    command: '.venv/bin/python server.py',
    url: 'http://localhost:5000',
    reuseExistingServer: true,
    timeout: 300_000, // first run may download the model
  },
  use: {
    baseURL: 'http://localhost:5000',
    permissions: ['microphone'],
    trace: 'on',
    launchOptions: {
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        `--use-file-for-fake-audio-capture=${path.resolve('samples/test.wav')}`,
      ],
    },
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
