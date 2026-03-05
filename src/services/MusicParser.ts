import {
  MusicScore,
  NoteEvent,
  Measure,
  TutorialStep,
  InstrumentInfo,
  ParsedMusicData,
  HandPosition,
  NoteName,
  VietnameseScale,
} from '../types/music';

// ==================== CONSTANTS ====================

const NOTE_NAMES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Vietnamese scales mapping (pentatonic)
const VIETNAMESE_SCALES: Record<VietnameseScale, number[]> = {
  'bac': [0, 2, 4, 7, 9], // C D E G A
  'nam': [0, 3, 5, 7, 10], // C Eb F G Bb
  'oi': [0, 2, 5, 7, 9], // C D F G A
  'xuong': [0, 3, 5, 8, 10], // C Eb F Ab Bb
  'ngu': [0, 2, 4, 6, 7, 9, 11], // C D E F# G A B (7 notes)
  'ly': [0, 2, 5, 7, 9], // Same as oi
  'tuong': [0, 3, 5, 7, 9], // C Eb F G A
};

// Đàn Tranh string tuning (16 strings, pentatonic scale)
const DAN_TRANH_TUNING: Record<VietnameseScale, number[]> = {
  'bac': [55, 57, 59, 62, 64, 67, 69, 71, 74, 76, 79, 81, 83, 86, 88, 91], // G3 to G6
  'nam': [55, 58, 60, 62, 65, 67, 70, 72, 74, 77, 79, 82, 84, 86, 89, 91],
  'oi': [55, 57, 60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84, 86, 88, 91],
  'xuong': [55, 58, 60, 63, 65, 67, 70, 72, 75, 77, 79, 82, 84, 87, 89, 91],
  'ngu': [55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74, 76, 78, 79, 81],
  'ly': [55, 57, 60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84, 86, 88, 91],
  'tuong': [55, 58, 60, 62, 64, 67, 70, 72, 74, 77, 79, 81, 84, 86, 88, 91],
};

// ==================== UTILITY FUNCTIONS ====================

export class MusicUtils {
  static midiToNote(midi: number): { step: NoteName; octave: number; alter: number } {
    const octave = Math.floor(midi / 12) - 1;
    const noteIndex = midi % 12;
    const step = NOTE_NAMES[noteIndex];
    const alter = step.includes('#') ? 1 : 0;
    const baseStep = step.replace('#', '') as NoteName;
    
    return { step: baseStep, octave, alter };
  }

  static noteToMidi(step: NoteName, octave: number, alter: number = 0): number {
    const baseIndex = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(step);
    if (baseIndex === -1) throw new Error(`Invalid note: ${step}`);
    return (octave + 1) * 12 + baseIndex + alter;
  }

  static msToBPM(ms: number): number {
    return Math.round(60000 / ms);
  }

  static bpmToMs(bpm: number): number {
    return 60000 / bpm;
  }

  static getStaffLine(midi: number, clef: 'treble' | 'bass' = 'treble'): number {
    // Middle C (C4 = 60) is on ledger line below treble staff (line -1)
    // Treble staff lines: E4(64), G4(67), B4(71), D5(74), F5(77)
    // Bass staff lines: G2(43), B2(47), D3(50), F3(53), A3(57)
    
    const middleC = 60;
    const semitonesFromMiddleC = midi - middleC;
    
    if (clef === 'treble') {
      // Line 0 = middle C, each line is 2 steps (whole tone apart in scale)
      // Actually in staff notation: lines are 2 scale degrees apart
      return Math.round(semitonesFromMiddleC / 2);
    } else {
      // Bass clef: middle C is above the staff
      const bassOffset = 12; // One octave difference
      return Math.round((midi - (middleC - bassOffset)) / 2);
    }
  }

  static detectVietnameseScale(notes: NoteEvent[]): VietnameseScale {
    // Analyze note distribution to detect scale
    const pitchClasses = new Set(notes.map(n => n.midi % 12));
    
    for (const [scaleName, scalePitches] of Object.entries(VIETNAMESE_SCALES)) {
      let matches = 0;
      for (const pc of pitchClasses) {
        if (scalePitches.includes(pc % 12)) {
          matches++;
        }
      }
      if (matches / pitchClasses.size > 0.8) {
        return scaleName as VietnameseScale;
      }
    }
    
    return 'bac'; // Default
  }
}

