import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Download, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  blob: Blob;
  onDownloadScript: () => void;
  topic: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, blob, onDownloadScript, topic }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      audioRef.current.playbackRate = playbackRate;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) {
      const time = (val / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(val);
    }
  };

  const handleDownloadWav = () => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linguadrama_${topic.replace(/\s+/g, '_').toLowerCase()}.wav`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const toggleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackRate(speeds[nextIndex]);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Format time helper
  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 backdrop-blur-sm">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-full text-slate-900">
                <Volume2 size={20} />
            </div>
            <div>
                <h3 className="font-serif text-lg text-amber-100">Now Playing</h3>
                <p className="text-xs text-amber-200/60 uppercase tracking-widest">Lukas & Felix</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <button
              onClick={toggleSpeed}
              className="text-xs font-bold text-amber-400 hover:text-amber-200 bg-amber-900/40 hover:bg-amber-900/60 px-2 py-1 rounded transition-colors uppercase min-w-[3rem]"
              title="Playback Speed"
            >
              {playbackRate}x
            </button>
            <div className="text-sm font-mono text-amber-200/80">
                {audioRef.current ? fmtTime(audioRef.current.currentTime) : "0:00"} / {fmtTime(duration)}
            </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-slate-800 rounded-full mb-6">
         <div 
            className="absolute top-0 left-0 h-full bg-amber-500 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
         />
         <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress} 
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
         />
      </div>

      <div className="flex justify-center items-center gap-6">
        <button
          onClick={onDownloadScript}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
        >
          <Download size={16} /> Script (.docx)
        </button>

        <button
          onClick={togglePlay}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>

        <button
          onClick={handleDownloadWav}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
        >
          <Download size={16} /> Audio (.wav)
        </button>
      </div>
    </div>
  );
};
