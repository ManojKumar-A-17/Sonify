import { FileInput, Settings2, Download } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: FileInput,
    title: 'Bring in text or a document',
    description: 'Start from pasted copy, quick notes, or longer PDFs without changing tools.',
  },
  {
    number: '02',
    icon: Settings2,
    title: 'Shape the listening mode',
    description: 'Pick the language, control the pace, and prepare the generation exactly how you want it.',
  },
  {
    number: '03',
    icon: Download,
    title: 'Preview, export, reuse',
    description: 'Listen immediately, restart cleanly, and download the MP3 when it sounds right.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="panel-surface overflow-hidden rounded-[2.5rem] p-8 sm:p-10 lg:p-14">
          <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="badge-chip">Workflow</span>
              <h2 className="text-display mt-6 text-4xl font-bold text-foreground sm:text-5xl">
                Three steps from reading to listening.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Every screen is being tuned to reduce hesitation: clear entry points, simpler controls, and output that feels immediately usable.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="rounded-[2rem] border border-border/70 bg-background/70 p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-display text-4xl font-bold text-primary">{step.number}</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
