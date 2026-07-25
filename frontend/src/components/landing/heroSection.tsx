'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, MapPin, Calendar, Users, Zap } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('2026-07-16');
  const [checkOut, setCheckOut] = useState('2026-07-17');
  const [guests, setGuests] = useState('2');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/searchVilla?location=${encodeURIComponent(location)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center text-white px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
      {/* High Quality Bali Ocean Cliff Villa Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2000&q=80"
        alt="Bali Villa Cliff Ocean View"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Subtle Dark Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-slate-950/20 z-0" />

      {/* Content Container */}
      <div className="relative max-w-5xl mx-auto text-left w-full space-y-8 z-10 pt-6">
        {/* Top Tagline Badge */}
        <div>
          <span className="inline-flex items-center gap-2 bg-emerald-500/90 text-slate-950 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Promo Spesial Hingga 20% Off</span>
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1] max-w-3xl">
          Rasakan liburan <br />
          sempurna di villa terbaik <br />
          <span className="text-white">Bali.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-100/90 max-w-2xl font-normal leading-relaxed">
          Mulai dari villa private pool, retreat pegunungan, hingga cliff top suite — semuanya bisa kamu booking dalam hitungan menit.
        </p>

        {/* Search Bar Container matching photo */}
        <div className="mt-10 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/20 text-slate-900 max-w-4xl">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-9 gap-3 items-center">
            {/* Field 1: Lokasi */}
            <div className="sm:col-span-3 flex items-center gap-3 px-3 py-2 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-[#0D5C54] transition-colors">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="flex flex-col text-left w-full">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">LOKASI</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none w-full cursor-pointer"
                >
                  <option value="">Canggu, Ubud, Seminyak...</option>
                  <option value="Canggu">Canggu</option>
                  <option value="Ubud">Ubud</option>
                  <option value="Seminyak">Seminyak</option>
                  <option value="Uluwatu">Uluwatu</option>
                </select>
              </div>
            </div>

            {/* Field 2: Check-In */}
            <div className="sm:col-span-2 flex items-center gap-2.5 px-3 py-2 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-[#0D5C54] transition-colors">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex flex-col text-left w-full">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">CHECK-IN</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none w-full cursor-pointer"
                />
              </div>
            </div>

            {/* Field 3: Check-Out */}
            <div className="sm:col-span-2 flex items-center gap-2.5 px-3 py-2 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-[#0D5C54] transition-colors">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex flex-col text-left w-full">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">CHECK-OUT</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none w-full cursor-pointer"
                />
              </div>
            </div>

            {/* Field 4 & Button: Tamu + Cari Villa Button */}
            <div className="sm:col-span-2 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex flex-col text-left w-full">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">TAMU</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none w-full cursor-pointer"
                  >
                    <option value="1">1 Tamu</option>
                    <option value="2">2 Tamu</option>
                    <option value="4">4 Tamu</option>
                    <option value="6">6+ Tamu</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#0D5C54] hover:bg-[#0A4842] text-white py-3.5 px-5 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Cari Villa</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
