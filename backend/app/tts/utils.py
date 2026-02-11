def split_text(text, max_chars=3000):
    """
    Split text into chunks at sentence boundaries for smooth audio flow.
    
    Args:
        text: Input text to split
        max_chars: Maximum characters per chunk (default: 3000)
        
    Returns:
        List of text chunks
    """
    chunks = []
    current = ""

    for sentence in text.split("."):
        if len(current) + len(sentence) < max_chars:
            current += sentence + "."
        else:
            chunks.append(current)
            current = sentence + "."

    if current.strip():
        chunks.append(current)

    return chunks

# Keep the old function for backward compatibility
def chunk_text(text: str, max_length: int = 3000) -> list[str]:
    """Backward compatibility wrapper."""
    return split_text(text, max_length)
