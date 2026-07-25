'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Palmtree, ShieldCheck, ArrowRight, Globe } from 'lucide-react';
import { SITE_CONFIG } from '@/constants/siteConfig';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const handleDemoLogin = () => {
    // Demo login redirect to home / booking history
    router.push('/bookingSaya');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0D5C54] text-white flex items-center justify-center mx-auto shadow-md">
            <Palmtree className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{SITE_CONFIG.name}</h2>
          <p className="text-xs text-slate-500">Masuk ke akun Balivio atau gunakan Mode Demo UI</p>
        </div>

        {/* Mode Demo Fast Button */}
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0D5C54]">
            <ShieldCheck className="w-4 h-4 text-[#0D5C54]" />
            <span>Fase Demo UI Replikasi</span>
          </div>
          <p className="text-xs text-slate-600">
            Tidak perlu registrasi akun nyata. Klik tombol di bawah untuk langsung masuk sebagai Demo User.
          </p>
          <button
            onClick={handleDemoLogin}
            className="w-full bg-[#0D5C54] hover:bg-[#0A4842] text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <span>Demo Login — Masuk Langsung</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 text-xs font-bold text-slate-400">
          <button
            onClick={() => setActiveTab('login')}
            className={`w-1/2 pb-3 transition-colors ${
              activeTab === 'login' ? 'text-[#0D5C54] border-b-2 border-[#0D5C54]' : ''
            }`}
          >
            Masuk Akun
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`w-1/2 pb-3 transition-colors ${
              activeTab === 'register' ? 'text-[#0D5C54] border-b-2 border-[#0D5C54]' : ''
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {/* Form Inputs (Visual UI) */}
        <form onSubmit={(e) => { e.preventDefault(); handleDemoLogin(); }} className="space-y-4 text-xs">
          {activeTab === 'register' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                defaultValue="Demo User"
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0D5C54]"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Alamat Email</label>
            <input
              type="email"
              placeholder="nama@email.com"
              defaultValue="demo@balivio.com"
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0D5C54]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Kata Sandi</label>
            <input
              type="password"
              placeholder="••••••••"
              defaultValue="demopassword"
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0D5C54]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-xs shadow-sm transition-all"
          >
            {activeTab === 'login' ? 'Masuk' : 'Buat Akun'}
          </button>
        </form>

        {/* Social Buttons (Visual Only) */}
        <div className="pt-2 border-t border-slate-100 text-center space-y-3">
          <span className="text-[11px] text-slate-400 block">Atau lanjutkan dengan</span>
          <button
            onClick={handleDemoLogin}
            className="w-full border border-slate-200 hover:bg-slate-50 py-2.5 rounded-xl font-semibold text-xs text-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Globe className="w-4 h-4 text-red-500" />
            <span>Google Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
