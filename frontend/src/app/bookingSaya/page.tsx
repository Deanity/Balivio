'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MOCK_BOOKINGS } from '@/data/bookings';
import { Booking } from '@/types/booking';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';
import {
  Calendar,
  MapPin,
  Ticket,
  CheckCircle2,
  Clock,
  X,
  FileText,
  User,
} from 'lucide-react';

export default function BookingSayaPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'completed'>('all');
  const [selectedBookingModal, setSelectedBookingModal] = useState<Booking | null>(null);

  const filteredBookings = MOCK_BOOKINGS.filter((b) => {
    if (activeTab === 'confirmed') return b.status === 'confirmed';
    if (activeTab === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* User Header */}
      <div className="bg-[#0B3B36] text-white p-8 rounded-3xl space-y-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-inner border-2 border-emerald-400">
            <User className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider bg-emerald-900/60 px-2.5 py-0.5 rounded-full">
              Mode Demo User
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight">Riwayat Booking Saya</h1>
            <p className="text-emerald-100/70 text-xs">demo@balivio.com • +62 812-3456-7890</p>
          </div>
        </div>

        <Link
          href="/searchVilla"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-colors"
        >
          + Sewa Villa Baru
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 transition-colors ${
            activeTab === 'all' ? 'text-[#0D5C54] border-b-2 border-[#0D5C54] font-bold' : 'hover:text-slate-900'
          }`}
        >
          Semua Booking ({MOCK_BOOKINGS.length})
        </button>
        <button
          onClick={() => setActiveTab('confirmed')}
          className={`pb-3 transition-colors ${
            activeTab === 'confirmed' ? 'text-[#0D5C54] border-b-2 border-[#0D5C54] font-bold' : 'hover:text-slate-900'
          }`}
        >
          Mendatang / Aktif (1)
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 transition-colors ${
            activeTab === 'completed' ? 'text-[#0D5C54] border-b-2 border-[#0D5C54] font-bold' : 'hover:text-slate-900'
          }`}
        >
          Selesai (1)
        </button>
      </div>

      {/* Booking List Cards */}
      <div className="space-y-6">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sm text-[#0D5C54] bg-emerald-50 px-3 py-1 rounded-xl">
                  {booking.bookingCode}
                </span>
                <span className="text-xs text-slate-400">Dibuat pada {formatDate(booking.createdAt)}</span>
              </div>

              {booking.status === 'confirmed' ? (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Terkonfirmasi (Mendatang)
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> Selesai Menginap
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div className="relative w-full sm:w-36 h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                <Image src={booking.villa.images[0]} alt={booking.villa.title} fill className="object-cover" />
              </div>

              <div className="space-y-2 flex-1">
                <h3 className="font-bold text-slate-900 text-lg">{booking.villa.title}</h3>
                <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#0D5C54]" />
                  <span>{booking.villa.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold pt-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)} ({booking.nights} Malam)</span>
                </div>
              </div>

              <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 space-y-2">
                <span className="text-xs text-slate-400 block">Total Biaya</span>
                <span className="text-xl font-extrabold text-[#0D5C54] block">
                  {formatCurrency(booking.totalPrice)}
                </span>
                <button
                  onClick={() => setSelectedBookingModal(booking)}
                  className="bg-[#0D5C54] hover:bg-[#0A4842] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 justify-center"
                >
                  <Ticket className="w-3.5 h-3.5" /> Lihat E-Voucher
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* E-Voucher Modal */}
      {selectedBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl animate-in zoom-in-95">
            <button
              onClick={() => setSelectedBookingModal(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#0D5C54]" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-xl">E-Voucher Resmi Balivio</h3>
                <span className="text-xs text-slate-500">Tunjukkan voucher ini saat tiba di lokasi villa.</span>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-400">Kode Booking:</span>
                <span className="font-bold text-emerald-400 text-sm">{selectedBookingModal.bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Villa:</span>
                <span className="font-bold">{selectedBookingModal.villa.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Check-In:</span>
                <span>{formatDate(selectedBookingModal.checkIn)} (14:00 WITA)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Check-Out:</span>
                <span>{formatDate(selectedBookingModal.checkOut)} (12:00 WITA)</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-3">
                <span className="text-slate-400">Status Pembayaran:</span>
                <span className="text-emerald-400 font-bold">LUNAS / CONFIRMED</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedBookingModal(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-6 py-2.5 rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
