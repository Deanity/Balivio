'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tag, ShieldCheck, CheckCircle2, Headset } from 'lucide-react';

export function WhyBalivio() {
  const features = [
    {
      icon: Tag,
      title: 'Jaminan Harga Terbaik',
      description: 'Dapatkan penawaran harga sewa villa transparan tanpa biaya tersembunyi.',
    },
    {
      icon: ShieldCheck,
      title: '100% Villa Terverifikasi',
      description: 'Setiap villa dipastikan keaslian foto, kebersihan, dan fasilitas oleh tim lokal.',
    },
    {
      icon: CheckCircle2,
      title: 'Free Cancellation',
      description: 'Fleksibilitas pembatalan gratis hingga 7 hari sebelum tanggal check-in.',
    },
    {
      icon: Headset,
      title: 'Layanan Bantuan 24/7',
      description: 'Tim concierge siap membantu kebutuhan Anda selama tinggal di Bali.',
    },
  ];

  return (
    <section id="mengapa" className="py-20 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            Kenapa Balivio
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Standar Baru Booking Villa di Bali
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Kami hadir memberikan jaminan kenyamanan dan kualitas terbaik untuk setiap detik liburan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-800/60 border border-slate-700/60 p-8 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0D5C54] text-emerald-300 flex items-center justify-center font-bold">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
