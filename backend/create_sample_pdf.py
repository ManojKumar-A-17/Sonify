from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch

def create_sample_pdf(filename="sample.pdf"):
    """
    Create a sample PDF file for testing PDF-to-speech functionality.
    
    Args:
        filename: Name of the PDF file to create
    """
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    # Page 1
    c.setFont("Helvetica-Bold", 16)
    c.drawString(1 * inch, height - 1 * inch, "Sonify Sample PDF")
    
    c.setFont("Helvetica", 12)
    y = height - 1.5 * inch
    
    text_lines = [
        "This is a sample PDF document created for testing the",
        "Sonify PDF-to-Speech conversion feature.",
        "",
        "Artificial Intelligence and Machine Learning",
        "",
        "Artificial intelligence is transforming the world in many ways.",
        "Machine learning algorithms can now perform tasks that were",
        "once thought to require human intelligence. From recognizing",
        "faces in photos to driving cars, AI is everywhere.",
        "",
        "Natural Language Processing",
        "",
        "Natural language processing enables computers to understand",
        "and generate human language. This technology powers virtual",
        "assistants, translation services, and text-to-speech systems",
        "like Sonify.",
    ]
    
    for line in text_lines:
        c.drawString(1 * inch, y, line)
        y -= 0.3 * inch
        if y < 1 * inch:
            c.showPage()
            c.setFont("Helvetica", 12)
            y = height - 1 * inch
    
    # Page 2
    c.showPage()
    c.setFont("Helvetica-Bold", 14)
    c.drawString(1 * inch, height - 1 * inch, "Page 2: The Future of AI")
    
    c.setFont("Helvetica", 12)
    y = height - 1.5 * inch
    
    text_lines_2 = [
        "The future of artificial intelligence is incredibly exciting.",
        "We are just beginning to scratch the surface of what is",
        "possible with AI technology.",
        "",
        "Some key areas of development include:",
        "",
        "- Advanced natural language understanding",
        "- Computer vision and image recognition",
        "- Autonomous systems and robotics",
        "- Personalized medicine and healthcare",
        "- Climate modeling and environmental protection",
        "",
        "As AI continues to evolve, it will be important to ensure",
        "that these technologies are developed responsibly and used",
        "for the benefit of all humanity.",
    ]
    
    for line in text_lines_2:
        c.drawString(1 * inch, y, line)
        y -= 0.3 * inch
    
    c.save()
    print(f"✅ Sample PDF created: {filename}")

if __name__ == "__main__":
    create_sample_pdf()
    print("\nYou can now test PDF-to-speech with:")
    print("python test_pdf.py")
