# CLAUDE.md Balivio (Villa Booking Bali)

> Catatan: dokumen ini adalah PRD teknis untuk AI coding agent (Claude Code).
> Tujuannya supaya AI tidak melenceng dari scope: **UI/tampilan saja**, belum backend nyata.

---

## 1. Project Overview

- **Name**: Balivio
- **Description**: Platform booking villa premium di Bali. Fase ini hanya membangun **tampilan (frontend UI)** berdasarkan desain yang sudah ada belum ada backend, database, atau payment gateway sungguhan.
- **Goal**: Mereplikasi seluruh alur visual (landing page → cari villa → detail villa → booking flow → konfirmasi → riwayat booking) menjadi kode Next.js yang rapi, reusable, dan gampang disambungkan ke backend nanti.
- **Target Users**: Traveler yang mencari private pool villa di Bali (Canggu, Ubud, Seminyak, Uluwatu, dll).
- **Version**: v0.1.0 (UI-only phase)
- **Status**: Active development **Frontend/UI only**, tidak ada integrasi API/backend real.

> ⚠️ Scope guard untuk AI: Jangan buat database schema, jangan buat auth logic sungguhan, jangan integrasi payment gateway. Semua data pakai **mock/dummy data lokal**. Semua tombol "Login/Booking/Bayar" hanya perlu bekerja secara visual (state lokal + navigasi), bukan transaksi nyata.

---

## 2. Tech Stack

- **Language**: TypeScript
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **UI Library**: shadcn/ui (berbasis Radix UI + Tailwind) dipilih karena ringan (bukan library besar seperti MUI/Ant Design), komponennya di-copy ke project (bukan dependency tebal), dan gampang dikustom biar terasa elegan sesuai desain (warna teal/hijau tua, banyak whitespace, rounded card).
- **Animation Library**: Framer Motion **dipakai terbatas di landing page saja** (hero fade-in, scroll reveal untuk section "Destinasi Populer", "Villa Rekomendasi", "Kenapa Pilih Balivio", testimonial). Halaman lain (search, detail, booking flow) transisi cukup pakai Tailwind transition biasa, jangan overuse animasi di halaman transaksional.
- **Icon Library**: lucide-react (ringan, konsisten dengan shadcn/ui)
- **Database**: Tidak ada di fase ini
- **ORM**: Tidak ada di fase ini
- **Auth**: Tidak ada auth sungguhan replikasi UI "Mode Demo" (Demo Login → Masuk Langsung) sebagai state lokal saja
- **State Management**: React state + Context API cukup (hindari Zustand/Redux dulu project masih kecil, semua data mock)
- **Data Fetching**: Tidak ada semua dari file JSON/TS lokal di `src/data`
- **Package Manager**: pnpm *(asumsi beri tahu kalau mau ganti npm/yarn/bun)*
- **Deployment**: Vercel

---

## 3. Commands

```bash
# Development
pnpm dev             # Jalankan dev server
pnpm build           # Build untuk production
pnpm start           # Jalankan production build
pnpm lint            # Jalankan linter
pnpm format          # Format kode (prettier)

# Package Management
pnpm add [package]   # Install package baru WAJIB konfirmasi ke user dulu

# shadcn/ui
pnpm dlx shadcn@latest add [component]   # Tambah komponen shadcn/ui baru
```

> Jangan pakai npm/yarn campur-campur konsisten pnpm.

---

## 4. Project Structure

Architecture: **by feature/section**, disesuaikan dengan halaman yang ada di desain.

