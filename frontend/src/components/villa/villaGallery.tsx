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

  // Fallback to repeating images if less than 5
  const displayImages = images.length >= 5 ? images : [...images, ...images, ...images].slice(0, 5);

  return (
    <div className="relative">
      {/* Grid Layout matching photo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Main Big Photo with rounded-3xl */}
        <div className="relative aspect-[4/3] md:h-[400px] w-full rounded-3xl overflow-hidden bg-slate-100 group shadow-xs">
          <Image
            src={displayImages[0]}
            alt={`${title} 1`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            onClick={() => setIsOpenModal(true)}
          />
        </div>

        {/* Right Column: 2x2 Grid of 4 Thumbnails with rounded-2xl */}
        <div className="grid grid-cols-2 gap-4 h-[400px]">
          {displayImages.slice(1, 5).map((img, idx) => (
            <div
              key={idx}
              className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-100 group shadow-xs"
            >
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
      </div>

      {/* Lightbox Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-8 animate-in fade-in">
          <div className="flex justify-between items-center text-white mb-4">
            <h3 className="font-bold text-lg">{title} — Galeri Foto</h3>
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
