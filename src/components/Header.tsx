import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, Music, Upload, Home, User } from 'lucide-react';
import { Button } from './ui/Button';

interface HeaderProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Header({ activePage, onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInstrumentsDropdownOpen, setIsInstrumentsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'upload', label: 'Studio', icon: Upload },
    { id: 'learn', label: 'Learn', icon: Music },
  ];

  const vietnameseInstruments = [
    { id: 'dan-tranh', name: 'Đàn Tranh', desc: '16-string Zither' },
    { id: 'dan-bau', name: 'Đàn Bầu', desc: 'Monochord' },
    { id: 'sao-truc', name: 'Sáo Trúc', desc: 'Bamboo Flute' },
  ];

  const handleNavigation = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
    setIsInstrumentsDropdownOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 font-serif
        ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-[#D4A574]/30'
            : 'bg-white/60 backdrop-blur-sm py-4 border-b border-[#D4A574]/10 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavigation('landing')}
          >
            <div className={`w-10 h-10 rounded-xl bg-[#8B4513] text-[#FAF7F0] flex items-center justify-center shadow-lg group-hover:bg-[#654321] transition-colors`}>
              <Music size={20} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold tracking-wider ${isScrolled ? 'text-[#3E2723]' : 'text-[#3E2723]'}`}>
                VIET<span className="text-[#8B4513]">MUSIC</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium tracking-wide
                  ${
                    activePage === item.id
                      ? 'bg-[#8B4513]/10 text-[#8B4513]'
                      : 'text-[#654321] hover:bg-[#8B4513]/5 hover:text-[#8B4513]'
                  }`}
              >
                {item.label}
              </button>
            ))}

            {/* Dropdown for Instruments */}
            <div
              className="relative"
              onMouseEnter={() => setIsInstrumentsDropdownOpen(true)}
              onMouseLeave={() => setIsInstrumentsDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-4 py-2 rounded-full transition-all text-sm font-medium tracking-wide text-[#654321] hover:bg-[#8B4513]/5 hover:text-[#8B4513] ${
                  activePage.startsWith('instrument-') ? 'bg-[#8B4513]/10 text-[#8B4513]' : ''
                }`}
              >
                Instruments <ChevronDown size={14} className={`transition-transform duration-200 ${isInstrumentsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isInstrumentsDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56">
                  <div className="bg-white rounded-2xl shadow-xl border border-[#D4A574]/20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="px-4 py-2 text-xs font-bold text-[#8B4513] uppercase tracking-wider bg-[#FAF7F0]/50 border-b border-[#D4A574]/10 mb-1">
                      Traditional
                    </p>
                    {vietnameseInstruments.map((inst) => (
                      <button
                        key={inst.id}
                        onClick={() => handleNavigation(`instrument-${inst.id}`)}
                        className="w-full text-left px-4 py-3 hover:bg-[#FAF7F0] transition-colors group flex flex-col"
                      >
                        <span className="font-bold text-[#3E2723] group-hover:text-[#8B4513] transition-colors">{inst.name}</span>
                        <span className="text-xs text-[#654321]/60 italic">{inst.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => handleNavigation('login')}
              className="text-[#8B4513] hover:bg-[#FAF7F0] font-medium"
            >
              Log in
            </Button>
            <Button
              onClick={() => handleNavigation('signup')}
              className="bg-[#8B4513] text-white hover:bg-[#654321] shadow-md border-none"
            >
              Sign up
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-[#3E2723] rounded-lg hover:bg-[#8B4513]/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#FAF7F0] pt-24 px-6 md:hidden animate-in slide-in-from-top-full duration-300 overflow-y-auto">
          <nav className="flex flex-col gap-2 mb-8">
            <p className="text-xs font-bold text-[#8B4513] uppercase tracking-wider mb-2">Menu</p>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all text-lg font-serif
                  ${
                    activePage === item.id
                      ? 'bg-[#8B4513]/10 text-[#8B4513] font-bold'
                      : 'text-[#3E2723] font-medium'
                  }`}
              >
                <item.icon size={20} className={activePage === item.id ? 'text-[#8B4513]' : 'text-[#8B4513]/50'} />
                {item.label}
              </button>
            ))}

            <p className="text-xs font-bold text-[#8B4513] uppercase tracking-wider mt-6 mb-2">Instruments</p>
            {vietnameseInstruments.map((inst) => (
              <button
                key={inst.id}
                onClick={() => handleNavigation(`instrument-${inst.id}`)}
                className="flex flex-col text-left px-4 py-3 rounded-xl hover:bg-[#8B4513]/5 transition-colors"
              >
                <span className="font-bold text-[#3E2723] text-lg font-serif">{inst.name}</span>
                <span className="text-sm text-[#654321]/70 italic">{inst.desc}</span>
              </button>
            ))}
          </nav>

          <div className="flex flex-col gap-3 pt-6 border-t border-[#8B4513]/10 pb-12">
            <Button
              className="w-full bg-[#8B4513] text-white py-6 text-lg"
              onClick={() => handleNavigation('signup')}
            >
              Sign up
            </Button>
            <Button
              variant="outline"
              className="w-full border-[#8B4513] text-[#8B4513] py-6 text-lg hover:bg-[#8B4513] hover:text-white transition-colors"
              onClick={() => handleNavigation('login')}
            >
              Log in
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