```
balivio/
  src/
    app/                        # Next.js App Router (WAJIB pakai nama file reserved: page.tsx, layout.tsx, dll TIDAK bisa camelCase, ini exception dari framework)
      page.tsx                  # Landing page
      searchVilla/page.tsx      # Halaman hasil pencarian & filter villa
      villa/[slug]/page.tsx     # Halaman detail villa
      booking/page.tsx          # Booking flow (ringkasan → pembayaran → konfirmasi)
      bookingSaya/page.tsx      # Riwayat/daftar booking user
      login/page.tsx            # Login / Register (mode demo)
      layout.tsx
    components/
      ui/                       # Base komponen dari shadcn/ui (button.tsx, card.tsx, dll ikut convention shadcn, jangan diubah manual)
      layout/                   # navbar.tsx, footer.tsx
      landing/                  # heroSection.tsx, destinasiPopuler.tsx, villaRekomendasi.tsx, whyBalivio.tsx, testimonialSection.tsx
      villa/                    # villaCard.tsx, villaFilter.tsx, villaGallery.tsx, availabilityCalendar.tsx
      booking/                  # bookingSummaryCard.tsx, bookingStepper.tsx, paymentMethodList.tsx
      shared/                   # komponen kecil yang dipakai lintas fitur, misal ratingBadge.tsx, priceTag.tsx
    data/                       # mock data lokal (dummy, bukan API)
      villas.ts
      destinations.ts
      testimonials.ts
      bookings.ts
    lib/                        # utils.ts, formatCurrency.ts, formatDate.ts
    types/                      # villa.ts, booking.ts, user.ts
    hooks/                      # useBookingFlow.ts, useVillaFilter.ts
    constants/                  # navLinks.ts, siteConfig.ts
  public/                       # gambar villa, ikon, dll
```

Aturan penempatan file:

- Komponen UI dasar (button, input, dialog) → `components/ui` (hasil generate shadcn, jangan edit struktur foldernya)
- Komponen per-section landing page → `components/landing`
- Komponen terkait villa/listing → `components/villa`
- Komponen terkait alur booking → `components/booking`
- Mock data → `src/data`, tipe data → `src/types`
- Jangan buat folder baru di luar struktur ini tanpa konfirmasi

---

## 5. Naming Conventions

**Aturan khusus project ini: SEMUA nama file pakai camelCase**, kecuali file yang namanya sudah ditentukan oleh Next.js (`page.tsx`, `layout.tsx`, `loading.tsx`, `not-found.tsx`, dll ini reserved filename, tidak boleh diubah).

```
# File dan Folder
- Komponen        : camelCase     contoh: villaCard.tsx, heroSection.tsx, bookingStepper.tsx
- Non-komponen     : camelCase     contoh: useBookingFlow.ts, formatCurrency.ts
- Folder           : camelCase     contoh: searchVilla/, bookingSaya/
- Next.js reserved : tetap sesuai framework, contoh: page.tsx, layout.tsx (exception)
- Mock data file   : camelCase     contoh: villas.ts, destinations.ts

# Penamaan Komponen di Dalam Kode
- Nama file      : camelCase (villaCard.tsx)
- Nama fungsi/komponen di dalamnya : tetap PascalCase karena ini requirement React,
  contoh: export function VillaCard() {} di dalam file villaCard.tsx

# Di dalam Kode
- Variabel        : camelCase     contoh: villaList, isBookingLoading
- Konstanta        : UPPER_SNAKE   contoh: MAX_GUEST, BASE_PRICE
- Fungsi           : camelCase     contoh: formatCurrency, getVillaBySlug
- Tipe/Interface   : PascalCase    contoh: Villa, BookingStep
- CSS Class        : kebab-case (Tailwind default) atau utility class langsung

# Git Branch
- Fitur baru : feat/[nama-fitur]
- Bug fix    : fix/[nama-bug]
```

---

## 6. Code Conventions

```
# Pendekatan
- DRY dan komponen reusable villaCard dipakai di landing, search, dan rekomendasi
- Prioritaskan keterbacaan, bukan kode paling singkat

# TypeScript
- Strict mode aktif
- Tidak boleh pakai tipe 'any' definisikan tipe di src/types
- Selalu tulis return type function secara eksplisit
- Gunakan interface untuk object (Villa, Booking), type untuk union (BookingStatus)

# Urutan Import
1. Library eksternal (react, next, framer-motion, lucide-react)
2. Internal absolut (@/components, @/lib, @/data, @/types)
3. Internal relatif
4. Tipe/Interface
5. Assets/styles

# Export Pattern
- Named export untuk semua komponen dan fungsi
- Default export hanya untuk page.tsx dan layout.tsx

# Error Handling
- Karena tidak ada API sungguhan, cukup handle empty state / loading state dummy
  (contoh: skeleton loading saat "cari villa" sebelum menampilkan mock data)
```

