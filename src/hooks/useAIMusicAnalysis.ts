import { useState, useCallback } from 'react';
import { ParsedMusicData, NoteEvent } from '../types/music';
import { 
  AIServiceFactory, 
  AIServiceConfig 
} from '../services/AIMusicService';
import { createScoreFromAI } from '../services/AIMusicService';

export type ProcessingStatus = 'idle' | 'uploading' | 'analyzing' | 'generating' | 'success' | 'error';

interface UseAIMusicAnalysisState {
  status: ProcessingStatus;
  progress: number;
  currentStep: string;
  result: ParsedMusicData | null;
  error: string | null;
}

interface UseAIMusicAnalysisReturn extends UseAIMusicAnalysisState {
  analyzeAudioFile: (file: File) => Promise<void>;
  analyzeYouTubeUrl: (url: string) => Promise<void>;
  reset: () => void;
  getTutorialSteps: (partIndex?: number) => import('../types/music').TutorialStep[] | null;
  getNotes: () => NoteEvent[];
  getInstrument: () => string;
}

const PROCESSING_STEPS = [
  'Uploading audio file...',
  'Preprocessing audio waveform...',
  'Running AI transcription model...',
  'Detecting instruments...',
  'Analyzing musical structure...',
  'Generating sheet music...',
  'Creating tutorial steps...',
];

/**
 * React Hook for AI Music Analysis
 * 
 * Usage:
 * ```tsx
 * const { 
 *   status, 
 *   progress, 
 *   result, 
 *   analyzeAudioFile,
 *   getNotes,
 *   getInstrument 
 * } = useAIMusicAnalysis();
 * 
 * // In your component
 * const handleFileUpload = async (file) => {
 *   await analyzeAudioFile(file);
 *   const notes = getNotes();
 *   const instrument = getInstrument();
 *   // Use notes and instrument for visualization
 * };
 * ```
 */
export function useAIMusicAnalysis(
  useRealAI: boolean = false,
  config?: AIServiceConfig
): UseAIMusicAnalysisReturn {
  const [state, setState] = useState<UseAIMusicAnalysisState>({
    status: 'idle',
    progress: 0,
    currentStep: '',
    result: null,
    error: null,
  });

  // Create AI service instance
  const service = useCallback(() => {
    return AIServiceFactory.create(useRealAI, config);
  }, [useRealAI, config]);

  /**
   * Analyze an audio file
   */
  const analyzeAudioFile = useCallback(async (file: File) => {
    try {
      setState({
        status: 'uploading',
        progress: 0,
        currentStep: PROCESSING_STEPS[0],
        result: null,
        error: null,
      });

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setState(prev => ({
          ...prev,
          progress: i,
        }));
      }

      setState(prev => ({
        ...prev,
        status: 'analyzing',
        progress: 0,
        currentStep: PROCESSING_STEPS[2],
      }));

      // Call AI service
      const aiService = service();
      const analysisResult = await aiService.analyzeAudio(file);

      if (!analysisResult.success) {
        throw new Error('AI analysis failed');
      }

      setState(prev => ({
        ...prev,
        status: 'generating',
        progress: 50,
        currentStep: PROCESSING_STEPS[5],
      }));

      // Convert to score
      const parsedData = await createScoreFromAI(analysisResult);

      setState({
        status: 'success',
        progress: 100,
        currentStep: PROCESSING_STEPS[6],
        result: parsedData,
        error: null,
      });

    } catch (err) {
      setState({
        status: 'error',
        progress: 0,
        currentStep: '',
        result: null,
        error: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    }
  }, [service]);

  /**
   * Analyze a YouTube URL
   */
  const analyzeYouTubeUrl = useCallback(async (url: string) => {
    try {
      setState({
        status: 'uploading',
        progress: 0,
        currentStep: 'Fetching YouTube video...',
        result: null,
        error: null,
      });

      setState(prev => ({
        ...prev,
        status: 'analyzing',
        currentStep: PROCESSING_STEPS[2],
      }));

      const aiService = service();
      const analysisResult = await aiService.analyzeYouTube(url);

      if (!analysisResult.success) {
        throw new Error('AI analysis failed');
      }

      setState(prev => ({
        ...prev,
        status: 'generating',
        progress: 50,
        currentStep: PROCESSING_STEPS[5],
      }));

      const parsedData = await createScoreFromAI(analysisResult);

      setState({
        status: 'success',
        progress: 100,
        currentStep: PROCESSING_STEPS[6],
        result: parsedData,
        error: null,
      });

    } catch (err) {
      setState({
        status: 'error',
        progress: 0,
        currentStep: '',
        result: null,
        error: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    }
  }, [service]);

  /**
   * Reset the state
   */
  const reset = useCallback(() => {
    setState({
      status: 'idle',
      progress: 0,
      currentStep: '',
      result: null,
      error: null,
    });
  }, []);

  /**
   * Get tutorial steps from the result
   */
  const getTutorialSteps = useCallback((partIndex: number = 0) => {
    if (!state.result) return null;
    
    const { MusicParser } = require('../services/MusicParser');
    const parser = new MusicParser(state.result.score);
    return parser.generateTutorial(partIndex);
  }, [state.result]);

  /**
   * Get notes from the result
   */
  const getNotes = useCallback((): NoteEvent[] => {
    if (!state.result || state.result.score.parts.length === 0) {
      return [];
    }
    
    return state.result.score.parts[0].staff.measures.flatMap(m => m.notes);
  }, [state.result]);

  /**
   * Get detected instrument ID
   */
  const getInstrument = useCallback((): string => {
    if (!state.result || state.result.detectedInstruments.length === 0) {
      return 'piano';
    }
    return state.result.detectedInstruments[0].id;
  }, [state.result]);

  return {
    ...state,
    analyzeAudioFile,
    analyzeYouTubeUrl,
    reset,
    getTutorialSteps,
    getNotes,
    getInstrument,
  };
}

export default useAIMusicAnalysis;
