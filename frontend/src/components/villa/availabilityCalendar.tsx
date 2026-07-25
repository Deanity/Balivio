'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

interface AvailabilityCalendarProps {
  onDateSelect?: (checkIn: string, checkOut: string) => void;
}

export function AvailabilityCalendar({ onDateSelect }: AvailabilityCalendarProps) {
  const [selectedDates, setSelectedDates] = useState({
    checkIn: '2026-08-10',
    checkOut: '2026-08-13',
  });

  const handleSelect = (checkIn: string, checkOut: string) => {
    setSelectedDates({ checkIn, checkOut });
    if (onDateSelect) {
      onDateSelect(checkIn, checkOut);
    }
  };

  return (
    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <CalendarIcon className="w-5 h-5 text-[#0D5C54]" />
          <span>Kalender Ketersediaan Tanggal</span>
        </div>
        <span className="text-xs text-emerald-800 bg-emerald-100 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#0D5C54]" /> Kuota Agustus Tersedia
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Check-In
          </label>
          <input
            type="date"
            value={selectedDates.checkIn}
            onChange={(e) => handleSelect(e.target.value, selectedDates.checkOut)}
            className="w-full text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
          />
        </div>
        <div className="border-l border-slate-200 pl-3">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Check-Out
          </label>
          <input
            type="date"
            value={selectedDates.checkOut}
            onChange={(e) => handleSelect(selectedDates.checkIn, e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
          />
        </div>
      </div>
      <p className="text-xs text-slate-500 italic">
        *Minimal menginap 1 malam. Harga diskon otomatis dihitung di rincian booking.
      </p>
    </div>
  );
}