---

## 7. Component Rules

```
# Urutan Penulisan dalam Satu Komponen
1. Import
2. Tipe/Interface props
3. Definisi komponen
4. Hooks (useState, useEffect jika perlu animasi/interaksi)
5. Handler lokal
6. Return JSX
7. Export

# Aturan Props
- Tulis tipe props secara eksplisit, contoh: VillaCardProps
- Beri default value untuk props opsional (misalnya showBadge?: boolean = true)

# Client vs Server Component
- Default: Server Component
- 'use client' hanya untuk:
    - Komponen dengan interaksi (filter, calendar, stepper booking, form login)
    - Komponen dengan animasi Framer Motion
    - Komponen yang pakai useState/useEffect

# Komponen Kecil
- Pisah ke file sendiri jika dipakai di lebih dari satu halaman (contoh: villaCard, priceTag, ratingBadge)
- Section landing page (hero, destinasi populer, dll) masing-masing satu file di components/landing
```

---

## 8. Styling Rules

```
# Pendekatan
- Tailwind CSS utility class langsung di JSX
- Pakai cn() helper (dari lib/utils.ts, standar shadcn) untuk conditional class
- Jangan pakai inline style kecuali nilai benar-benar dinamis (contoh: width progress bar booking stepper)
- Jangan pakai !important

# Design Tokens (sesuai desain Balivio)
- Warna primer  : teal/hijau tua gelap (dipakai di tombol utama, navbar aktif, badge harga)
- Warna aksen   : hijau muda untuk badge promo/diskon
- Background    : putih/krem, card dengan rounded-xl dan shadow tipis
- Definisikan warna ini sebagai CSS variable di globals.css / tailwind.config, jangan hardcode hex di banyak tempat

# Responsive
- Mobile-first
- Breakpoint standar Tailwind: sm/md/lg/xl

# Dark Mode
- Tidak ada di desain saat ini skip dulu, jangan implementasi dark mode kecuali diminta
```

---

## 9. Data (Mock) Rules

```
# Karena fase ini UI-only, tidak ada API & Data Fetching sungguhan
- Semua data (villa, destinasi, testimonial, booking) disimpan sebagai array/object TypeScript di src/data
- Simulasikan loading state dengan delay dummy (setTimeout) HANYA jika diminta,
  supaya skeleton/loading UI kelihatan bagus bukan untuk fetch data asli
- Struktur data mock harus mengikuti tipe yang didefinisikan di src/types,
  supaya gampang diganti ke API call sungguhan nanti
- Jangan bikin folder services/api dulu itu untuk fase backend berikutnya
```

---

## 10. State Management Rules

```
# Hierarki State
1. Local state (useState)  : filter di satu komponen, buka/tutup dialog
2. Lifted state            : hasil search villa dipakai di beberapa komponen di halaman yang sama
3. Context (jika perlu)    : progress booking flow (step 1-3), dipakai di beberapa komponen dalam satu halaman booking

# Jangan
- Jangan install Zustand/Redux dulu Context + useState cukup untuk fase UI-only
- Jangan simpan data yang bisa dihitung ulang (misal total harga dihitung dari subtotal + biaya + pajak, bukan disimpan terpisah)
```

---

## 11. Performance & Animation Rules

```
# Framer Motion (landing page saja)
- Gunakan whileInView untuk scroll-reveal section (Destinasi Populer, Villa Rekomendasi, Kenapa Pilih Balivio, Testimonial)
- Hero section: simple fade-in + slight slide-up saat page load
- Jangan pasang animasi berat di halaman search/detail/booking biar terasa cepat & transaksional, bukan playful

# Image
- Selalu pakai next/image untuk gambar villa, tentukan width/height atau fill dengan container yang jelas
- Jangan pakai tag <img> biasa

# Code Splitting
- Lazy load komponen yang berat dan jarang terlihat di awal (contoh: availabilityCalendar di detail villa)

# Bundle Size
- Import spesifik dari lucide-react per ikon, jangan import semua ikon sekaligus
```

