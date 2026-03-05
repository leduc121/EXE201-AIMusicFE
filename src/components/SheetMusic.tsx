import { useMemo } from 'react';
import { NoteEvent } from '../types/music';

interface VisualNote {
  id: string | number;
  top: number;
  left: number;
  type: string;
  isActive: boolean;
  noteName?: string;
}

interface SheetMusicProps {
  isPlaying: boolean;
  currentNote?: number;
  notes?: NoteEvent[];
  currentTime?: number;
}

export function SheetMusic({ isPlaying, currentNote, notes = [], currentTime = 0 }: SheetMusicProps) {
  // Convert notes to visual positions
  const visualNotes: VisualNote[] = useMemo(() => {
    if (notes.length === 0) {
      // Generate mock notes if none provided
      return Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        top: 20 + Math.random() * 40,
        left: i * 40,
        type: Math.random() > 0.5 ? 'quarter' : 'half',
        isActive: false,
        noteName: undefined,
      }));
    }

    // Map actual notes to positions
    const totalDuration = Math.max(...notes.map((n) => n.startTime + n.duration));
    return notes.map((note, index) => {
      const left = (note.startTime / totalDuration) * 800; // Scale to pixels
      const top = getStaffPosition(note.midi);
      const isActive = currentNote === note.midi;

      return {
        id: note.id || index,
        top,
        left,
        type: note.type,
        isActive,
        noteName: `${note.pitch.step}${note.pitch.octave}`,
      };
    });
  }, [notes, currentNote]);

  // Calculate scroll position based on current time
  const scrollOffset = useMemo(() => {
    if (notes.length === 0 || !currentTime) return 0;
    const totalDuration = Math.max(...notes.map((n) => n.startTime + n.duration));
    return (currentTime * 1000 / totalDuration) * 800;
  }, [notes, currentTime]);

  // Auto-scroll effect when playing
  useMemo(() => {
    if (isPlaying) {
      // Additional logic can be added here if needed
    }
  }, [isPlaying]);

  return (
    <div className="relative w-full h-48 bg-parchment border-y-4 border-[#8B4513] overflow-hidden shadow-inner">
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-50" />

      {/* Clef Symbol (Fixed) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-[#3E2723]">
        <svg width="60" height="100" viewBox="0 0 50 100" className="drop-shadow-sm">
          <path
            d="M15,70 C5,70 0,60 5,50 C10,40 20,40 20,30 C20,20 15,10 25,5 C35,10 35,20 30,30 L25,80 C20,90 15,95 25,95 C35,95 40,85 35,75"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Staff Lines */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col space-y-3 opacity-60">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-full h-[1px] bg-[#3E2723]" />
        ))}
      </div>

      {/* Scrolling Notes Container */}
      <div
        className="absolute top-0 left-20 h-full flex items-center transition-transform duration-100"
        style={{
          transform: `translateX(-${scrollOffset}px)`,
        }}
      >
        {visualNotes.map((note) => (
          <div
            key={note.id}
            className="absolute"
            style={{
              left: `${note.left}px`,
              top: `${note.top}%`,
            }}
          >
            {/* Note Head */}
            <div
              className={`
                w-4 h-3 rounded-full transform -rotate-12 transition-all duration-200
                ${note.type === 'quarter' ? 'bg-[#3E2723]' : 'border-2 border-[#3E2723] bg-transparent'}
                ${note.isActive ? 'bg-amber-500 scale-125 shadow-[0_0_10px_rgba(245,158,11,0.8)]' : ''}
              `}
            />

            {/* Note Stem */}
            <div
              className={`w-[2px] h-10 absolute right-0 bottom-1 ${note.isActive ? 'bg-amber-500' : 'bg-[#3E2723]'}`}
            />

            {/* Note Name Label (when active) */}
            {note.isActive && note.noteName && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-amber-600 whitespace-nowrap">
                {note.noteName}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Playhead Indicator */}
      <div className="absolute left-24 top-0 bottom-0 w-[2px] bg-amber-500/50 z-20 shadow-[0_0_10px_rgba(184,134,11,0.5)]" />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#F4E4BC] via-transparent to-[#F4E4BC]" />
    </div>
  );
}

// Map MIDI note to vertical position on staff (0-100%)
function getStaffPosition(midi: number): number {
  // Middle C (C4 = 60) is at 50%
  // Higher notes go up (lower %), lower notes go down (higher %)
  const middleC = 60;
  const semitonesFromMiddleC = midi - middleC;
  // Each line/space is about 5% height
  const position = 50 - semitonesFromMiddleC * 2.5;
  // Clamp between 10% and 90%
  return Math.max(10, Math.min(90, position));
}
