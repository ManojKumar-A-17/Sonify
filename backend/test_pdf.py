import requests

BASE_URL = "http://localhost:8000"

def test_pdf_upload():
    """Test PDF to speech conversion"""
    print("Testing /api/tts/pdf endpoint...")
    
    # First, create a sample PDF if it doesn't exist
    try:
        import os
        if not os.path.exists("sample.pdf"):
            print("Sample PDF not found. Run create_sample_pdf.py first.")
            print("Creating sample PDF now...")
            from create_sample_pdf import create_sample_pdf
            create_sample_pdf()
    except Exception as e:
        print(f"Error creating sample PDF: {str(e)}")
        return
    
    # Upload the PDF
    with open("sample.pdf", "rb") as f:
        files = {"file": ("sample.pdf", f, "application/pdf")}
        response = requests.post(f"{BASE_URL}/api/tts/pdf", files=files)
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ Success!")
        print(f"Audio URL: {data['audio_url']}")
        print(f"Text Length: {data['text_length']}")
        print(f"Chunks: {data['chunks']}")
        print(f"\nExtracted Text (first 200 chars):")
        print(data['extracted_text'][:200] + "...")
    else:
        print(f"\n❌ Error: {response.json()}")

def test_invalid_file():
    """Test with non-PDF file (should fail)"""
    print("\nTesting with invalid file type (should fail)...")
    
    # Create a temporary text file
    with open("temp_test.txt", "w") as f:
        f.write("This is not a PDF file")
    
    try:
        with open("temp_test.txt", "rb") as f:
            files = {"file": ("test.txt", f, "text/plain")}
            response = requests.post(f"{BASE_URL}/api/tts/pdf", files=files)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    finally:
        import os
        if os.path.exists("temp_test.txt"):
            os.remove("temp_test.txt")

if __name__ == "__main__":
    print("=" * 50)
    print("Sonify PDF Test Suite")
    print("=" * 50 + "\n")
    
    try:
        test_pdf_upload()
        test_invalid_file()
        
        print("\n" + "=" * 50)
        print("PDF tests completed!")
        print("=" * 50)
    
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to the API.")
        print("Make sure the server is running at http://localhost:8000")
        print("Run: python main.py")
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
