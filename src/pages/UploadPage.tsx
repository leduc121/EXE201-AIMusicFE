import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Upload,
  FileAudio,
  CheckCircle2,
  Music,
  ArrowRight,
  Loader2,
  Sparkles,
  ChevronLeft,
  Download,
  FileText,
  Eye,
  X,
} from 'lucide-react';
import { NoteEvent } from '../types/music';
import { mockSheetMusicGenerator } from '../services/MockSheetMusicGenerator';
import { basicPitchAPI } from '../services/BasicPitchAPI';

type InstrumentType = 'piano' | 'flute' | 'dan-tranh' | 'dan-bau' | 'guitar' | 'violin';

interface UploadPageProps {
  onStartLearning: (instrument: InstrumentType, notes: NoteEvent[], audioFile?: File) => void;
  onBack?: () => void;
}

export function UploadPage({ onStartLearning, onBack }: UploadPageProps) {
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'processing' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);
  const [detectedInstrument, setDetectedInstrument] = useState<InstrumentType>('piano');
  const [generatedNotes, setGeneratedNotes] = useState<NoteEvent[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [midiBuffer, setMidiBuffer] = useState<ArrayBuffer | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const processingSteps = [
    'Analyzing audio waveform...',
    'Isolating instrument tracks...',
    'Detecting pitch and rhythm...',
    'Generating sheet music...',
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
      startProcessing(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a']
    }
  });

  const startProcessing = async (file: File, useDemo = false) => {
    setUploadStatus('uploading');
    setProgress(0);
    setErrorMessage(null);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          if (useDemo) {
            startAISimulation(file);
          } else {
            startRealAIProcessing(file);
          }
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Real AI Processing: gửi file lên Google Colab API
  const startRealAIProcessing = async (file: File) => {
    setUploadStatus('processing');
    setProcessingStep(0);

    try {
      // Step 0: Analyzing audio waveform
      setProcessingStep(0);
      await new Promise(r => setTimeout(r, 800));

      // Step 1: Isolating instrument tracks
      setProcessingStep(1);

      // Gọi API thật
      const result = await basicPitchAPI.analyzeAudio(file);

      // Step 2: Detecting pitch and rhythm
      setProcessingStep(2);
      await new Promise(r => setTimeout(r, 600));

      // Step 3: Generating sheet music
      setProcessingStep(3);
      await new Promise(r => setTimeout(r, 400));

      const notes = result.parsedData.score.parts[0]?.staff.measures.flatMap(m => m.notes) || [];
      const instrument = result.parsedData.detectedInstruments[0]?.id as InstrumentType || 'piano';

      setGeneratedNotes(notes);
      setDetectedInstrument(instrument);
      setMidiBuffer(result.midiBuffer);
      setPdfBlob(result.pdfBlob);
      setUploadStatus('success');
    } catch (error: any) {
      console.error('AI Processing Error:', error);
      setErrorMessage(error.message || 'Có lỗi xảy ra khi xử lý bằng AI. Hãy kiểm tra lại Colab API.');
      setUploadStatus('idle');
    }
  };

  // Demo mode: dùng mock data (không cần API)
  const startAISimulation = async (file: File) => {
    setUploadStatus('processing');
    setProcessingStep(0);

    const analysis = await mockSheetMusicGenerator.analyzeAudio(file);

    let step = 0;
    const stepInterval = setInterval(() => {
      step++;
      setProcessingStep(step);

      if (step >= processingSteps.length - 1) {
        clearInterval(stepInterval);

        const parsedData = mockSheetMusicGenerator.createScore(file, analysis);
        const notes = parsedData.score.parts[0]?.staff.measures.flatMap(m => m.notes) || [];
        const instrument = parsedData.detectedInstruments[0]?.id as InstrumentType || 'piano';

        setGeneratedNotes(notes);
        setDetectedInstrument(instrument);
        setUploadStatus('success');
      }
    }, 1500);
  };

  const handleStartLearning = () => {
    if (uploadedFile) {
      onStartLearning(detectedInstrument, generatedNotes, uploadedFile);
    }
  };

  const handleDownloadMidi = () => {
    if (!midiBuffer) return;
    const blob = new Blob([midiBuffer], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = uploadedFile?.name.replace(/\.[^/.]+$/, '') || 'transcription';
    link.download = `${fileName}_sheet.mid`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = uploadedFile?.name.replace(/\.[^/.]+$/, '') || 'transcription';
    link.download = `${fileName}_sheet.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadDemoForInstrument = (instrument: InstrumentType) => {
    // Create a mock file with instrument name to trigger correct note generation
    const mockFile = new File([''], `demo-${instrument}.mp3`, { type: 'audio/mp3' });
    setUploadedFile(mockFile);
    startProcessing(mockFile, true); // true = use demo/mock mode
  };

  const getInstrumentDisplayName = (instrument: InstrumentType): string => {
    const names: Record<InstrumentType, string> = {
      piano: 'Piano',
      flute: 'Sáo Trúc',
      'dan-tranh': 'Đàn Tranh',
      'dan-bau': 'Đàn Bầu',
      guitar: 'Guitar',
      violin: 'Violin',
    };
    return names[instrument];
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F0] p-6 lg:p-12 flex items-center justify-center relative overflow-hidden">
      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="ml-2 font-bold hover:opacity-80">✕</button>
        </div>
      )}
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#D4A574]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#8B4513]/10 rounded-full blur-3xl" />
      </div>



      {/* Back Button - positioned in top right to avoid logo */}
      {onBack && (
        <Button
          variant="ghost"
          className="absolute top-6 right-6 z-20 text-[#3E2723] hover:bg-[#FAF7F0] bg-white/80 backdrop-blur-sm shadow-md border border-[#D4A574]/30 rounded-full px-4"
          onClick={onBack}
        >
          <ChevronLeft className="mr-2 w-5 h-5" /> Back
        </Button>
      )}

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-5xl md:text-6xl font-bold text-[#3E2723] mb-4">
            Upload Studio
          </h1>
          <p className="text-[#8B4513] text-xl font-serif italic">
            Import your music for AI analysis and transcription
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#D4A574]/30 animate-in fade-in zoom-in duration-500">
          {/* Wood Header Strip */}
          <div className="h-6 bg-wood-grain w-full relative shadow-md">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="p-8 md:p-12">
            {uploadStatus === 'idle' && (
              <div className="space-y-12 animate-in fade-in duration-300">
                {/* File Upload Section */}
                <section className="space-y-6">
                  <div className="flex items-center space-x-4 text-[#3E2723]">
                    <div className="p-3 bg-[#8B4513]/10 rounded-full">
                      <FileAudio className="w-8 h-8 text-[#8B4513]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Audio File</h2>
                      <p className="text-[#8B4513]/70 text-sm">
                        Upload MP3, WAV, or M4A directly
                      </p>
                    </div>
                  </div>

                  <div
                    {...getRootProps()}
                    className={`
                      border-3 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 group
                      ${isDragActive ? 'border-[#8B4513] bg-[#8B4513]/5 scale-[1.01]' : 'border-[#D4A574]/40 hover:border-[#8B4513] hover:bg-[#FAF7F0]'}
                    `}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center text-[#654321] group-hover:scale-105 transition-transform duration-300">
                      <Upload className="w-16 h-16 mb-6 text-[#D4A574] group-hover:text-[#8B4513] transition-colors" />
                      <p className="text-2xl font-bold mb-3">
                        Drag & Drop audio file
                      </p>
                      <p className="text-lg opacity-60 font-serif italic">
                        or click to browse your computer
                      </p>
                    </div>
                  </div>
                </section>

                {/* Demo Mode for Vietnamese Instruments */}
                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-[#D4A574]/20"></div>
                  <span className="flex-shrink-0 mx-6 text-[#8B4513]/50 font-serif italic text-lg">
                    or try demo
                  </span>
                  <div className="flex-grow border-t border-[#D4A574]/20"></div>
                </div>

                <section className="space-y-6">
                  <div className="flex items-center space-x-4 text-[#3E2723]">
                    <div className="p-3 bg-amber-50 rounded-full">
                      <Sparkles className="w-8 h-8 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Demo Mode</h2>
                      <p className="text-[#8B4513]/70 text-sm">
                        Test Vietnamese instruments with mock data
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => loadDemoForInstrument('dan-tranh')}
                      className="h-16 text-lg border-2 hover:bg-[#8B4513] hover:text-[#FAF7F0]"
                    >
                      <Music className="mr-2 w-5 h-5" />
                      Try Đàn Tranh
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => loadDemoForInstrument('dan-bau')}
                      className="h-16 text-lg border-2 hover:bg-[#8B4513] hover:text-[#FAF7F0]"
                    >
                      <Music className="mr-2 w-5 h-5" />
                      Try Đàn Bầu
                    </Button>
                  </div>
                  <p className="text-sm text-[#8B4513]/60 text-center font-serif italic">
                    No file upload required. Uses simulated AI transcription.
                  </p>
                </section>
              </div>
            )}

            {uploadStatus === 'uploading' && (
              <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                <div className="w-24 h-24 mb-8 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="45"
                      fill="none"
                      stroke="#FAF7F0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="45"
                      fill="none"
                      stroke="#8B4513"
                      strokeWidth="8"
                      strokeDasharray="283"
                      strokeDashoffset={283 - 283 * progress / 100}
                      className="transition-all duration-100 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#3E2723]">
                    {progress}%
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#3E2723] mb-2">
                  Uploading Media...
                </h3>
                <p className="text-[#8B4513] font-serif italic">
                  Please wait while we secure your file
                </p>
              </div>
            )}

            {uploadStatus === 'processing' && (
              <div className="py-12 max-w-lg mx-auto animate-in fade-in duration-300">
                <h3 className="text-2xl font-bold text-[#3E2723] mb-8 text-center">
                  AI Processing Studio
                </h3>
                <div className="space-y-6">
                  {processingSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <div
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500
                          ${idx < processingStep ? 'bg-green-500 text-white' : idx === processingStep ? 'bg-[#D4A574] text-white animate-pulse' : 'bg-gray-200 text-gray-400'}
                        `}
                      >
                        {idx < processingStep ? (
                          <CheckCircle2 size={18} />
                        ) : idx === processingStep ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-current" />
                        )}
                      </div>
                      <span
                        className={`text-lg font-serif transition-colors duration-300 ${idx === processingStep ? 'text-[#3E2723] font-bold' : 'text-[#8B4513]/60'}`}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="py-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-lg">
                  <Music className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-bold text-[#3E2723] mb-4">
                  Masterpiece Ready!
                </h2>
                <p className="text-xl text-[#654321] mb-8 font-serif max-w-md">
                  We've successfully transcribed your audio into sheet music.
                </p>

                <div className="bg-[#FAF7F0] p-6 rounded-xl border border-[#D4A574]/30 w-full max-w-md mb-8 text-left">
                  <h4 className="font-bold text-[#3E2723] mb-2 uppercase text-sm tracking-wider">
                    Detected Instrument
                  </h4>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-[#3E2723] text-[#FAF7F0] rounded-full text-sm">
                      {getInstrumentDisplayName(detectedInstrument)}
                    </span>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-[#3E2723] mb-2 uppercase text-sm tracking-wider">
                      Generated Notes
                    </h4>
                    <p className="text-[#8B4513]">{generatedNotes.length} notes detected</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl justify-center flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => setUploadStatus('idle')}
                    className="flex-1 min-w-[140px]"
                  >
                    Upload Another
                  </Button>
                  {midiBuffer && (
                    <Button
                      variant="outline"
                      onClick={handleDownloadMidi}
                      className="flex-1 min-w-[170px] border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                    >
                      <Download className="mr-2 w-5 h-5" /> Download MIDI
                    </Button>
                  )}
                  {pdfBlob && (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleDownloadPdf}
                        className="flex-1 min-w-[170px] border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <FileText className="mr-2 w-5 h-5" /> Download PDF
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => setShowPdfViewer(true)}
                        className="flex-1 min-w-[180px] bg-[#3E2723] text-[#FAF7F0] hover:bg-[#5D4037] shadow-lg"
                      >
                        <Eye className="mr-2 w-5 h-5" /> View Sheet Music
                      </Button>
                    </>
                  )}
                  <Button
                    size="lg"
                    onClick={handleStartLearning}
                    className="flex-1 min-w-[180px] px-8 shadow-xl hover:scale-105 transition-transform"
                  >
                    Start Learning <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Full-screen PDF Viewer Modal */}
      {showPdfViewer && pdfBlob && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col pt-4 px-4 pb-0 items-center justify-center animate-in fade-in duration-300">
          <div className="flex justify-between w-full max-w-6xl mb-4">
            <h3 className="text-white text-2xl font-serif">Sheet Music Viewer</h3>
            <button
              onClick={() => setShowPdfViewer(false)}
              className="text-white hover:text-red-400 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={32} />
            </button>
          </div>
          <div className="w-full max-w-6xl flex-1 bg-white rounded-t-xl overflow-hidden shadow-2xl">
            <iframe
              src={URL.createObjectURL(pdfBlob)}
              className="w-full h-full border-0"
              title="PDF Sheet Music"
            />
          </div>
        </div>
      )}
    </div>
  );
}
