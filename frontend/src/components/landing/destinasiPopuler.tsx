'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_DESTINATIONS } from '@/data/destinations';
import { useAuth } from '@/context/AuthContext';

export function DestinasiPopuler() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const getTargetUrl = (path: string) => {
    return isLoggedIn ? path : `/login?redirect=${encodeURIComponent(path)}`;
  };

  const handleNavigate = (path: string) => (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push(getTargetUrl(path));
    }
  };

  return (
    <section id="destinasi" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & View All */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Destinasi Populer
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Area favorit para traveler di Pulau Dewata.
            </p>
          </div>

          <Link
            href={getTargetUrl('/dashboard?tab=search')}
            onClick={handleNavigate('/dashboard?tab=search')}
            className="text-[#0D5C54] hover:underline font-bold text-xs flex items-center gap-1"
          >
            <span>Lihat semua →</span>
          </Link>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_DESTINATIONS.map((dest) => {
            const destPath = `/dashboard?tab=search&location=${encodeURIComponent(dest.name)}`;
            const targetUrl = getTargetUrl(destPath);

            return (
              <Link
                key={dest.id}
                href={targetUrl}
                onClick={handleNavigate(destPath)}
                className="group relative block aspect-[4/5] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-slate-900"
              >
                {/* Background Image */}
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                {/* Card Contents */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white z-10 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest block">
                    {dest.popularTagline}
                  </span>
                  <h3 className="text-2xl font-extrabold text-white">{dest.name}</h3>
                  <span className="text-xs text-emerald-300 font-medium block">
                    {dest.villaCount} Villa Tersedia
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
