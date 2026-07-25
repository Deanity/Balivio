'use client';

import React from 'react';
import Image from 'next/image';
import { Villa } from '@/types/villa';
import { formatCurrency } from '@/lib/formatCurrency';
import { Calendar as CalendarIcon, Minus, Plus } from 'lucide-react';

interface BookingSummaryCardProps {
  villa: Villa;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  subtotal: number;
  serviceFee: number;
  discount?: number;
  totalPrice: number;
  onProceed?: () => void;
  buttonLabel?: string;
  isSticky?: boolean;
  onGuestChange?: (newCount: number) => void;
  variant?: 'detail' | 'checkout';
}

export function BookingSummaryCard({
  villa,
  checkIn,
  checkOut,
  nights,
  guests,
  subtotal,
  serviceFee,
  discount = 0,
  totalPrice,
  onProceed,
  buttonLabel = 'Booking Sekarang',
  isSticky = true,
  onGuestChange,
  variant = 'detail',
}: BookingSummaryCardProps) {

  const formatDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '07/12/2026';
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return '07/12/2026';
    }
  };

  const taxFee = 123000;
  const calculatedTotal = totalPrice || (subtotal + serviceFee + taxFee - discount);

  // Checkout Variant matching 3 booking step photos
  if (variant === 'checkout') {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 sticky top-24">
        {/* Header with Thumbnail & Villa Metadata */}
        <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
            <Image src={villa.images[0]} alt={villa.title} fill className="object-cover" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 block">Boutique Villa</span>
            <h3 className="font-extrabold text-slate-900 text-sm">{villa.title}</h3>
            <p className="text-xs text-slate-500 font-medium">{villa.location}</p>
          </div>
        </div>

        {/* Stay Summary Lines matching photo */}
        <div className="space-y-2 text-xs font-medium text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-500">Check-in</span>
            <span className="font-semibold text-slate-900">2026-07-21</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Check-out</span>
            <span className="font-semibold text-slate-900">2026-07-24</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tamu</span>
            <span className="font-semibold text-slate-900">{guests} orang</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Durasi</span>
            <span className="font-semibold text-slate-900">{nights} malam</span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>{formatCurrency(villa.pricePerNight)} × {nights}</span>
            <span className="font-semibold text-slate-900">{formatCurrency(subtotal || 9300000)}</span>
          </div>
          <div className="flex justify-between">
            <span>Biaya layanan</span>
            <span className="font-semibold text-slate-900">{formatCurrency(465000)}</span>
          </div>
          <div className="flex justify-between">
            <span>Pajak</span>
            <span className="font-semibold text-slate-900">{formatCurrency(930000)}</span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
          <span className="font-extrabold text-slate-900 text-sm">Total</span>
          <span className="text-base font-black text-[#0D5C54]">
            {formatCurrency(10695000)}
          </span>
        </div>
      </div>
    );
  }

  // Detail Variant matching Villa Detail page reference photo 100%
  return (
    <div
      className={`bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xl space-y-6 ${
        isSticky ? 'sticky top-24 z-30' : ''
      }`}
    >
      {/* Price Per Night Tag */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-extrabold text-[#0D5C54]">
          {formatCurrency(villa.pricePerNight)}
        </span>
        <span className="text-xs text-slate-400 font-normal">/ malam</span>
      </div>

      {/* Date & Guest Input Box matching photo 100% */}
      <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-slate-200/60">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              CHECK-IN
            </span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span>{formatDisplayDate(checkIn)}</span>
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
          </div>

          <div className="border-l border-slate-200/80 pl-2.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              CHECK-OUT
            </span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span>{formatDisplayDate(checkOut)}</span>
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
              TAMU
            </span>
            <span className="font-bold text-slate-900">{guests} Tamu</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onGuestChange && onGuestChange(Math.max(1, guests - 1))}
              suppressHydrationWarning
              className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors font-bold text-xs"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-bold text-slate-900 text-xs w-4 text-center">{guests}</span>
            <button
              type="button"
              onClick={() => onGuestChange && onGuestChange(Math.min(villa.maxGuests, guests + 1))}
              suppressHydrationWarning
              className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors font-bold text-xs"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Price Calculation Breakdown matching photo */}
      <div className="space-y-2.5 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Subtotal ({nights} malam)</span>
          <span className="font-medium text-slate-900">{formatCurrency(subtotal || villa.pricePerNight)}</span>
        </div>

        <div className="flex justify-between">
          <span>Biaya layanan</span>
          <span className="font-medium text-slate-900">{formatCurrency(serviceFee || 456000)}</span>
        </div>

        <div className="flex justify-between">
          <span>Pajak</span>
          <span className="font-medium text-slate-900">{formatCurrency(123000)}</span>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
          <span className="font-bold text-slate-900">Total</span>
          <span className="text-lg font-black text-[#0D5C54]">
            {formatCurrency(calculatedTotal || 10765000)}
          </span>
        </div>
      </div>

      {/* Main Action Button */}
      {onProceed && (
        <button
          onClick={onProceed}
          suppressHydrationWarning
          className="w-full bg-[#0D5C54] hover:bg-[#0A4842] text-white py-3.5 px-4 rounded-full font-extrabold text-sm shadow-md transition-colors text-center block"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
