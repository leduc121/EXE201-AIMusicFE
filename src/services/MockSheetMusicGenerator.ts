import { NoteEvent, MusicScore, ParsedMusicData, InstrumentInfo } from '../types/music';
import { MusicUtils } from './MusicParser';

/**
 * Mock Sheet Music Generator
 * Simulates AI transcription from audio files
 */

export interface AudioAnalysisResult {
  duration: number;
  tempo: number;
  detectedInstruments: string[];
  confidence: number;
}

/**
 * Analyzes audio file and generates mock transcription data
 * In a real implementation, this would call an AI service API
 */
export async function analyzeAudioFile(file: File): Promise<AudioAnalysisResult> {
  // Simulate AI analysis delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock analysis based on filename or random
  const fileName = file.name.toLowerCase();
  
  // Try to detect instrument from filename
  let detectedInstruments = ['piano'];
  if (fileName.includes('guitar') || fileName.includes('guitar')) {
    detectedInstruments = ['guitar'];
  } else if (fileName.includes('violin') || fileName.includes('violin')) {
    detectedInstruments = ['violin'];
  } else if (fileName.includes('flute') || fileName.includes('sao')) {
    detectedInstruments = ['sao-truc'];
  } else if (fileName.includes('tranh') || fileName.includes('zither')) {
    detectedInstruments = ['dan-tranh'];
  } else if (fileName.includes('bau') || fileName.includes('monochord')) {
    detectedInstruments = ['dan-bau'];
  }
  
  return {
    duration: Math.floor(Math.random() * 120) + 60, // 1-3 minutes
    tempo: Math.floor(Math.random() * 60) + 80, // 80-140 BPM
    detectedInstruments,
    confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
  };
}

/**
 * Generates mock notes based on instrument type
 */
export function generateMockNotes(
  instrument: string,
  duration: number,
  tempo: number
): NoteEvent[] {
  const notes: NoteEvent[] = [];
  const beatDuration = 60000 / tempo; // ms per beat
  let currentTime = 0;
  let noteId = 0;
  
  // Get appropriate note range for instrument
  const noteRange = getInstrumentNoteRange(instrument);
  
  // Generate notes for the duration
  while (currentTime < duration * 1000) {
    const noteDuration = beatDuration * getRandomNoteLength();
    const midi = getRandomNoteInRange(noteRange.min, noteRange.max, instrument);
    const noteInfo = MusicUtils.midiToNote(midi);
    
    const note: NoteEvent = {
      id: `note-${noteId++}`,
      pitch: {
        step: noteInfo.step,
        octave: noteInfo.octave,
        alter: noteInfo.alter,
      },
      midi,
      duration: noteDuration,
      startTime: currentTime,
      type: durationToNoteType(noteDuration, tempo),
    };
    
    // Add Vietnamese-specific metadata for traditional instruments
    if (instrument.includes('dan') || instrument.includes('sao')) {
      note.vietnamese = {
        technique: getRandomTechnique(),
        stringIndex: instrument === 'dan-tranh' ? Math.floor(Math.random() * 16) : undefined,
      };
    }
    
    notes.push(note);
    currentTime += noteDuration;
    
    // Add small gap between notes sometimes
    if (Math.random() > 0.7) {
      currentTime += beatDuration * 0.5;
    }
  }
  
  return notes;
}

/**
 * Creates a complete mock music score from audio analysis
 */
export function createMockScore(
  file: File,
  analysis: AudioAnalysisResult
): ParsedMusicData {
  const now = new Date().toISOString();
  const instrument = analysis.detectedInstruments[0];
  
  // Generate notes
  const notes = generateMockNotes(instrument, analysis.duration, analysis.tempo);
  
  // Create instrument info
  const instrumentInfo = getMockInstrumentInfo(instrument);
  
  // Group notes into measures
  const measures = groupNotesIntoMeasures(notes, analysis.tempo);
  
  const score: MusicScore = {
    id: `score-${Date.now()}`,
    title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
    metadata: {
      createdAt: now,
      updatedAt: now,
      source: 'ai-transcription',
      duration: analysis.duration * 1000,
      tempo: {
        bpm: analysis.tempo,
        marking: getTempoMarking(analysis.tempo),
      },
    },
    parts: [
      {
        id: 'part-1',
        name: instrumentInfo.displayName,
        instrument: instrumentInfo,
        staff: {
          id: 'staff-1',
          clef: { type: 'treble', line: 2 },
          keySignature: { fifths: 0, mode: 'major' },
          timeSignature: { beats: 4, beatType: 4 },
          measures,
        },
        isActive: true,
      },
    ],
  };
  
  // Add Vietnamese metadata if applicable
  if (instrument.includes('dan') || instrument.includes('sao')) {
    score.vietnamese = {
      scale: 'bac',
      mode: 'hard',
    };
  }
  
  return {
    score,
    detectedInstruments: [instrumentInfo],
    suggestedTempo: analysis.tempo,
    confidence: analysis.confidence,
    warnings: analysis.confidence < 0.8 ? ['Low confidence in transcription'] : undefined,
  };
}

// Helper functions

function getInstrumentNoteRange(instrument: string): { min: number; max: number } {
  const ranges: Record<string, { min: number; max: number }> = {
    'piano': { min: 48, max: 84 },
    'guitar': { min: 40, max: 76 },
    'violin': { min: 55, max: 88 },
    'sao-truc': { min: 62, max: 86 },
    'dan-tranh': { min: 55, max: 91 },
    'dan-bau': { min: 48, max: 84 },
    'flute': { min: 60, max: 96 },
  };
  
  return ranges[instrument] || ranges['piano'];
}

