import { Link } from 'react-router-dom';
import { ArrowRight, FileText, AudioWaveform } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero opacity-95" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Glass Morphism Overlay */}
      <div className="absolute inset-0 glass-morphism opacity-30" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8 animate-fade-in">
          <AudioWaveform className="w-4 h-4" />
          <span>Powered by Advanced AI Voice Technology</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Transform Text into
          <br />
          <span className="relative">
            Natural Speech
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
              <path d="M2 10C50 2 100 2 150 6C200 10 250 10 298 2" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Convert text and PDF documents into high-quality audio in seconds.
          Perfect for learning, accessibility, and productivity.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Button variant="default" size="xl" className="bg-white text-primary hover:bg-white/90 shadow-large" asChild>
            <Link to="/text-to-speech">
              Try Now
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </Button>
          <Button variant="gradient-outline" size="xl" asChild>
            <Link to="/pdf-upload">
              <FileText className="w-5 h-5 mr-1" />
              Upload PDF
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {[
            { value: '6+', label: 'Languages' },
            { value: '100K+', label: 'Audio Generated' },
            { value: '99%', label: 'Accuracy' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
              <div className="text-white/60 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path
            d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}
