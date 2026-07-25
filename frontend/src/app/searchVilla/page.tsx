'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_VILLAS } from '@/data/villas';
import { VillaFilter } from '@/types/villa';
import { VillaCard } from '@/components/villa/villaCard';
import { VillaFilterSidebar } from '@/components/villa/villaFilter';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';

function SearchVillaContent() {
  const searchParams = useSearchParams();
  const initialLocation = searchParams.get('location') || '';

  const [filter, setFilter] = useState<VillaFilter>({
    location: initialLocation || undefined,
    maxPrice: 10000000,
    sortBy: 'recommended',
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredVillas = useMemo(() => {
    return MOCK_VILLAS.filter((v) => {
      if (filter.location && v.area !== filter.location) return false;
      if (filter.maxPrice && v.pricePerNight > filter.maxPrice) return false;
      if (filter.minRating && v.rating < filter.minRating) return false;
      if (searchTerm && !v.title.toLowerCase().includes(searchTerm.toLowerCase()) && !v.location.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filter.amenities && filter.amenities.length > 0) {
        const hasAllAmenities = filter.amenities.every((a) => v.amenities.includes(a));
        if (!hasAllAmenities) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
      if (filter.sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
      if (filter.sortBy === 'rating-desc') return b.rating - a.rating;
      return 0; // recommended
    });
  }, [filter, searchTerm]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner & Search Input */}
      <div className="bg-[#0B3B36] text-white p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            Katalog Villa Bali
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Cari & Filter Private Pool Villa</h1>
          <p className="text-emerald-100/80 text-sm">
            {filter.location ? `Menampilkan villa di area ${filter.location}` : 'Semua pilihan villa terverifikasi di Bali'}
          </p>
        </div>

        {/* Quick Search Bar */}
        <div className="relative z-10 bg-white/95 backdrop-blur-md p-2 rounded-2xl flex items-center gap-3 text-slate-900 max-w-xl">
          <Search className="w-5 h-5 text-[#0D5C54] shrink-0 ml-3" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama villa atau lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm font-medium focus:outline-none bg-transparent py-2"
          />
        </div>
      </div>

      {/* Main Grid: Sidebar + Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1">
          <VillaFilterSidebar
            filter={filter}
            onFilterChange={setFilter}
            onReset={() => setFilter({ maxPrice: 10000000, sortBy: 'recommended' })}
          />
        </div>

        {/* Right Villa Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Controls: Result Count & Sort dropdown */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0D5C54]" />
              <span>Ditemukan <strong className="text-[#0D5C54]">{filteredVillas.length} Villa</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Urutkan:</span>
              <select
                value={filter.sortBy || 'recommended'}
                onChange={(e) => setFilter({ ...filter, sortBy: e.target.value as any })}
                className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="recommended">Rekomendasi Terbaik</option>
                <option value="price-asc">Harga Termurah</option>
                <option value="price-desc">Harga Tertinggi</option>
                <option value="rating-desc">Rating Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Villa Cards Grid */}
          {filteredVillas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredVillas.map((villa) => (
                <VillaCard key={villa.id} villa={villa} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl font-bold">
                🏝️
              </div>
              <h3 className="text-lg font-bold text-slate-900">Tidak ada villa yang cocok</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Coba ubah rentang harga atau kurangi filter fasilitas Anda untuk melihat pilihan villa lainnya.
              </p>
              <button
                onClick={() => setFilter({ maxPrice: 10000000, sortBy: 'recommended' })}
                className="bg-[#0D5C54] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm hover:bg-[#0A4842]"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchVillaPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 font-medium">Memuat katalog villa...</div>}>
      <SearchVillaContent />
    </Suspense>
  );
}
