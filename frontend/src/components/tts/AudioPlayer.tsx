import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  audioUrl: string;
  onDownload?: () => void;
  className?: string;
}

const waveformSeed = [26, 52, 34, 70, 44, 62, 30, 75, 40, 58, 31, 66, 48, 60, 36, 72, 42, 64, 28, 56];

export function AudioPlayer({ audioUrl, onDownload, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const waveformBars = useMemo(
    () => waveformSeed.map((value, index) => value + ((index % 4) * 4)),
    []
  );

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    await audio.play();
    setIsPlaying(true);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextVolume = value[0];
    audio.volume = nextVolume;
    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 1;
      setIsMuted(false);
      return;
    }

    audio.volume = 0;
    setIsMuted(true);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('panel-surface rounded-[2rem] p-6 sm:p-8 animate-slide-up', className)}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Generated audio</p>
          <h3 className="text-display mt-3 text-3xl font-bold text-foreground">Playback Studio</h3>
        </div>
        <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          MP3 ready
        </div>
      </div>

      <div className="mt-8 rounded-[1.75rem] bg-slate-950 px-5 py-6 text-white sm:px-6">
        <div className="flex h-24 items-end gap-2">
          {waveformBars.map((height, index) => (
            <div
              key={height + index}
              className={cn(
                'w-full rounded-full bg-gradient-to-t from-cyan-400 via-sky-300 to-amber-200 transition-all duration-300',
                isPlaying ? 'opacity-100' : 'opacity-65'
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        <div className="mt-6">
          <Slider value={[currentTime]} max={duration || 100} step={0.1} onValueChange={handleSeek} className="cursor-pointer" />
          <div className="mt-2 flex justify-between text-xs text-white/60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleRestart} className="text-white/70 hover:bg-white/10 hover:text-white">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="gradient" size="icon" onClick={togglePlay} className="h-12 w-12 bg-white text-slate-950 hover:bg-white/92">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white/70 hover:bg-white/10 hover:text-white">
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-24" />
          </div>

          {onDownload && (
            <Button variant="gradient" size="default" onClick={onDownload} className="w-full sm:w-auto">
              <Download className="h-4 w-4" />
              Download MP3
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
