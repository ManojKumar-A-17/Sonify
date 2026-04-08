import { useState } from 'react';
import { Loader2, Sparkles, Type, WandSparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AudioPlayer } from '@/components/tts/AudioPlayer';
import { LanguageSelector } from '@/components/tts/LanguageSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { sourceLanguages } from '@/lib/languages';
import { cn } from '@/lib/utils';

const MAX_CHARS = 5000;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [translateBeforeSpeaking, setTranslateBeforeSpeaking] = useState(false);
  const [slowMode, setSlowMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [translatedTextPreview, setTranslatedTextPreview] = useState('');
  const [translatedPreviewTruncated, setTranslatedPreviewTruncated] = useState(false);
  const { toast } = useToast();

  const charCount = text.length;
  const charPercentage = (charCount / MAX_CHARS) * 100;

  const getCharCountColor = () => {
    if (charPercentage < 50) return 'text-success';
    if (charPercentage < 80) return 'text-secondary';
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
    setTranslatedTextPreview('');
    setTranslatedPreviewTruncated(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          lang: language,
          slow: slowMode,
          source_lang: sourceLanguage,
          translate_before_speaking: translateBeforeSpeaking,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to generate audio');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      const translatedHeader = response.headers.get('X-Translated-Text');
      if (translatedHeader) {
        setTranslatedTextPreview(decodeURIComponent(translatedHeader));
      }
      setTranslatedPreviewTruncated(response.headers.get('X-Translated-Text-Truncated') === 'true');

      toast({
        title: 'Audio Generated',
        description: translateBeforeSpeaking
          ? 'Your text was translated and converted to speech successfully.'
          : 'Your text has been converted to speech successfully.',
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
    if (!audioUrl) return;

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'sonify-audio.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="overflow-hidden pt-24">
        <section className="relative isolate pb-16 pt-10">
          <div className="absolute inset-x-0 top-0 h-[32rem] gradient-hero" />
          <div className="absolute inset-x-0 top-0 h-[32rem] ambient-grid opacity-15" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
                <Type className="h-4 w-4" />
                Text to Speech Workspace
              </div>
              <h1 className="text-display mt-6 text-5xl font-bold leading-tight sm:text-6xl">
                Shape text into a voice people can actually enjoy listening to.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
                Use a cleaner studio layout for drafting, tuning speech pace, and reviewing output without breaking your flow.
              </p>
            </div>

            <div className="mt-12 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="panel-surface rounded-[2rem] p-6 sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Input</p>
                    <h2 className="text-display mt-3 text-3xl font-bold text-foreground">Draft Your Script</h2>
                  </div>
                  <div className={cn('text-sm font-semibold transition-colors', getCharCountColor())}>
                    {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                  </div>
                </div>

                <div className="mt-6 rounded-[1.75rem] border border-border/70 bg-background/75 p-3 shadow-soft">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                    placeholder="Paste an article paragraph, meeting notes, or a script you want to hear out loud..."
                    className="h-80 w-full resize-none rounded-[1.25rem] border-0 bg-transparent p-4 text-base leading-7 text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        charPercentage < 50 ? 'bg-success' : charPercentage < 80 ? 'bg-secondary' : 'bg-destructive'
                      )}
                      style={{ width: `${Math.min(charPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="panel-surface rounded-[2rem] p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Controls</p>
                <h2 className="text-display mt-3 text-3xl font-bold text-foreground">Generation Setup</h2>

                <div className="mt-8 space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">Voice language</Label>
                    <LanguageSelector value={language} onChange={setLanguage} />
                    <p className="text-sm leading-6 text-muted-foreground">
                      This changes the speaking voice language. Translation only happens when the toggle below is enabled.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-5 shadow-soft">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Label htmlFor="translate-toggle" className="text-sm font-semibold text-foreground">
                          Translate before speaking
                        </Label>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Turn this on to translate your text into the selected voice language before audio generation.
                        </p>
                      </div>
                      <Switch
                        id="translate-toggle"
                        checked={translateBeforeSpeaking}
                        onCheckedChange={setTranslateBeforeSpeaking}
                      />
                    </div>

                    {translateBeforeSpeaking && (
                      <div className="mt-5 space-y-3">
                        <Label className="text-sm font-semibold text-foreground">Source language</Label>
                        <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                          <SelectTrigger className="h-12 rounded-2xl border-border/60 bg-background/70 shadow-soft">
                            <SelectValue placeholder="Select source language" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-border/60 bg-card shadow-large">
                            {sourceLanguages.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-5 shadow-soft">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Label htmlFor="slow-mode" className="text-sm font-semibold text-foreground">
                          Listening Pace
                        </Label>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Enable a slower cadence when you want the generated voice to feel more deliberate.
                        </p>
                      </div>
                      <Switch id="slow-mode" checked={slowMode} onCheckedChange={setSlowMode} />
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                    <div className="flex items-center gap-3">
                      <WandSparkles className="h-5 w-5 text-cyan-300" />
                      <p className="font-semibold">Studio tip</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/68">
                      Short paragraphs and punctuation usually produce a more natural rhythm than one long uninterrupted block.
                    </p>
                  </div>
                </div>

                <Button
                  variant="gradient"
                  size="xl"
                  onClick={handleGenerate}
                  disabled={isLoading || !text.trim()}
                  className={cn('mt-8 w-full', isLoading && 'animate-pulse-soft')}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating Audio...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Audio
                    </>
                  )}
                </Button>
              </div>
            </div>

            {translatedTextPreview && (
              <div className="panel-surface mt-6 rounded-[2rem] p-6 sm:p-8 animate-slide-up">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Translated Preview</p>
                <h3 className="text-display mt-3 text-2xl font-bold text-foreground">Text Used for Speech</h3>
                {translatedPreviewTruncated && (
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    This preview is shortened for long inputs, but the full translated text was used for audio generation.
                  </p>
                )}
                <div className="mt-5 rounded-[1.5rem] border border-border/70 bg-background/75 p-5 shadow-soft">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                    {translatedTextPreview}
                  </p>
                </div>
              </div>
            )}

            {audioUrl && <AudioPlayer audioUrl={audioUrl} onDownload={handleDownload} className="mt-6" />}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
