import { AudioLines, FileStack, Languages, TimerReset } from 'lucide-react';

const features = [
  {
    icon: AudioLines,
    title: 'Studio-grade playback',
    description: 'Clean generation flow, built-in preview controls, and better hierarchy around the final audio output.',
  },
  {
    icon: FileStack,
    title: 'Document-first conversion',
    description: 'Bring PDFs into the same polished workflow so long-form reading feels just as refined as short prompts.',
  },
  {
    icon: Languages,
    title: 'Clear language controls',
    description: 'Move between supported languages with fewer clicks and more confidence about what is being generated.',
  },
  {
    icon: TimerReset,
    title: 'Faster repeat usage',
    description: 'The interface is structured for people who generate often, not only for a one-time demo visit.',
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="badge-chip">Product Strengths</span>
            <h2 className="text-display mt-6 text-4xl font-bold text-foreground sm:text-5xl">
              A cleaner product story for every surface.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            The upgrade is not just visual. We are shaping Sonify into a more intentional listening tool, with better emphasis, pacing, and user confidence.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="panel-surface group rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-large"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-soft">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
