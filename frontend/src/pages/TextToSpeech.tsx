import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AudioPlayer } from '@/components/tts/AudioPlayer';
import { LanguageSelector } from '@/components/tts/LanguageSelector';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_CHARS = 5000;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [slowMode, setSlowMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const charCount = text.length;
  const charPercentage = (charCount / MAX_CHARS) * 100;

  const getCharCountColor = () => {
    if (charPercentage < 50) return 'text-success';
    if (charPercentage < 80) return 'text-yellow-500';
    return 'text-destructive';
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: 'Empty Text',
        description: 'Please enter some text to convert to speech.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setAudioUrl(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          lang: language,
          slow: slowMode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to generate audio');
      }

      // Backend returns audio file as blob, not JSON
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      setAudioUrl(url);
      toast({
        title: 'Audio Generated!',
        description: 'Your text has been converted to speech successfully.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: 'Generation Failed',
        description: errorMessage.includes('fetch') 
          ? 'Unable to connect to the server. Make sure the backend is running on port 8000.'
          : errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'echoverse-audio.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Type className="w-4 h-4" />
              <span>Text to Speech</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Convert Text to Audio
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Enter your text below and transform it into natural-sounding speech in seconds.
            </p>
          </div>

          {/* Text Input Area */}
          <div className="bg-card rounded-3xl border border-border/50 shadow-medium p-6 sm:p-8 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Type or paste your text here..."
                className="w-full h-80 p-4 rounded-2xl border border-border/50 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
              />
              
              {/* Character Counter */}
              <div className={cn(
                "absolute bottom-4 right-4 text-sm font-medium transition-colors",
                getCharCountColor()
              )}>
                {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  charPercentage < 50 ? 'bg-success' : charPercentage < 80 ? 'bg-yellow-500' : 'bg-destructive'
                )}
                style={{ width: `${Math.min(charPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Settings */}
          <div className="bg-card rounded-3xl border border-border/50 shadow-medium p-6 sm:p-8 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-lg font-semibold text-foreground mb-6">Settings</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Language Selector */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Language</Label>
                <LanguageSelector value={language} onChange={setLanguage} />
              </div>

              {/* Slow Mode Toggle */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Speech Speed</Label>
                <div className="flex items-center gap-3 h-12 px-4 rounded-xl border border-border/50 bg-card">
                  <Switch
                    id="slow-mode"
                    checked={slowMode}
                    onCheckedChange={setSlowMode}
                  />
                  <Label htmlFor="slow-mode" className="text-muted-foreground cursor-pointer">
                    Slow Speech Mode
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button
              variant="gradient"
              size="xl"
              onClick={handleGenerate}
              disabled={isLoading || !text.trim()}
              className={cn(
                "min-w-64",
                isLoading && "animate-pulse-soft"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Audio...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Audio
                </>
              )}
            </Button>
          </div>

          {/* Audio Player */}
          {audioUrl && (
            <AudioPlayer
              audioUrl={audioUrl}
              onDownload={handleDownload}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
