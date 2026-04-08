from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes.tts import router as tts_router
import os
from datetime import datetime, timedelta
import glob

app = FastAPI(title="Sonify TTS Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
os.makedirs("audio", exist_ok=True)
os.makedirs("temp", exist_ok=True)

def cleanup_old_files():
    """
    Clean up audio and temp files older than 1 hour.
    This is a safety mechanism for orphaned files.
    """
    try:
        current_time = datetime.now()
        cutoff_time = current_time - timedelta(hours=1)
        
        # Clean audio directory
        for file_path in glob.glob("audio/*.mp3"):
            try:
                file_time = datetime.fromtimestamp(os.path.getmtime(file_path))
                if file_time < cutoff_time:
                    os.remove(file_path)
                    print(f"Cleaned up old audio file: {file_path}")
            except Exception as e:
                print(f"Error cleaning {file_path}: {e}")
        
        # Clean temp directory
        for file_path in glob.glob("temp/*"):
            if file_path.endswith(".gitkeep"):
                continue
            try:
                file_time = datetime.fromtimestamp(os.path.getmtime(file_path))
                if file_time < cutoff_time:
                    os.remove(file_path)
                    print(f"Cleaned up old temp file: {file_path}")
            except Exception as e:
                print(f"Error cleaning {file_path}: {e}")
    except Exception as e:
        print(f"Cleanup error: {e}")

@app.on_event("startup")
async def startup_event():
    """Run cleanup on startup"""
    cleanup_old_files()

# Include routers with /api prefix to match frontend expectations
app.include_router(tts_router, prefix="/api")

# Mount static files
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

@app.get("/")
def read_root():
    return {
        "message": "Sonify TTS Backend",
        "version": "1.0.0",
        "endpoints": {
            "text_to_speech": "/api/tts",
            "text_to_speech_json": "/api/tts/json", 
            "pdf_to_speech": "/api/pdf",
            "speech_to_text": "/api/transcribe",
            "pdf_to_speech_legacy": "/api/tts/pdf",
            "docs": "/docs"
        }
    }

@app.get("/health")
def health_check():
    # Count files in audio and temp directories
    audio_files = len([f for f in os.listdir("audio") if f.endswith(".mp3")])
    temp_files = len([f for f in os.listdir("temp") if not f.endswith(".gitkeep")])
    
    return {
        "status": "healthy",
        "audio_files": audio_files,
        "temp_files": temp_files,
        "note": "Files are auto-cleaned after streaming and hourly for orphaned files"
    }

@app.get("/cleanup")
def manual_cleanup():
    """Manual cleanup endpoint for admin use"""
    cleanup_old_files()
    return {"status": "cleanup completed"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
