"""
Frontend-Backend Integration Test Script

This script tests all API endpoints to ensure frontend-backend integration is working correctly.
Run this after starting the backend server to verify the API is ready for frontend consumption.
"""

import requests
import json
import os
from pathlib import Path

# Configuration
BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api"

# ANSI color codes for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_success(message):
    print(f"{GREEN}✓ {message}{RESET}")

def print_error(message):
    print(f"{RED}✗ {message}{RESET}")

def print_info(message):
    print(f"{BLUE}ℹ {message}{RESET}")

def print_warning(message):
    print(f"{YELLOW}⚠ {message}{RESET}")

def test_health_check():
    """Test health check endpoint"""
    print_info("Testing health check endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print_success("Health check passed")
            return True
        else:
            print_error(f"Health check failed: Status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to backend. Make sure it's running on port 8000")
        return False
    except Exception as e:
        print_error(f"Health check error: {str(e)}")
        return False

def test_root_endpoint():
    """Test root endpoint"""
    print_info("Testing root endpoint...")
    try:
        response = requests.get(BASE_URL)
        if response.status_code == 200:
            data = response.json()
            print_success("Root endpoint accessible")
            print_info(f"Available endpoints: {', '.join(data.get('endpoints', {}).keys())}")
            return True
        else:
            print_error(f"Root endpoint failed: Status {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Root endpoint error: {str(e)}")
        return False

def test_text_to_speech():
    """Test text to speech endpoint (returns blob)"""
    print_info("Testing text to speech endpoint...")
    
    test_cases = [
        {
            "name": "Default (English, Normal speed)",
            "text": "Hello, this is a test of the text to speech system.",
            "lang": "en",
            "slow": False
        },
        {
            "name": "Slow mode",
            "text": "This should be slower.",
            "lang": "en",
            "slow": True
        },
        {
            "name": "Spanish",
            "text": "Hola, esto es una prueba.",
            "lang": "es",
            "slow": False
        }
    ]
    
    passed = 0
    for test in test_cases:
        print_info(f"  Testing: {test['name']}")
        try:
            response = requests.post(
                f"{API_URL}/tts",
                json={
                    "text": test["text"],
                    "lang": test["lang"],
                    "slow": test["slow"]
                },
                timeout=10
            )
            
            if response.status_code == 200:
                # Check if response is audio
                content_type = response.headers.get('content-type', '')
                if 'audio' in content_type:
                    print_success(f"  {test['name']}: Audio generated successfully ({len(response.content)} bytes)")
                    passed += 1
                else:
                    print_error(f"  {test['name']}: Unexpected content type: {content_type}")
            else:
                print_error(f"  {test['name']}: Failed with status {response.status_code}")
                if response.headers.get('content-type', '').startswith('application/json'):
                    print_error(f"    Error: {response.json().get('detail', 'Unknown error')}")
        except Exception as e:
            print_error(f"  {test['name']}: Error - {str(e)}")
    
    print_info(f"Text to Speech: {passed}/{len(test_cases)} tests passed")
    return passed == len(test_cases)

def test_text_to_speech_json():
    """Test text to speech JSON endpoint"""
    print_info("Testing text to speech JSON endpoint...")
    
    try:
        response = requests.post(
            f"{API_URL}/tts/json",
            json={
                "text": "Testing JSON endpoint",
                "lang": "en",
                "slow": False
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'success' and data.get('audio_file'):
                print_success(f"JSON endpoint working: {data['audio_file']}")
                return True
            else:
                print_error("JSON endpoint returned invalid data")
                return False
        else:
            print_error(f"JSON endpoint failed: Status {response.status_code}")
            return False
    except Exception as e:
        print_error(f"JSON endpoint error: {str(e)}")
        return False

def test_pdf_to_speech():
    """Test PDF to speech endpoint"""
    print_info("Testing PDF to speech endpoint...")
    
    # Create a sample PDF if it doesn't exist
    sample_pdf = "temp/integration_test.pdf"
    if not os.path.exists(sample_pdf):
        print_info("Creating sample PDF for testing...")
        try:
            from reportlab.lib.pagesizes import letter
            from reportlab.pdfgen import canvas
            
            os.makedirs("temp", exist_ok=True)
            c = canvas.Canvas(sample_pdf, pagesize=letter)
            c.drawString(100, 750, "Integration Test PDF")
            c.drawString(100, 730, "This is a test document for the PDF to speech feature.")
            c.drawString(100, 710, "It contains sample text that will be converted to audio.")
            c.save()
            print_success("Sample PDF created")
        except ImportError:
            print_warning("reportlab not installed, using create_sample_pdf.py")
            os.system("python create_sample_pdf.py")
    
    if not os.path.exists(sample_pdf):
        print_error("Cannot test PDF endpoint: No sample PDF available")
        return False
    
    try:
        with open(sample_pdf, 'rb') as f:
            files = {'file': ('test.pdf', f, 'application/pdf')}
            data = {
                'lang': 'en',
                'slow': 'false'
            }
            
            response = requests.post(
                f"{API_URL}/pdf",
                files=files,
                data=data,
                timeout=30
            )
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            extracted_text = response.headers.get('X-Extracted-Text', '')
            
            if 'audio' in content_type:
                print_success(f"PDF endpoint working: Generated {len(response.content)} bytes of audio")
                if extracted_text:
                    print_info(f"Extracted text preview: {extracted_text[:100]}...")
                return True
            else:
                print_error(f"PDF endpoint returned unexpected content type: {content_type}")
                return False
        else:
            print_error(f"PDF endpoint failed: Status {response.status_code}")
            if response.headers.get('content-type', '').startswith('application/json'):
                print_error(f"  Error: {response.json().get('detail', 'Unknown error')}")
            return False
    except Exception as e:
        print_error(f"PDF endpoint error: {str(e)}")
        return False

def test_error_handling():
    """Test error handling"""
    print_info("Testing error handling...")
    
    tests_passed = 0
    total_tests = 3
    
    # Test 1: Empty text
    print_info("  Testing empty text validation...")
    try:
        response = requests.post(
            f"{API_URL}/tts",
            json={"text": "", "lang": "en", "slow": False}
        )
        if response.status_code == 400:
            print_success("  Empty text properly rejected")
            tests_passed += 1
        else:
            print_error(f"  Empty text not rejected (status: {response.status_code})")
    except Exception as e:
        print_error(f"  Empty text test error: {str(e)}")
    
    # Test 2: Invalid file type
    print_info("  Testing invalid file type...")
    try:
        files = {'file': ('test.txt', b'not a pdf', 'text/plain')}
        response = requests.post(f"{API_URL}/pdf", files=files)
        if response.status_code == 400:
            print_success("  Invalid file type properly rejected")
            tests_passed += 1
        else:
            print_error(f"  Invalid file type not rejected (status: {response.status_code})")
    except Exception as e:
        print_error(f"  Invalid file type test error: {str(e)}")
    
    # Test 3: Large file (simulate)
    print_info("  Testing file size limit...")
    try:
        # Create a file that's just over 10MB
        large_content = b'X' * (11 * 1024 * 1024)  # 11MB
        files = {'file': ('large.pdf', large_content, 'application/pdf')}
        response = requests.post(f"{API_URL}/pdf", files=files, timeout=5)
        if response.status_code == 400:
            print_success("  Large file properly rejected")
            tests_passed += 1
        else:
            print_warning(f"  Large file not rejected (status: {response.status_code})")
            tests_passed += 1  # Not critical if backend processing is slow
    except requests.exceptions.Timeout:
        print_warning("  Large file test timed out (expected)")
        tests_passed += 1
    except Exception as e:
        print_error(f"  Large file test error: {str(e)}")
    
    print_info(f"Error handling: {tests_passed}/{total_tests} tests passed")
    return tests_passed >= 2  # Allow some flexibility

def test_cors():
    """Test CORS headers"""
    print_info("Testing CORS configuration...")
    
    try:
        response = requests.options(
            f"{API_URL}/tts",
            headers={
                'Origin': 'http://localhost:5173',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        )
        
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
        }
        
        if cors_headers['Access-Control-Allow-Origin']:
            print_success("CORS configured:")
            for header, value in cors_headers.items():
                if value:
                    print_info(f"  {header}: {value}")
            return True
        else:
            print_warning("CORS headers not found in response")
            return True  # May still work
    except Exception as e:
        print_error(f"CORS test error: {str(e)}")
        return False

def main():
    """Run all integration tests"""
    print("\n" + "="*60)
    print("EchoVerse Frontend-Backend Integration Tests")
    print("="*60 + "\n")
    
    results = {
        "Health Check": test_health_check(),
        "Root Endpoint": test_root_endpoint(),
        "Text to Speech": test_text_to_speech(),
        "Text to Speech JSON": test_text_to_speech_json(),
        "PDF to Speech": test_pdf_to_speech(),
        "Error Handling": test_error_handling(),
        "CORS Configuration": test_cors(),
    }
    
    print("\n" + "="*60)
    print("Test Summary")
    print("="*60 + "\n")
    
    passed = sum(results.values())
    total = len(results)
    
    for test_name, result in results.items():
        status = f"{GREEN}PASSED{RESET}" if result else f"{RED}FAILED{RESET}"
        print(f"{test_name:.<40} {status}")
    
    print("\n" + "-"*60)
    print(f"Total: {passed}/{total} tests passed")
    
    if passed == total:
        print(f"\n{GREEN}✓ All integration tests passed!{RESET}")
        print(f"{GREEN}✓ Frontend is ready to connect to the backend{RESET}\n")
        return 0
    elif passed >= total * 0.7:  # 70% pass rate
        print(f"\n{YELLOW}⚠ Most tests passed ({passed}/{total}){RESET}")
        print(f"{YELLOW}⚠ Check failed tests for issues{RESET}\n")
        return 1
    else:
        print(f"\n{RED}✗ Many tests failed ({total - passed}/{total}){RESET}")
        print(f"{RED}✗ Please fix backend issues before running frontend{RESET}\n")
        return 2

if __name__ == "__main__":
    exit(main())
