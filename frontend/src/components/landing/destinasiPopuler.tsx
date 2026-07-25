'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MOCK_DESTINATIONS } from '@/data/destinations';
import { ArrowUpRight } from 'lucide-react';

export function DestinasiPopuler() {
  return (
    <section id="destinasi" className="py-20 bg-slate-50/60 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#0D5C54] uppercase tracking-widest bg-emerald-100/60 px-3 py-1 rounded-full">
            Eksplor Bali
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Destinasi Populer Favorit
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Pilih area liburan terbaik di Bali yang sesuai dengan gaya & kenyamanan Anda.
          </p>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_DESTINATIONS.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                href={`/searchVilla?location=${dest.name}`}
                className="group relative block aspect-[3/4] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                {/* Background Image */}
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent transition-opacity" />

                {/* Card Info */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
                  <div className="flex justify-end">
                    <span className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#0D5C54] transition-colors">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                      {dest.popularTagline}
                    </span>
                    <h3 className="text-2xl font-bold text-white">{dest.name}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>
                    <div className="pt-2 text-xs font-semibold text-emerald-400">
                      {dest.villaCount}+ Villa Tersedia
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