// ==================== MUSIC PARSER CLASS ====================

export class MusicParser {
  private score: MusicScore;

  constructor(score: MusicScore) {
    this.score = score;
  }

  /**
   * Parse AI output (mock format for now - will be replaced by real AI integration)
   */
  static fromAIOutput(aiData: any): ParsedMusicData {
    // Expected AI output format:
    // {
    //   title: string,
    //   duration: number,
    //   tempo: number,
    //   notes: Array<{pitch: number, start: number, duration: number, velocity: number}>,
    //   detectedInstruments: string[],
    //   confidence: number
    // }
    
    const now = new Date().toISOString();
    const detectedInstruments = aiData.detectedInstruments || ['piano'];
    
    // Convert AI notes to NoteEvents
    const notes: NoteEvent[] = aiData.notes.map((n: any, index: number) => {
      const noteInfo = MusicUtils.midiToNote(n.pitch);
      return {
        id: `note-${index}`,
        pitch: {
          step: noteInfo.step,
          octave: noteInfo.octave,
          alter: noteInfo.alter,
        },
        midi: n.pitch,
        duration: n.duration,
        startTime: n.start,
        type: MusicParser.inferNoteType(n.duration, aiData.tempo),
      };
    });

    // Group notes into measures
    const measures = MusicParser.groupIntoMeasures(notes, aiData.tempo);

    // Detect Vietnamese scale if applicable
    const vietnameseScale = MusicUtils.detectVietnameseScale(notes);

    // Create instrument parts
    const parts = detectedInstruments.map((instId: string, index: number) => {
      const instrument = MusicParser.getInstrumentInfo(instId);
      
      return {
        id: `part-${index}`,
        name: instrument.displayName,
        instrument,
        staff: {
          id: `staff-${index}`,
          clef: { type: 'treble' as const, line: 2 },
          keySignature: { fifths: 0, mode: 'major' as const },
          timeSignature: { beats: 4, beatType: 4 },
          measures,
        },
        isActive: true,
      };
    });

    const score: MusicScore = {
      id: `score-${Date.now()}`,
      title: aiData.title || 'Untitled',
      metadata: {
        createdAt: now,
        updatedAt: now,
        source: 'ai-transcription',
        originalUrl: aiData.originalUrl,
        duration: aiData.duration || 0,
        tempo: {
          bpm: aiData.tempo || 120,
          marking: MusicParser.getTempoMarking(aiData.tempo || 120),
        },
      },
      parts,
    };

    // Add Vietnamese metadata if detected
    if (detectedInstruments.some((id: string) => id.includes('dan') || id.includes('sao'))) {
      score.vietnamese = {
        scale: vietnameseScale,
        mode: 'hard',
      };
    }

    return {
      score,
      detectedInstruments: parts.map((p: { instrument: InstrumentInfo }) => p.instrument),
      suggestedTempo: aiData.tempo || 120,
      confidence: aiData.confidence || 0.9,
      warnings: aiData.warnings,
    };
  }

  /**
   * Generate tutorial steps from a part
   */
  generateTutorial(partIndex: number = 0): TutorialStep[] {
    const part = this.score.parts[partIndex];
    if (!part) throw new Error(`Part ${partIndex} not found`);

    const steps: TutorialStep[] = [];
    const instrument = part.instrument;
    const measures = part.staff.measures;

    let stepOrder = 0;
    
    for (const measure of measures) {
      for (const note of measure.notes) {
        const handPositions = this.calculateHandPositions(note, instrument);
        
        const step: TutorialStep = {
          id: `step-${stepOrder}`,
          order: stepOrder,
          noteEvent: note,
          timestamp: note.startTime,
          instruction: this.generateInstruction(note, instrument),
          handPositions,
          indicators: this.calculateIndicators(note, instrument),
          practice: {
            waitForInput: true,
            tempo: this.score.metadata.tempo.bpm,
            loopCount: 1,
            metronome: true,
          },
        };

        steps.push(step);
        stepOrder++;
      }
    }

    return steps;
  }

