'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MOCK_VILLAS } from '@/data/villas';
import { VillaCard } from '../villa/villaCard';
import { ArrowRight } from 'lucide-react';

export function VillaRekomendasi() {
  return (
    <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header & View All */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#0D5C54] uppercase tracking-widest bg-emerald-100/60 px-3 py-1 rounded-full">
              Pilihan Editor
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Villa Rekomendasi Terbaik
            </h2>
            <p className="text-slate-600 text-sm">
              Koleksi villa private pool favorit tamu dengan ulasan tertinggi di Bali.
            </p>
          </div>

          <Link
            href="/searchVilla"
            className="inline-flex items-center gap-2 text-[#0D5C54] hover:text-[#0A4842] font-bold text-sm group"
          >
            <span>Lihat Semua Villa</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Villa Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_VILLAS.slice(0, 3).map((villa, idx) => (
            <motion.div
              key={villa.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <VillaCard villa={villa} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
