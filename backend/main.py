from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes.tts import router as tts_router
import os

app = FastAPI(title="EchoVerse TTS Backend")

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

# Include routers with /api prefix to match frontend expectations
app.include_router(tts_router, prefix="/api")

# Mount static files
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

@app.get("/")
def read_root():
    return {
        "message": "EchoVerse TTS Backend",
        "version": "1.0.0",
        "endpoints": {
            "text_to_speech": "/api/tts",
            "text_to_speech_json": "/api/tts/json", 
            "pdf_to_speech": "/api/pdf",
            "pdf_to_speech_legacy": "/api/tts/pdf",
            "docs": "/docs"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
