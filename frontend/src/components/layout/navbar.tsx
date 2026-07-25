'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Palmtree, Globe, Menu, X } from 'lucide-react';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#0D5C54] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Palmtree className="w-5 h-5 text-emerald-300" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Balivio
          </span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <button
            title="Mata Uang (IDR)"
            suppressHydrationWarning
            className="p-2 text-slate-600 hover:text-[#0D5C54] rounded-full hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Globe className="w-4 h-4 text-slate-500" />
            <span>IDR</span>
          </button>

          <Link
            href="/login"
            className="text-sm font-semibold text-slate-700 hover:text-[#0D5C54] px-3 py-2 transition-colors"
          >
            Login
          </Link>

          <Link
            href="/login?mode=register"
            className="bg-[#0D5C54] hover:bg-[#0A4842] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-sm hover:shadow transition-all"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-[#0D5C54]"
          aria-label="Toggle Navigation"
          suppressHydrationWarning
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Globe className="w-4 h-4 text-[#0D5C54]" />
              <span>Mata Uang: <strong>IDR (Rp)</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-bold text-slate-800 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/login?mode=register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 bg-[#0D5C54] hover:bg-[#0A4842] rounded-full text-xs font-bold text-white shadow-sm transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
