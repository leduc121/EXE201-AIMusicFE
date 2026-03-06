import { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { UploadPage } from './pages/UploadPage';
import { LearningPage } from './pages/LearningPage';
import { InstrumentDetailPage } from './pages/InstrumentDetailPage';
import { LoginPage } from './pages/LoginPage';
import { AudioProvider } from './contexts/AudioContext';
import { NoteEvent } from './types/music';
import { PIANO_DEMO_NOTES } from './data/DemoNotes';

type InstrumentType = 'piano' | 'flute' | 'dan-tranh' | 'dan-bau' | 'guitar' | 'violin';

interface LearningSession {
  instrument: InstrumentType;
  notes: NoteEvent[];
  audioFile?: File;
}

export function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentInstrumentId, setCurrentInstrumentId] = useState('');
  const [learningSession, setLearningSession] = useState<LearningSession | null>(null);

  const handleNavigate = (page: string) => {
    if (page.startsWith('instrument-')) {
      const instrumentId = page.replace('instrument-', '');
      setCurrentInstrumentId(instrumentId);
      setCurrentPage('instrument-detail');
    } else {
      setCurrentPage(page);
    }
  };

  const handleStartLearning = (instrument: InstrumentType, notes: NoteEvent[], audioFile?: File) => {
    setLearningSession({ instrument, notes, audioFile });
    setCurrentPage('learn');
  };

  const getLearningPageProps = () => {
    if (learningSession) {
      return {
        instrument: learningSession.instrument,
        notes: learningSession.notes,
        audioFile: learningSession.audioFile,
        title: getInstrumentTitle(learningSession.instrument),
        subtitle: getInstrumentSubtitle(learningSession.instrument),
      };
    }

    // Default to piano
    return {
      instrument: 'piano' as const,
      notes: PIANO_DEMO_NOTES,
      title: 'Piano Learning',
      subtitle: 'Western Classical',
    };
  };

  const getInstrumentTitle = (instrument: InstrumentType): string => {
    const titles: Record<InstrumentType, string> = {
      piano: 'Piano Learning',
      flute: 'Sáo Trúc - Vietnamese Flute',
      'dan-tranh': 'Đàn Tranh - Vietnamese Zither',
      'dan-bau': 'Đàn Bầu - Vietnamese Monochord',
      guitar: 'Guitar Learning',
      violin: 'Violin Learning',
    };
    return titles[instrument];
  };

  const getInstrumentSubtitle = (instrument: InstrumentType): string => {
    const subtitles: Record<InstrumentType, string> = {
      piano: 'Western Classical Instrument',
      flute: 'Traditional Bamboo Flute',
      'dan-tranh': '16-string Plucked Zither',
      'dan-bau': 'One-string Monochord',
      guitar: '6-string Acoustic Guitar',
      violin: '4-string Bowed Instrument',
    };
    return subtitles[instrument];
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'upload':
        return <UploadPage onStartLearning={handleStartLearning} onBack={() => handleNavigate('landing')} />;
      case 'learn':
        const props = getLearningPageProps();
        return <LearningPage {...props} onBack={() => handleNavigate('landing')} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} isSignUp={false} />;
      case 'signup':
        return <LoginPage onNavigate={handleNavigate} isSignUp={true} />;
      case 'instrument-detail':
        return (
          <InstrumentDetailPage
            instrumentId={currentInstrumentId}
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('landing')}
          />
        );
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  const hideSidebar = currentPage === 'learn' || currentPage === 'login' || currentPage === 'signup';

  return (
    <AudioProvider>
      <div className="flex flex-col min-h-screen bg-[#FAF7F0] font-serif text-[#3E2723]">
        {!hideSidebar && (
          <Header activePage={currentPage} onNavigate={handleNavigate} />
        )}

        <main className={`flex-1 transition-all duration-300 w-full`}>
          <div className="animate-in fade-in slide-in-bottom-4 duration-500 w-full">
            {renderPage()}
          </div>
        </main>
      </div>
    </AudioProvider>
  );
}
