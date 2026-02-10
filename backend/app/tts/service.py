from gtts import gTTS
from pydub import AudioSegment
import os
import uuid
from app.tts.utils import chunk_text

def generate_speech(text: str) -> tuple[str, int]:
    """
    Generate speech from text, handling long texts by chunking and merging.
    
    Args:
        text: Input text to convert to speech
        
    Returns:
        Tuple of (audio_filename, number_of_chunks)
        
    Raises:
        Exception: If TTS generation or audio merging fails
    """
    # Create necessary directories
    os.makedirs("audio", exist_ok=True)
    os.makedirs("temp", exist_ok=True)
    
    # Generate unique filename
    audio_filename = f"speech_{uuid.uuid4().hex[:8]}.mp3"
    audio_path = os.path.join("audio", audio_filename)
    
    # Chunk text if necessary
    chunks = chunk_text(text)
    
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
