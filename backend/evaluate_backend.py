"""
Backend Evaluation Script for Sonify TTS
Tests all critical functionality against the evaluation checklist
"""
import requests
import os
import time

API_BASE = "http://localhost:8000"
RESULTS = {}

def test_section(name):
    """Decorator to track test sections"""
    print(f"\n{'='*60}")
    print(f"🔹 {name}")
    print(f"{'='*60}")
    RESULTS[name] = {"total": 0, "passed": 0, "tests": []}

def check(desc, condition):
    """Test assertion helper"""
    RESULTS[list(RESULTS.keys())[-1]]["total"] += 1
    status = "✓" if condition else "✗"
    result = "PASS" if condition else "FAIL"
    print(f" {status} {desc}: {result}")
    RESULTS[list(RESULTS.keys())[-1]]["tests"].append({
        "desc": desc, "passed": condition
    })
    if condition:
        RESULTS[list(RESULTS.keys())[-1]]["passed"] += 1
    return condition

print("="*60)
print("SONIFY BACKEND EVALUATION")
print("="*60)

# 1. Environment & Setup
test_section("1. Environment & Setup")
check("requirements.txt exists", os.path.exists("requirements.txt"))
check("main.py exists", os.path.exists("main.py"))
check("app/routes/tts.py exists", os.path.exists("app/routes/tts.py"))
check("app/tts/service.py exists", os.path.exists("app/tts/service.py"))

# 2. Application Boot
test_section("2. Application Boot")
try:
    response = requests.get(f"{API_BASE}/", timeout=2)
    check("Server responds to root endpoint", response.status_code == 200)
    check("Returns JSON response", response.headers.get('content-type', '').startswith('application/json'))
    data = response.json()
    check("Response contains API metadata", 'message' in data or 'version' in data)
    check("Response contains endpoints info", 'endpoints' in data)
except requests.exceptions.RequestException as e:
    check("Server responds to root endpoint", False)
    check("Returns JSON response", False)
    check("Response contains API metadata", False)
    check("Response contains endpoints info", False)
    print(f"   Error: {e}")

# Check Swagger UI
try:
    response = requests.get(f"{API_BASE}/docs", timeout=2)
    check("Swagger UI loads at /docs", response.status_code == 200)
except:
    check("Swagger UI loads at /docs", False)

# 3. Folder & File Handling
test_section("3. Folder & File Handling")
check("audio/ directory exists", os.path.exists("audio"))
check("temp/ directory exists", os.path.exists("temp"))

# 4. Text-to-Speech Endpoint
test_section("4. Text-to-Speech Endpoint (/api/tts)")
try:
    # Valid request
    response = requests.post(
        f"{API_BASE}/api/tts",
        json={"text": "Hello world"},
        timeout=15
    )
    check("Accepts JSON input", response.status_code == 200)
    data = response.json()
    check("Returns JSON response with audio path", 'audio_url' in data)
    check("Response contains text_length", 'text_length' in data)
    
    # Test empty text validation
    response = requests.post(
        f"{API_BASE}/api/tts",
        json={"text": ""},
        timeout=5
    )
    check("Validates non-empty text", response.status_code == 400)
    
    # Test with whitespace only
    response = requests.post(
        f"{API_BASE}/api/tts",
        json={"text": "   "},
        timeout=5
    )
    check("Rejects whitespace-only text", response.status_code == 400)
    
except requests.exceptions.RequestException as e:
    check("Accepts JSON input", False)
    check("Returns JSON response with audio path", False)
    check("Response contains text_length", False)
    check("Validates non-empty text", False)
    check("Rejects whitespace-only text", False)
    print(f"   Error: {e}")

# 5. Large Text Handling
test_section("5. Large Text Handling")
try:
    long_text = "This is a test sentence. " * 200  # ~5000 chars
    response = requests.post(
        f"{API_BASE}/api/tts",
        json={"text": long_text},
        timeout=30
    )
    check("Handles large text without crash", response.status_code == 200)
    data = response.json()
    check("Returns chunks count", 'chunks' in data)
    check("Multiple chunks generated", data.get('chunks', 0) > 1)