function getRandomNoteInRange(min: number, max: number, instrument: string): number {
  // For Vietnamese instruments, use pentatonic scale
  if (instrument.includes('dan') || instrument.includes('sao')) {
    const pentatonic = [0, 2, 4, 7, 9]; // Major pentatonic intervals
    const octave = Math.floor(Math.random() * ((max - min) / 12)) + Math.floor(min / 12);
    const noteInScale = pentatonic[Math.floor(Math.random() * pentatonic.length)];
    return octave * 12 + noteInScale;
  }
  
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNoteLength(): number {
  const lengths = [0.25, 0.5, 1, 1.5, 2]; // Quarter, half, whole, etc.
  const weights = [0.3, 0.4, 0.2, 0.05, 0.05];
  
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < lengths.length; i++) {
    sum += weights[i];
    if (random <= sum) return lengths[i];
  }
  return 1;
}

function durationToNoteType(duration: number, tempo: number): NoteEvent['type'] {
  const beatMs = 60000 / tempo;
  const beats = duration / beatMs;
  
  if (beats >= 4) return 'whole';
  if (beats >= 2) return 'half';
  if (beats >= 1) return 'quarter';
  if (beats >= 0.5) return 'eighth';
  return 'sixteenth';
}

function getRandomTechnique(): 'pluck' | 'slide' | 'hammer-on' | 'pull-off' | 'harmonic' | 'tremolo' {
  const techniques: ('pluck' | 'slide' | 'hammer-on' | 'pull-off' | 'harmonic' | 'tremolo')[] = ['pluck', 'slide', 'hammer-on', 'pull-off', 'harmonic', 'tremolo'];
  return techniques[Math.floor(Math.random() * techniques.length)];
}

function getTempoMarking(bpm: number): string {
  if (bpm < 60) return 'Largo';
  if (bpm < 70) return 'Adagio';
  if (bpm < 85) return 'Andante';
  if (bpm < 110) return 'Moderato';
  if (bpm < 130) return 'Allegro';
  return 'Vivace';
}

function getMockInstrumentInfo(instrumentId: string): InstrumentInfo {
  const instruments: Record<string, InstrumentInfo> = {
    'piano': {
      id: 'piano',
      name: 'piano',
      displayName: 'Piano',
      category: 'western',
      family: 'keyboard',
      range: { min: 21, max: 108 },
    },
    'guitar': {
      id: 'guitar',
      name: 'guitar',
      displayName: 'Acoustic Guitar',
      category: 'western',
      family: 'string',
      range: { min: 40, max: 76 },
    },
    'violin': {
      id: 'violin',
      name: 'violin',
      displayName: 'Violin',
      category: 'western',
      family: 'string',
      range: { min: 55, max: 103 },
    },
    'sao-truc': {
      id: 'sao-truc',
      name: 'sao-truc',
      displayName: 'Sáo Trúc',
      category: 'vietnamese-traditional',
      family: 'wind',
      range: { min: 62, max: 86 },
      vietnamese: {
        scale: 'bac',
        holes: 6,
      },
    },
    'dan-tranh': {
      id: 'dan-tranh',
      name: 'dan-tranh',
      displayName: 'Đàn Tranh',
      category: 'vietnamese-traditional',
      family: 'string',
      range: { min: 55, max: 91 },
      vietnamese: {
        scale: 'bac',
        strings: 16,
      },
    },
    'dan-bau': {
      id: 'dan-bau',
      name: 'dan-bau',
      displayName: 'Đàn Bầu',
      category: 'vietnamese-traditional',
      family: 'string',
      range: { min: 48, max: 84 },
      vietnamese: {
        scale: 'bac',
        strings: 1,
      },
    },
    'flute': {
      id: 'flute',
      name: 'flute',
      displayName: 'Flute',
      category: 'western',
      family: 'wind',
      range: { min: 60, max: 96 },
    },
  };
  
  return instruments[instrumentId] || instruments['piano'];
}

function groupNotesIntoMeasures(notes: NoteEvent[], tempo: number) {
  const beatMs = 60000 / tempo;
  const measureDuration = beatMs * 4; // 4/4 time
  
  const measures: { id: string; number: number; notes: NoteEvent[]; timeSignature: { beats: number; beatType: number } }[] = [];
  let currentMeasure: NoteEvent[] = [];
  let measureNumber = 1;
  let measureStartTime = 0;
  
  for (const note of notes) {
    if (note.startTime >= measureStartTime + measureDuration) {
      // Save current measure
      measures.push({
        id: `measure-${measureNumber}`,
        number: measureNumber,
        notes: currentMeasure,
        timeSignature: { beats: 4, beatType: 4 },
      });
      
      // Start new measure
      measureNumber++;
      measureStartTime += measureDuration;
      currentMeasure = [note];
    } else {
      currentMeasure.push(note);
    }
  }
  
  // Add last measure
  if (currentMeasure.length > 0) {
    measures.push({
      id: `measure-${measureNumber}`,
      number: measureNumber,
      notes: currentMeasure,
      timeSignature: { beats: 4, beatType: 4 },
    });
  }
  
  return measures;
}

// Export convenience functions
export const mockSheetMusicGenerator = {
  analyzeAudio: analyzeAudioFile,
  generateNotes: generateMockNotes,
  createScore: createMockScore,
};
