import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { test as base, type Page } from '@playwright/test'

// Folder that holds the audio files. Tests pass only the file name.
export const AUDIO_DIR = resolve(__dirname, '..', 'audio_samples')

export const audioPath = (fileName: string) => join(AUDIO_DIR, fileName)

// Length of a WAV file in seconds, read from its header.
export function audioSeconds(fileName: string): number {
  const buf = readFileSync(audioPath(fileName))
  let byteRate = 0
  let offset = 12
  while (offset + 8 <= buf.length) {
    const id = buf.toString('ascii', offset, offset + 4)
    const size = buf.readUInt32LE(offset + 4)
    if (id === 'fmt ') byteRate = buf.readUInt32LE(offset + 16)
    if (id === 'data' && byteRate > 0) return Math.min(size, buf.length - offset - 8) / byteRate
    offset += 8 + size
  }
  throw new Error(`Could not read duration of ${fileName}`)
}

interface FakeMicrophoneFixtures {
  micAudio: string | undefined
  appPage: Page
}

// Chromium reads its fake microphone file only at launch, and Playwright does not allow changing
// launch options per describe group, so this fixture launches its own browser for each test.
// A test picks its audio with test.use({ micAudio: '<file name in audio_samples/>' }) and then
// uses `appPage`. Without micAudio, `appPage` is Playwright's regular `page`.
// "%noloop" makes the browser play the file once instead of repeating it.
export const test = base.extend<FakeMicrophoneFixtures>({
  micAudio: [undefined, { option: true }],
  appPage: async ({ page, playwright, baseURL, micAudio, headless }, use, testInfo) => {
    if (!micAudio) {
      await use(page)
      return
    }
    const browser = await playwright.chromium.launch({
      headless,
      args: [
        '--use-fake-device-for-media-stream',
        '--use-fake-ui-for-media-stream',
        `--use-file-for-fake-audio-capture=${audioPath(micAudio)}%noloop`,
      ],
    })
    const context = await browser.newContext({ baseURL, permissions: ['microphone'] })
    const micPage = await context.newPage()
    await use(micPage)
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach('screenshot', { body: await micPage.screenshot(), contentType: 'image/png' })
    }
    await browser.close()
  },
})

export { expect } from '@playwright/test'
