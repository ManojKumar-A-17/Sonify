# Integration Testing Checklist

Use this checklist to verify that the frontend-backend integration is working correctly.

## Pre-Testing Setup

- [ ] Backend is running on port 8000
- [ ] Frontend is running on port 5173
- [ ] No console errors when loading http://localhost:5173
- [ ] Browser network tab shows no CORS errors

## Backend Health Checks

- [ ] http://localhost:8000 returns JSON with endpoints list
- [ ] http://localhost:8000/docs shows Swagger UI
- [ ] http://localhost:8000/health returns `{"status": "healthy"}`
- [ ] `audio/` directory exists in backend folder
- [ ] `temp/` directory exists in backend folder

## Text to Speech Feature

### Basic Functionality
- [ ] Navigate to Text to Speech page
- [ ] Text area accepts input
- [ ] Character counter shows correct count (0/5000)
- [ ] Progress bar updates as you type
- [ ] Character counter changes color at 50% and 80%

### Language Selection
- [ ] Language dropdown is visible
- [ ] Can select different languages (English, Spanish, French, etc.)
- [ ] Selected language is displayed correctly

### Speed Mode
- [ ] Slow mode toggle is visible
- [ ] Can toggle slow mode on/off
- [ ] Toggle state is reflected in UI

### Audio Generation
- [ ] Enter text: "Hello, this is a test of the text to speech system."
- [ ] Click "Generate Audio" button
- [ ] Button shows loading state with "Generating Audio..."
- [ ] No browser console errors
- [ ] Network tab shows POST to http://localhost:8000/api/tts
- [ ] Request payload includes: text, lang, slow
- [ ] Response Content-Type is "audio/mpeg"
- [ ] Audio player appears after generation
- [ ] Can play the audio
- [ ] Audio plays the correct text
- [ ] Audio is in the correct language

### Download Functionality
- [ ] Download button is visible
- [ ] Click download button
- [ ] File downloads with name "echoverse-audio.mp3"
- [ ] Downloaded file plays correctly in media player

### Error Handling
- [ ] Try generating with empty text → Shows error toast
- [ ] Backend not running → Shows connection error
- [ ] Error messages are clear and helpful

### Multiple Languages Test
- [ ] Generate audio in English → Works
- [ ] Generate audio in Spanish → Works
- [ ] Generate audio in French → Works
- [ ] Each language sounds different

### Slow Mode Test
- [ ] Generate with slow mode OFF → Normal speed
- [ ] Generate with slow mode ON → Slower speed
- [ ] Speed difference is noticeable

## PDF Upload Feature

### Basic Functionality
- [ ] Navigate to PDF Upload page
- [ ] Upload area is visible
- [ ] Drag & drop zone shows hover effect

### File Upload
- [ ] Can click to select PDF file
- [ ] Can drag and drop PDF file
- [ ] File name and size display after upload
- [ ] Remove button (X) appears
- [ ] Can click X to remove file

### Settings
- [ ] Language dropdown is visible
- [ ] Can select different languages
- [ ] Speed mode dropdown is visible
- [ ] Can select Normal or Slow speed

### PDF Processing
- [ ] Upload a PDF file (use a real PDF or create one)
- [ ] Select language
- [ ] Select speed mode
- [ ] Click "Convert to Speech" button
- [ ] Button shows loading state "Processing..."
- [ ] Progress indicator appears
- [ ] Network tab shows POST to http://localhost:8000/api/pdf
- [ ] FormData includes: file, lang, slow
- [ ] Response Content-Type is "audio/mpeg"
- [ ] Response has X-Extracted-Text header

### Audio Output
- [ ] Audio player appears after processing
- [ ] Text preview shows extracted text
- [ ] Can play the audio
- [ ] Audio contains the PDF text
- [ ] Language info shows selected language
- [ ] Speed info shows selected speed

### Download Functionality
- [ ] Download button is visible
- [ ] Click download button
- [ ] File downloads with name pattern "sonify-pdf-[timestamp].mp3"
- [ ] Downloaded file plays correctly

### Error Handling
- [ ] Try uploading non-PDF file → Shows error
- [ ] Try processing without file → Shows error
- [ ] Upload corrupted PDF → Shows error
- [ ] Backend not running → Shows connection error

