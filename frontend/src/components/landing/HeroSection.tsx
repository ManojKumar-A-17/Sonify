import { Link } from 'react-router-dom';
import { ArrowRight, AudioLines, Mic2, Sparkles, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';

const waveformBars = [40, 64, 30, 72, 48, 56, 26, 68, 36, 58, 32, 76];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero pt-32 text-white">
      <div className="ambient-grid absolute inset-0 opacity-20" />
      <div className="animate-drift absolute left-[8%] top-40 h-48 w-48 rounded-full bg-cyan-300/15 blur-3xl" />
      <div className="absolute bottom-16 right-[10%] h-64 w-64 rounded-full bg-amber-300/12 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 pb-24 sm:px-6 lg:px-8 lg:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Built for listening-first workflows
            </div>

            <h1 className="text-display mt-8 text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl">
              Make reading feel
              <span className="block text-gradient"> cinematic, clear, and fast.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
              Sonify turns writing into polished audio and recorded speech into usable text through an interface that feels closer to a modern studio than a utility form.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button variant="gradient" size="xl" asChild>
                <Link to="/text-to-speech">
                  Open Text Workspace
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="gradient-outline" size="xl" asChild>
                <Link to="/speech-to-text">
                  <Mic2 className="h-5 w-5" />
                  Transcribe speech to text
                </Link>
              </Button>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ['6+', 'Supported languages'],
                ['5K', 'Characters per take'],
                ['<1 min', 'Fast generation flow'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/6 px-5 py-5 backdrop-blur">
                  <div className="text-display text-3xl font-bold">{value}</div>
                  <div className="mt-1 text-sm text-white/62">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-frame animate-float relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
            <div className="absolute inset-x-8 top-7 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-white/45">
              <span>Live Preview</span>
              <span>Studio Panel</span>
            </div>

            <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-6 shadow-large">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">Now shaping</p>
                  <h2 className="mt-2 text-2xl font-bold">Article narration</h2>
                </div>
                <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Ready
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Warm studio voice</span>
                  <span>English</span>
                </div>
                <div className="mt-5 flex h-24 items-end gap-2">
                  {waveformBars.map((height, index) => (
                    <div
                      key={height + index}
                      className="w-full rounded-full bg-gradient-to-t from-cyan-400 via-sky-300 to-amber-200 opacity-90"
                      style={{
                        height: `${height}%`,
                        animationDelay: `${index * 0.08}s`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3 text-white/78">
                    <AudioLines className="h-5 w-5 text-cyan-300" />
                    Text to Speech
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/58">
                    Paste text, adjust cadence, and download a clean MP3 without leaving the workspace.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3 text-white/78">
                    <Waves className="h-5 w-5 text-amber-200" />
                    Speech to Text
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/58">
                    Upload recorded audio and turn it into editable text inside the same workspace feel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
