'use client';

import React from 'react';
import { Tag, RotateCcw, ShieldCheck, Headset } from 'lucide-react';

export function WhyBalivio() {
  const features = [
    {
      icon: Tag,
      title: 'Harga Terbaik',
      description: 'Jaminan harga paling kompetitif untuk setiap villa di Bali.',
    },
    {
      icon: RotateCcw,
      title: 'Free Cancellation',
      description: 'Batalkan gratis hingga hari yang telah ditentukan.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Villa',
      description: 'Setiap villa dikurasi & diverifikasi tim lokal kami.',
    },
    {
      icon: Headset,
      title: '24/7 Support',
      description: 'Tim support siap membantumu kapan pun dibutuhkan.',
    },
  ];

  return (
    <section id="mengapa" className="py-16 sm:py-20 lg:py-24 bg-[#FBFBFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kenapa pilih Balivio?
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Pengalaman booking villa tanpa ribet. Transparan, aman, dan didukung tim lokal dari awal sampai check-out.
          </p>
        </div>

        {/* 4 Cards Grid matching photo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/60 text-[#0D5C54] flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5 text-[#0D5C54]" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
