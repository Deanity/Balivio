'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MOCK_VILLAS } from '@/data/villas';
import { VillaGallery } from '@/components/villa/villaGallery';
import { RatingBadge } from '@/components/shared/ratingBadge';
import { BookingSummaryCard } from '@/components/booking/bookingSummaryCard';
import { AvailabilityCalendar } from '@/components/villa/availabilityCalendar';
import { calculateNights } from '@/lib/formatDate';
import {
  MapPin,
  Bed,
  Users,
  Bath,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  ChevronRight,
} from 'lucide-react';

export default function VillaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const villa = MOCK_VILLAS.find((v) => v.slug === slug) || MOCK_VILLAS[0];

  const [checkIn, setCheckIn] = useState('2026-08-10');
  const [checkOut, setCheckOut] = useState('2026-08-13');
  const [guests, setGuests] = useState(2);

  const nights = calculateNights(checkIn, checkOut);
  const subtotal = villa.pricePerNight * nights;
  const serviceFee = 250000;
  const discount = villa.isPromo ? 350000 : 0;
  const totalPrice = subtotal + serviceFee - discount;

  const handleProceedBooking = () => {
    router.push(
      `/booking?slug=${villa.slug}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <a href="/" className="hover:text-[#0D5C54]">Beranda</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <a href="/searchVilla" className="hover:text-[#0D5C54]">Villa Bali</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">{villa.title}</span>
      </nav>

      {/* Villa Title & Header Info */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {villa.title}
          </h1>
          <RatingBadge rating={villa.rating} reviewCount={villa.reviewCount} />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5 text-[#0D5C54] font-semibold">
            <MapPin className="w-4 h-4" />
            <span>{villa.location}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-slate-400" />
            <span>{villa.bedrooms} Kamar Tidur</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-slate-400" />
            <span>{villa.bathrooms} Kamar Mandi</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-slate-400" />
            <span>Maks {villa.maxGuests} Tamu</span>
          </div>
        </div>
      </div>

      {/* Gallery Component */}
      <VillaGallery title={villa.title} images={villa.images} />

      {/* Main Grid: Left Details + Right Sticky Booking Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4">
        {/* Left Column: Description, Amenities, Host, Calendar, Reviews */}
        <div className="lg:col-span-2 space-y-10">
          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Tentang Villa Ini
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {villa.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Fasilitas Unggulan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {villa.amenities.map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0D5C54]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Availability Calendar Component */}
          <AvailabilityCalendar
            onDateSelect={(cIn, cOut) => {
              setCheckIn(cIn);
              setCheckOut(cOut);
            }}
          />

          {/* Host Profile Card */}
          <div className="bg-emerald-50/60 p-6 rounded-3xl border border-emerald-100 flex items-center gap-5">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 shrink-0">
              <Image src={villa.hostAvatar} alt={villa.hostName} fill className="object-cover" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D5C54]">Hosted by Superhost</span>
              <h3 className="font-bold text-slate-900 text-base">{villa.hostName}</h3>
              <p className="text-xs text-slate-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0D5C54]" /> {villa.hostResponseTime}
              </p>
            </div>
          </div>

          {/* Rules & Check-in info */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Kebijakan Menginap
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Waktu Check-In</span>
                <span className="text-slate-600">{villa.checkInTime}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Waktu Check-Out</span>
                <span className="text-slate-600">{villa.checkOutTime}</span>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside bg-slate-50 p-4 rounded-2xl">
              {villa.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>

          {/* Guest Reviews Section */}
          {villa.reviewsList && villa.reviewsList.length > 0 && (
            <div className="space-y-6 pt-4">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span>Ulasan Tamu</span>
                <RatingBadge rating={villa.rating} reviewCount={villa.reviewCount} />
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {villa.reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                        <Image src={rev.userAvatar} alt={rev.userName} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{rev.userName}</h4>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 text-xs italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Summary & Booking Trigger */}
        <div className="lg:col-span-1">
          <BookingSummaryCard
            villa={villa}
            checkIn={checkIn}
            checkOut={checkOut}
            nights={nights}
            guests={guests}
            subtotal={subtotal}
            serviceFee={serviceFee}
            discount={discount}
            totalPrice={totalPrice}
            onProceed={handleProceedBooking}
            buttonLabel="Lanjut Pembayaran Booking"
            isSticky={true}
          />
        </div>
      </div>
    </div>
  );
}
