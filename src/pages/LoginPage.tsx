import React, { useState } from 'react';
import { ArrowLeft, Music, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  isSignUp?: boolean;
}

export function LoginPage({ onNavigate, isSignUp = false }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isSignUp ? '/auth/register' : '/auth/login';
      const body = isSignUp
        ? { email, password, fullName: name }
        : { email, password };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await response.json();
      const data = json.data || json;

      if (!response.ok) {
        throw new Error(data.message || json.message || 'Login failed');
      }

      if (isSignUp) {
        // After registration, switch to login
        setError('');
        alert('Account created! Please check your email for verification, then sign in.');
        onNavigate('login');
        return;
      }

      // Save tokens to localStorage
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Check if admin → redirect to admin dashboard
      if (data.user?.role === 'admin') {
        onNavigate('admin');
      } else {
        onNavigate('landing');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-serif text-center">
            {error}
          </div>
        )}

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

          <Button
            type="submit"
            className="w-full py-4 text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && <Loader2 size={20} className="animate-spin" />}
            {loading
              ? 'Please wait...'
              : isSignUp
                ? 'Create Account'
                : 'Sign In'}
          </Button>
        </form>

        {/* Quick admin hint (dev only) */}
        {!isSignUp && (
          <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono text-center">
            <p className="font-bold mb-1">🔐 Dev Admin Credentials</p>
            <p>Email: admin@uniwave.local</p>
            <p>Password: Admin@123456</p>
          </div>
        )}

        <div className="mt-6 text-center text-sm font-serif text-[#654321]">
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
