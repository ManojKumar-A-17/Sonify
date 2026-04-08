import { Link } from 'react-router-dom';
import { ArrowUpRight, AudioWaveform, Github, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70 bg-background/80">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary shadow-soft">
                <AudioWaveform className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-display text-xl font-bold text-foreground">Sonify</span>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Voice Studio</p>
              </div>
            </Link>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Turn text and documents into clear, natural speech with a workspace designed for accessibility, learning, and modern content teams.
            </p>
            <div className="badge-chip w-fit">
              <ArrowUpRight className="h-4 w-4 text-primary" />
              Polished audio in minutes
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/text-to-speech" className="text-muted-foreground transition-colors hover:text-primary">
                  Text to Speech
                </Link>
              </li>
              <li>
                <Link to="/speech-to-text" className="text-muted-foreground transition-colors hover:text-primary">
                  Speech to Text
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground transition-colors hover:text-primary">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-border/70 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            Copyright {currentYear} Sonify. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-4 md:mt-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
