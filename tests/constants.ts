// Shared constants for the audio-to-text tests.

export const STATUS = {
  idle: 'idle',
  recording: 'recording',
  transcribing: 'transcribing',
  done: 'done',
  error: 'error',
} as const

export const BUTTON = {
  start: 'Start recording',
  stop: 'Stop recording',
} as const

export const SELECTORS = {
  status: '#status',
  transcriptTestId: 'transcript',
} as const

// Extra seconds to keep recording after the clip ends, so the last word is captured.
export const RECORD_TAIL_SECONDS = 1

export const TRANSCRIBE_TIMEOUT_MS = 90_000

// Each sample file (inside audio_samples/) and the keywords its transcript must contain.
// Keywords, not full sentences: speech models vary their wording slightly.
export const SAMPLES = [
  { file: 'greeting.wav', keywords: ['hello', 'transcription'] },
  { file: 'weather.wav', keywords: ['weather', 'rain', 'evening'] },
  { file: 'meeting.wav', keywords: ['meeting', 'tomorrow', 'morning'] },
  { file: 'report.wav', keywords: ['report', 'team', 'friday'] },
  { file: 'conversation.wav', keywords: ['transcription', 'weather', 'meeting', 'thank you'] },
] as const
