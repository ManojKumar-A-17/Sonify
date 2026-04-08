import os
import tempfile
from pathlib import Path

import speech_recognition as sr
from pydub import AudioSegment


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


def transcribe_audio_bytes(audio_bytes: bytes, filename: str) -> str:
    """
    Convert uploaded audio into text using SpeechRecognition.

    This keeps the local footprint small, but it depends on the recognizer
    being able to reach its transcription backend at runtime.
    """
    suffix = Path(filename).suffix or ".audio"
    recognizer = sr.Recognizer()

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

        try:
            return recognizer.recognize_google(audio_data).strip()
        except sr.UnknownValueError:
            return ""
        except sr.RequestError as exc:
            raise RuntimeError(
                "Speech recognition service is unavailable right now. "
                "Please try again when the network is available."
            ) from exc
