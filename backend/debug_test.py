import requests
import json

"""
Quick debug script to test the TTS API with minimal output
"""

BASE_URL = "http://localhost:8000"

def quick_test():
    """Quick test of the TTS endpoint"""
    print("Quick TTS Test\n")
    
    payload = {
        "text": "This is a quick test of the Sonify text to speech API."
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/tts", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success!")
            print(f"Audio: {data['audio_url']}")
            print(f"Length: {data['text_length']} chars")
            print(f"Chunks: {data['chunks']}")
        else:
            print(f"❌ Error {response.status_code}")
            print(response.json())
    
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed. Is the server running?")
        print("Run: python main.py")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    quick_test()
