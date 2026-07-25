'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_VILLAS } from '@/data/villas';
import { BookingSummaryCard } from '@/components/booking/bookingSummaryCard';
import { formatCurrency } from '@/lib/formatCurrency';
import { useAuth } from '@/context/AuthContext';
import {
  Check,
  Building,
  CreditCard,
  Wallet,
  Download,
} from 'lucide-react';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const slug = searchParams.get('slug') || 'ubud-jungle-retreat';
  const checkIn = searchParams.get('checkIn') || '2026-07-21';
  const checkOut = searchParams.get('checkOut') || '2026-07-24';
  const guestsParam = searchParams.get('guests');
  const guests = guestsParam ? parseInt(guestsParam, 10) : 2;

  const villa = MOCK_VILLAS.find((v) => v.slug === slug) || MOCK_VILLAS[0];

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states matching Step 1 screenshot
  const [customer, setCustomer] = useState({
    fullName: user?.name || 'Dendra De Tama',
    email: user?.email || 'dendradetama2@gmail.com',
    phone: '+6281239021528',
    specialRequests: 'Late check-in, early breakfast...',
  });

  // Payment method selection matching Step 2 screenshot
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'card' | 'wallet'>('bank');

  const nights = 3;
  const subtotal = 9300000;
  const serviceFee = 465000;
  const taxFee = 930000;
  const totalPrice = 10695000;
  const bookingCode = 'BK-Y72J7X';

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Top 3-Step Progress Header matching photo */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-xs max-w-4xl mx-auto">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          {/* Step 1 */}
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-colors ${
                step > 1
                  ? 'bg-[#0D5C54] text-white'
                  : step === 1
                  ? 'bg-[#0D5C54] text-white ring-4 ring-emerald-100'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className={step === 1 ? 'text-slate-900 font-extrabold' : step > 1 ? 'text-[#0D5C54]' : ''}>
              Ringkasan & Data Diri
            </span>
          </div>

          <div className={`flex-1 h-0.5 mx-4 transition-colors ${step >= 2 ? 'bg-[#0D5C54]' : 'bg-slate-200'}`} />

          {/* Step 2 */}
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-colors ${
                step > 2
                  ? 'bg-[#0D5C54] text-white'
                  : step === 2
                  ? 'bg-[#0D5C54] text-white ring-4 ring-emerald-100'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <span className={step === 2 ? 'text-slate-900 font-extrabold' : step > 2 ? 'text-[#0D5C54]' : ''}>
              Pembayaran
            </span>
          </div>

          <div className={`flex-1 h-0.5 mx-4 transition-colors ${step >= 3 ? 'bg-[#0D5C54]' : 'bg-slate-200'}`} />

          {/* Step 3 */}
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-colors ${
                step === 3
                  ? 'bg-[#0D5C54] text-white ring-4 ring-emerald-100'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              3
            </div>
            <span className={step === 3 ? 'text-slate-900 font-extrabold' : ''}>
              Konfirmasi
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Form Card + Right Villa Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: Ringkasan & Data Diri */}
          {step === 1 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
              <h2 className="text-xl font-extrabold text-slate-900">
                Data Pemesan
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">Nama Lengkap</label>
                  <input
                    type="text"
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    suppressHydrationWarning
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-[#EEF4FF]/50 focus:outline-none focus:border-[#0D5C54] font-medium text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">Email</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    suppressHydrationWarning
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0D5C54] font-medium text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">No. HP</label>
                  <input
                    type="text"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    suppressHydrationWarning
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0D5C54] font-medium text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">Catatan (opsional)</label>
                  <input
                    type="text"
                    placeholder="Late check-in, early breakfast..."
                    value={customer.specialRequests}
                    onChange={(e) => setCustomer({ ...customer, specialRequests: e.target.value })}
                    suppressHydrationWarning
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0D5C54] text-slate-900 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/villa/${villa.slug}`}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900"
                >
                  ← Kembali
                </Link>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  suppressHydrationWarning
                  className="bg-[#0D5C54] hover:bg-[#0A4842] text-white px-7 py-3 rounded-full font-extrabold text-xs shadow-md transition-colors"
                >
                  Lanjut ke Pembayaran
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Metode Pembayaran */}
          {step === 2 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
              <h2 className="text-xl font-extrabold text-slate-900">
                Metode Pembayaran
              </h2>

              <div className="space-y-3">
                {/* Option 1: Transfer Bank */}
                <div
                  onClick={() => setSelectedMethod('bank')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedMethod === 'bank'
                      ? 'bg-[#F1F7F6] border-2 border-[#0D5C54]'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#0D5C54] text-white flex items-center justify-center shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">Transfer Bank</h4>
                      <p className="text-[11px] text-slate-500">BCA, Mandiri, BRI, BNI</p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'bank' ? 'border-[#0D5C54]' : 'border-slate-300'
                    }`}
                  >
                    {selectedMethod === 'bank' && <div className="w-2.5 h-2.5 rounded-full bg-[#0D5C54]" />}
                  </div>
                </div>

                {/* Option 2: Kartu Kredit / Debit */}
                <div
                  onClick={() => setSelectedMethod('card')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedMethod === 'card'
                      ? 'bg-[#F1F7F6] border-2 border-[#0D5C54]'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">Kartu Kredit / Debit</h4>
                      <p className="text-[11px] text-slate-500">Visa, Mastercard, JCB</p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'card' ? 'border-[#0D5C54]' : 'border-slate-300'
                    }`}
                  >
                    {selectedMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#0D5C54]" />}
                  </div>
                </div>

                {/* Option 3: E-Wallet */}
                <div
                  onClick={() => setSelectedMethod('wallet')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedMethod === 'wallet'
                      ? 'bg-[#F1F7F6] border-2 border-[#0D5C54]'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">E-Wallet</h4>
                      <p className="text-[11px] text-slate-500">GoPay, OVO, DANA, ShopeePay</p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'wallet' ? 'border-[#0D5C54]' : 'border-slate-300'
                    }`}
                  >
                    {selectedMethod === 'wallet' && <div className="w-2.5 h-2.5 rounded-full bg-[#0D5C54]" />}
                  </div>
                </div>

                {/* Virtual Account Info Box matching photo */}
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-1 mt-4">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                    <Building className="w-4 h-4 text-[#0D5C54]" />
                    <span>BCA Virtual Account</span>
                  </div>
                  <p className="text-xl font-black text-slate-900 tracking-wider">
                    8808 0000000727
                  </p>
                  <p className="text-xs text-slate-500">
                    Selesaikan pembayaran dalam 1 jam.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900"
                >
                  ← Kembali
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  suppressHydrationWarning
                  className="bg-[#0D5C54] hover:bg-[#0A4842] text-white px-7 py-3 rounded-full font-extrabold text-xs shadow-md transition-colors"
                >
                  Bayar {formatCurrency(totalPrice)}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Konfirmasi / Booking Berhasil */}
          {step === 3 && (
            <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-xs text-center space-y-6 animate-in fade-in">
              {/* Success Checkmark Circle */}
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#0D5C54] flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Booking Berhasil!
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Terima kasih {customer.fullName}. E-voucher telah dikirim ke email{' '}
                  <span className="font-bold text-slate-700">{customer.email}</span>.
                </p>
              </div>

              {/* Voucher Box matching photo */}
              <div className="bg-slate-50/80 rounded-3xl p-6 text-left border border-slate-200/80 space-y-4 max-w-lg mx-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                      BOOKING ID
                    </span>
                    <span className="text-base font-extrabold text-slate-900 tracking-wider">
                      {bookingCode}
                    </span>
                  </div>
                  <span className="bg-[#BFF038] text-slate-900 font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase">
                    PAID
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                      VILLA
                    </span>
                    <span className="font-extrabold text-slate-900">{villa.title}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                      LOKASI
                    </span>
                    <span className="font-extrabold text-slate-900">{villa.location}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                      CHECK-IN
                    </span>
                    <span className="font-extrabold text-slate-900">{checkIn}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                      CHECK-OUT
                    </span>
                    <span className="font-extrabold text-slate-900">{checkOut}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                      TAMU
                    </span>
                    <span className="font-extrabold text-slate-900">{guests} orang</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                      TOTAL
                    </span>
                    <span className="font-extrabold text-slate-900">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons matching photo */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => alert(`Mengunduh invoice #${bookingCode}...`)}
                  suppressHydrationWarning
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 px-6 py-3 rounded-full font-extrabold text-xs shadow-2xs transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Unduh Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/dashboard?tab=bookings')}
                  suppressHydrationWarning
                  className="bg-[#0D5C54] hover:bg-[#0A4842] text-white px-6 py-3 rounded-full font-extrabold text-xs shadow-md transition-colors"
                >
                  Lihat Booking Saya
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Villa Summary Card (variant='checkout') */}
        <div className="lg:col-span-1">
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
            variant="checkout"
          />
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-xs font-bold text-slate-400">Loading Booking...</div>}>
      <BookingContent />
    </Suspense>
  );
}