  /**
   * Calculate hand positions for a note
   */
  private calculateHandPositions(note: NoteEvent, instrument: InstrumentInfo): {
    left?: HandPosition[];
    right?: HandPosition[];
  } {
    const positions: { left?: HandPosition[]; right?: HandPosition[] } = {};

    switch (instrument.id) {
      case 'dan-tranh':
        positions.right = this.calculateDanTranhHandPosition(note);
        break;
      case 'dan-bau':
        positions.right = this.calculateDanBauHandPosition(note);
        break;
      case 'sao-truc':
      case 'flute':
        positions.left = this.calculateFluteHandPosition(note);
        break;
      case 'piano':
        positions.left = this.calculatePianoHandPosition(note, 'left');
        positions.right = this.calculatePianoHandPosition(note, 'right');
        break;
    }

    return positions;
  }

  private calculateDanTranhHandPosition(note: NoteEvent): HandPosition[] {
    const tuning = DAN_TRANH_TUNING[this.score.vietnamese?.scale || 'bac'];
    
    // Find which string to play
    let stringIndex = -1;
    for (let i = 0; i < tuning.length; i++) {
      if (Math.abs(tuning[i] - note.midi) <= 1) {
        stringIndex = i;
        break;
      }
    }

    if (stringIndex === -1) return [];

    // Map string to finger position
    // Strings 0-7: right hand thumb-index-middle-ring-pinky
    // Strings 8-15: reposition hand
    const normalizedString = stringIndex % 8;
    const fingerMap = ['thumb', 'index', 'middle', 'ring', 'pinky', 'index', 'middle', 'ring'];
    const finger = fingerMap[normalizedString] as HandPosition['finger'];

    // Calculate visual position (0-1 from left to right)
    const x = stringIndex / 16;
    const y = 0.8; // Above strings
    const z = 0;

    return [{
      finger,
      position: { x, y, z },
      pressure: 0.7,
    }];
  }

  private calculateDanBauHandPosition(note: NoteEvent): HandPosition[] {
    // Đàn bầu: monochord with pitch bend
    // Hand position controls pitch
    const normalized = (note.midi - 48) / (84 - 48);
    
    return [{
      finger: 'middle',
      position: { x: 0.3 + normalized * 0.4, y: 0.5, z: 0 },
      pressure: 0.5,
    }];
  }

  private calculateFluteHandPosition(note: NoteEvent): HandPosition[] {
    // For 6-hole flute, map notes to hole combinations
    const holeMap: Record<number, number[]> = {
      62: [0],      // D4 - all open
      64: [1],      // E4
      67: [2],      // G4
      69: [3],      // A4
      71: [4],      // B4
      74: [5],      // D5 - all closed
    };

    const holes = holeMap[note.midi] || [];
    
    return holes.map(hole => ({
      finger: ['index', 'middle', 'ring', 'pinky'][hole % 4] as HandPosition['finger'],
      position: { x: 0.2 + hole * 0.15, y: 0.5, z: 0.1 },
      pressure: 1.0,
    }));
  }

  private calculatePianoHandPosition(note: NoteEvent, hand: 'left' | 'right'): HandPosition[] {
    // Simplified: just indicate which key
    // In a full implementation, this would calculate proper fingering
    const isLeftHand = hand === 'left';
    const keyRange = isLeftHand ? [36, 60] : [60, 84];
    
    if (note.midi < keyRange[0] || note.midi > keyRange[1]) {
      return [];
    }

    const fingerMap = ['thumb', 'index', 'middle', 'ring', 'pinky'];
    const fingerIndex = (note.midi - keyRange[0]) % 5;

    return [{
      finger: fingerMap[fingerIndex] as HandPosition['finger'],
      position: { x: (note.midi - keyRange[0]) / 24, y: 0, z: 0.1 },
      pressure: 0.8,
    }];
  }

