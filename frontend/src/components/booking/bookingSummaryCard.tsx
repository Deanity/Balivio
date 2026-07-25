import React from 'react';
import Image from 'next/image';
import { Villa } from '@/types/villa';
import { formatCurrency } from '@/lib/formatCurrency';
import { RatingBadge } from '../shared/ratingBadge';
import { MapPin, Calendar, Users, ShieldCheck } from 'lucide-react';

interface BookingSummaryCardProps {
  villa: Villa;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  subtotal: number;
  serviceFee: number;
  discount: number;
  totalPrice: number;
  onProceed?: () => void;
  buttonLabel?: string;
  isSticky?: boolean;
}

export function BookingSummaryCard({
  villa,
  checkIn,
  checkOut,
  nights,
  guests,
  subtotal,
  serviceFee,
  discount,
  totalPrice,
  onProceed,
  buttonLabel = 'Lanjut ke Booking',
  isSticky = false,
}: BookingSummaryCardProps) {
  return (
    <div
      className={`bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-6 ${
        isSticky ? 'sticky top-24' : ''
      }`}
    >
      {/* Villa Mini Header */}
      <div className="flex gap-4 pb-5 border-b border-slate-100">
        <div className="relative w-24 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
          <Image src={villa.images[0]} alt={villa.title} fill className="object-cover" />
        </div>
        <div className="space-y-1">
          <RatingBadge rating={villa.rating} reviewCount={villa.reviewCount} />
          <h4 className="font-bold text-slate-900 text-base line-clamp-1">{villa.title}</h4>
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#0D5C54]" />
            <span>{villa.area}, Bali</span>
          </div>
        </div>
      </div>

      {/* Stay Details */}
      <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-xs">
        <div className="flex justify-between items-center text-slate-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0D5C54]" />
            <span>Tanggal Stay:</span>
          </div>
          <span className="font-semibold text-slate-900">
            {checkIn} - {checkOut} ({nights} Malam)
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-700 pt-2 border-t border-slate-200/60">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0D5C54]" />
            <span>Jumlah Tamu:</span>
          </div>
          <span className="font-semibold text-slate-900">{guests} Tamu</span>
        </div>
      </div>

      {/* Price Calculation Breakdown */}
      <div className="space-y-2.5 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>
            {formatCurrency(villa.pricePerNight)} x {nights} malam
          </span>
          <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>Biaya Layanan & Kebersihan</span>
          <span className="font-medium text-slate-900">{formatCurrency(serviceFee)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <span>Diskon Promo Special</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
          <span className="text-sm font-bold text-slate-900">Total Pembayaran</span>
          <span className="text-xl font-extrabold text-[#0D5C54]">
            {formatCurrency(totalPrice)}
          </span>
        </div>
      </div>

      {/* Action Button */}
      {onProceed && (
        <button
          onClick={onProceed}
          className="w-full bg-[#0D5C54] hover:bg-[#0A4842] text-white py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all text-center block"
        >
          {buttonLabel}
        </button>
      )}

      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Garansi Booking Langsung & Bebas Penipuan</span>
      </div>
    </div>
  );
}
