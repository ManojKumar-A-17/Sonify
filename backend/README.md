# Sonify Backend

FastAPI-based Text-to-Speech backend supporting text and PDF inputs.

## Features

- **Text to Speech**: Convert text to audio using Google TTS
- **PDF to Speech**: Extract text from PDFs and convert to audio
- **Long Text Support**: Automatic chunking and merging for texts over 3000 characters
- **Multi-language Support**: Support for all gTTS languages
- **Speed Control**: Normal and slow speech modes
- **Error Handling**: Comprehensive validation and error messages
- **CORS Enabled**: Ready for frontend integration
- **Deployment Ready**: Automatic file cleanup for cloud platforms
- **Ephemeral Storage Compatible**: Works on Heroku, Render, Railway, etc.

## Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Running the Server

```bash
# Development mode with auto-reload
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: http://localhost:8000

## API Endpoints

### 1. Text to Speech
**POST** `/api/tts`

Convert text to speech audio file.

**Request Body:**
```json
{
  "text": "Your text here"
}
```

**Response:**
```json
{
  "audio_url": "/audio/filename.mp3",
  "text_length": 100,
  "chunks": 1
}
```

### 2. PDF to Speech
**POST** `/api/tts/pdf`

Extract text from PDF and convert to speech.

**Request:**
- Form data with file upload
- Field name: `file`
- Max size: 10MB

**Response:**
```json
{
  "audio_url": "/audio/filename.mp3",
  "text_length": 5000,
  "chunks": 2,
  "extracted_text": "Full text from PDF..."
}
```

### 3. Health Check
**GET** `/health`

Check API status and file cleanup status.

**Response:**
```json
{
  "status": "healthy",
  "audio_files": 0,
  "temp_files": 0,
  "note": "Files are auto-cleaned after streaming and hourly for orphaned files"
}
```

### 4. Manual Cleanup
**GET** `/cleanup`

Manually trigger cleanup of old files (>1 hour).

### 5. Root
**GET** `/`

API information and available endpoints.

## Error Handling

The API includes comprehensive error handling:
- Empty text validation
- File size validation (10MB limit for PDFs)
- PDF processing errors
- TTS generation errors
- File system errors

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── app/
│   ├── routes/
│   │   └── tts.py         # TTS API routes with auto-cleanup
│   └── tts/
│       ├── service.py     # TTS generation service
│       ├── utils.py       # Text chunking utilities
│       └── pdf_utils.py   # PDF text extraction
├── audio/                  # Temporary audio files (auto-cleaned)
└── temp/                   # Temporary upload files (auto-cleaned)
```

## Testing

API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Test the endpoints using the interactive documentation or tools like Postman/curl.

## Technical Details

- **Framework**: FastAPI
- **TTS Engine**: Google Text-to-Speech (gTTS)
- **Audio Processing**: pydub (for merging chunks)
- **PDF Processing**: PyPDF2
- **Text Chunking**: 3000 character limit per chunk (sentence-aware)

## File Management

### Automatic Cleanup
- Audio files are deleted automatically after streaming to client
- Temporary PDF files are deleted immediately after processing
- Orphaned files (>1 hour old) are cleaned up on server startup and via manual endpoint
- No persistent storage required - perfect for cloud deployment

### Storage Directories
- `audio/` - Temporary storage for generated audio (auto-cleaned)
- `temp/` - Temporary storage for uploaded PDFs (auto-cleaned)

## Deployment

### Cloud Platform Compatibility

This backend is optimized for platforms with ephemeral file systems:

✅ **Supported Platforms:**
- Heroku
- Render
- Railway
- Google Cloud Run
- AWS Elastic Beanstalk
- Azure App Service
- DigitalOcean App Platform
- Fly.io

### Production Deployment

```bash
# Using gunicorn (recommended for production)
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Using uvicorn with workers
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Environment Configuration

1. Update CORS origins in `main.py` with your production frontend URL
2. Set appropriate port binding
3. Configure workers based on your server capacity
4. No additional storage configuration needed!

## License

MIT License
