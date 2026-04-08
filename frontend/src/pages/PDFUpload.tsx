import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { Check, Clipboard, Download, FileAudio2, Loader2, Mic2, Sparkles, Upload, X } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { sttLanguages } from '@/lib/languages';
import { cn } from '@/lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface TranscriptionResponse {
  text: string;
  character_count: number;
  filename: string;
}

export default function PDFUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState('');
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('auto');
  const [resolvedLanguage, setResolvedLanguage] = useState('auto');
  const { toast } = useToast();

  const supportedFormats = useMemo(() => ['MP3', 'WAV', 'M4A', 'OGG', 'WEBM'], []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const audioFile = acceptedFiles[0];
      if (!audioFile.type.startsWith('audio/')) {
        toast({
          title: 'Invalid File',
          description: 'Please upload an audio file.',
          variant: 'destructive',
        });
        return;
      }

      setFile(audioFile);
      setTranscript('');
      setCopied(false);
      setResolvedLanguage('auto');
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.webm'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const transcriptionMutation = useMutation({
    mutationFn: async (): Promise<TranscriptionResponse> => {
      if (!file) throw new Error('No file selected');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('lang', language);

      const response = await fetch(`${API_URL}/api/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Failed to process PDF');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setTranscript(data.text);
      setResolvedLanguage(data.language);
      toast({
        title: 'Transcription Ready',
        description: 'Your audio has been converted into text.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Transcription Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleProcess = () => {
    if (!file) {
      toast({
        title: 'Missing Audio',
        description: 'Please upload an audio file first.',
        variant: 'destructive',
      });
      return;
    }

    transcriptionMutation.mutate();
  };

  const handleDownload = () => {
    if (!transcript) return;

    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sonify-transcript-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!transcript) return;

    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    toast({
      title: 'Copied',
      description: 'Transcript copied to your clipboard.',
    });
  };

  const removeFile = () => {
    setFile(null);
    setTranscript('');
    setCopied(false);
    setResolvedLanguage('auto');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="overflow-hidden pt-24">
        <section className="relative isolate pb-16 pt-10">
          <div className="absolute inset-x-0 top-0 h-[28rem] gradient-hero" />
          <div className="absolute inset-x-0 top-0 h-[28rem] ambient-grid opacity-15" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
                <Mic2 className="h-4 w-4" />
                Speech to Text Workspace
              </div>
              <h1 className="text-display mt-6 text-5xl font-bold leading-tight sm:text-6xl">
                Turn recorded speech into editable text.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
                Upload spoken audio, transcribe it into text, and copy or download the result inside the same polished workspace.
              </p>
            </div>

            <div className="mt-12 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="panel-surface rounded-[2rem] p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Audio Input</p>
                <h2 className="text-display mt-3 text-3xl font-bold text-foreground">Upload and Transcribe</h2>

                <div className="mt-8 space-y-6">
                  {!file ? (
                    <div
                      {...getRootProps()}
                      className={cn(
                        'cursor-pointer rounded-[1.75rem] border border-dashed p-8 text-center transition-all duration-300',
                        isDragActive
                          ? 'border-primary bg-primary/8'
                          : 'border-border bg-background/70 hover:border-primary/50 hover:bg-background'
                      )}
                    >
                      <input {...getInputProps()} id="speech-file-upload" name="speech-file" />
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background">
                        <Upload className="h-6 w-6" />
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-foreground">Drop an audio file here</h3>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Drag and drop a recording, or click to browse. Keep files under 10MB for the smoothest transcription.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-[1.75rem] border border-border/70 bg-background/75 p-5 shadow-soft">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <FileAudio2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{file.name}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={removeFile} disabled={transcriptionMutation.isPending}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-5 shadow-soft">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Supported formats</p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{supportedFormats.join(', ')}</p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">Which language is spoken in this audio?</Label>
                    <Select value={language} onValueChange={setLanguage} disabled={transcriptionMutation.isPending}>
                      <SelectTrigger className="h-12 rounded-2xl border-border/60 bg-background/70 shadow-soft">
                        <SelectValue placeholder="Select spoken language" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border/60 bg-card shadow-large">
                        {sttLanguages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Choose a language for better accuracy, or use Best Effort Auto Detect if you are not sure.
                    </p>
                  </div>

                  <Button onClick={handleProcess} disabled={transcriptionMutation.isPending || !file} variant="gradient" size="xl" className="w-full">
                    {transcriptionMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Transcribing Audio...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Generate Transcript
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="panel-surface rounded-[2rem] p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Output</p>
                <h2 className="text-display mt-3 text-3xl font-bold text-foreground">Transcript Result</h2>

                {transcriptionMutation.isPending && (
                  <div className="mt-8 rounded-[1.75rem] bg-slate-950 p-6 text-white">
                    <div className="flex items-center justify-between text-sm">
                      <span>Cleaning audio and recognizing speech</span>
                      <span className="text-white/60">In progress</span>
                    </div>
                    <Progress value={65} className="mt-4 h-2" />
                    <p className="mt-4 text-sm leading-6 text-white/68">
                      Shorter and clearer recordings usually produce better transcripts.
                    </p>
                  </div>
                )}

                {transcript && (
                  <div className="mt-8 space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-4 shadow-soft">
                        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Characters</p>
                        <p className="mt-3 text-lg font-semibold capitalize text-foreground">{transcript.length.toLocaleString()}</p>
                      </div>
                      <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-4 shadow-soft">
                        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Language</p>
                        <p className="mt-3 text-lg font-semibold capitalize text-foreground">
                          {sttLanguages.find((item) => item.code === resolvedLanguage)?.name ?? resolvedLanguage}
                        </p>
                      </div>
                      <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-4 shadow-soft">
                        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Status</p>
                        <p className="mt-3 text-lg font-semibold text-foreground">Transcript ready</p>
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-border/70 bg-background/75 p-5 shadow-soft">
                      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Transcript</p>
                      <div className="mt-4 max-h-[24rem] overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                        {transcript}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Button onClick={handleCopy} variant="outline" size="lg" className="w-full">
                        {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                        {copied ? 'Copied' : 'Copy Transcript'}
                      </Button>
                      <Button onClick={handleDownload} variant="outline" size="lg" className="w-full">
                        <Download className="h-4 w-4" />
                        Download Text
                      </Button>
                    </div>
                  </div>
                )}

                {!transcript && !transcriptionMutation.isPending && (
                  <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-background/70 p-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-primary/10 text-primary">
                      <Mic2 className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold text-foreground">Your transcript will appear here</h3>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                      Upload speech audio to generate text you can review, copy, or download as a plain text file.
                    </p>
                  </div>
                )}

                <div className="mt-6 rounded-[1.75rem] border border-border/70 bg-background/75 p-5 shadow-soft">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Tips</p>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                    <li>Clear speech with low background noise usually improves transcript quality.</li>
                    <li>Very long recordings may need to be split into smaller parts for better reliability.</li>
                    <li>Best Effort Auto Detect is heuristic, so manually choosing the spoken language is usually more accurate.</li>
                    <li>This version uses a lightweight recognizer, so network availability affects transcription.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
