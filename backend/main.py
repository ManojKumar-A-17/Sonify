from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import tts
import os

app = FastAPI(title="EchoVerse TTS API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
os.makedirs("audio", exist_ok=True)
os.makedirs("temp", exist_ok=True)

# Mount static files
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

# Include routers
app.include_router(tts.router, prefix="/api", tags=["TTS"])

@app.get("/")
def read_root():
    return {
        "message": "EchoVerse TTS API",
        "version": "1.0.0",
        "endpoints": {
            "text_to_speech": "/api/tts",
            "pdf_to_speech": "/api/tts/pdf"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
