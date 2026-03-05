/**
 * Music Score Schema for AI-generated sheet music
 * Compatible with MIDI, MusicXML, and traditional Vietnamese music notation
 */

// ==================== CORE TYPES ====================

export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
export type Accidental = 'natural' | 'sharp' | 'flat' | 'double-sharp' | 'double-flat';
export type ClefType = 'treble' | 'bass' | 'alto' | 'tenor' | 'percussion';
export type NoteType = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth' | 'thirty-second' | 'sixty-fourth';

// Vietnamese traditional music specific
export type VietnameseScale = 'bac' | 'nam' | 'oi' | 'xuong' | 'ngu' | 'ly' | 'tuong';
export type VietnameseMode = 'hard' | 'soft' | 'mixed';

// ==================== NOTE EVENT ====================

export interface NoteEvent {
  id: string;
  pitch: {
    step: NoteName;
    octave: number;
    alter?: number; // -1, 0, 1 for flat, natural, sharp
  };
  midi: number; // 0-127
  duration: number; // in milliseconds
  startTime: number; // in milliseconds from start
  type: NoteType;
  dots?: number; // 0-3
  tied?: 'start' | 'stop' | 'continue';
  slur?: 'start' | 'stop';
  
  // Vietnamese music specific
  vietnamese?: {
    stringIndex?: number; // For đàn tranh (0-18)
    fretPosition?: number; // For string instruments
    bending?: {
      type: 'up' | 'down' | 'vibrato';
      amount: number; // semitones
      duration: number; // ms
    };
    technique?: 'pluck' | 'hammer-on' | 'pull-off' | 'slide' | 'harmonic' | 'tremolo';
  };
  
  // Visual properties
  position?: {
    staffLine: number; // -5 to 5 (0 = middle C line)
    ledgerLines?: number; // Number of ledger lines needed
  };
}

// ==================== MEASURE & STAFF ====================

export interface TimeSignature {
  beats: number;
  beatType: number; // 4 = quarter, 8 = eighth, etc.
}

export interface KeySignature {
  fifths: number; // -7 to 7 (negative = flats, positive = sharps)
  mode?: 'major' | 'minor' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian';
}

export interface Measure {
  id: string;
  number: number;
  timeSignature?: TimeSignature; // Changes within piece
  keySignature?: KeySignature; // Changes within piece
  notes: NoteEvent[];
  barline?: {
    left?: 'regular' | 'heavy' | 'light-light' | 'light-heavy';
    right?: 'regular' | 'heavy' | 'light-light' | 'light-heavy' | 'repeat-forward' | 'repeat-backward';
  };
}

export interface Staff {
  id: string;
  clef: {
    type: ClefType;
    line?: number; // 1-5, default 2 for treble
  };
  keySignature: KeySignature;
  timeSignature: TimeSignature;
  measures: Measure[];
}

// ==================== INSTRUMENT ====================

export interface InstrumentInfo {
  id: string;
  name: string;
  displayName: string;
  category: 'western' | 'vietnamese-traditional' | 'vietnamese-folk' | 'asian';
  family: 'string' | 'wind' | 'percussion' | 'keyboard';
  
  // Technical specs
  tuning?: {
    notes: number[]; // MIDI numbers
    name: string; // e.g., "Standard", "Bạc scale"
  };
  range: {
    min: number; // MIDI
    max: number; // MIDI
  };
  
  // Vietnamese specific
  vietnamese?: {
    scale?: VietnameseScale;
    mode?: VietnameseMode;
    strings?: number; // For đàn tranh, đàn nguyệt
    holes?: number; // For sáo, tiêu
  };
  
  // Visual properties
  color?: string;
  icon?: string;
  description?: string;
}

// ==================== TUTORIAL STEP ====================

export interface HandPosition {
  finger: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
  position: {
    x: number; // 0-1 normalized position on instrument
    y: number;
    z?: number;
  };
  pressure?: number; // 0-1
}

export interface TutorialStep {
  id: string;
  order: number;
  noteEvent: NoteEvent;
  timestamp: number; // When this step starts
  
  // Instruction
  instruction: {
    text: string;
    vietnamese?: string;
    highlight?: 'finger' | 'note' | 'both';
  };
  
  // Hand positions for this step
  handPositions: {
    left?: HandPosition[];
    right?: HandPosition[];
  };
  
  // Visual indicators
  indicators?: {
    stringHighlight?: number[]; // String indices to highlight
    holeHighlight?: number[]; // Hole indices to highlight  
    keyHighlight?: number[]; // Key indices for keyboard
    fretHighlight?: number[];
  };
  
  // Audio
  audio?: {
    url?: string;
    synthesized?: boolean;
    referencePitch?: number;
  };
  
  // Practice settings
  practice?: {
    waitForInput: boolean;
    tempo: number; // BPM
    loopCount: number;
    metronome: boolean;
  };
}

// ==================== MAIN MUSIC SCORE ====================

export interface MusicScore {
  id: string;
  title: string;
  composer?: string;
  arranger?: string;
  lyricist?: string;
  
  // Metadata
  metadata: {
    createdAt: string;
    updatedAt: string;
    source?: 'ai-transcription' | 'manual' | 'import';
    originalUrl?: string; // For YouTube imports
    duration: number; // Total duration in ms
    difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    genre?: string[];
    tempo: {
      bpm: number;
      marking?: string; // e.g., "Allegro", "Andante"
    };
  };
  
  // Parts (instruments)
  parts: {
    id: string;
    name: string;
    instrument: InstrumentInfo;
    staff: Staff;
    isActive: boolean;
  }[];
  
  // Tutorials generated from parts
  tutorials?: {
    instrumentId: string;
    steps: TutorialStep[];
  }[];
  
  // Vietnamese music specific
  vietnamese?: {
    scale: VietnameseScale;
    mode: VietnameseMode;
    lyrics?: {
      text: string;
      startTime: number;
      endTime: number;
    }[];
  };
}

// ==================== PARSER OUTPUT ====================

export interface ParsedMusicData {
  score: MusicScore;
  detectedInstruments: InstrumentInfo[];
  suggestedTempo: number;
  confidence: number; // AI confidence 0-1
  warnings?: string[];
}

// ==================== EXPORT FORMATS ====================

export type ExportFormat = 'json' | 'musicxml' | 'midi' | 'pdf' | 'abc';

export interface ExportOptions {
  format: ExportFormat;
  includeTutorials?: boolean;
  includeMetadata?: boolean;
  instruments?: string[]; // Filter by instrument IDs
}
