import React, { useState } from 'react';
import { Home, Upload, Music, Menu, X, ChevronRight } from 'lucide-react';
interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}
export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
  {
    id: 'landing',
    label: 'Home',
    icon: Home
  },
  {
    id: 'upload',
    label: 'Upload Studio',
    icon: Upload
  },
  {
    id: 'learn',
    label: 'Piano Learning',
    icon: Music
  }];

  const vietnameseInstruments = [
  {
    id: 'dan-tranh',
    name: 'Đàn Tranh',
    desc: '16-string Zither',
    icon:
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-6 h-6">

          <path
        d="M2 8L22 4V16L2 20V8Z"
        strokeLinecap="round"
        strokeLinejoin="round" />

          <path d="M6 7V19" strokeLinecap="round" />
          <path d="M10 6V18" strokeLinecap="round" />
          <path d="M14 5V17" strokeLinecap="round" />
          <path d="M18 4V16" strokeLinecap="round" />
        </svg>

  },
  {
    id: 'dan-bau',
    name: 'Đàn Bầu',
    desc: 'Monochord',
    icon:
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-6 h-6">

          <path d="M4 20H20" strokeLinecap="round" />
          <path d="M12 20V8" strokeLinecap="round" />
          <path
        d="M12 8C12 8 16 4 18 6C20 8 12 12 12 12"
        strokeLinecap="round" />

          <circle cx="12" cy="18" r="2" />
        </svg>

  },
  {
    id: 'sao-truc',
    name: 'Sáo Trúc',
    desc: 'Bamboo Flute',
    icon:
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-6 h-6">

          <rect
        x="2"
        y="10"
        width="20"
        height="4"
        rx="2"
        strokeLinecap="round" />

          <circle cx="6" cy="12" r="1" fill="currentColor" />
          <circle cx="10" cy="12" r="1" fill="currentColor" />
          <circle cx="14" cy="12" r="1" fill="currentColor" />
          <circle cx="18" cy="12" r="1" fill="currentColor" />
        </svg>

  }];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#8B4513] text-[#FAF7F0] rounded-md shadow-lg"
        onClick={() => setIsOpen(!isOpen)}>

        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`
        fixed top-0 left-0 z-40 h-screen w-72 
        bg-wood-grain text-[#FAF7F0] shadow-2xl
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div 
            className="mb-10 text-center border-b border-[#FAF7F0]/10 pb-6 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              onNavigate('landing');
              setIsOpen(false);
            }}
          >
            <h1 className="text-2xl font-bold font-serif tracking-wider text-[#D4A574]">
              VIET<span className="text-[#FAF7F0]">MUSIC</span>
            </h1>
            <p className="text-xs text-[#FAF7F0]/60 mt-1 uppercase tracking-widest">
              Traditional Studio
            </p>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-2 mb-10">
            <p className="text-xs font-bold text-[#D4A574] uppercase tracking-wider mb-4 px-2">
              Menu
            </p>
            {navItems.map((item) =>
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsOpen(false);
              }}
              className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${activePage === item.id ? 'bg-[#FAF7F0]/10 text-[#D4A574] border-l-4 border-[#D4A574]' : 'text-[#FAF7F0]/80 hover:bg-[#FAF7F0]/5 hover:text-[#FAF7F0] hover:pl-5'}
                `}>

                <item.icon size={20} />
                <span className="font-serif text-lg">{item.label}</span>
              </button>
            )}
          </nav>

          {/* Instruments Section */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-xs font-bold text-[#D4A574] uppercase tracking-wider mb-4 px-2">
              Traditional Instruments
            </p>
            <div className="space-y-3">
              {vietnameseInstruments.map((inst) =>
              <div
                key={inst.id}
                className="group relative overflow-hidden rounded-lg bg-[#3E2723]/50 border border-[#FAF7F0]/10 p-4 hover:border-[#D4A574]/50 transition-all cursor-pointer hover:shadow-lg">

                  <div className="flex items-start justify-between mb-2">
                    <div className="text-[#D4A574] group-hover:text-[#FAF7F0] transition-colors">
                      {inst.icon}
                    </div>
                    <ChevronRight
                    size={16}
                    className="text-[#FAF7F0]/20 group-hover:text-[#D4A574] transition-colors" />

                  </div>
                  <h3 className="font-serif font-bold text-[#FAF7F0] group-hover:text-[#D4A574] transition-colors">
                    {inst.name}
                  </h3>
                  <p className="text-xs text-[#FAF7F0]/60 italic">
                    {inst.desc}
                  </p>

                  {/* Hover Effect Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574]/0 to-[#D4A574]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-[#FAF7F0]/10 text-center">
            <p className="text-xs text-[#FAF7F0]/40 font-serif">
              © 2024 VietMusic Studio
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
        onClick={() => setIsOpen(false)} />

      }
    </>);

}