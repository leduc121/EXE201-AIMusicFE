export interface NoteEvent {
    note: number;
    duration: number; // in ms
    startTime: number; // in ms
}

// Ode to Joy (Simple Version)
// E4=64, F4=65, G4=67, D4=62, C4=60
export const DEMO_SONG: NoteEvent[] = [
    { note: 64, duration: 400, startTime: 0 },
    { note: 64, duration: 400, startTime: 500 },
    { note: 65, duration: 400, startTime: 1000 },
    { note: 67, duration: 400, startTime: 1500 },

    { note: 67, duration: 400, startTime: 2000 },
    { note: 65, duration: 400, startTime: 2500 },
    { note: 64, duration: 400, startTime: 3000 },
    { note: 62, duration: 400, startTime: 3500 },

    { note: 60, duration: 400, startTime: 4000 },
    { note: 60, duration: 400, startTime: 4500 },
    { note: 62, duration: 400, startTime: 5000 },
    { note: 64, duration: 400, startTime: 5500 },

    { note: 64, duration: 600, startTime: 6000 },
    { note: 62, duration: 200, startTime: 6600 },
    { note: 62, duration: 800, startTime: 7000 },
];
