# EchoVerse Backend

FastAPI-based Text-to-Speech backend supporting text and PDF inputs.

## Features

- **Text to Speech**: Convert text to audio using Google TTS
- **PDF to Speech**: Extract text from PDFs and convert to audio
- **Long Text Support**: Automatic chunking and merging for texts over 3000 characters
- **Error Handling**: Comprehensive validation and error messages
- **CORS Enabled**: Ready for frontend integration

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

Check API status.

### 4. Root
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
│   │   └── tts.py         # TTS API routes
│   └── tts/
│       ├── service.py     # TTS generation service
│       ├── utils.py       # Text chunking utilities
│       └── pdf_utils.py   # PDF text extraction
├── audio/                  # Generated audio files
├── temp/                   # Temporary files
└── test_*.py              # Testing scripts
```

## Testing

```bash
# Test text-to-speech
python test_api.py

# Test PDF-to-speech
python test_pdf.py

# Quick debug test
python debug_test.py

# Create sample PDF for testing
python create_sample_pdf.py
```

## Technical Details

- **Framework**: FastAPI
- **TTS Engine**: Google Text-to-Speech (gTTS)
- **Audio Processing**: pydub (for merging chunks)
- **PDF Processing**: PyPDF2
- **Text Chunking**: 3000 character limit per chunk (sentence-aware)

## Development Notes

- Audio files are stored in the `audio/` directory
- Temporary files during processing are stored in `temp/`
- Both directories are created automatically on startup
- Static files are served from the `/audio` route

## License

MIT License