---

## 12. Git Rules

Setiap selesai satu section/halaman, langsung commit sebelum lanjut ke task berikutnya.

```
# Format Commit Message
feat     : [deskripsi fitur/halaman baru]
fix      : [deskripsi bug UI yang diperbaiki]
refactor : [deskripsi refactor komponen]
style    : [perubahan styling/spacing/warna]
chore    : [setup config, install package]

# Contoh
feat: add hero section with framer motion fade-in
feat: add villa search page with filter sidebar
fix: fix booking stepper active state on mobile

# Aturan Tambahan
- Satu commit untuk satu perubahan spesifik (per halaman/komponen)
- Jangan gabung banyak halaman berbeda dalam satu commit
```

---

## 13. Pages & Flow (referensi desain jangan melenceng dari ini)

```
# Sudah ada desainnya (kerjakan sesuai urutan ini)
- [ ] Landing page: Hero + search bar, Destinasi Populer (4 kota), Villa Rekomendasi,
      "Kenapa pilih Balivio" (4 poin: Harga Terbaik, Free Cancellation, Verified Villa, 24/7 Support),
      Testimonial, Footer
- [ ] Login/Register page (mode demo tab Masuk/Daftar, tombol "Demo Login - Masuk Langsung",
      social login Google/Apple sebagai UI saja)
- [ ] Search/listing villa: search bar (lokasi, check-in/out, tamu), filter sidebar
      (rentang harga, lokasi, rating minimum, tipe villa), hasil dalam bentuk card
- [ ] Detail villa: galeri foto, info (kamar, tamu, free cancellation), fasilitas,
      kebijakan check-in/out, kalender ketersediaan, card booking (harga + total) sticky di kanan
- [ ] Booking flow 3 step: (1) Ringkasan & Data Diri, (2) Pembayaran
      (transfer bank / kartu / e-wallet), (3) Konfirmasi/Booking Berhasil
- [ ] Booking Saya: daftar booking user (upcoming/completed) dengan status & tombol lihat detail/e-voucher

# Komponen berulang yang dipakai di banyak halaman
- Navbar (beda state: guest vs logged in "Hi, Demo")
- Footer (sama persis di semua halaman)
- villaCard (dipakai di landing, search, rekomendasi dengan variasi badge promo/best seller/premium)
```

---

## 14. Testing

```
- Fase UI-only: testing otomatis TIDAK jadi prioritas
- Cukup manual check responsive (mobile/tablet/desktop) tiap selesai satu halaman
- Kalau nanti masuk fase backend, baru pertimbangkan Vitest + Playwright
```

---

## 15. Do Not

Kalau instruksi ambigu, TANYA DULU sebelum coding jangan asumsi sendiri.

```
# Scope
- Jangan bikin backend/API route sungguhan
- Jangan bikin database schema atau ORM
- Jangan integrasi payment gateway sungguhan (Midtrans/Xendit dll) cukup UI pemilihan metode pembayaran
- Jangan bikin auth/session sungguhan "Mode Demo" cukup state lokal

# Struktur & File
- Jangan buat folder baru di luar struktur section 4 tanpa konfirmasi
- Jangan ubah nama file reserved Next.js (page.tsx, layout.tsx) jadi camelCase itu akan merusak routing
- Jangan install package baru (termasuk library animasi/UI lain) tanpa konfirmasi

# Kode
- Jangan pakai tipe 'any'
- Jangan hardcode warna hex berulang-ulang pakai token di config
- Jangan pasang animasi Framer Motion di luar landing page tanpa diminta
```

---

## 16. Environment Variables

```
Tidak ada environment variable yang dibutuhkan di fase UI-only ini
(tidak ada API key, database URL, atau auth secret semua data mock lokal).
Section ini akan diisi lagi saat project masuk fase integrasi backend.
```

---

_PRD ini jadi acuan utama AI coding agent supaya pembangunan UI Balivio konsisten dengan desain yang sudah ada dan tidak melebar ke scope backend dulu. Update dokumen ini kalau ada penambahan halaman/fitur baru._