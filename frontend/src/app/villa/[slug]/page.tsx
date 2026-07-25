'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_VILLAS } from '@/data/villas';
import { VillaGallery } from '@/components/villa/villaGallery';
import { BookingSummaryCard } from '@/components/booking/bookingSummaryCard';
import { AvailabilityCalendar } from '@/components/villa/availabilityCalendar';
import { calculateNights } from '@/lib/formatDate';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  Star,
  Users,
  Bed,
  ShieldCheck,
  Calendar,
  Wifi,
  Waves,
  Wind,
  Coffee,
  Car,
  UtensilsCrossed,
  Dumbbell,
  Clock,
} from 'lucide-react';

export default function VillaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { isLoggedIn } = useAuth();

  const villa = MOCK_VILLAS.find((v) => v.slug === slug) || MOCK_VILLAS[0];

  const [checkIn, setCheckIn] = useState('2026-07-12');
  const [checkOut, setCheckOut] = useState('2026-07-15');
  const [guests, setGuests] = useState(2);

  const nights = calculateNights(checkIn, checkOut) || 3;
  const subtotal = villa.pricePerNight * nights;
  const serviceFee = 456000;
  const taxFee = 123000;
  const totalPrice = subtotal + serviceFee + taxFee;

  const handleProceedBooking = () => {
    const bookingUrl = `/booking?slug=${villa.slug}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(bookingUrl)}`);
    } else {
      router.push(bookingUrl);
    }
  };

  // Facility list mapping matching reference photo
  const facilities = [
    { icon: Waves, label: 'Private pool' },
    { icon: Wifi, label: 'Wifi' },
    { icon: Wind, label: 'AC' },
    { icon: Coffee, label: 'Breakfast' },
    { icon: Car, label: 'Parkir' },
    { icon: UtensilsCrossed, label: 'Dapur' },
    { icon: Dumbbell, label: 'Gym' },
  ];

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/dashboard" className="hover:text-[#0D5C54]">Beranda</Link>
        <span>/</span>
        <Link href="/dashboard?tab=search" className="hover:text-[#0D5C54]">Cari Villa</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">{villa.title}</span>
      </nav>

      {/* Villa Title & Meta Info Section */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {villa.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3.5 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1 text-slate-500">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{villa.location}</span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            <span>{villa.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-normal">• {villa.reviewCount} review</span>
          </div>

          <span className="bg-emerald-50 text-[#0D5C54] border border-emerald-200/60 font-extrabold text-xs px-3.5 py-1 rounded-full">
            Boutique Villa
          </span>
        </div>
      </div>

      {/* Gallery Section */}
      <VillaGallery title={villa.title} images={villa.images} />

      {/* Main Content & Sticky Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4 items-start">
        {/* Left Column: Details, Facilities, Rules, Availability */}
        <div className="lg:col-span-2 space-y-12">
          {/* Section 1: Tentang villa ini */}
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold text-slate-900">
              Tentang villa ini
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
              {villa.description ||
                'Retreat tropis di tengah rice terrace Tegallalang. Wake up dengan suara burung dan yoga deck di antara pepohonan.'}
            </p>

            {/* 3 Spec Cards matching photo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0D5C54] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-[#0D5C54]" />
                </div>
                <span className="font-extrabold text-xs text-slate-900">{villa.maxGuests} tamu</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0D5C54] flex items-center justify-center shrink-0">
                  <Bed className="w-4 h-4 text-[#0D5C54]" />
                </div>
                <span className="font-extrabold text-xs text-slate-900">{villa.bedrooms} kamar</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0D5C54] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#0D5C54]" />
                </div>
                <span className="font-extrabold text-xs text-slate-900">Free cancellation</span>
              </div>
            </div>
          </div>

          {/* Section 2: Fasilitas */}
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold text-slate-900">
              Fasilitas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl">
              {facilities.map((fac) => {
                const Icon = fac.icon;
                return (
                  <div
                    key={fac.label}
                    className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0D5C54] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#0D5C54]" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">{fac.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Kebijakan */}
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold text-slate-900">
              Kebijakan
            </h2>

            <div className="space-y-3 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                    CHECK-IN
                  </span>
                  <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900">
                    <Clock className="w-4 h-4 text-[#0D5C54]" />
                    <span>{villa.checkInTime || '15:00'}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                    CHECK-OUT
                  </span>
                  <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900">
                    <Clock className="w-4 h-4 text-[#0D5C54]" />
                    <span>{villa.checkOutTime || '12:00'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  CANCLELATION
                </span>
                <p className="text-xs font-semibold text-slate-700">
                  Free cancellation hingga 5 hari sebelum check-in
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Ketersediaan (Availability Matrix Calendar) */}
          <AvailabilityCalendar
            onDateSelect={(cIn, cOut) => {
              setCheckIn(cIn);
              setCheckOut(cOut);
            }}
          />
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-1 sticky top-24">
          <BookingSummaryCard
            villa={villa}
            checkIn={checkIn}
            checkOut={checkOut}
            nights={nights}
            guests={guests}
            subtotal={subtotal}
            serviceFee={serviceFee}
            discount={0}
            totalPrice={totalPrice}
            onProceed={handleProceedBooking}
            buttonLabel="Booking Sekarang"
            isSticky={true}
            onGuestChange={(c) => setGuests(c)}
          />
        </div>
      </div>
    </div>
  );
}
