import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-12 sm:p-16 lg:p-20">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Start Converting Today</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Text?
            </h2>
            <p className="text-lg sm:text-xl text-white/80 mb-10">
              Join thousands of users who have already discovered the power of natural text-to-speech conversion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" size="xl" className="bg-white text-primary hover:bg-white/90 shadow-large" asChild>
                <Link to="/text-to-speech">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
              <Button variant="gradient-outline" size="xl" asChild>
                <Link to="/pdf-upload">
                  Upload Your First PDF
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
