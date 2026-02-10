def chunk_text(text: str, max_length: int = 3000) -> list[str]:
    """
    Split text into chunks of maximum length, breaking at sentence boundaries.
    
    Args:
        text: Input text to chunk
        max_length: Maximum characters per chunk (default: 3000)
        
    Returns:
        List of text chunks
    """
    if len(text) <= max_length:
        return [text]
    
    chunks = []
    current_chunk = ""
    
    # Split by sentences (simple approach)
    sentences = text.replace('! ', '!|').replace('? ', '?|').replace('. ', '.|').split('|')
    
    for sentence in sentences:
        # If adding this sentence exceeds max_length
        if len(current_chunk) + len(sentence) > max_length:
            if current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = sentence
            else:
                # Single sentence is too long, split by words
                words = sentence.split()
                for word in words:
                    if len(current_chunk) + len(word) + 1 > max_length:
                        if current_chunk:
                            chunks.append(current_chunk.strip())
                        current_chunk = word
                    else:
                        current_chunk += " " + word if current_chunk else word
        else:
            current_chunk += " " + sentence if current_chunk else sentence
    
    # Add remaining chunk
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks
