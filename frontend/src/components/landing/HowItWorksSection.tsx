import { FileUp, Settings, Download } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: FileUp,
    title: 'Enter or Upload',
    description: 'Type your text directly or upload a PDF document. We handle all the formatting automatically.',
  },
  {
    number: '02',
    icon: Settings,
    title: 'Customize Settings',
    description: 'Choose your preferred language and adjust the speech speed to match your needs.',
  },
  {
    number: '03',
    icon: Download,
    title: 'Generate & Download',
    description: 'Click generate and get your high-quality MP3 audio file ready to play or download.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Three Simple Steps
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Converting text to speech has never been easier. Follow these simple steps to get started.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector Line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] right-[-40%] h-0.5 bg-gradient-to-r from-primary/50 to-secondary/50" />
              )}

              {/* Step Number */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-32 h-32 rounded-full bg-card border-2 border-border/50 flex items-center justify-center shadow-medium group hover-scale cursor-default">
                  <div className="text-center">
                    <span className="block text-3xl font-bold text-gradient mb-1">
                      {step.number}
                    </span>
                    <step.icon className="w-6 h-6 text-muted-foreground mx-auto" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
