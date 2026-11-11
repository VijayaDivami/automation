import { test, expect } from '@playwright/test';

const CLIP_SECONDS = 9.5; // length of samples/test.wav

test.describe('Live audio to text', () => {
  test('transcribes the recorded sentences', { tag: ['@transcribe', '@web', '@whisper'] }, async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#status')).toHaveAttribute('data-state', 'idle');

    await page.getByRole('button', { name: 'Start recording' }).click();
    await expect(page.locator('#status')).toHaveAttribute('data-state', 'recording');
    await page.waitForTimeout((CLIP_SECONDS + 0.1) * 1000);

    await page.getByRole('button', { name: 'Stop recording' }).click();
    await expect(page.locator('#status')).toHaveAttribute('data-state', 'done', { timeout: 90_000 });

    const text = (await page.getByTestId('transcript').innerText()).toLowerCase();
    for (const word of ['transcription', 'weather', 'meeting', 'thank you']) {
      expect(text).toContain(word);
    }
  });
});
