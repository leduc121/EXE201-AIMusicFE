import React from 'react';
import { Button } from '../components/ui/Button';
import { HowItWorks } from '../components/HowItWorks';
import { Testimonials } from '../components/Testimonials';
import { PricingPlans } from '../components/PricingPlans';
import { ArrowRight, Music, Sparkles } from 'lucide-react';
interface LandingPageProps {
  onNavigate: (page: string) => void;
}
export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen w-full bg-cream-light overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
        {/* Background with wood texture and gradient */}
        <div className="absolute inset-0 bg-wood-grain opacity-10 z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F0]/90 via-[#FAF7F0]/60 to-[#FAF7F0] z-0" />

        {/* Animated Floating Notes Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(8)].map((_, i) =>
          <div
            key={i}
            className="absolute text-[#3E2723]/5 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 100 + 50}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}>

              ♪
            </div>
          )}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="mb-8 inline-block animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="px-6 py-2 rounded-full border border-[#8B4513]/30 text-[#8B4513] text-sm font-serif tracking-widest uppercase bg-[#FAF7F0]/80 backdrop-blur-sm shadow-sm flex items-center gap-2">
              <Sparkles size={14} /> AI-Powered Music Studio
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-[#3E2723] mb-8 leading-tight drop-shadow-sm animate-in fade-in zoom-in duration-1000">
            Master the Art <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B4513] via-[#D4A574] to-[#8B4513] bg-size-200 animate-gradient">
              of Music
            </span>
          </h1>

          <p className="text-xl md:text-3xl text-[#654321] mb-12 max-w-3xl mx-auto font-serif italic leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            Transform any YouTube video into sheet music instantly. Experience
            the warmth of tradition meeting the precision of AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <Button
              size="lg"
              onClick={() => onNavigate('upload')}
              className="min-w-[220px] h-14 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group">

              Start Creating{' '}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('learn')}
              className="min-w-[220px] h-14 text-lg bg-[#FAF7F0]/50 backdrop-blur-sm border-2">

              Try Demo
            </Button>
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* Instrument Showcase Preview */}
      <section className="py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-4">
                Traditional Heritage
              </h2>
              <p className="text-[#8B4513] text-xl font-serif italic">
                Explore the soul of Vietnamese music
              </p>
            </div>
            <Button
              variant="ghost"
              className="hidden md:flex group"
              onClick={() => {}}>

              View All Instruments{' '}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
            {
              id: 'dan-tranh',
              name: 'Đàn Tranh',
              img: 'https://images.unsplash.com/photo-1680792563719-288027b2a090?q=80&w=2787&auto=format&fit=crop'
            },
            {
              id: 'dan-bau',
              name: 'Đàn Bầu',
              img: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=1000'
            },
            {
              id: 'sao-truc',
              name: 'Sáo Trúc',
              img: 'https://images.unsplash.com/photo-1665492723785-502693722256?auto=format&fit=crop&q=80&w=1000'
            }].
            map((inst) =>
            <div
              key={inst.id}
              onClick={() => onNavigate(`instrument-${inst.id}`)}
              className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">

                <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${inst.img})`
                }} />

                <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-3xl font-bold text-[#FAF7F0] mb-2">
                    {inst.name}
                  </h3>
                  <div className="flex items-center text-[#D4A574] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <span className="font-serif italic mr-2">Learn more</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 md:hidden text-center">
            <Button variant="ghost" className="group">
              View All Instruments{' '}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <Testimonials />
      
      <PricingPlans />

      {/* Final CTA */}
      <section className="py-32 px-6 bg-[#FAF7F0] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-wood-grain opacity-5" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-[#3E2723] mb-8">
            Ready to Start?
          </h2>
          <p className="text-xl text-[#654321] mb-12 font-serif italic">
            Join thousands of musicians preserving tradition through technology.
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate('upload')}
            className="h-16 px-12 text-xl shadow-xl hover:scale-105 transition-transform">

            Launch Studio
          </Button>
        </div>
      </section>
    </div>);

}