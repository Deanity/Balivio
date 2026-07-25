'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Villa } from '@/types/villa';
import { formatCurrency } from '@/lib/formatCurrency';
import { MapPin, Users, Bed, Bath, Wifi, Heart, Star } from 'lucide-react';

interface VillaCardProps {
  villa: Villa;
  showBadge?: boolean;
}

export function VillaCard({ villa, showBadge = true }: VillaCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={villa.images[0]}
          alt={villa.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Top-Left */}
        {showBadge && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            {villa.discountPercentage && (
              <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                {villa.discountPercentage}
              </span>
            )}
            {villa.isPromo && (
              <span className="bg-[#0D5C54] text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                PROMO
              </span>
            )}
            {villa.isBestSeller && (
              <span className="bg-[#0D5C54] text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                BEST SELLER
              </span>
            )}
            {villa.isPremium && (
              <span className="bg-slate-900 text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                PREMIUM
              </span>
            )}
          </div>
        )}

        {/* Wishlist Heart Top-Right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          suppressHydrationWarning
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-red-500 transition-colors shadow-sm"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
        <div className="space-y-1">
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2">
            <Link href={`/villa/${villa.slug}`}>
              <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#0D5C54] transition-colors line-clamp-1">
                {villa.title}
              </h3>
            </Link>
            <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-bold text-[#0D5C54] shrink-0">
              <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
              <span>{villa.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{villa.location}</span>
          </div>
        </div>

        {/* Specs Line with Icons */}
        <div className="flex items-center gap-3 text-slate-500 text-[11px] font-medium pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-slate-400" />
            <span>{villa.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-slate-400" />
            <span>{villa.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{villa.maxGuests} Tamu</span>
          </div>
          <div className="flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-slate-400" />
            <span>Wifi</span>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="flex items-end justify-between pt-3 border-t border-slate-100">
          <div className="flex flex-col">
            {villa.originalPricePerNight && (
              <span className="text-[10px] text-slate-400 line-through font-medium">
                {formatCurrency(villa.originalPricePerNight)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-slate-900 text-base">
                {formatCurrency(villa.pricePerNight)}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">/ malam</span>
            </div>
          </div>

          <Link
            href={`/villa/${villa.slug}`}
            className="bg-[#0D5C54] hover:bg-[#0A4842] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
