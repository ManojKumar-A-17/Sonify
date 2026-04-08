from gtts import gTTS
from gtts.lang import tts_langs
from pydub import AudioSegment
import uuid
import os
import tempfile
from app.tts.utils import split_text

# Use temp directory for audio generation
AUDIO_DIR = "audio"
os.makedirs(AUDIO_DIR, exist_ok=True)
SUPPORTED_TTS_LANGUAGES = tts_langs()

def generate_audio_from_text(text, lang="en", slow=False):
    """
    Generate audio from text with support for long texts via chunking and merging.
    
    Args:
        text: Input text to convert to speech
        lang: Language code (default: "en")
        slow: Slow speech mode (default: False)
        
    Returns:
        Path to the final merged audio file
    """
    if lang not in SUPPORTED_TTS_LANGUAGES:
        raise ValueError(f"Unsupported language code: {lang}")

    chunks = split_text(text)
    audio_parts = []

    for i, chunk in enumerate(chunks):
        filename = f"{AUDIO_DIR}/part_{i}_{uuid.uuid4()}.mp3"
        tts = gTTS(text=chunk, lang=lang, slow=slow)
        tts.save(filename)
        audio_parts.append(filename)

    final_audio = AudioSegment.empty()
    for part in audio_parts:
        final_audio += AudioSegment.from_mp3(part)

    final_name = f"{AUDIO_DIR}/final_{uuid.uuid4()}.mp3"
    final_audio.export(final_name, format="mp3")

    # Optional: cleanup parts
    for part in audio_parts:
        os.remove(part)

    return final_name

# Keep old function for backward compatibility
def generate_speech(text: str) -> tuple[str, int]:
    """
    Backward compatibility wrapper for generate_audio_from_text.
    
    Returns:
        Tuple of (audio_filename, number_of_chunks)
    """
    # Create necessary directories
    os.makedirs("audio", exist_ok=True)
    os.makedirs("temp", exist_ok=True)
    
    # Generate unique filename
    audio_filename = f"speech_{uuid.uuid4().hex[:8]}.mp3"
    audio_path = os.path.join("audio", audio_filename)
    
    # Chunk text if necessary
    chunks = split_text(text)
    
    if len(chunks) == 1:
        # Single chunk - direct generation
        tts = gTTS(text=text, lang='en', slow=False)
        tts.save(audio_path)
        return audio_filename, 1
    else:
        # Multiple chunks - generate and merge
        chunk_files = []
        
        try:
            # Generate audio for each chunk
            for i, chunk in enumerate(chunks):
                chunk_filename = f"temp/chunk_{uuid.uuid4().hex[:8]}_{i}.mp3"
                tts = gTTS(text=chunk, lang='en', slow=False)
                tts.save(chunk_filename)
                chunk_files.append(chunk_filename)
            
            # Merge audio chunks
            combined = AudioSegment.empty()
            for chunk_file in chunk_files:
                audio = AudioSegment.from_mp3(chunk_file)
                combined += audio
            
            # Export merged audio
            combined.export(audio_path, format="mp3")
            
            return audio_filename, len(chunks)
        
        finally:
            # Clean up chunk files
            for chunk_file in chunk_files:
                if os.path.exists(chunk_file):
                    os.remove(chunk_file)
