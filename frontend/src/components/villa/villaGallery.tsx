'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Grid, X } from 'lucide-react';

interface VillaGalleryProps {
  title: string;
  images: string[];
}

export function VillaGallery({ title, images }: VillaGalleryProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <div>
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden shadow-sm relative">
        {/* Main Big Photo */}
        <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto md:h-[420px] bg-slate-100 group overflow-hidden">
          <Image
            src={images[0]}
            alt={`${title} 1`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            onClick={() => setIsOpenModal(true)}
          />
        </div>

        {/* Side Thumbnails */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-[420px]">
          {images.slice(1, 5).map((img, idx) => (
            <div key={idx} className="relative w-full h-full bg-slate-100 group overflow-hidden">
              <Image
                src={img}
                alt={`${title} ${idx + 2}`}
                fill
                sizes="25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                onClick={() => setIsOpenModal(true)}
              />
            </div>
          ))}
        </div>

        {/* View All Photos Button */}
        <button
          onClick={() => setIsOpenModal(true)}
          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-slate-900 text-xs font-bold px-4 py-2.5 rounded-2xl shadow-lg backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105"
        >
          <Grid className="w-4 h-4 text-[#0D5C54]" />
          <span>Lihat Semua Foto ({images.length})</span>
        </button>
      </div>

      {/* Modal Lightbox */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-8 animate-in fade-in">
          <div className="flex justify-between items-center text-white mb-4">
            <h3 className="font-bold text-lg">{title} - Galeri Foto</h3>
            <button
              onClick={() => setIsOpenModal(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800">
                <Image src={img} alt={`Foto ${idx + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
