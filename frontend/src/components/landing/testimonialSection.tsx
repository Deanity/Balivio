'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MOCK_TESTIMONIALS } from '@/data/testimonials';
import { Star, Quote } from 'lucide-react';

export function TestimonialSection() {
  return (
    <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-14">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#0D5C54] uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
            Kata Tamu Kami
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pengalaman Menginap Istimewa
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Cerita nyata dari para traveler yang telah menemukan villa liburan impian mereka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_TESTIMONIALS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between relative space-y-6"
            >
              <Quote className="w-10 h-10 text-emerald-100 absolute top-6 right-6" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0">
                  <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                  <span className="text-xs text-[#0D5C54] font-medium block">{item.role}</span>
                  <span className="text-[11px] text-slate-400 block">{item.villaStayed}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
