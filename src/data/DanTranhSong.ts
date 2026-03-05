import { NoteEvent } from '../types/music';

// Đàn Tranh - 16 strings pentatonic scale
// String 1 (leftmost) = G3 (55), String 16 (rightmost) = G6 (91)
// Scale: G A B D E (Bắc scale - pentatonic)

export const DAN_TRANH_DEMO_SONG: NoteEvent[] = [
    // Introduction: G A B
    { id: 'dt-1', pitch: { step: 'G', octave: 3, alter: 0 }, midi: 55, duration: 500, startTime: 0, type: 'quarter' },
    { id: 'dt-2', pitch: { step: 'A', octave: 3, alter: 0 }, midi: 57, duration: 500, startTime: 600, type: 'quarter' },
    { id: 'dt-3', pitch: { step: 'B', octave: 3, alter: 0 }, midi: 59, duration: 500, startTime: 1200, type: 'quarter' },
    
    // Main melody: D E D B A G
    { id: 'dt-4', pitch: { step: 'D', octave: 4, alter: 0 }, midi: 62, duration: 400, startTime: 1800, type: 'quarter' },
    { id: 'dt-5', pitch: { step: 'E', octave: 4, alter: 0 }, midi: 64, duration: 400, startTime: 2300, type: 'quarter' },
    { id: 'dt-6', pitch: { step: 'D', octave: 4, alter: 0 }, midi: 62, duration: 400, startTime: 2800, type: 'quarter' },
    { id: 'dt-7', pitch: { step: 'B', octave: 3, alter: 0 }, midi: 59, duration: 400, startTime: 3300, type: 'quarter' },
    { id: 'dt-8', pitch: { step: 'A', octave: 3, alter: 0 }, midi: 57, duration: 400, startTime: 3800, type: 'quarter' },
    { id: 'dt-9', pitch: { step: 'G', octave: 3, alter: 0 }, midi: 55, duration: 600, startTime: 4300, type: 'half' },
    
    // Second phrase: Higher octave
    { id: 'dt-10', pitch: { step: 'G', octave: 4, alter: 0 }, midi: 67, duration: 400, startTime: 5200, type: 'quarter' },
    { id: 'dt-11', pitch: { step: 'A', octave: 4, alter: 0 }, midi: 69, duration: 400, startTime: 5700, type: 'quarter' },
    { id: 'dt-12', pitch: { step: 'G', octave: 4, alter: 0 }, midi: 67, duration: 400, startTime: 6200, type: 'quarter' },
    { id: 'dt-13', pitch: { step: 'E', octave: 4, alter: 0 }, midi: 64, duration: 400, startTime: 6700, type: 'quarter' },
    { id: 'dt-14', pitch: { step: 'D', octave: 4, alter: 0 }, midi: 62, duration: 800, startTime: 7200, type: 'half' },
];

// Map MIDI notes to string indices (0-15)
export const DAN_TRANH_STRING_MAP: Record<number, number> = {
    55: 0,   // G3 - String 1
    57: 1,   // A3 - String 2
    59: 2,   // B3 - String 3
    62: 3,   // D4 - String 4
    64: 4,   // E4 - String 5
    67: 5,   // G4 - String 6
    69: 6,   // A4 - String 7
    71: 7,   // B4 - String 8
    74: 8,   // D5 - String 9
    76: 9,   // E5 - String 10
    79: 10,  // G5 - String 11
    81: 11,  // A5 - String 12
    83: 12,  // B5 - String 13
    86: 13,  // D6 - String 14
    88: 14,  // E6 - String 15
    91: 15,  // G6 - String 16
};

// Convert NoteEvent array to active string indices for 3D visualization
export function getActiveStrings(notes: NoteEvent[]): number[] {
    return notes
        .map(note => DAN_TRANH_STRING_MAP[note.midi])
        .filter(index => index !== undefined);
}
