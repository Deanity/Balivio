'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Palmtree, Globe, Share2, Mail, Compass } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Footer ONLY appears on Landing Page ('/') and Auth Page ('/login')
  const isLandingPage = pathname === '/';
  const isAuthPage = pathname === '/login' || pathname?.startsWith('/login');

  if (!isLandingPage && !isAuthPage) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0D5C54] text-white flex items-center justify-center font-bold">
                <Palmtree className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Balivio</span>
            </Link>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              Platform booking villa terpercaya di Bali. Temukan villa impianmu dengan harga terbaik.
            </p>
            <div className="flex items-center gap-2 pt-1 text-slate-400">
              <a href="#" aria-label="Globe" className="p-2 hover:text-[#0D5C54] hover:bg-slate-100 rounded-full transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Share" className="p-2 hover:text-[#0D5C54] hover:bg-slate-100 rounded-full transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Mail" className="p-2 hover:text-[#0D5C54] hover:bg-slate-100 rounded-full transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Explore" className="p-2 hover:text-[#0D5C54] hover:bg-slate-100 rounded-full transition-colors">
                <Compass className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Tentang */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Tentang</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="#" className="hover:text-[#0D5C54] transition-colors">Tentang Balivio</Link></li>
              <li><Link href="#" className="hover:text-[#0D5C54] transition-colors">Karir</Link></li>
              <li><Link href="#" className="hover:text-[#0D5C54] transition-colors">Press Kit</Link></li>
              <li><Link href="#" className="hover:text-[#0D5C54] transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Col 3: Bantuan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Bantuan</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="#" className="hover:text-[#0D5C54] transition-colors">Pusat Bantuan</Link></li>
              <li><Link href="#" className="hover:text-[#0D5C54] transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="#" className="hover:text-[#0D5C54] transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="#" className="hover:text-[#0D5C54] transition-colors">Kontak Kami</Link></li>
            </ul>
          </div>

          {/* Col 4: Kontak & Metode Pembayaran */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Kontak</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="font-medium text-slate-900">support@balivio.id</li>
              <li>+62 361 123 4567</li>
              <li>Kuta, Bali, Indonesia</li>
            </ul>

            <div className="pt-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Metode pembayaran</span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-500">
                <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">VISA</span>
                <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">MC</span>
                <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">BCA</span>
                <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">QRIS</span>
                <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">GOPAY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© 2026 Balivio. All rights reserved.</p>
          <p>Dibuat dengan <span className="text-red-500">❤</span> untuk Bali</p>
        </div>
      </div>
    </footer>
  );
}
