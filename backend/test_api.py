import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health check endpoint"""
    print("Testing /health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def test_root():
    """Test root endpoint"""
    print("Testing / endpoint...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_tts_short():
    """Test TTS with short text"""
    print("Testing /api/tts with short text...")
    payload = {
        "text": "Hello, this is a test of the text to speech API."
    }
    response = requests.post(f"{BASE_URL}/api/tts", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_tts_long():
    """Test TTS with long text (will be chunked)"""
    print("Testing /api/tts with long text...")
    long_text = """
    Artificial intelligence is transforming the world in unprecedented ways. 
    From healthcare to transportation, from education to entertainment, AI is 
    revolutionizing every sector. Machine learning algorithms can now detect 
    diseases, drive cars, teach students, and create art. The potential of AI 
    is limitless, but it also comes with challenges. We must ensure that AI is 
    developed responsibly, with proper safeguards and ethical considerations.
    
    The future of AI is bright, with advancements in natural language processing,
    computer vision, and robotics. As we continue to push the boundaries of what
    machines can do, we must also remain mindful of the impact on society, jobs,
    and privacy. The key is to harness the power of AI for good, while mitigating
    its risks and ensuring that its benefits are shared by all.
    
    In the coming years, we will see AI become even more integrated into our daily
    lives. Smart homes, autonomous vehicles, and personalized education are just
    the beginning. The challenge for humanity is to adapt to these changes while
    maintaining our values and ensuring that technology serves humanity, not the
    other way around.
    """ * 3  # Repeat to make it long enough for chunking
    
    payload = {
        "text": long_text
    }
    response = requests.post(f"{BASE_URL}/api/tts", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_tts_empty():
    """Test TTS with empty text (should fail)"""
    print("Testing /api/tts with empty text (should fail)...")
    payload = {
        "text": ""
    }
    response = requests.post(f"{BASE_URL}/api/tts", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

if __name__ == "__main__":
    print("=" * 50)
    print("Sonify API Test Suite")
    print("=" * 50 + "\n")
    
    try:
        test_health()
        test_root()
        test_tts_short()
        test_tts_long()
        test_tts_empty()
        
        print("=" * 50)
        print("All tests completed!")
        print("=" * 50)
    
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to the API.")
        print("Make sure the server is running at http://localhost:8000")
        print("Run: python main.py")
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
