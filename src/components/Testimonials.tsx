import React, { useEffect, useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
const testimonials = [
{
  id: 1,
  name: 'Sarah Nguyen',
  role: 'Piano Student',
  image:
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
  quote:
  "The visualization of the hand movements helped me master Chopin's Nocturne in weeks instead of months. It's like having a teacher right beside you.",
  instrument: 'Piano'
},
{
  id: 2,
  name: 'Minh Tran',
  role: 'Traditional Musician',
  image:
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
  quote:
  'Finally, an app that respects and accurately simulates Vietnamese instruments. The Đàn Tranh simulation is incredibly responsive and authentic.',
  instrument: 'Đàn Tranh'
},
{
  id: 3,
  name: 'Elena Rossi',
  role: 'Music Teacher',
  image:
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
  quote:
  'I use this tool to generate sheet music for my students from YouTube videos. The accuracy of the transcription is simply unmatched.',
  instrument: 'Violin'
}];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const next = () => {
    setDirection('right');
    setActive((prev) => (prev + 1) % testimonials.length);
  };
  const prev = () => {
    setDirection('left');
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);
  return (
    <section className="py-24 px-6 bg-[#3E2723] relative overflow-hidden text-[#FAF7F0]">
      {/* Wood Texture Background */}
      <div className="absolute inset-0 bg-wood-grain opacity-90" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Student Stories
          </h2>
          <p className="text-[#D4A574] font-serif italic text-xl">
            Hear from our community of musicians
          </p>
        </div>

        <div className="relative min-h-[400px] flex items-center justify-center">
          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="absolute left-0 z-20 p-3 rounded-full border border-[#D4A574]/30 text-[#D4A574] hover:bg-[#D4A574] hover:text-[#3E2723] transition-all hidden md:block">

            <ChevronLeft size={24} />
          </button>

          <button
            onClick={next}
            className="absolute right-0 z-20 p-3 rounded-full border border-[#D4A574]/30 text-[#D4A574] hover:bg-[#D4A574] hover:text-[#3E2723] transition-all hidden md:block">

            <ChevronRight size={24} />
          </button>

          {/* Card Container */}
          <div className="w-full max-w-3xl relative overflow-hidden">
            <div
              key={active}
              className={`
                bg-[#FAF7F0] text-[#3E2723] p-8 md:p-12 rounded-2xl shadow-2xl
                animate-in fade-in duration-500 fill-mode-forwards
                ${direction === 'right' ? 'slide-in-from-right-8' : 'slide-in-from-left-8'}
              `}>

              <div className="absolute top-8 left-8 text-[#D4A574]/20">
                <Quote size={80} />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full border-4 border-[#D4A574] overflow-hidden shadow-lg">
                    <img
                      src={testimonials[active].image}
                      alt={testimonials[active].name}
                      className="w-full h-full object-cover" />

                  </div>
                  <div className="flex justify-center mt-3 space-x-1 text-[#D4A574]">
                    {[...Array(5)].map((_, i) =>
                    <Star key={i} size={14} fill="currentColor" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="text-center md:text-left flex-1">
                  <p className="text-xl md:text-2xl font-serif italic leading-relaxed mb-6">
                    "{testimonials[active].quote}"
                  </p>

                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-wider">
                      {testimonials[active].name}
                    </h4>
                    <p className="text-[#8B4513] font-serif">
                      {testimonials[active].role} •{' '}
                      {testimonials[active].instrument}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-3 mt-8">
          {testimonials.map((_, idx) =>
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > active ? 'right' : 'left');
              setActive(idx);
            }}
            className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${idx === active ? 'bg-[#D4A574] w-8' : 'bg-[#D4A574]/30 hover:bg-[#D4A574]/50'}
              `} />

          )}
        </div>
      </div>
    </section>);

}