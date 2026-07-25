import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/constants/siteConfig';
import { Palmtree, MapPin, Phone, Mail, Globe, Share2, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0B3B36] text-white pt-16 pb-12 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <Palmtree className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">{SITE_CONFIG.name}</span>
            </Link>
            <p className="text-emerald-100/70 text-sm leading-relaxed">
              {SITE_CONFIG.description}
            </p>
            <div className="flex items-center gap-3 pt-2 text-emerald-200">
              <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noreferrer" className="hover:text-emerald-400 p-2 bg-emerald-900/50 rounded-lg transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href={SITE_CONFIG.social.facebook} target="_blank" rel="noreferrer" className="hover:text-emerald-400 p-2 bg-emerald-900/50 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Destinasi Populer */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-emerald-300 tracking-wide uppercase text-xs">Destinasi Villa</h4>
            <ul className="space-y-2 text-sm text-emerald-100/80">
              <li><Link href="/searchVilla?location=Canggu" className="hover:text-white transition-colors">Villa Canggu</Link></li>
              <li><Link href="/searchVilla?location=Ubud" className="hover:text-white transition-colors">Villa Ubud</Link></li>
              <li><Link href="/searchVilla?location=Seminyak" className="hover:text-white transition-colors">Villa Seminyak</Link></li>
              <li><Link href="/searchVilla?location=Uluwatu" className="hover:text-white transition-colors">Villa Uluwatu</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-emerald-300 tracking-wide uppercase text-xs">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm text-emerald-100/80">
              <li><Link href="/searchVilla" className="hover:text-white transition-colors">Cari Semua Villa</Link></li>
              <li><Link href="/#mengapa" className="hover:text-white transition-colors">Jaminan Terbaik Balivio</Link></li>
              <li><Link href="/bookingSaya" className="hover:text-white transition-colors">Cek Booking Saya</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Mode Demo Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-emerald-300 tracking-wide uppercase text-xs">Hubungi Kami</h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{SITE_CONFIG.supportPhone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{SITE_CONFIG.supportEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & UI disclaimer */}
        <div className="pt-8 border-t border-emerald-900/60 flex flex-col md:flex-row items-center justify-between text-xs text-emerald-100/50 gap-4">
          <p>© 2026 {SITE_CONFIG.name}. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-2 bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-800/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fase Tampilan UI Only (Demo Replikasi Visual)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
