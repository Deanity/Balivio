'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, ShieldCheck } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('2');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/searchVilla?location=${encodeURIComponent(location)}&guests=${guests}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-emerald-950 via-[#0B3B36] to-[#0D5C54] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
        {/* Top Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-emerald-800/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm font-medium"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Garansi Harga Terbaik & 100% Villa Terverifikasi Bali</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight"
        >
          Temukan Private Pool Villa <br />
          <span className="text-emerald-400">Impian Anda di Bali</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-emerald-100/80 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Ribuan pilihan villa mewah di Canggu, Ubud, Seminyak & Uluwatu dengan kolam renang pribadi, pemandangan indah, dan layanan kelas dunia.
        </motion.p>

        {/* Search Bar Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/20 text-slate-900 max-w-4xl mx-auto"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
            {/* Location Select */}
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-emerald-500 transition-colors">
              <MapPin className="w-5 h-5 text-[#0D5C54] shrink-0" />
              <div className="flex flex-col text-left w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lokasi</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none w-full cursor-pointer"
                >
                  <option value="">Semua Lokasi Bali</option>
                  <option value="Canggu">Canggu</option>
                  <option value="Ubud">Ubud</option>
                  <option value="Seminyak">Seminyak</option>
                  <option value="Uluwatu">Uluwatu</option>
                </select>
              </div>
            </div>

            {/* Check-In / Out Dummy Input */}
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-emerald-500 transition-colors">
              <Calendar className="w-5 h-5 text-[#0D5C54] shrink-0" />
              <div className="flex flex-col text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Stay</label>
                <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">Pilih Tanggal</span>
              </div>
            </div>

            {/* Guests Select */}
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-emerald-500 transition-colors">
              <Users className="w-5 h-5 text-[#0D5C54] shrink-0" />
              <div className="flex flex-col text-left w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jumlah Tamu</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none w-full cursor-pointer"
                >
                  <option value="1">1 Tamu</option>
                  <option value="2">2 Tamu (Pasangan)</option>
                  <option value="4">4 Tamu (Keluarga)</option>
                  <option value="6">6+ Tamu (Rombongan)</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full bg-[#0D5C54] hover:bg-[#0A4842] text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg hover:shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 group"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Cari Villa</span>
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
