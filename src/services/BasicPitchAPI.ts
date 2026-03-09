/**
 * Basic Pitch AI API Service
 * 
 * Connects to the ngrok-exposed Flask API running on Google Colab.
 * Sends audio files for AI transcription and parses the returned MIDI.
 */

import { Midi } from '@tonejs/midi';
import JSZip from 'jszip';
import { NoteEvent, NoteName } from '../types/music';
import { MusicParser } from './MusicParser';
import { ParsedMusicData } from '../types/music';

// ====== CONFIG ======
// Thay URL ngrok mới vào đây mỗi lần khởi động lại Colab
const API_BASE_URL = 'https://resources-oriental-why-generates.trycloudflare.com';

export class BasicPitchAPI {
    private baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || API_BASE_URL;
    }

    /**
     * Gửi file audio lên Colab API và nhận về file ZIP (chứa MIDI và PDF)
     */
    async convertAudioToMidiAndPdf(audioFile: File): Promise<{ midiBuffer: ArrayBuffer, pdfBlob: Blob | null }> {
        const formData = new FormData();
        formData.append('audio', audioFile);

        const response = await fetch(`${this.baseUrl}/api/convert`, {
            method: 'POST',
            body: formData,
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });


        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `API Error: ${response.status}`);
        }

        const zipBuffer = await response.arrayBuffer();

        // Giải nén ZIP
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(zipBuffer);

        let midiBuffer: ArrayBuffer | null = null;
        let pdfBlob: Blob | null = null;

        // Tìm file trong ZIP
        for (const filename of Object.keys(loadedZip.files)) {
            if (filename.endsWith('.mid')) {
                midiBuffer = await loadedZip.files[filename].async('arraybuffer');
            } else if (filename.endsWith('.pdf')) {
                const pdfUint8 = await loadedZip.files[filename].async('uint8array');
                const arrayBuffer = new ArrayBuffer(pdfUint8.length);
                const view = new Uint8Array(arrayBuffer);
                for (let i = 0; i < pdfUint8.length; ++i) {
                    view[i] = pdfUint8[i];
                }
                pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
            }
        }

        if (!midiBuffer) {
            throw new Error("Không tìm thấy file MIDI trong kết quả trả về.");
        }

        return { midiBuffer, pdfBlob };
    }

    /**
     * Parse MIDI ArrayBuffer thành NoteEvent[] cho FE hiển thị
     */
    parseMidiToNotes(midiBuffer: ArrayBuffer): NoteEvent[] {
        const midi = new Midi(midiBuffer);
        const notes: NoteEvent[] = [];

        // Lấy tất cả notes từ tất cả tracks (trừ track percussion nếu có)
        for (const track of midi.tracks) {
            for (const note of track.notes) {
                const noteInfo = this.midiNumberToNote(note.midi);

                notes.push({
                    id: `note-${notes.length}`,
                    pitch: {
                        step: noteInfo.step as NoteName,
                        octave: noteInfo.octave,
                        alter: noteInfo.alter,
                    },
                    midi: note.midi,
                    duration: note.duration * 1000, // seconds -> ms
                    startTime: note.time * 1000,     // seconds -> ms
                    type: this.inferNoteType(note.duration * 1000, midi.header.tempos[0]?.bpm || 120),
                });
            }
        }

        // Sắp xếp theo thời gian bắt đầu
        notes.sort((a, b) => a.startTime - b.startTime);

        return notes;
    }

    /**
     * Full pipeline: gửi audio → nhận MIDI → parse thành ParsedMusicData
     */
    async analyzeAudio(audioFile: File): Promise<{
        notes: NoteEvent[];
        parsedData: ParsedMusicData;
        midiBuffer: ArrayBuffer;
        pdfBlob: Blob | null;
        tempo: number;
    }> {
        // Bước 1: Gọi API
        const { midiBuffer, pdfBlob } = await this.convertAudioToMidiAndPdf(audioFile);

        // Bước 2: Parse MIDI
        const midi = new Midi(midiBuffer);
        const tempo = midi.header.tempos[0]?.bpm || 120;
        const totalDuration = midi.duration * 1000; // seconds -> ms

        // Bước 3: Chuyển thành NoteEvent[]
        const notes = this.parseMidiToNotes(midiBuffer);

        // Bước 4: Dùng MusicParser để tạo ParsedMusicData đầy đủ
        const aiData = {
            title: audioFile.name.replace(/\.[^/.]+$/, ''), // Tên file bỏ extension
            duration: totalDuration,
            tempo: tempo,
            notes: notes.map(n => ({
                pitch: n.midi,
                start: n.startTime,
                duration: n.duration,
                velocity: 80,
            })),
            detectedInstruments: ['piano'], // Mặc định là piano
            confidence: 0.85,
        };

        const parsedData = MusicParser.fromAIOutput(aiData);

        return { notes, parsedData, midiBuffer, pdfBlob, tempo };
    }

    // ====== Helper methods ======

    private midiNumberToNote(midi: number): { step: NoteName; octave: number; alter: number } {
        const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor(midi / 12) - 1;
        const noteIndex = midi % 12;
        const step = NOTE_NAMES[noteIndex];
        const alter = step.includes('#') ? 1 : 0;
        const baseStep = step.replace('#', '');

        return { step: baseStep as NoteName, octave, alter };
    }

    private inferNoteType(durationMs: number, tempo: number): NoteEvent['type'] {
        const beatMs = 60000 / tempo;
        const beats = durationMs / beatMs;

        if (beats >= 4) return 'whole';
        if (beats >= 2) return 'half';
        if (beats >= 1) return 'quarter';
        if (beats >= 0.5) return 'eighth';
        if (beats >= 0.25) return 'sixteenth';
        return 'thirty-second';
    }
}

// Export singleton
export const basicPitchAPI = new BasicPitchAPI();