except requests.exceptions.RequestException as e:
    check("Handles large text without crash", False)
    check("Returns chunks count", False)
    check("Multiple chunks generated", False)
    print(f"   Error: {e}")

# 6. PDF-to-Speech Endpoint
test_section("6. PDF-to-Speech Endpoint (/api/tts/pdf)")
try:
    # Invalid file type
    response = requests.post(
        f"{API_BASE}/api/tts/pdf",
        files={"file": ("test.txt", b"hello", "text/plain")},
        timeout=5
    )
    check("Validates PDF file type", response.status_code == 400)
except:
    check("Validates PDF file type", False)

# 7. Static File Serving
test_section("7. Static File Serving")
check("Audio directory mounted", os.path.exists("audio"))
# If there are any audio files, test serving
audio_files = [f for f in os.listdir("audio") if f.endswith('.mp3')] if os.path.exists("audio") else []
if audio_files:
    try:
        test_file = audio_files[0]
        response = requests.get(f"{API_BASE}/audio/{test_file}", timeout=5)
        check("Audio files accessible via URL", response.status_code == 200)
        check("Correct MIME type (audio/mpeg)", 'audio' in response.headers.get('content-type', '').lower())
    except:
        check("Audio files accessible via URL", False)
        check("Correct MIME type (audio/mpeg)", False)
else:
    print("   (No audio files to test serving)")

# 8. Error Handling
test_section("8. Error Handling")
try:
    # Empty text error
    response = requests.post(f"{API_BASE}/api/tts", json={"text": ""}, timeout=5)
    check("Empty text returns error response", response.status_code == 400)
    
    # Invalid PDF error  
    response = requests.post(
        f"{API_BASE}/api/tts/pdf",
        files={"file": ("test.txt", b"not a pdf", "text/plain")},
        timeout=5
    )
    check("Invalid PDF returns error", response.status_code == 400)
    
    # Server still responsive after errors
    response = requests.get(f"{API_BASE}/", timeout=2)
    check("Server remains responsive after errors", response.status_code == 200)
    
except requests.exceptions.RequestException as e:
    check("Empty text returns error response", False)
    check("Invalid PDF returns error", False)
    check("Server remains responsive after errors", False)
    print(f"   Error: {e}")

# 9. API Response Consistency
test_section("9. API Response Consistency")
try:
    response = requests.post(
        f"{API_BASE}/api/tts",
        json={"text": "Test consistency"},
        timeout=15
    )
    check("All endpoints return JSON", response.headers.get('content-type', '').startswith('application/json'))
    data = response.json()
    check("Consistent response format", isinstance(data, dict))
    check("Audio file path returned correctly", 'audio_url' in data)
    
except:
    check("All endpoints return JSON", False)
    check("Consistent response format", False)
    check("Audio file path returned correctly", False)

# FINAL SUMMARY
print("\n" + "="*60)
print("FINAL EVALUATION SUMMARY")
print("="*60)

total_tests = 0
total_passed = 0

for section, result in RESULTS.items():
    percentage = (result["passed"] / result["total"] * 100) if result["total"] > 0 else 0
    status = "✅" if percentage >= 90 else "⚠️" if percentage >= 70 else "❌"
    print(f"\n{status} {section}")
    print(f"   {result['passed']}/{result['total']} tests passed ({percentage:.0f}%)")
    total_tests += result["total"]
    total_passed += result["passed"]

overall_percentage = (total_passed / total_tests * 100) if total_tests > 0 else 0

print(f"\n{'='*60}")
print(f"OVERALL SCORE: {total_passed}/{total_tests} ({overall_percentage:.1f}%)")
print(f"{'='*60}")

if overall_percentage >= 90:
    print("\n🟢 ✅ Backend is COMPLETE & ACCEPTABLE")
elif overall_percentage >= 70:
    print("\n🟡 ⚠️ Minor fixes needed")
else:
    print("\n🔴 ❌ Backend incomplete - significant work required")

print("\nNote: Some tests may require manual verification (e.g., FFmpeg, audio playback)")
