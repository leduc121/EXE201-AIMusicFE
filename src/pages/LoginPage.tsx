import React, { useState } from 'react';
import { ArrowLeft, Music, Mail, Lock, User } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  isSignUp?: boolean;
}

export function LoginPage({ onNavigate, isSignUp = false }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/signup
    onNavigate('landing');
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F0] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background styling */}
      <div className="absolute inset-0 bg-wood-grain opacity-5 z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4A574]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8B4513]/10 rounded-full blur-3xl" />

      {/* Back button */}
      <button 
        onClick={() => onNavigate('landing')}
        className="absolute top-8 left-8 z-20 flex items-center text-[#8B4513] hover:text-[#654321] transition-colors"
      >
        <ArrowLeft className="mr-2" size={20} />
        <span className="font-serif">Back to Home</span>
      </button>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#8B4513]/10 text-[#8B4513] mb-4">
            <Music size={32} />
          </div>
          <h2 className="text-3xl font-bold font-serif text-[#3E2723]">
            {isSignUp ? 'Join VietMusic' : 'Welcome Back'}
          </h2>
          <p className="text-[#654321] mt-2 font-serif italic">
            {isSignUp ? 'Start your musical journey today' : 'Continue your musical journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-[#3E2723] mb-2 font-serif">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-[#8B4513]/50" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#D4A574]/30 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#8B4513]/50 focus:border-[#8B4513]/50 transition-all font-serif"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#3E2723] mb-2 font-serif">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-[#8B4513]/50" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-[#D4A574]/30 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#8B4513]/50 focus:border-[#8B4513]/50 transition-all font-serif"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3E2723] mb-2 font-serif flex justify-between">
              <span>Password</span>
              {!isSignUp && (
                <a href="#" className="text-xs text-[#8B4513] hover:underline">
                  Forgot password?
                </a>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-[#8B4513]/50" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-[#D4A574]/30 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#8B4513]/50 focus:border-[#8B4513]/50 transition-all font-serif"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full py-4 text-lg shadow-xl hover:shadow-2xl transition-all">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm font-serif text-[#654321]">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => onNavigate('login')} className="font-bold text-[#8B4513] hover:underline">
                Sign in
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={() => onNavigate('signup')} className="font-bold text-[#8B4513] hover:underline">
                Create one
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