### PDF Processing with Different Settings
- [ ] Process PDF with English + Normal speed → Works
- [ ] Process PDF with English + Slow speed → Works slower
- [ ] Process PDF with Spanish + Normal speed → Works in Spanish
- [ ] Process PDF with French + Normal speed → Works in French

## Navigation & UI

### Navigation
- [ ] Can navigate Home → Text to Speech
- [ ] Can navigate Home → PDF Upload
- [ ] Can navigate Text to Speech → PDF Upload
- [ ] Can navigate PDF Upload → Text to Speech
- [ ] Back button works correctly
- [ ] URLs update correctly

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] All features work on all screen sizes

### Browser Compatibility
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Edge
- [ ] Test in Safari (if available)

## Backend API Tests

### Automated Tests
- [ ] Run `python test_integration.py`
- [ ] All tests pass (or at least 70%)
- [ ] Review any failed tests

### Manual API Tests (using Swagger UI)

#### Text to Speech Endpoint
- [ ] Open http://localhost:8000/docs
- [ ] Find POST /api/tts
- [ ] Test with: `{"text": "Hello", "lang": "en", "slow": false}`
- [ ] Response is audio file
- [ ] Test with different languages
- [ ] Test with slow=true

#### PDF Endpoint
- [ ] Find POST /api/pdf
- [ ] Upload a PDF file
- [ ] Set lang and slow parameters
- [ ] Response is audio file
- [ ] X-Extracted-Text header is present

## Performance Tests

### Text to Speech
- [ ] Short text (<100 chars) → Fast (<2 seconds)
- [ ] Medium text (500 chars) → Reasonable (<5 seconds)
- [ ] Long text (3000 chars) → Works (<15 seconds)
- [ ] Maximum text (5000 chars) → Works (<30 seconds)

### PDF Processing
- [ ] 1-page PDF → Fast (<5 seconds)
- [ ] 5-page PDF → Reasonable (<15 seconds)
- [ ] 10-page PDF → Works (<30 seconds)

## Edge Cases

### Text to Speech
- [ ] Text with special characters → Works
- [ ] Text with numbers → Works
- [ ] Text with punctuation → Works
- [ ] Text in multiple languages mixed → Works as best as possible
- [ ] Very long sentence → Works
- [ ] Text with line breaks → Works

### PDF Upload
- [ ] PDF with images → Extracts text only
- [ ] PDF with tables → Extracts text
- [ ] PDF with complex layout → Extracts text
- [ ] Scanned PDF (image-based) → Shows appropriate error or extracts what's possible
- [ ] Password-protected PDF → Shows error
- [ ] Corrupted PDF → Shows error

## State Management

### Text to Speech
- [ ] Generate audio → Audio appears
- [ ] Edit text → Old audio remains
- [ ] Generate new audio → Old audio is replaced
- [ ] Navigate away and back → State is reset

### PDF Upload
- [ ] Upload file → File info appears
- [ ] Remove file → UI resets
- [ ] Upload and process → Audio appears
- [ ] Remove and upload new → Works correctly
- [ ] Navigate away and back → State is reset

## Console Checks

- [ ] No errors in browser console
- [ ] No warnings in browser console (except minor ones)
- [ ] No CORS errors
- [ ] No 404 errors
- [ ] No 500 errors

## Network Checks

- [ ] All API calls succeed (200 status)
- [ ] Request headers are correct
- [ ] Response headers are correct
- [ ] CORS headers are present
- [ ] Content-Type headers are correct

---

## Test Results

**Date Tested:** _______________

**Tester:** _______________

**Total Tests:** _____

**Passed:** _____

**Failed:** _____

**Pass Rate:** _____%

### Failed Tests (if any):
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Notes:
________________________________________________________________
________________________________________________________________
________________________________________________________________
________________________________________________________________

---

## Sign-off

- [ ] All critical features work
- [ ] All endpoints tested and functional
- [ ] Error handling works correctly
- [ ] Documentation is accurate
- [ ] Ready for deployment / next phase

**Signed:** _______________  **Date:** _______________
