import os

from faster_whisper import WhisperModel

# Fixed language avoids Whisper auto-detect misfires on short clips. Set to "" to auto-detect.
LANGUAGE = os.environ.get("WHISPER_LANGUAGE", "en") or None

_model = None


def load_model(model_size: str = "small") -> WhisperModel:
    """Download (first run only) and load the model. Call at startup."""
    global _model
    if _model is None:
        _model = WhisperModel(model_size, device="cpu", compute_type="int8")
    return _model


def transcribe(path: str) -> str:
    """Transcribe an audio file to text with a local Whisper model."""
    segments, _ = load_model().transcribe(path, language=LANGUAGE, vad_filter=True)
    return " ".join(s.text.strip() for s in segments)
