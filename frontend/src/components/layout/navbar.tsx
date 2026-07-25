'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/constants/navLinks';
import { SITE_CONFIG } from '@/constants/siteConfig';
import { Palmtree, User, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default demo mode: logged in

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-950/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-[#0D5C54] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Palmtree className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-[#0D5C54] block leading-none">
              {SITE_CONFIG.name}
            </span>
            <span className="text-[10px] tracking-wider uppercase text-emerald-700 font-semibold">
              Bali Villa Booking
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-[#0D5C54]',
                  isActive ? 'text-[#0D5C54] font-bold border-b-2 border-[#0D5C54] pb-1' : 'text-slate-600'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User / Demo Action */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0D5C54]" />
            <span className="font-medium">Mode Demo UI</span>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/bookingSaya"
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                <User className="w-4 h-4 text-[#0D5C54]" />
                <span>Hi, Demo User</span>
              </Link>
              <button
                onClick={() => setIsLoggedIn(false)}
                title="Keluar Demo"
                className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#0D5C54] hover:bg-[#0A4842] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all"
            >
              Demo Login
            </Link>
          )}
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-700 hover:text-[#0D5C54] font-medium py-1 text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-1 rounded">Mode Demo UI</span>
            {isLoggedIn ? (
              <Link
                href="/bookingSaya"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-[#0D5C54] flex items-center gap-1"
              >
                <User className="w-4 h-4" />
                Demo User
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm bg-[#0D5C54] text-white px-4 py-2 rounded-lg font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
