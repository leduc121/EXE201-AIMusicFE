import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  loadAudio: (file: File | string) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const play = useCallback(() => {
    audioRef.current?.play();
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const loadAudio = useCallback((file: File | string) => {
    if (audioRef.current) {
      const url = typeof file === 'string' ? file : URL.createObjectURL(file);
      audioRef.current.src = url;
      audioRef.current.load();
      
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current?.duration || 0);
      };

      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      };

      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  }, []);

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        isPlaying,
        currentTime,
        duration,
        play,
        pause,
        seek,
        loadAudio,
        volume,
        setVolume,
      }}
    >
      {children}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};
