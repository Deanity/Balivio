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
            className="p-2 text-slate-600 hover:text-[#0D5C54] rounded-full hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Globe className="w-4 h-4 text-slate-500" />
            <span>IDR (Rp)</span>
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
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-3">
            <Link
              href="/searchVilla"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-700 hover:text-[#0D5C54] font-medium py-1 text-base"
            >
              Cari Villa
            </Link>
            <Link
              href="/bookingSaya"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-700 hover:text-[#0D5C54] font-medium py-1 text-base"
            >
              Booking Saya
            </Link>
          </nav>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-bold text-slate-800"
            >
              Login
            </Link>
            <Link
              href="/login?mode=register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm bg-[#0D5C54] text-white px-5 py-2 rounded-full font-bold"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
