import { useEffect, useRef, useCallback } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { NoteEvent } from '../types/music';

interface UseAudioSyncOptions {
  notes: NoteEvent[];
  onNoteStart: (note: NoteEvent) => void;
  onNoteEnd: (note: NoteEvent) => void;
  onProgressUpdate: (progress: number) => void;
}

export function useAudioSync({
  notes,
  onNoteStart,
  onNoteEnd,
  onProgressUpdate,
}: UseAudioSyncOptions) {
  const { currentTime, isPlaying, duration } = useAudio();
  const activeNotesRef = useRef<Set<string>>(new Set());
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (!isPlaying) {
      // Clear all active notes when paused
      activeNotesRef.current.forEach((noteId) => {
        const note = notes.find((n) => n.id === noteId);
        if (note) {
          onNoteEnd(note);
        }
      });
      activeNotesRef.current.clear();
      return;
    }

    // Check for notes that should start or end
    notes.forEach((note) => {
      const noteStart = note.startTime / 1000; // Convert ms to seconds
      const noteEnd = noteStart + note.duration / 1000;
      const isActive = activeNotesRef.current.has(note.id);

      if (currentTime >= noteStart && currentTime < noteEnd && !isActive) {
        // Note should start
        activeNotesRef.current.add(note.id);
        onNoteStart(note);
      } else if ((currentTime >= noteEnd || currentTime < noteStart) && isActive) {
        // Note should end
        activeNotesRef.current.delete(note.id);
        onNoteEnd(note);
      }
    });

    // Update progress
    if (duration > 0) {
      onProgressUpdate((currentTime / duration) * 100);
    }

    lastTimeRef.current = currentTime;
  }, [currentTime, isPlaying, notes, onNoteStart, onNoteEnd, onProgressUpdate, duration]);

  const getCurrentNotes = useCallback(() => {
    return notes.filter((note) => {
      const noteStart = note.startTime / 1000;
      const noteEnd = noteStart + note.duration / 1000;
      return currentTime >= noteStart && currentTime < noteEnd;
    });
  }, [currentTime, notes]);

  return { getCurrentNotes };
}
