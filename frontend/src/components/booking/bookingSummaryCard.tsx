'use client';

import React from 'react';
import Image from 'next/image';
import { Villa } from '@/types/villa';
import { formatCurrency } from '@/lib/formatCurrency';

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
  variant = 'detail',
}: BookingSummaryCardProps) {

  const formatDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return dateStr;
    }
  };

  const taxFee = 930000;
  const calculatedTotal = subtotal + serviceFee + taxFee - discount;

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
            <span className="font-semibold text-slate-900">{formatDisplayDate(checkIn)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Check-out</span>
            <span className="font-semibold text-slate-900">{formatDisplayDate(checkOut)}</span>
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
            <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Biaya layanan</span>
            <span className="font-semibold text-slate-900">{formatCurrency(serviceFee)}</span>
          </div>
          <div className="flex justify-between">
            <span>Pajak</span>
            <span className="font-semibold text-slate-900">{formatCurrency(taxFee)}</span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
          <span className="font-extrabold text-slate-900 text-sm">Total</span>
          <span className="text-base font-black text-[#0D5C54]">
            {formatCurrency(calculatedTotal)}
          </span>
        </div>
      </div>
    );
  }

  // Detail Variant matching Villa Detail page
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

      {/* Price Calculation Breakdown */}
      <div className="space-y-2.5 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Subtotal ({nights} malam)</span>
          <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>Biaya layanan</span>
          <span className="font-medium text-slate-900">{formatCurrency(serviceFee)}</span>
        </div>

        <div className="flex justify-between">
          <span>Pajak</span>
          <span className="font-medium text-slate-900">{formatCurrency(123000)}</span>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
          <span className="font-bold text-slate-900">Total</span>
          <span className="text-lg font-black text-[#0D5C54]">
            {formatCurrency(subtotal + serviceFee + 123000)}
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
