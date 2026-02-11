from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from pydantic import BaseModel
from app.tts.service import generate_audio_from_text, generate_speech
from app.tts.pdf_utils import extract_text_from_pdf
import os

router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    lang: str = "en"
    slow: bool = False

@router.post("/tts")
def text_to_speech(request: TTSRequest):
    """
    Convert text to speech - Returns audio blob for frontend playback.
    
    Args:
        request: TTSRequest with text, lang, and slow parameters
        
    Returns:
        Audio file as blob response
    """
    try:
        # Validate input
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Generate speech with lang and slow parameters
        audio_file_path = generate_audio_from_text(
            request.text,
            request.lang,
            request.slow
        )
        
        # Return audio file as blob for frontend
        return FileResponse(
            path=audio_file_path,
            media_type="audio/mpeg",
            filename="audio.mp3"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")

@router.post("/tts/json")
def text_to_speech_json(request: TTSRequest):
    """
    Convert text to speech - Returns JSON response for API consumers.
    
    Args:
        request: TTSRequest with text, lang, and slow parameters
        
    Returns:
        JSON with status and audio_file path
    """
    try:
        # Validate input
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Generate speech with lang and slow parameters
        audio_path = generate_audio_from_text(
            request.text,
            request.lang,
            request.slow
        )
        
        return {
            "status": "success",
            "audio_file": audio_path
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")

@router.post("/pdf")
async def pdf_to_speech_frontend(
    file: UploadFile = File(...),
    lang: str = "en",
    slow: bool = False
):
    """
    PDF endpoint for frontend - Returns audio blob for direct playback.
    
    Args:
        file: Uploaded PDF file
        lang: Language code (default: "en")
        slow: Slow speech mode (default: False)
        
    Returns:
        Audio file as blob response with extracted text in headers
    """
    try:
        # Validate file
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Read file content
        content = await file.read()
        
        # Validate file size (10MB limit)
        max_size = 10 * 1024 * 1024  # 10MB in bytes
        if len(content) > max_size:
            raise HTTPException(
                status_code=400, 
                detail=f"File too large. Maximum size is {max_size / (1024*1024):.0f}MB"
            )
        
        # Save temporarily
        temp_path = f"temp/{file.filename}"
        os.makedirs("temp", exist_ok=True)
        
        with open(temp_path, "wb") as f:
            f.write(content)
        
        try:
            # Extract text from PDF
            text = extract_text_from_pdf(temp_path)
            
            # Validate extracted text
            if not text or not text.strip():
                raise HTTPException(status_code=400, detail="No text found in PDF or PDF is empty")
            
            # Generate speech using provided language and slow mode settings
            audio_file_path = generate_audio_from_text(text, lang, slow)
            
            # Return audio file as blob for frontend
            return FileResponse(
                path=audio_file_path,
                media_type="audio/mpeg",
                filename="audio.mp3",
                headers={"X-Extracted-Text": text[:500]}  # First 500 chars in header
            )
        
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF processing failed: {str(e)}")

@router.post("/tts/pdf")
async def pdf_to_speech_legacy(file: UploadFile = File(...)):
    """
    Legacy PDF endpoint - Returns JSON response.
    
    Args:
        file: Uploaded PDF file
        
    Returns:
        JSON with audio_url, text_length, chunks count, and extracted_text
    """
    try:
        # Validate file
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Read file content
        content = await file.read()
        
        # Validate file size (10MB limit)
        max_size = 10 * 1024 * 1024  # 10MB in bytes
        if len(content) > max_size:
            raise HTTPException(
                status_code=400, 
                detail=f"File too large. Maximum size is {max_size / (1024*1024):.0f}MB"
            )
        
        # Save temporarily
        temp_path = f"temp/{file.filename}"
        os.makedirs("temp", exist_ok=True)
        
        with open(temp_path, "wb") as f:
            f.write(content)
        
        try:
            # Extract text from PDF
            text = extract_text_from_pdf(temp_path)
            
            # Validate extracted text
            if not text or not text.strip():
                raise HTTPException(status_code=400, detail="No text found in PDF or PDF is empty")
            
            # Generate speech using legacy function
            audio_filename, chunks = generate_speech(text)
            
            return {
                "audio_url": f"/audio/{audio_filename}",
                "text_length": len(text),
                "chunks": chunks,
                "extracted_text": text
            }
        
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF processing failed: {str(e)}")

# Keep old TTS endpoint for backward compatibility
class LegacyTTSRequest(BaseModel):
    text: str

@router.post("/tts/legacy")
async def text_to_speech_legacy(request: LegacyTTSRequest):
    """
    Legacy TTS endpoint - Returns JSON response with audio_url format.
    """
    try:
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        audio_filename, chunks = generate_speech(request.text)
        
        return {
            "audio_url": f"/audio/{audio_filename}",
            "text_length": len(request.text),
            "chunks": chunks
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")
