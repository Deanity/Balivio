'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_VILLAS } from '@/data/villas';
import { BookingStep, PaymentMethod } from '@/types/booking';
import { BookingStepper } from '@/components/booking/bookingStepper';
import { BookingSummaryCard } from '@/components/booking/bookingSummaryCard';
import { PaymentMethodList, PAYMENT_OPTIONS } from '@/components/booking/paymentMethodList';
import { calculateNights, formatDate } from '@/lib/formatDate';
import { formatCurrency } from '@/lib/formatCurrency';
import {
  ShieldCheck,
  CheckCircle,
  Copy,
  Calendar,
  UserCheck,
  Building2,
  ArrowLeft,
} from 'lucide-react';

function BookingFlowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = searchParams.get('slug') || MOCK_VILLAS[0].slug;
  const checkIn = searchParams.get('checkIn') || '2026-08-10';
  const checkOut = searchParams.get('checkOut') || '2026-08-13';
  const guests = Number(searchParams.get('guests') || 2);

  const villa = MOCK_VILLAS.find((v) => v.slug === slug) || MOCK_VILLAS[0];

  const nights = calculateNights(checkIn, checkOut);
  const subtotal = villa.pricePerNight * nights;
  const serviceFee = 250000;
  const discount = villa.isPromo ? 350000 : 0;
  const totalPrice = subtotal + serviceFee - discount;

  const [step, setStep] = useState<BookingStep>(1);

  // Form State Step 1
  const [customer, setCustomer] = useState({
    fullName: 'Demo User',
    email: 'demo@balivio.com',
    phone: '+62 812-3456-7890',
    specialRequests: 'Mohon persiapkan kamar dalam kondisi harum dan bersih.',
  });

  // Payment State Step 2
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PAYMENT_OPTIONS[0]);

  // Copy VA helper
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyVA = () => {
    if (selectedMethod.accountNumber) {
      navigator.clipboard.writeText(selectedMethod.accountNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const bookingCode = `BLV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header & Stepper */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Pemesanan Villa {villa.title}
        </h1>
        <p className="text-slate-500 text-sm">
          Selesaikan langkah berikut untuk mendapatkan e-voucher booking terkonfirmasi.
        </p>
      </div>

      <BookingStepper currentStep={step} />

      {/* STEP 1 & STEP 2 LAYOUT: Left Form/Payment + Right Summary */}
      {step !== 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Form / Payment Column */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#0D5C54]" />
                    <span>Langkah 1: Data Diri Pemesan</span>
                  </h2>
                  <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                    Mode Demo Terisi Otomatis
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-slate-700">Nama Lengkap (Sesuai KTP/Paspor)</label>
                    <input
                      type="text"
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0D5C54] font-semibold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Email Utama (Untuk E-Voucher)</label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0D5C54] font-semibold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Nomor WhatsApp / HP</label>
                    <input
                      type="text"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0D5C54] font-semibold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-slate-700">Permintaan Khusus (Opsional)</label>
                    <textarea
                      rows={3}
                      value={customer.specialRequests}
                      onChange={(e) => setCustomer({ ...customer, specialRequests: e.target.value })}
                      placeholder="Contoh: Honeymoon decor, airport pick-up info..."
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0D5C54] text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-[#0D5C54] hover:bg-[#0A4842] text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-md transition-all"
                  >
                    Lanjut Pilih Pembayaran
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-[#0D5C54] hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Data Diri
                  </button>
                  <span className="text-xs text-slate-500 font-medium">Langkah 2 dari 3</span>
                </div>

                <PaymentMethodList
                  selectedMethod={selectedMethod.id}
                  onSelectMethod={(m) => setSelectedMethod(m)}
                />

                {/* Simulated Payment Instructions Box */}
                {selectedMethod.accountNumber && (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <span className="font-bold text-slate-700 uppercase tracking-wider block">
                      Instruksi Pembayaran Demo:
                    </span>
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Nomor Rekening / VA</span>
                        <span className="font-mono text-base font-bold text-slate-900">
                          {selectedMethod.accountNumber}
                        </span>
                      </div>
                      <button
                        onClick={handleCopyVA}
                        className="bg-emerald-50 text-[#0D5C54] hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isCopied ? 'Tersalin!' : 'Salin VA'}</span>
                      </button>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Atas Nama: <strong>{selectedMethod.accountName}</strong>
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-emerald-800 font-medium bg-emerald-50 px-3 py-1 rounded-full">
                    Sistem Demo: Klik "Simulasi Bayar" untuk menyelesaikan.
                  </span>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-[#0D5C54] hover:bg-[#0A4842] text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all"
                  >
                    Simulasi Bayar & Selesai
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Column */}
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
            />
          </div>
        </div>
      )}

      {/* STEP 3: SUCCESS CONFIRMATION & E-VOUCHER PREVIEW */}
      {step === 3 && (
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl text-center space-y-8 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-emerald-100 text-[#0D5C54] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest">
              Pembayaran Sukses (Mode Demo)
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">Booking Berhasil Dikonfirmasi!</h2>
            <p className="text-slate-600 text-sm">
              E-Voucher dan instruksi check-in telah dikirimkan ke email <strong>{customer.email}</strong>.
            </p>
          </div>

          {/* E-Voucher Ticket Card */}
          <div className="bg-gradient-to-br from-[#0B3B36] to-[#0D5C54] text-white p-6 sm:p-8 rounded-3xl shadow-lg text-left space-y-6 relative overflow-hidden">
            <div className="flex justify-between items-start border-b border-emerald-800 pb-4">
              <div>
                <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider block">Kode Booking Balivio</span>
                <span className="text-2xl font-mono font-extrabold text-white tracking-widest">{bookingCode}</span>
              </div>
              <div className="bg-emerald-900/60 px-3 py-1 rounded-lg border border-emerald-700 text-xs font-bold text-emerald-200">
                LUNAS (CONFIRMED)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-emerald-300 block mb-1">Nama Villa:</span>
                <span className="font-bold text-base block">{villa.title}</span>
                <span className="text-emerald-100/70">{villa.location}</span>
              </div>
              <div>
                <span className="text-emerald-300 block mb-1">Tamu Pemesan:</span>
                <span className="font-bold text-base block">{customer.fullName}</span>
                <span className="text-emerald-100/70">{customer.phone}</span>
              </div>
              <div>
                <span className="text-emerald-300 block mb-1">Tanggal Stay:</span>
                <span className="font-semibold block">{formatDate(checkIn)} - {formatDate(checkOut)} ({nights} Malam)</span>
              </div>
              <div>
                <span className="text-emerald-300 block mb-1">Total Pembayaran:</span>
                <span className="font-bold text-lg text-emerald-300 block">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-800 flex items-center justify-between text-[11px] text-emerald-200/80">
              <span>Metode: {selectedMethod.name}</span>
              <span>Tunjukan E-Voucher ini saat Check-In</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/bookingSaya"
              className="w-full sm:w-auto bg-[#0D5C54] hover:bg-[#0A4842] text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all"
            >
              Lihat di Booking Saya
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 font-medium">Memuat form booking...</div>}>
      <BookingFlowContent />
    </Suspense>
  );
}
