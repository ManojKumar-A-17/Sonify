# 🚀 Sonify Quick Start Guide

## Prerequisites

### Backend Requirements
- Python 3.8 or higher
- pip (Python package manager)

### Frontend Requirements
- Node.js 16+ or Bun
- npm or bun package manager

## Installation & Setup

### 1. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

Backend will run on: **http://localhost:8000**

### 2. Frontend Setup

Open a new terminal:

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies (choose one)
npm install
# OR
bun install

# Start the development server (choose one)
npm run dev
# OR
bun dev
```

Frontend will run on: **http://localhost:5173**

## Testing the Integration

### Option 1: Quick Integration Test

```powershell
# In backend directory with venv activated
python test_integration.py
```

This will test all API endpoints and verify the integration is working.

### Option 2: Manual Testing

1. **Open your browser** to http://localhost:5173
2. **Test Text to Speech:**
   - Click "Text to Speech" in the navigation
   - Enter some text
   - Select language and speed
   - Click "Generate Audio"
   - Play and download the audio
3. **Test PDF Upload:**
   - Click "PDF Upload" in the navigation
   - Drag & drop or select a PDF file
   - Select language and speed
   - Click "Convert to Speech"
   - Play and download the audio

## Verification Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] No CORS errors in browser console
- [ ] Text to speech generates audio
- [ ] PDF upload extracts and converts text
- [ ] Audio playback works
- [ ] Download functionality works

## Common Issues & Solutions

### Backend Issues

**Issue:** `ModuleNotFoundError: No module named 'fastapi'`
- **Solution:** Make sure virtual environment is activated and run `pip install -r requirements.txt`

**Issue:** `Address already in use: Port 8000`
- **Solution:** Kill the process using port 8000 or change the port in `main.py`

### Frontend Issues

**Issue:** `Cannot connect to backend`
- **Solution:** Ensure backend is running on port 8000 and check `.env` file

**Issue:** `CORS error in browser console`
- **Solution:** Verify backend CORS configuration includes `http://localhost:5173`

**Issue:** Dependencies not found
- **Solution:** Delete `node_modules` and `bun.lockb`, then reinstall: `bun install`

## Development Workflow

### Backend Changes
1. Make changes to Python files
2. Server auto-reloads (if using `uvicorn` with `--reload`)
3. Test with `python test_integration.py`

### Frontend Changes
1. Make changes to React/TypeScript files
2. Vite hot-reloads automatically
3. Check browser console for errors

## API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Port Configuration

### Default Ports
- **Backend:** 8000
- **Frontend:** 5173

### Changing Ports

**Backend Port:**
Edit [backend/main.py](backend/main.py):
```python
uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
#                                              ^^^^
#                                        Change this port
```

**Frontend Port:**
Edit [frontend/vite.config.ts](frontend/vite.config.ts) or use:
```bash
npm run dev -- --port 3000
```

Don't forget to update:
- [frontend/.env](frontend/.env) - `VITE_API_URL`
- [backend/main.py](backend/main.py) - CORS `allow_origins`

## Production Build

### Backend (Deployment-Ready)

The backend is now optimized for cloud deployment:

✅ **Automatic File Cleanup** - Audio files are deleted after streaming
✅ **No persistent storage needed** - Works on ephemeral file systems (Heroku, Render, etc.)
✅ **Hourly cleanup** - Orphaned files are automatically removed
✅ **Multi-instance ready** - No shared file dependencies

```powershell
cd backend

# For production deployment:
# 1. Update CORS origins in main.py with your production domain
# 2. Use production WSGI server (gunicorn, uvicorn)
# 3. Set environment variables as needed

# Example with uvicorn:
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# Example with gunicorn:
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**Monitoring:**
- Health endpoint: `GET /health` - Shows file count and cleanup status
- Manual cleanup: `GET /cleanup` - Trigger cleanup manually

### Frontend
```powershell
cd frontend
npm run build
# OR
bun run build

# Files will be in 'dist' directory
# Deploy to static hosting (Vercel, Netlify, etc.)
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

### Backend
Currently using hardcoded values. No `.env` file needed for development.

For production, update CORS origins in `main.py` to match your frontend domain.

## Deployment Notes

### Cloud Platform Compatibility

The backend is optimized for cloud platforms with ephemeral storage:

**✅ Compatible Platforms:**
- Heroku
- Render
- Railway
- Google Cloud Run
- AWS Lambda / Elastic Beanstalk
- Azure App Service
- DigitalOcean App Platform
- Fly.io

**How it works:**
- Audio files are generated in `/audio` directory
- Files are streamed to client immediately
- Files are automatically deleted after response is sent
- Hourly cleanup removes any orphaned files (>1 hour old)
- No persistent storage required
- Works perfectly on platforms that reset file systems on restart

## Next Steps

- [ ] Test all features thoroughly
- [ ] Customize UI in frontend components
- [ ] Add more languages to backend
- [ ] Implement user authentication
- [ ] Add audio caching
- [ ] Deploy to production

## Support

For more details, see:
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Detailed integration documentation
- [backend/README.md](backend/README.md) - Backend documentation
- [frontend/README.md](frontend/README.md) - Frontend documentation

---

**Happy Building! 🎉**
