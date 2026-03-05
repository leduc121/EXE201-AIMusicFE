import { NoteEvent } from '../types/music';

// Đàn Bầu - Monochord with pitch bending
// Range: C3 (48) to C6 (84)
// Uses continuous pitch bending for expressive playing

export const DAN_BAU_DEMO_SONG: NoteEvent[] = [
    // Opening - low C with vibrato/pitch bend
    { 
        id: 'db-1', 
        pitch: { step: 'C', octave: 4, alter: 0 }, 
        midi: 60, 
        duration: 800, 
        startTime: 0, 
        type: 'half',
        vietnamese: {
            bending: { type: 'vibrato', amount: 0.5, duration: 800 },
            technique: 'pluck'
        }
    },
    
    // Ascending glissando: C -> D -> E
    { 
        id: 'db-2', 
        pitch: { step: 'D', octave: 4, alter: 0 }, 
        midi: 62, 
        duration: 400, 
        startTime: 1000, 
        type: 'quarter',
        vietnamese: {
            bending: { type: 'up', amount: 2, duration: 300 },
            technique: 'slide'
        }
    },
    
    { 
        id: 'db-3', 
        pitch: { step: 'E', octave: 4, alter: 0 }, 
        midi: 64, 
        duration: 600, 
        startTime: 1500, 
        type: 'quarter',
        vietnamese: {
            bending: { type: 'up', amount: 2, duration: 200 },
            technique: 'slide'
        }
    },
    
    // Descending: E -> D -> C
    { 
        id: 'db-4', 
        pitch: { step: 'D', octave: 4, alter: 0 }, 
        midi: 62, 
        duration: 400, 
        startTime: 2200, 
        type: 'quarter',
        vietnamese: {
            bending: { type: 'down', amount: 2, duration: 300 },
            technique: 'slide'
        }
    },
    
    { 
        id: 'db-5', 
        pitch: { step: 'C', octave: 4, alter: 0 }, 
        midi: 60, 
        duration: 800, 
        startTime: 2700, 
        type: 'half' 
    },
    
    // Higher register phrase
    { 
        id: 'db-6', 
        pitch: { step: 'G', octave: 4, alter: 0 }, 
        midi: 67, 
        duration: 400, 
        startTime: 3800, 
        type: 'quarter' 
    },
    
    { 
        id: 'db-7', 
        pitch: { step: 'A', octave: 4, alter: 0 }, 
        midi: 69, 
        duration: 400, 
        startTime: 4300, 
        type: 'quarter',
        vietnamese: {
            bending: { type: 'vibrato', amount: 0.3, duration: 400 },
            technique: 'pluck'
        }
    },
    
    { 
        id: 'db-8', 
        pitch: { step: 'G', octave: 4, alter: 0 }, 
        midi: 67, 
        duration: 600, 
        startTime: 4800, 
        type: 'quarter' 
    },
    
    // Final note with long sustain and vibrato
    { 
        id: 'db-9', 
        pitch: { step: 'C', octave: 4, alter: 0 }, 
        midi: 60, 
        duration: 1500, 
        startTime: 5600, 
        type: 'whole',
        vietnamese: {
            bending: { type: 'vibrato', amount: 0.5, duration: 1500 },
            technique: 'pluck'
        }
    },
];

// Calculate hand position on string (0-1) from MIDI note
// Lower notes = hand closer to resonator (higher position on string)
// Higher notes = hand further from resonator (lower position on string)
export function getDanBauHandPosition(midi: number): number {
    const minMidi = 48; // C3
    const maxMidi = 84; // C6
    const normalized = (midi - minMidi) / (maxMidi - minMidi);
    // Invert: lower notes need hand closer to bridge
    return 1 - normalized;
}

// Get pitch bend amount for visualization
export function getPitchBendAmount(note: NoteEvent): number {
    if (note.vietnamese?.bending) {
        const bend = note.vietnamese.bending;
        if (bend.type === 'up') return bend.amount / 12; // Convert semitones to 0-1 range
        if (bend.type === 'down') return -bend.amount / 12;
    }
    return 0;
}
