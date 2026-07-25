'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Palmtree, Globe, Menu, X, LogOut, Ticket } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

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

          {isLoggedIn && user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard?tab=bookings"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0D5C54] transition-colors bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-full"
              >
                <Ticket className="w-3.5 h-3.5 text-[#0D5C54]" />
                <span>Booking Saya</span>
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-80 transition-opacity"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-emerald-500 shrink-0">
                  <Image
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xs font-extrabold text-slate-900">{user.name}</span>
              </Link>

              <button
                onClick={logout}
                title="Logout"
                suppressHydrationWarning
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
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

          {isLoggedIn && user ? (
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-emerald-500 shrink-0">
                  <Image src={user.avatar || ''} alt={user.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/dashboard?tab=bookings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-slate-100 rounded-full text-xs font-bold text-slate-800 transition-colors"
                >
                  Booking Saya
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-full text-xs font-bold transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      )}
    </header>
  );
}
