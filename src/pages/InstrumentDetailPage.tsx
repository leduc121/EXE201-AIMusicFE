import React from 'react';
import { Button } from '../components/ui/Button';
import { ChevronLeft, Play, BookOpen, Music, Info } from 'lucide-react';
interface InstrumentDetailPageProps {
  instrumentId: string;
  onNavigate: (page: string) => void;
  onBack: () => void;
}
export function InstrumentDetailPage({
  instrumentId,
  onNavigate,
  onBack
}: InstrumentDetailPageProps) {
  // Mock data - in a real app this would come from a database or config
  const instrumentData = {
    'dan-tranh': {
      name: 'Đàn Tranh',
      subtitle: 'The Vietnamese Zither',
      description:
      'The Đàn Tranh is a plucked zither of Vietnam, similar to the Chinese guzheng, the Japanese koto, the Korean gayageum, and the Mongolian yatga. It has a long soundbox with the steel strings tuned to the pentatonic scale.',
      history:
      'Dating back to the Tran Dynasty (12th century), the Đàn Tranh has evolved from 16 strings to the modern 17, 19, 22, 24 and even 25 strings versions. It was traditionally used in court music but has found its way into modern folk and pop music.',
      features: [
      '16-25 Steel Strings',
      'Pentatonic Tuning',
      'Movable Bridges',
      'Finger Picks Used'],

      image:
      'https://images.unsplash.com/photo-1680792563719-288027b2a090?q=80&w=2787&auto=format&fit=crop',
      color: '#8B4513'
    },
    'dan-bau': {
      name: 'Đàn Bầu',
      subtitle: 'The Monochord of Vietnam',
      description:
      'The Đàn Bầu is a Vietnamese monochord, a traditional one-string musical instrument. What makes it unique is its ability to produce a wide range of sounds and pitches from a single string through the use of harmonics and a flexible rod.',
      history:
      'Legend has it that the instrument was invented by a blind woman who played it to earn a living for her family while her husband was at war. It is considered one of the most soulful instruments in Vietnamese culture.',
      features: [
      'Single String',
      'Flexible Bamboo Rod',
      'Harmonic Nodes',
      'Gourd Resonator'],

      image:
      'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=1000',
      color: '#5D4037'
    },
    'sao-truc': {
      name: 'Sáo Trúc',
      subtitle: 'Bamboo Flute',
      description:
      'The Sáo Trúc is a transverse flute made of bamboo. It is a very popular instrument in the Vietnamese countryside, often played by farmers resting in the fields.',
      history:
      'Bamboo flutes have been part of Vietnamese culture for thousands of years. The specific Sáo Trúc with 6 finger holes was modified in the 1970s to 10 holes to play chromatic scales.',
      features: [
      'Bamboo Construction',
      'Membrane Hole',
      '6-10 Finger Holes',
      '3 Octave Range'],

      image:
      'https://images.unsplash.com/photo-1665492723785-502693722256?auto=format&fit=crop&q=80&w=1000',
      color: '#3E2723'
    }
  }[instrumentId] || {
    name: 'Unknown Instrument',
    subtitle: '',
    description: 'Instrument details not found.',
    history: '',
    features: [],
    image: '',
    color: '#000'
  };
  return (
    <div className="min-h-screen bg-[#FAF7F0] animate-in slide-in-from-right duration-500">
      {/* Hero Header */}
      <div className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${instrumentData.image})`
          }} />


        <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16 max-w-6xl mx-auto">
          <Button
            variant="ghost"
            className="absolute top-8 left-8 text-white hover:bg-white/20 hover:text-white"
            onClick={onBack}>

            <ChevronLeft className="mr-2" /> Back to Studio
          </Button>

          <span className="text-[#D4A574] font-serif italic text-2xl mb-2 animate-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-forwards opacity-0">
            {instrumentData.subtitle}
          </span>
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 shadow-black drop-shadow-lg animate-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-forwards opacity-0">
            {instrumentData.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-[#3E2723] mb-6 flex items-center">
                <Info className="mr-3 text-[#D4A574]" /> About the Instrument
              </h2>
              <p className="text-xl text-[#654321] leading-relaxed font-serif">
                {instrumentData.description}
              </p>
            </section>

            <section className="bg-white p-8 rounded-xl border border-[#D4A574]/20 shadow-sm">
              <h2 className="text-3xl font-bold text-[#3E2723] mb-6 flex items-center">
                <BookOpen className="mr-3 text-[#D4A574]" /> History & Origins
              </h2>
              <p className="text-lg text-[#654321] leading-relaxed font-serif">
                {instrumentData.history}
              </p>
            </section>

            {/* Audio Samples Mock */}
            <section>
              <h2 className="text-3xl font-bold text-[#3E2723] mb-6 flex items-center">
                <Music className="mr-3 text-[#D4A574]" /> Sound Samples
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) =>
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#D4A574]/20 hover:border-[#D4A574] transition-colors group cursor-pointer">

                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#3E2723] flex items-center justify-center text-[#D4A574] mr-4 group-hover:scale-110 transition-transform">
                        <Play size={16} fill="currentColor" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#3E2723]">
                          Traditional Melody No. {i}
                        </h4>
                        <p className="text-sm text-[#8B4513]">Duration: 1:30</p>
                      </div>
                    </div>
                    <span className="text-[#D4A574] font-serif italic text-sm">
                      Play Preview
                    </span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-[#3E2723] text-[#FAF7F0] p-8 rounded-xl shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-wood-grain opacity-50" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 border-b border-[#D4A574]/30 pb-4">
                  Key Features
                </h3>
                <ul className="space-y-4">
                  {instrumentData.features.map((feature, idx) =>
                  <li key={idx} className="flex items-center">
                      <span className="w-2 h-2 bg-[#D4A574] rounded-full mr-3" />
                      <span className="font-serif text-lg">{feature}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="bg-[#D4A574]/10 p-8 rounded-xl border border-[#D4A574]/30 text-center">
              <h3 className="text-2xl font-bold text-[#3E2723] mb-4">
                Ready to Learn?
              </h3>
              <p className="text-[#654321] mb-6 font-serif">
                Start your journey with the {instrumentData.name} today. Our AI
                can generate sheet music for this instrument.
              </p>
              <Button onClick={() => onNavigate('upload')} className="w-full">
                Start Learning Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}