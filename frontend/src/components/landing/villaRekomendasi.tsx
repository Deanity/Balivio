'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_VILLAS } from '@/data/villas';
import { VillaCard } from '../villa/villaCard';
import { useAuth } from '@/context/AuthContext';

export function VillaRekomendasi() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const searchUrl = '/dashboard?tab=search';
  const targetUrl = isLoggedIn ? searchUrl : `/login?redirect=${encodeURIComponent(searchUrl)}`;

  const handleNavigate = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push(targetUrl);
    }
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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
            href={targetUrl}
            onClick={handleNavigate}
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
