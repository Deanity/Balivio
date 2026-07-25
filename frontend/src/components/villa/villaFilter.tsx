'use client';

import React from 'react';
import { VillaFilter } from '@/types/villa';
import { Filter, RotateCcw } from 'lucide-react';

interface VillaFilterSidebarProps {
  filter: VillaFilter;
  onFilterChange: (newFilter: VillaFilter) => void;
  onReset: () => void;
}

export function VillaFilterSidebar({ filter, onFilterChange, onReset }: VillaFilterSidebarProps) {
  const locations = ['Canggu', 'Ubud', 'Seminyak', 'Uluwatu'];
  const amenitiesList = ['Private Swimming Pool', 'Free Breakfast Daily', 'Infinity Pool', 'High-Speed Wi-Fi', 'Beach View'];

  const handleLocationToggle = (loc: string) => {
    onFilterChange({
      ...filter,
      location: filter.location === loc ? undefined : loc,
    });
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Filter className="w-4 h-4 text-[#0D5C54]" />
          <span>Filter Pencarian</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Area Location Filter */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Area Lokasi Bali
        </label>
        <div className="flex flex-wrap gap-2">
          {locations.map((loc) => {
            const isSelected = filter.location === loc;
            return (
              <button
                key={loc}
                onClick={() => handleLocationToggle(loc)}
                className={`text-xs font-medium px-3 py-2 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-[#0D5C54] text-white shadow-sm font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Maksimal Harga Per Malam
        </label>
        <input
          type="range"
          min="1000000"
          max="10000000"
          step="500000"
          value={filter.maxPrice || 10000000}
          onChange={(e) => onFilterChange({ ...filter, maxPrice: Number(e.target.value) })}
          className="w-full accent-[#0D5C54] cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>Rp 1 Jt</span>
          <span className="font-bold text-[#0D5C54]">
            s/d Rp {((filter.maxPrice || 10000000) / 1000000).toFixed(1)} Jt
          </span>
          <span>Rp 10 Jt</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Rating Minimum
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[4.5, 4.8, 4.9].map((ratingVal) => (
            <button
              key={ratingVal}
              onClick={() =>
                onFilterChange({
                  ...filter,
                  minRating: filter.minRating === ratingVal ? undefined : ratingVal,
                })
              }
              className={`text-xs font-medium py-2 rounded-xl border text-center transition-all ${
                filter.minRating === ratingVal
                  ? 'border-[#0D5C54] bg-emerald-50 text-[#0D5C54] font-bold'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              ⭐ {ratingVal}+
            </button>
          ))}
        </div>
      </div>

      {/* Key Amenities */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Fasilitas Populer
        </label>
        <div className="space-y-2">
          {amenitiesList.map((item) => (
            <label key={item} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                className="rounded text-[#0D5C54] focus:ring-[#0D5C54]"
                checked={filter.amenities?.includes(item) || false}
                onChange={(e) => {
                  const currentList = filter.amenities || [];
                  const updated = e.target.checked
                    ? [...currentList, item]
                    : currentList.filter((a) => a !== item);
                  onFilterChange({ ...filter, amenities: updated });
                }}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
