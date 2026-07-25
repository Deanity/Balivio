'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MOCK_BOOKINGS } from '@/data/bookings';
import { MOCK_VILLAS } from '@/data/villas';
import { VillaCard } from '@/components/villa/villaCard';
import { formatCurrency } from '@/lib/formatCurrency';
import {
  Search,
  Ticket,
  User as UserIcon,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  Download,
  LogOut,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  Save,
} from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const locationParam = searchParams.get('location') || '';

  const { user, isLoggedIn, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'search' | 'bookings' | 'profile'>(
    tabParam === 'search' || locationParam ? 'search' : tabParam === 'profile' ? 'profile' : 'bookings'
  );
  const [selectedVoucherBooking, setSelectedVoucherBooking] = useState<typeof MOCK_BOOKINGS[0] | null>(null);

  // Form states for Profile
  const [profileName, setProfileName] = useState(user?.name || 'Bali Traveler');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'traveler@gmail.com');
  const [profilePhone, setProfilePhone] = useState('+62 812 3456 7890');
  const [profileAddress, setProfileAddress] = useState('Denpasar, Bali, Indonesia');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Search tab state
  const [searchQuery, setSearchQuery] = useState(locationParam);

  useEffect(() => {
    if (tabParam === 'search' || locationParam) {
      setActiveTab('search');
    } else if (tabParam === 'profile') {
      setActiveTab('profile');
    } else if (tabParam === 'bookings') {
      setActiveTab('bookings');
    }
  }, [tabParam, locationParam]);

  useEffect(() => {
    if (locationParam) {
      setSearchQuery(locationParam);
    }
  }, [locationParam]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
    }
  }, [user]);

  // Protect page if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/dashboard');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs font-bold text-slate-400">
        Mengarahkan ke halaman login...
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 3000);
  };

  const filteredVillas = MOCK_VILLAS.filter((v) =>
    searchQuery === ''
      ? true
      : v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* 3 Main Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto text-xs font-bold text-slate-500">
        <button
          onClick={() => setActiveTab('bookings')}
          suppressHydrationWarning
          className={`flex items-center gap-2 pb-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'text-[#0D5C54] border-[#0D5C54]'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Booking Saya</span>
          <span className="bg-emerald-100 text-[#0D5C54] text-[10px] px-2 py-0.5 rounded-full font-extrabold">
            {MOCK_BOOKINGS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          suppressHydrationWarning
          className={`flex items-center gap-2 pb-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'search'
              ? 'text-[#0D5C54] border-[#0D5C54]'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Cari Villa</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          suppressHydrationWarning
          className={`flex items-center gap-2 pb-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'text-[#0D5C54] border-[#0D5C54]'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile Saya</span>
        </button>
      </div>

      {/* TAB 1: BOOKING SAYA */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Daftar Pesanan Villa
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Menampilkan {MOCK_BOOKINGS.length} pesanan aktif
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {MOCK_BOOKINGS.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                {/* Villa Image & Title Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src={booking.villa.images[0]}
                      alt={booking.villa.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-[#0D5C54] border border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {booking.status}
                      </span>
                      <span className="text-slate-400 text-xs font-medium">
                        ID: #{booking.bookingCode}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900">
                      {booking.villa.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.villa.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {booking.checkIn} — {booking.checkOut} ({booking.nights} malam)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.guests} Tamu</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Total Pembayaran
                    </span>
                    <span className="text-lg font-extrabold text-[#0D5C54]">
                      {formatCurrency(booking.totalPrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedVoucherBooking(booking)}
                    suppressHydrationWarning
                    className="bg-[#0D5C54] hover:bg-[#0A4842] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Lihat E-Voucher</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CARI VILLA */}
      {activeTab === 'search' && (
        <div className="space-y-8">
          {/* Search Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Eksplor & Booking Villa Bali
            </h2>

            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama villa atau lokasi (Canggu, Ubud, Seminyak...)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                suppressHydrationWarning
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0D5C54] text-xs font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Villa Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVillas.map((villa) => (
              <VillaCard key={villa.id} villa={villa} />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE SAYA */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm max-w-3xl space-y-8">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Pengaturan Profil Saya
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Perbarui informasi pribadi dan kontak untuk pemesanan villa.
            </p>
          </div>

          {isSavedSuccess && (
            <div className="bg-emerald-50 text-[#0D5C54] border border-emerald-200 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#0D5C54]" />
              <span>Perubahan data profil berhasil disimpan!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nama Lengkap</span>
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  suppressHydrationWarning
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0D5C54] font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Alamat Email</span>
                </label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  suppressHydrationWarning
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0D5C54] font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nomor Telepon</span>
                </label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  suppressHydrationWarning
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0D5C54] font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Alamat Domisili</span>
                </label>
                <input
                  type="text"
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  suppressHydrationWarning
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0D5C54] font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <button
                type="submit"
                suppressHydrationWarning
                className="bg-[#0D5C54] hover:bg-[#0A4842] text-white px-6 py-3 rounded-full font-bold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                suppressHydrationWarning
                className="text-red-600 hover:bg-red-50 px-5 py-3 rounded-full font-bold text-xs transition-colors flex items-center gap-2 border border-red-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun (Logout)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* E-Voucher Modal */}
      {selectedVoucherBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 border border-slate-100 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#0D5C54]">
                <ShieldCheck className="w-5 h-5 text-[#0D5C54]" />
                <span className="font-extrabold text-sm text-slate-900">E-Voucher Booking Balivio</span>
              </div>
              <button
                onClick={() => setSelectedVoucherBooking(null)}
                suppressHydrationWarning
                className="text-slate-400 hover:text-slate-600 font-extrabold text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200/80 space-y-1">
                <p className="text-[10px] font-extrabold text-[#0D5C54] uppercase tracking-wider">
                  KODE VOUCHER RESMI
                </p>
                <p className="text-xl font-black text-slate-900 tracking-wider">
                  #{selectedVoucherBooking.bookingCode}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Tunjukkan voucher ini saat Check-In di resepsionis villa.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-slate-700 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nama Guest:</span>
                  <span className="font-extrabold text-slate-900">{selectedVoucherBooking.customer.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Villa:</span>
                  <span className="font-extrabold text-slate-900">{selectedVoucherBooking.villa.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Check-In:</span>
                  <span className="font-extrabold text-slate-900">{selectedVoucherBooking.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Check-Out:</span>
                  <span className="font-extrabold text-slate-900">{selectedVoucherBooking.checkOut}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 font-bold">
                  <span className="text-slate-900">Total Lunas:</span>
                  <span className="text-[#0D5C54]">{formatCurrency(selectedVoucherBooking.totalPrice)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedVoucherBooking(null)}
              suppressHydrationWarning
              className="w-full bg-[#0D5C54] hover:bg-[#0A4842] text-white py-3 rounded-2xl font-extrabold text-xs shadow-md transition-colors"
            >
              Tutup E-Voucher
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-xs font-bold text-slate-400">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
