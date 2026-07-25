'use client';

import React from 'react';
import Image from 'next/image';
import { MOCK_TESTIMONIALS } from '@/data/testimonials';
import { Quote } from 'lucide-react';

export function TestimonialSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kata mereka yang sudah menginap
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Ribuan tamu bahagia setiap bulannya. Berikut beberapa cerita mereka.
          </p>
        </div>

        {/* 3 Cards Grid matching photo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6 relative hover:shadow-md transition-shadow"
            >
              {/* Quote Icon */}
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0D5C54] flex items-center justify-center">
                <Quote className="w-4 h-4 fill-[#0D5C54]" />
              </div>

              {/* Comment text */}
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
                "{item.comment}"
              </p>

              {/* User Profile */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                  <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">{item.name}</h4>
                  <span className="text-[11px] text-slate-400 font-medium block">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
