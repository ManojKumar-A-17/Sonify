import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AudioWaveform, Menu, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Text to Speech', path: '/text-to-speech' },
  { name: 'Speech to Text', path: '/speech-to-text' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="fixed left-0 right-0 top-0 z-50">
      <div className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link to="/" className="group flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary shadow-soft transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-glow">
                <AudioWaveform className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-display text-xl font-bold text-white">
                  Soni<span className="text-gradient">fy</span>
                </span>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                  Voice Studio
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2 shadow-soft md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                    location.pathname === link.path
                      ? 'bg-white text-slate-950 shadow-soft'
                      : 'text-white/70 hover:bg-white/8 hover:text-white'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              {isHome && (
                <div className="badge-chip border-white/10 bg-white/10 text-white/80">
                  <Sparkles className="h-4 w-4" />
                  Instant audio generation
                </div>
              )}
              <Button variant="gradient" size="default" asChild>
                <Link to="/text-to-speech">Launch Workspace</Link>
              </Button>
            </div>

            <button
              className="rounded-full border border-white/10 bg-white/5 p-2 text-white transition-colors hover:bg-white/10 md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'absolute left-0 right-0 top-20 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 md:hidden',
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        )}
      >
        <div className="container mx-auto space-y-2 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                'block rounded-2xl px-4 py-3 text-base font-medium transition-all duration-200',
                location.pathname === link.path
                  ? 'bg-white text-slate-950'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <Button variant="gradient" size="lg" className="w-full" asChild>
              <Link to="/text-to-speech" onClick={() => setIsOpen(false)}>
                Launch Workspace
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
