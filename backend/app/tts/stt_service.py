import os
import tempfile
from pathlib import Path

import speech_recognition as sr
from langdetect import DetectorFactory, LangDetectException, detect
from pydub import AudioSegment

DetectorFactory.seed = 0


SUPPORTED_AUDIO_TYPES = {
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/mp4",
    "audio/x-m4a",
    "audio/m4a",
    "audio/ogg",
    "audio/webm",
}

SUPPORTED_STT_LANGUAGES = {
    "en": "en-US",
    "es": "es-ES",
    "fr": "fr-FR",
    "de": "de-DE",
    "it": "it-IT",
    "pt": "pt-PT",
}


def detect_transcript_language(text: str) -> str:
    try:
        return detect(text)
    except LangDetectException:
        return "unknown"


def transcribe_audio_bytes(audio_bytes: bytes, filename: str, lang: str = "auto") -> tuple[str, str]:
    """
    Convert uploaded audio into text using SpeechRecognition.

    This keeps the local footprint small, but it depends on the recognizer
    being able to reach its transcription backend at runtime.
    """
    suffix = Path(filename).suffix or ".audio"
    recognizer = sr.Recognizer()
    candidate_languages = (
        list(SUPPORTED_STT_LANGUAGES.items())
        if lang == "auto"
        else [(lang, SUPPORTED_STT_LANGUAGES.get(lang, SUPPORTED_STT_LANGUAGES["en"]))]
    )

    with tempfile.TemporaryDirectory() as temp_dir:
        input_path = os.path.join(temp_dir, f"input{suffix}")
        wav_path = os.path.join(temp_dir, "normalized.wav")

        with open(input_path, "wb") as input_file:
            input_file.write(audio_bytes)

        audio_segment = AudioSegment.from_file(input_path)
        audio_segment = audio_segment.set_channels(1).set_frame_rate(16000)
        audio_segment.export(wav_path, format="wav")

        with sr.AudioFile(wav_path) as source:
            audio_data = recognizer.record(source)

        candidates: list[tuple[str, str]] = []

        for language_code, recognition_language in candidate_languages:
            try:
                transcript = recognizer.recognize_google(
                    audio_data,
                    language=recognition_language,
                ).strip()
                if transcript:
                    candidates.append((language_code, transcript))
            except sr.UnknownValueError:
                continue
            except sr.RequestError as exc:
                raise RuntimeError(
                    "Speech recognition service is unavailable right now. "
                    "Please try again when the network is available."
                ) from exc

        if lang != "auto":
            if candidates:
                return candidates[0][1], candidates[0][0]
            return "", "unknown"

        best_match: tuple[str, str] | None = None
        fallback_match: tuple[str, str] | None = None

        for language_code, transcript in candidates:
            detected_language = detect_transcript_language(transcript)

            if detected_language == language_code:
                current_choice = (transcript, language_code)
                if best_match is None or len(transcript) > len(best_match[0]):
                    best_match = current_choice

            if fallback_match is None or len(transcript) > len(fallback_match[0]):
                fallback_match = (transcript, language_code)

        if best_match is not None:
            return best_match
        if fallback_match is not None:
            return fallback_match

        return "", "unknown"
