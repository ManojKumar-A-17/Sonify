from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from app.tts.service import generate_speech
from app.tts.pdf_utils import extract_text_from_pdf
import os

router = APIRouter()

class TTSRequest(BaseModel):
    text: str

@router.post("/tts")
async def text_to_speech(request: TTSRequest):
    """
    Convert text to speech audio file.
    
    Args:
        request: TTSRequest with text field
        
    Returns:
        Dictionary with audio_url, text_length, and chunks count
        
    Raises:
        HTTPException: If text is empty or TTS generation fails
    """
    try:
        # Validate input
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Generate speech
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

@router.post("/tts/pdf")
async def pdf_to_speech(file: UploadFile = File(...)):
    """
    Extract text from PDF and convert to speech audio file.
    
    Args:
        file: Uploaded PDF file
        
    Returns:
        Dictionary with audio_url, text_length, chunks count, and extracted_text
        
    Raises:
        HTTPException: If file is invalid, too large, or processing fails
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
            
            # Generate speech
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
