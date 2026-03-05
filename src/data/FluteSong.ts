// Demo song for bamboo flute using 6-hole pentatonic scale
// Notes: D4(62), E4(64), G4(67), A4(69), B4(71), D5(74)

export interface FluteEvent {
    note: number;
    startTime: number;
    duration: number;
}

export const FLUTE_DEMO_SONG: FluteEvent[] = [
    // Simple melody: D E G A G E D
    { note: 62, startTime: 0, duration: 600 },      // D4
    { note: 64, startTime: 700, duration: 600 },    // E4
    { note: 67, startTime: 1400, duration: 600 },   // G4
    { note: 69, startTime: 2100, duration: 600 },   // A4
    { note: 67, startTime: 2800, duration: 600 },   // G4
    { note: 64, startTime: 3500, duration: 600 },   // E4
    { note: 62, startTime: 4200, duration: 800 },   // D4

    // Repeat with variation
    { note: 64, startTime: 5200, duration: 400 },   // E4
    { note: 67, startTime: 5700, duration: 400 },   // G4
    { note: 69, startTime: 6200, duration: 400 },   // A4
    { note: 71, startTime: 6700, duration: 600 },   // B4
    { note: 69, startTime: 7400, duration: 400 },   // A4
    { note: 67, startTime: 7900, duration: 400 },   // G4
    { note: 64, startTime: 8400, duration: 800 },   // E4
];
