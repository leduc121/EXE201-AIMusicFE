import { NoteEvent } from '../types/music';

// Demo song: Ode to Joy (Simple Version)
export const PIANO_DEMO_NOTES: NoteEvent[] = [
  { id: 'p1', pitch: { step: 'E', octave: 4, alter: 0 }, midi: 64, duration: 400, startTime: 0, type: 'quarter' },
  { id: 'p2', pitch: { step: 'E', octave: 4, alter: 0 }, midi: 64, duration: 400, startTime: 500, type: 'quarter' },
  { id: 'p3', pitch: { step: 'F', octave: 4, alter: 0 }, midi: 65, duration: 400, startTime: 1000, type: 'quarter' },
  { id: 'p4', pitch: { step: 'G', octave: 4, alter: 0 }, midi: 67, duration: 400, startTime: 1500, type: 'quarter' },
  { id: 'p5', pitch: { step: 'G', octave: 4, alter: 0 }, midi: 67, duration: 400, startTime: 2000, type: 'quarter' },
  { id: 'p6', pitch: { step: 'F', octave: 4, alter: 0 }, midi: 65, duration: 400, startTime: 2500, type: 'quarter' },
  { id: 'p7', pitch: { step: 'E', octave: 4, alter: 0 }, midi: 64, duration: 400, startTime: 3000, type: 'quarter' },
  { id: 'p8', pitch: { step: 'D', octave: 4, alter: 0 }, midi: 62, duration: 400, startTime: 3500, type: 'quarter' },
  { id: 'p9', pitch: { step: 'C', octave: 4, alter: 0 }, midi: 60, duration: 400, startTime: 4000, type: 'quarter' },
  { id: 'p10', pitch: { step: 'C', octave: 4, alter: 0 }, midi: 60, duration: 400, startTime: 4500, type: 'quarter' },
  { id: 'p11', pitch: { step: 'D', octave: 4, alter: 0 }, midi: 62, duration: 400, startTime: 5000, type: 'quarter' },
  { id: 'p12', pitch: { step: 'E', octave: 4, alter: 0 }, midi: 64, duration: 400, startTime: 5500, type: 'quarter' },
  { id: 'p13', pitch: { step: 'E', octave: 4, alter: 0 }, midi: 64, duration: 600, startTime: 6000, type: 'half' },
  { id: 'p14', pitch: { step: 'D', octave: 4, alter: 0 }, midi: 62, duration: 200, startTime: 6600, type: 'eighth' },
  { id: 'p15', pitch: { step: 'D', octave: 4, alter: 0 }, midi: 62, duration: 800, startTime: 7000, type: 'half' },
];

// Demo song: Simple Guitar Melody
export const GUITAR_DEMO_NOTES: NoteEvent[] = [
  { id: 'g1', pitch: { step: 'E', octave: 3, alter: 0 }, midi: 52, duration: 500, startTime: 0, type: 'quarter' },
  { id: 'g2', pitch: { step: 'G', octave: 3, alter: 0 }, midi: 55, duration: 500, startTime: 600, type: 'quarter' },
  { id: 'g3', pitch: { step: 'A', octave: 3, alter: 0 }, midi: 57, duration: 500, startTime: 1200, type: 'quarter' },
  { id: 'g4', pitch: { step: 'G', octave: 3, alter: 0 }, midi: 55, duration: 1000, startTime: 1800, type: 'half' },
  { id: 'g5', pitch: { step: 'E', octave: 3, alter: 0 }, midi: 52, duration: 500, startTime: 3000, type: 'quarter' },
  { id: 'g6', pitch: { step: 'D', octave: 3, alter: 0 }, midi: 50, duration: 500, startTime: 3600, type: 'quarter' },
  { id: 'g7', pitch: { step: 'E', octave: 3, alter: 0 }, midi: 52, duration: 1000, startTime: 4200, type: 'half' },
];

// Demo song: Simple Violin Melody
export const VIOLIN_DEMO_NOTES: NoteEvent[] = [
  { id: 'v1', pitch: { step: 'G', octave: 4, alter: 0 }, midi: 67, duration: 400, startTime: 0, type: 'quarter' },
  { id: 'v2', pitch: { step: 'A', octave: 4, alter: 0 }, midi: 69, duration: 400, startTime: 500, type: 'quarter' },
  { id: 'v3', pitch: { step: 'B', octave: 4, alter: 0 }, midi: 71, duration: 400, startTime: 1000, type: 'quarter' },
  { id: 'v4', pitch: { step: 'C', octave: 5, alter: 0 }, midi: 72, duration: 800, startTime: 1500, type: 'half' },
  { id: 'v5', pitch: { step: 'B', octave: 4, alter: 0 }, midi: 71, duration: 400, startTime: 2500, type: 'quarter' },
  { id: 'v6', pitch: { step: 'A', octave: 4, alter: 0 }, midi: 69, duration: 400, startTime: 3000, type: 'quarter' },
  { id: 'v7', pitch: { step: 'G', octave: 4, alter: 0 }, midi: 67, duration: 800, startTime: 3500, type: 'half' },
];

// Demo song for flute (pentatonic)
export const FLUTE_DEMO_NOTES: NoteEvent[] = [
  { id: 'f1', pitch: { step: 'D', octave: 4, alter: 0 }, midi: 62, duration: 600, startTime: 0, type: 'quarter' },
  { id: 'f2', pitch: { step: 'E', octave: 4, alter: 0 }, midi: 64, duration: 600, startTime: 700, type: 'quarter' },
  { id: 'f3', pitch: { step: 'G', octave: 4, alter: 0 }, midi: 67, duration: 600, startTime: 1400, type: 'quarter' },
  { id: 'f4', pitch: { step: 'A', octave: 4, alter: 0 }, midi: 69, duration: 600, startTime: 2100, type: 'quarter' },
  { id: 'f5', pitch: { step: 'G', octave: 4, alter: 0 }, midi: 67, duration: 600, startTime: 2800, type: 'quarter' },
  { id: 'f6', pitch: { step: 'E', octave: 4, alter: 0 }, midi: 64, duration: 600, startTime: 3500, type: 'quarter' },
  { id: 'f7', pitch: { step: 'D', octave: 4, alter: 0 }, midi: 62, duration: 800, startTime: 4200, type: 'half' },
];
