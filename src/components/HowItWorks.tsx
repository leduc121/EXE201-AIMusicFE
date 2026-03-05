import React from 'react';
import { Upload, Wand2, Music } from 'lucide-react';
export function HowItWorks() {
  const steps = [
  {
    icon: <Upload className="w-8 h-8 text-[#FAF7F0]" />,
    title: 'Upload Your Music',
    desc: 'Import any YouTube video or audio file. Our studio accepts MP3, WAV, and direct links.',
    delay: '0ms'
  },
  {
    icon: <Wand2 className="w-8 h-8 text-[#FAF7F0]" />,
    title: 'AI Transcription',
    desc: 'Our advanced AI listens to every note, separating instruments and generating precise sheet music.',
    delay: '200ms'
  },
  {
    icon: <Music className="w-8 h-8 text-[#FAF7F0]" />,
    title: 'Start Learning',
    desc: 'Follow the animated hands and sheet music to master your favorite pieces instantly.',
    delay: '400ms'
  }];

  return (
    <section className="py-24 px-6 bg-[#FAF7F0] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#D4A574] blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#8B4513] blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#D4A574] font-serif italic text-lg mb-2 block">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-6">
            How It Works
          </h2>
          <div className="w-24 h-1 bg-[#D4A574] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-[#D4A574]/30 z-0" />

          {steps.map((step, idx) =>
          <div
            key={idx}
            className="relative flex flex-col items-center text-center group animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards"
            style={{
              animationDelay: step.delay
            }}>

              {/* Icon Circle */}
              <div className="w-24 h-24 rounded-full bg-[#3E2723] border-4 border-[#D4A574] flex items-center justify-center shadow-xl z-10 mb-8 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-wood-grain opacity-50" />
                <div className="relative z-10">{step.icon}</div>
              </div>

              {/* Content Card */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-[#D4A574]/20 w-full flex-1 hover:shadow-xl transition-shadow duration-300 relative">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#FAF7F0] rounded-bl-2xl border-b border-l border-[#D4A574]/20" />

                <h3 className="text-2xl font-bold text-[#3E2723] mb-4">
                  {step.title}
                </h3>
                <p className="text-[#654321] leading-relaxed font-serif text-lg">
                  {step.desc}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}