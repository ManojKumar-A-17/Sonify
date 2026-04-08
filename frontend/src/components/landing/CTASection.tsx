import { Link } from 'react-router-dom';
import { ArrowRight, FileAudio2, Mic2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-hero px-8 py-12 text-white shadow-large sm:px-10 sm:py-14 lg:px-14">
          <div className="absolute inset-0 ambient-grid opacity-15" />
          <div className="absolute -left-12 top-10 h-40 w-40 rounded-full bg-cyan-300/15 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-amber-300/15 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/82">
                <Mic2 className="h-4 w-4" />
                Build your listening workflow
              </div>
              <h2 className="text-display mt-6 text-4xl font-bold sm:text-5xl">
                Ready for a UI that feels more like a product than a prototype?
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/72">
                Start with quick text generation or upload spoken audio and move through the same polished workflow.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="gradient" size="xl" className="bg-white text-slate-950 hover:bg-white/90" asChild>
                <Link to="/text-to-speech">
                  Open Studio
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="gradient-outline" size="xl" asChild>
                <Link to="/speech-to-text">
                  <FileAudio2 className="h-5 w-5" />
                  Transcribe Audio
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
