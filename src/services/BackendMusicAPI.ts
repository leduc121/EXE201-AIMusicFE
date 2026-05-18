import { Midi } from '@tonejs/midi';
import { ParsedMusicData, NoteEvent } from '../types/music';
import { basicPitchAPI } from './BasicPitchAPI';
import { MusicParser } from './MusicParser';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: {
    message?: string | string[];
  };
}

interface InstrumentResponse {
  id: string;
  slug: string;
}

interface SheetAssetResponse {
  id: string;
  assetType: string;
}

interface SheetGenerationResponse {
  id: string;
  title?: string | null;
  assets?: SheetAssetResponse[];
}

interface UploadResponse {
  id: string;
  originalFilename: string;
  sheetGeneration?: SheetGenerationResponse;
}

export interface BackendAnalysisResult {
  uploadId: string;
  generationId: string;
  notes: NoteEvent[];
  parsedData: ParsedMusicData;
  midiBuffer: ArrayBuffer;
  pdfObjectUrl: string | null;
}

export class BackendMusicAPI {
  async analyzeAudio(audioFile: File, instrumentSlug = 'piano'): Promise<BackendAnalysisResult> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Please sign in before converting audio.');
    }

    const instrument = await this.getInstrument(instrumentSlug);
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('instrumentId', instrument.id);

    const upload = await this.requestJson<UploadResponse>('/audio-uploads', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const generation = upload.sheetGeneration;
    if (!generation?.id) {
      throw new Error('Backend did not return a generated sheet.');
    }

    const midiBuffer = await this.fetchAssetArrayBuffer(
      `/sheet-generations/${generation.id}/midi/file`,
      token,
    );
    const midi = new Midi(midiBuffer);
    const notes = basicPitchAPI.parseMidiToNotes(midiBuffer);
    const tempo = midi.header.tempos[0]?.bpm || 120;
    const parsedData = MusicParser.fromAIOutput({
      title: generation.title || audioFile.name.replace(/\.[^/.]+$/, ''),
      duration: midi.duration * 1000,
      tempo,
      notes: notes.map((note) => ({
        pitch: note.midi,
        start: note.startTime,
        duration: note.duration,
        velocity: 80,
      })),
      detectedInstruments: [instrument.slug],
      confidence: 0.85,
    });

    const hasPdf = generation.assets?.some((asset) => asset.assetType === 'pdf');
    const pdfObjectUrl = hasPdf
      ? URL.createObjectURL(
          await this.fetchAssetBlob(`/sheet-generations/${generation.id}/pdf/file`, token),
        )
      : null;

    return {
      uploadId: upload.id,
      generationId: generation.id,
      notes,
      parsedData,
      midiBuffer,
      pdfObjectUrl,
    };
  }

  private async getInstrument(slug: string) {
    const apiSlug = slug === 'flute' ? 'sao-truc' : slug;
    return this.requestJson<InstrumentResponse>(`/instruments/${apiSlug}`);
  }

  private async requestJson<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, init);
    const json = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

    if (!response.ok) {
      const message = json?.error?.message;
      throw new Error(Array.isArray(message) ? message.join(', ') : message || response.statusText);
    }

    return json?.data ?? (json as T);
  }

  private async fetchAssetArrayBuffer(path: string, token: string) {
    const blob = await this.fetchAssetBlob(path, token);
    return blob.arrayBuffer();
  }

  private async fetchAssetBlob(path: string, token: string) {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Cannot download generated asset: ${response.statusText}`);
    }

    return response.blob();
  }

  private getToken() {
    return (
      localStorage.getItem('access_token') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      ''
    );
  }
}

export const backendMusicAPI = new BackendMusicAPI();
