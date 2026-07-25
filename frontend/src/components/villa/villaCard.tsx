import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Villa } from '@/types/villa';
import { RatingBadge } from '../shared/ratingBadge';
import { PriceTag } from '../shared/priceTag';
import { MapPin, Users, Bed, Sparkles } from 'lucide-react';

interface VillaCardProps {
  villa: Villa;
  showBadge?: boolean;
}

export function VillaCard({ villa, showBadge = true }: VillaCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={villa.images[0]}
          alt={villa.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        {showBadge && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {villa.isPromo && (
              <span className="bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                Promo Special
              </span>
            )}
            {villa.isBestSeller && (
              <span className="bg-amber-500 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Best Seller
              </span>
            )}
            {villa.isPremium && (
              <span className="bg-slate-900/90 text-amber-300 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">
                Premium
              </span>
            )}
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-10 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
          <RatingBadge rating={villa.rating} reviewCount={villa.reviewCount} showReviewsText={false} />
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
        <div>
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#0D5C54] shrink-0" />
            <span>{villa.location}</span>
          </div>
          <Link href={`/villa/${villa.slug}`}>
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#0D5C54] transition-colors line-clamp-1">
              {villa.title}
            </h3>
          </Link>
          <p className="text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed">
            {villa.tagline}
          </p>
        </div>

        {/* Specifications */}
        <div className="flex items-center gap-4 text-slate-600 text-xs pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-slate-400" />
            <span>{villa.bedrooms} Kamar</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-slate-400" />
            <span>Maks {villa.maxGuests} Tamu</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2">
          <PriceTag pricePerNight={villa.pricePerNight} originalPricePerNight={villa.originalPricePerNight} size="md" />
          <Link
            href={`/villa/${villa.slug}`}
            className="bg-[#0D5C54] hover:bg-[#0A4842] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors shadow-sm"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
