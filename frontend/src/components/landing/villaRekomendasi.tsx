'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_VILLAS } from '@/data/villas';
import { VillaCard } from '../villa/villaCard';

export function VillaRekomendasi() {
  return (
    <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & View All Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Villa Rekomendasi
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Pilihan villa dengan rating terbaik dari tamu.
            </p>
          </div>

          <Link
            href="/searchVilla"
            className="border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs px-5 py-2 rounded-full transition-colors self-start sm:self-auto"
          >
            Lihat Semua Villa
          </Link>
        </div>

        {/* Villa Cards 4-Column Grid matching photo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_VILLAS.slice(0, 4).map((villa) => (
            <VillaCard key={villa.id} villa={villa} />
          ))}
        </div>
      </div>
    </section>
  );
}
