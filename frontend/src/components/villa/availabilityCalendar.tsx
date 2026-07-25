'use client';

import React from 'react';

interface AvailabilityCalendarProps {
  onDateSelect?: (checkIn: string, checkOut: string) => void;
}

export function AvailabilityCalendar({ onDateSelect }: AvailabilityCalendarProps) {
  // Calendar matrix days matching reference photo
  const daysOfWeek = ['Su', 'Mo', 'Th', 'We', 'Th', 'Fr', 'Sa'];

  const calendarDays = [
    28, 29, 1, 2, 3, 5, 6,
    7, 8, 9, 10, 11, 12, 13,
    14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27,
    28, 29, 30, 31, 1, 2, 3
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
        Ketersediaan
      </h2>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 max-w-xl">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-extrabold text-slate-700 pb-2">
          {daysOfWeek.map((day, idx) => (
            <div key={idx} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-2.5">
          {calendarDays.map((dayNum, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                if (onDateSelect) {
                  onDateSelect('2026-07-12', '2026-07-15');
                }
              }}
              suppressHydrationWarning
              className="bg-[#E6F7F4] hover:bg-[#D3F1EC] text-[#0D5C54] font-extrabold text-xs py-3.5 rounded-2xl text-center transition-colors shadow-2xs"
            >
              {dayNum}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