  private calculateIndicators(note: NoteEvent, instrument: InstrumentInfo) {
    const indicators: TutorialStep['indicators'] = {};

    switch (instrument.id) {
      case 'dan-tranh':
        const tuning = DAN_TRANH_TUNING[this.score.vietnamese?.scale || 'bac'];
        for (let i = 0; i < tuning.length; i++) {
          if (Math.abs(tuning[i] - note.midi) <= 1) {
            indicators.stringHighlight = [i];
            break;
          }
        }
        break;
      case 'sao-truc':
      case 'flute':
        const holeMap: Record<number, number[]> = {
          62: [0], 64: [1], 67: [2], 69: [3], 71: [4], 74: [5],
        };
        indicators.holeHighlight = holeMap[note.midi] || [];
        break;
      case 'piano':
        indicators.keyHighlight = [note.midi];
        break;
    }

    return indicators;
  }

  private generateInstruction(note: NoteEvent, instrument: InstrumentInfo): TutorialStep['instruction'] {
    const noteName = `${note.pitch.step}${note.pitch.alter ? '#' : ''}${note.pitch.octave}`;
    
    let text = `Play ${noteName}`;
    let vietnamese = `Chơi nốt ${noteName}`;

    switch (instrument.id) {
      case 'dan-tranh':
        const tuning = DAN_TRANH_TUNING[this.score.vietnamese?.scale || 'bac'];
        for (let i = 0; i < tuning.length; i++) {
          if (Math.abs(tuning[i] - note.midi) <= 1) {
            text = `Pluck string ${i + 1}`;
            vietnamese = `Búng dây ${i + 1}`;
            break;
          }
        }
        break;
      case 'sao-truc':
        text = `Play note ${noteName} on flute`;
        vietnamese = `Thổi nốt ${noteName}`;
        break;
      case 'piano':
        text = `Press key ${noteName}`;
        vietnamese = `Ấn phím ${noteName}`;
        break;
    }

    return { text, vietnamese, highlight: 'both' };
  }

  // ==================== STATIC HELPER METHODS ====================

  private static inferNoteType(duration: number, tempo: number): NoteEvent['type'] {
    const beatMs = 60000 / tempo;
    const beats = duration / beatMs;

    if (beats >= 4) return 'whole';
    if (beats >= 2) return 'half';
    if (beats >= 1) return 'quarter';
    if (beats >= 0.5) return 'eighth';
    if (beats >= 0.25) return 'sixteenth';
    return 'thirty-second';
  }

  private static groupIntoMeasures(notes: NoteEvent[], tempo: number): Measure[] {
    const beatMs = 60000 / tempo;
    const measureDuration = beatMs * 4; // Assume 4/4 time
    
    const measures: Measure[] = [];
    let currentMeasure: NoteEvent[] = [];
    let measureNumber = 1;

    // Sort notes by start time
    const sortedNotes = [...notes].sort((a, b) => a.startTime - b.startTime);

    for (const note of sortedNotes) {
      const measureStart = (measureNumber - 1) * measureDuration;
      const measureEnd = measureStart + measureDuration;

      if (note.startTime >= measureEnd) {
        // Save current measure
        measures.push({
          id: `measure-${measureNumber}`,
          number: measureNumber,
          notes: currentMeasure,
          timeSignature: { beats: 4, beatType: 4 },
        });
        
        // Start new measure
        measureNumber++;
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

  private static getInstrumentInfo(instrumentId: string): InstrumentInfo {
    const instruments: Record<string, InstrumentInfo> = {
      'piano': {
        id: 'piano',
        name: 'piano',
        displayName: 'Piano',
        category: 'western',
        family: 'keyboard',
        range: { min: 21, max: 108 },
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

  private static getTempoMarking(bpm: number): string {
    if (bpm < 60) return 'Largo';
    if (bpm < 70) return 'Adagio';
    if (bpm < 85) return 'Andante';
    if (bpm < 110) return 'Moderato';
    if (bpm < 130) return 'Allegro';
    if (bpm < 150) return 'Vivace';
    return 'Presto';
  }
}

// Export singleton instance for convenience
export const musicParser = {
  parse: MusicParser.fromAIOutput,
  utils: MusicUtils,
};
