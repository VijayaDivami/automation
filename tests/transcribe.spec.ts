import {
  BUTTON,
  RECORD_TAIL_SECONDS,
  SAMPLES,
  SELECTORS,
  STATUS,
  TRANSCRIBE_TIMEOUT_MS,
} from './constants'
import { audioSeconds, expect, test } from './fixtures'

test.describe('Live audio to text', () => {
  for (const { file, keywords } of SAMPLES) {
    test.describe(file, () => {
      test.use({ micAudio: file })

      test(`transcribes ${file}`, { tag: ['@transcribe', '@web', '@whisper'] }, async ({ appPage }) => {
        const status = appPage.locator(SELECTORS.status)

        await appPage.goto('/')
        await expect(status).toHaveAttribute('data-state', STATUS.idle)

        await appPage.getByRole('button', { name: BUTTON.start }).click()
        await expect(status).toHaveAttribute('data-state', STATUS.recording)
        await appPage.waitForTimeout((audioSeconds(file) + RECORD_TAIL_SECONDS) * 1000)

        await appPage.getByRole('button', { name: BUTTON.stop }).click()
        await expect(status).toHaveAttribute('data-state', STATUS.done, { timeout: TRANSCRIBE_TIMEOUT_MS })

        const text = (await appPage.getByTestId(SELECTORS.transcriptTestId).innerText()).toLowerCase()
        for (const word of keywords) {
          expect(text).toContain(word)
        }
      })
    })
  }
})
