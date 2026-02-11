import { Mic, FileText, Globe, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Mic,
    title: 'Natural Voice Quality',
    description: 'Powered by Google\'s advanced text-to-speech engine for natural-sounding voices that captivate listeners.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: FileText,
    title: 'PDF to Speech',
    description: 'Upload PDFs and automatically extract and convert text to audio. Perfect for articles, reports, and documents.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description: 'Support for English, Spanish, French, German, Italian, Portuguese, and more languages coming soon.',
    gradient: 'from-teal-500 to-green-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get your audio in seconds with intelligent chunking optimized for large documents and batch processing.',
    gradient: 'from-orange-500 to-yellow-500',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed to make text-to-speech conversion effortless and professional.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "group relative p-8 rounded-3xl bg-card border border-border/50 hover-lift cursor-default",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br shadow-medium",
                feature.gradient
              )}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Gradient Background */}
              <div className={cn(
                "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br",
                feature.gradient
              )} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
