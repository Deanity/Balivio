'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const { login, loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'user@balivio.id', name || 'Bali Traveler');
    router.push(redirectUrl);
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
    router.push(redirectUrl);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Left Column: Promo Banner Card (Matching Photo) */}
        <div className="bg-[#F1F5F3] rounded-3xl p-8 sm:p-12 flex flex-col justify-center space-y-6 relative overflow-hidden">
          <div>
            <span className="bg-[#BFF038] text-slate-900 font-extrabold text-xs px-3.5 py-1.5 rounded-full inline-block shadow-xs">
              Balivio Member
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Dapatkan diskon khusus <br />
              hingga <span className="text-[#0D5C54]">20%</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              Daftar gratis dan nikmati promo eksklusif setiap bulan untuk villa terbaik di Bali.
            </p>
          </div>
        </div>

        {/* Right Column: Auth Form Card (Matching Photo 100%) */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-center space-y-6">
          {/* Tab Switcher (Masuk vs Daftar Pill) */}
          <div className="bg-slate-100/90 p-1 rounded-full grid grid-cols-2 gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              suppressHydrationWarning
              className={`py-2.5 rounded-full font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              suppressHydrationWarning
              className={`py-2.5 rounded-full font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {activeTab === 'register' && (
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-900 block">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Nama kamu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={activeTab === 'register'}
                  suppressHydrationWarning
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0D5C54] text-slate-900 font-medium text-xs placeholder:text-slate-400"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-900 block">Email</label>
              <input
                type="email"
                placeholder="email@balivio.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0D5C54] text-slate-900 font-medium text-xs placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-900 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0D5C54] text-slate-900 font-medium text-xs placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              suppressHydrationWarning
              className="w-full bg-[#0D5C54] hover:bg-[#0A4842] text-white py-3.5 rounded-full font-extrabold text-xs shadow-md transition-colors mt-2"
            >
              {activeTab === 'login' ? 'Masuk' : 'Buat Akun'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 font-medium absolute">atau</span>
          </div>

          {/* Social Auth Buttons */}
          <div className="space-y-2.5">
            {/* Lanjut dengan Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              suppressHydrationWarning
              className="w-full border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2.5 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Lanjut dengan Google</span>
            </button>

            {/* Lanjut dengan Apple */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              suppressHydrationWarning
              className="w-full border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2.5 transition-colors"
            >
              <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.36c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.14 1.86-1 2.97 1.08.08 2.16-.57 2.81-1.37z" />
              </svg>
              <span>Lanjut dengan Apple</span>
            </button>
          </div>

          {/* Terms Footer */}
          <p className="text-[11px] text-slate-400 text-center font-medium pt-2">
            Dengan masuk, kamu menyetujui{' '}
            <Link href="#" className="underline text-slate-600 hover:text-[#0D5C54]">
              Syarat & Ketentuan
            </Link>{' '}
            kami.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center text-xs text-slate-400">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
