# Frontend-Backend Integration Guide

## Overview
This document describes the integration between the EchoVerse frontend (React + Vite) and backend (FastAPI).

## Architecture

### Backend (FastAPI)
- **Base URL**: `http://localhost:8000`
- **Port**: 8000
- **CORS**: Configured to allow requests from frontend origins

### Frontend (React + Vite)
- **Development URL**: `http://localhost:5173`
- **Port**: 5173 (default Vite port)
- **API Client**: Native fetch API

## API Endpoints

### 1. Text to Speech - `/api/tts` (POST)

**Purpose**: Convert text input to speech audio

**Request**:
```json
{
  "text": "Hello world",
  "lang": "en",
  "slow": false
}
```

**Response**: Audio file (audio/mpeg) as blob

**Frontend Implementation**: [src/pages/TextToSpeech.tsx](src/pages/TextToSpeech.tsx)

**Features**:
- Character limit: 5000
- Multiple language support
- Slow speech mode toggle
- Real-time audio playback
- Download functionality

### 2. PDF to Speech - `/api/pdf` (POST)

**Purpose**: Extract text from PDF and convert to speech

**Request**: FormData with:
- `file`: PDF file (max 10MB)
- `lang`: Language code (default: "en")
- `slow`: Boolean string ("true"/"false")

**Response**: Audio file (audio/mpeg) as blob
- Header `X-Extracted-Text`: First 500 chars of extracted text

**Frontend Implementation**: [src/pages/PDFUpload.tsx](src/pages/PDFUpload.tsx)

**Features**:
- Drag & drop file upload
- Language selection
- Speed mode selection
- Text preview
- Audio playback and download

## Environment Configuration

### Frontend Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

For production:
```env
VITE_API_URL=https://your-production-api.com
```

### Backend Environment

The backend automatically creates necessary directories:
- `audio/` - Generated audio files
- `temp/` - Temporary PDF storage

## Data Flow

### Text to Speech Flow
1. User enters text in frontend
2. Frontend sends POST to `/api/tts` with text, lang, and slow parameters
3. Backend generates audio using gTTS
4. Backend returns audio file as blob
5. Frontend creates object URL and plays audio
6. User can download the audio file

### PDF to Speech Flow
1. User uploads PDF file
2. Frontend sends FormData to `/api/pdf` with file, lang, and slow
3. Backend extracts text from PDF using PyPDF2
4. Backend generates audio from extracted text
5. Backend returns audio blob with text preview in header
6. Frontend displays audio player and text preview
7. User can play or download audio

## Error Handling

### Frontend Error Handling
- Network errors (backend not running)
- Empty text/file validation
- File type validation
- File size validation
- Toast notifications for all error states

### Backend Error Handling
- Input validation (empty text, invalid file type)
- File size limits (10MB for PDFs)
- PDF text extraction failures
- Audio generation failures
- HTTP exception responses with detail messages

## CORS Configuration

Backend allows requests from:
- `http://localhost:8080`
- `http://localhost:5173` (Vite default)
- `http://localhost:3000`

All origins allow:
- Credentials: true
- Methods: All
- Headers: All

## Running the Full Stack

### Start Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Unix/Mac
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

Backend will run on `http://localhost:8000`

### Start Frontend
```bash
cd frontend
npm install  # or bun install
npm run dev  # or bun dev
```

Frontend will run on `http://localhost:5173`

## Testing the Integration

1. Ensure backend is running on port 8000
2. Ensure frontend is running on port 5173
3. Open `http://localhost:5173` in browser
4. Test Text to Speech:
   - Enter text
   - Select language
   - Toggle slow mode
   - Click "Generate Audio"
   - Verify audio plays
   - Test download
5. Test PDF to Speech:
   - Upload a PDF file
   - Select language and speed
   - Click "Convert to Speech"
   - Verify audio plays
   - Check text preview
   - Test download

## Common Integration Issues

### Issue: "Unable to connect to the server"
- **Cause**: Backend not running or wrong port
- **Solution**: Start backend on port 8000

### Issue: CORS errors in browser console
- **Cause**: Backend CORS not configured for frontend origin
- **Solution**: Add frontend URL to CORS allowed origins in [backend/main.py](../backend/main.py)

### Issue: Audio not playing
- **Cause**: Browser blocking autoplay or blob URL issue
- **Solution**: User interaction triggers play, check browser console for errors

### Issue: PDF upload fails
- **Cause**: File too large or not a valid PDF
- **Solution**: Check file size (<10MB) and file type (.pdf)

## API Response Formats

### Success Response (Audio Blob)
- Content-Type: `audio/mpeg`
- Body: Binary audio data
- Optional Header: `X-Extracted-Text` (for PDF endpoint)

### Error Response (JSON)
```json
{
  "detail": "Error message describing what went wrong"
}
```

## Security Considerations

1. **File Upload**: 10MB limit enforced
2. **Text Input**: 5000 character limit enforced
3. **File Type**: Only PDF files accepted for upload
4. **Temporary Files**: Cleaned up after processing
5. **CORS**: Restricted to specific origins

## Performance Optimization

1. **Audio Generation**: Cached in `audio/` directory
2. **Blob URLs**: Created in frontend, cleaned up on unmount
3. **File Validation**: Done before upload/processing
4. **Error Boundaries**: Prevent full app crashes

## Future Enhancements

- [ ] Add audio format selection (MP3, WAV, OGG)
- [ ] Implement audio caching to avoid regeneration
- [ ] Add progress tracking for long PDFs
- [ ] Support multiple file uploads
- [ ] Add voice/accent selection
- [ ] Implement audio streaming for large files
- [ ] Add authentication and rate limiting
- [ ] Store user preferences in localStorage
