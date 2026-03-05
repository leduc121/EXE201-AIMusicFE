import { useEffect, useState, useCallback } from 'react';
import { Scene3D } from '../components/3d/Scene3D';
import { SheetMusic } from '../components/SheetMusic';
import { Button } from '../components/ui/Button';
import { Play, Pause, RotateCcw, Volume2, ChevronLeft } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { useAudioSync } from '../hooks/useAudioSync';
import { NoteEvent } from '../types/music';

type InstrumentType = 'piano' | 'flute' | 'dan-tranh' | 'dan-bau' | 'guitar' | 'violin';

interface LearningPageProps {
  title: string;
  subtitle: string;
  instrument: InstrumentType;
  notes: NoteEvent[];
  audioFile?: File | string;
  onBack?: () => void;
}

export function LearningPage({ title, subtitle, instrument, notes, audioFile, onBack }: LearningPageProps) {
  const { play, pause, isPlaying, currentTime, duration, loadAudio, volume, setVolume } = useAudio();
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentNote, setCurrentNote] = useState<NoteEvent | null>(null);

  // Load audio file when provided
  useEffect(() => {
    if (audioFile) {
      loadAudio(audioFile);
    }
  }, [audioFile, loadAudio]);

  const handleNoteStart = useCallback((note: NoteEvent) => {
    setActiveNotes((prev) => [...prev, note.midi]);
    setCurrentNote(note);
  }, []);

  const handleNoteEnd = useCallback((note: NoteEvent) => {
    setActiveNotes((prev) => prev.filter((midi) => midi !== note.midi));
  }, []);

  const handleProgressUpdate = useCallback((prog: number) => {
    setProgress(prog);
  }, []);

  // Audio sync hook
  useAudioSync({
    notes,
    onNoteStart: handleNoteStart,
    onNoteEnd: handleNoteEnd,
    onProgressUpdate: handleProgressUpdate,
  });

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#2a1b15] flex flex-col">
      {/* Top Control Bar */}
      <div className="bg-wood-grain p-4 shadow-xl z-20 flex items-center justify-between border-b border-[#D4A574]/20">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-[#D4A574] hover:text-[#FAF7F0] hover:bg-[#3E2723]/50 border border-[#D4A574]/30"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Studio
            </Button>
          )}
          <h2 className="text-[#FAF7F0] text-xl font-bold tracking-wider">{title}</h2>
          <span className="text-[#D4A574] text-sm font-serif italic">{subtitle}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={togglePlay}
            className="min-w-[100px]"
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 w-4 h-4" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-2 w-4 h-4" /> Play
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              pause();
              setProgress(0);
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 ml-4">
            <Volume2 className="w-4 h-4 text-[#D4A574]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 accent-[#D4A574]"
            />
          </div>
        </div>
      </div>

      {/* Sheet Music Area */}
      <div className="flex-1 bg-[#1a100c] relative flex flex-col">
        <div className="w-full max-w-6xl mx-auto pt-8 px-4 flex-1 flex flex-col justify-center">
          <SheetMusic
            isPlaying={isPlaying}
            currentNote={currentNote?.midi}
            notes={notes}
            currentTime={currentTime}
          />

          {/* Progress Bar */}
          <div className="mt-8 w-full bg-[#3E2723] h-2 rounded-full overflow-hidden cursor-pointer">
            <div
              className="h-full bg-[#D4A574] transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(212,165,116,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-[#8B4513] font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Active Notes Display */}
          <div className="mt-4 flex justify-center space-x-2">
            {activeNotes.map((midi) => (
              <span
                key={midi}
                className="px-3 py-1 bg-[#D4A574] text-[#3E2723] rounded-full text-sm font-bold animate-pulse"
              >
                {getNoteName(midi)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Instrument Visualization */}
      <Scene3D
        instrument={instrument}
        activeKeys={activeNotes}
        pitch={instrument === 'dan-bau' ? activeNotes[0] : undefined}
      />
    </div>
  );
}

function getNoteName(midi: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const noteName = noteNames[midi % 12];
  return `${noteName}${octave}`;
}
