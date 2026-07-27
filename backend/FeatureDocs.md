# Dokumentasi Fitur Balivio Backend API

Dokumen ini berisi daftar seluruh fitur aplikasi web/mobile yang dapat dibangun berdasarkan endpoint API dan logika bisnis yang tersedia pada backend Balivio.

---

## 🔐 1. Otentikasi & Manajemen Akun (Auth & Users)

### Fitur Pengguna & Keamanan
- **Registrasi Akun Baru (Email & Password)**: Pendaftaran pengguna baru (peran default: Guest) dengan pembatasan rate limit (`registerRateLimit`).
- **Login Sistem (Email & Password)**: Masuk ke aplikasi dengan enkripsi & validasi Supabase Auth, menghasilkan JWT Access Token & Refresh Token.
- **Single Sign-On (SSO) Google OAuth**: Login/Registrasi secara instan menggunakan akun Google (`/api/v1/auth/google`).
- **Pembaruan Token Sesi (Refresh Token)**: Memperbarui token akses secara otomatis tanpa perlu login ulang (`/api/v1/auth/refresh`).
- **Penghentian Sesi (Logout)**: Menghapus/mencabut token sesi pengguna dari server (`/api/v1/auth/logout`).
- **Pemeriksaan Sesi Aktif (`/api/v1/auth/me`)**: Mengambil informasi profil & identitas pengguna yang sedang login.
- **Profil Pengguna (`/api/v1/users/profile`)**:
  - Melihat & memperbarui data pribadi (Nama Tampilan, Nomor Telepon, Foto Avatar, Tanggal Lahir, Jenis Kelamin, Alamat, Kota, Negara).
- **Pengaturan Keamanan (`/api/v1/users/password`)**: Fitur ubah kata sandi (*Change Password*) yang terhubung langsung ke Supabase Auth Admin.
- **Kontrol Akses Berbasis Peran (RBAC)**: Pembatasan hak akses berbasis peran `guest`, `host`, dan `admin`.

---

## 🏡 2. Eksplorasi & Pencarian Villa (Villas & Master Data)

### Fitur Pengunjung (Guest)
- **Katalog & Pencarian Multi-Kriteria (`GET /api/v1/villas`)**:
  - Filter berdasarkan **Lokasi / Area** (`area_id`: Canggu, Ubud, Uluwatu, Seminyak, dll).
  - Filter berdasarkan **Tipe Properti** (`property_type_id`: Private Villa, Boutique Villa, Luxury Villa, Family Villa, dll).
  - Filter berdasarkan **Fasilitas / Amenities** (`amenity_ids`: WiFi, Private Pool, AC, Kitchen, Breakfast, Parking, dsb. dengan dukungan multiple-selection).
  - Filter berdasarkan **Rentang Harga** (`min_price` & `max_price`).
  - Filter berdasarkan **Kapasitas Tamu & Jumlah Kamar Tidur** (`guests`, `bedrooms`).
  - Filter berdasarkan **Ketersediaan Tanggal (`check_in` & `check_out`)**: Memfilter & menyembunyikan villa yang sudah dipesan (*booked*) pada rentang tanggal tersebut.
- **Urutan Hasil Pencarian (Sorting)**:
  - Harga Terendah (`price_asc`)
  - Harga Tertinggi (`price_desc`)
  - Terbaru (`newest`)
- **Detail Lengkap Villa (`GET /api/v1/villas/:slug`)**:
  - Menampilkan judul, deskripsi, harga per malam, harga asli, diskon (%), alamat lengkap, serta koordinat peta (Latitude/Longitude).
  - Galeri foto villa yang berurutan (*image gallery*).
  - Daftar lengkap fasilitas beserta ikon dan kategorinya (General, Safety, Entertainment, dll).
  - Aturan & Kebijakan Villa (Jam Check-in/Check-out, Kebijakan Pembatalan, dan Aturan Khusus).
- **Kalender Ketersediaan (`GET /api/v1/villas/:villaId/availability`)**: Cek ketersediaan tanggal dan status (available, blocked, booked) untuk rentang tanggal tertentu (`start_date`, `end_date`).
- **Destinasi & Area Populer (`GET /api/v1/areas`)**: Mengambil daftar area/wilayah di Bali beserta gambar sampul dan deskripsi untuk kartu destinasi (*Destination Cards*).
- **Master Data Fasilitas & Tipe Properti**: Mengambil daftar opsi fasilitas (`GET /api/v1/amenities`) dan jenis properti (`GET /api/v1/property-types`) untuk pengisian opsi filter UI.

---

## 🛠️ 3. Manajemen Properti (Host & Admin Dashboard)

### Fitur Host / Pemilik Villa & Admin
- **Tambah Properti Baru (`POST /api/v1/villas`)**: Mendaftarkan villa baru lengkap dengan slug, deskripsi, harga, fasilitas, tipe properti, lokasi, serta batas kapasitas.
- **Edit & Update Data Villa (`PUT /api/v1/villas/:villaId`)**: Memperbarui informasi properti yang sudah terdaftar.
- **Hapus Properti (`DELETE /api/v1/villas/:villaId`)**: Soft delete properti dari katalog publik tanpa kehilangan riwayat transaksi backend.
- **Manajemen Galeri Foto Villa**:
  - Mengunggah / menambahkan foto baru dengan pengaturan urutan tampil (*sort order*) (`POST /api/v1/villas/:villaId/images`).
  - Menghapus foto dari galeri (`DELETE /api/v1/villas/:villaId/images/:imageId`).
- **Manajemen Ketersediaan & Pemblokiran Tanggal (`PUT /api/v1/villas/:villaId/availability`)**: Host dapat secara manual memblokir (*block*) atau membuka (*unblock*) tanggal tertentu di kalender properti untuk pemeliharaan atau keperluan pribadi.

---

## 📅 4. Reservasi & Pemesanan (Bookings & Reservations)

### Fitur Tamu (Guest)
- **Pemesanan Villa Baru (`POST /api/v1/bookings`)**:
  - Validasi otomatis ketersediaan tanggal (mencegah pembatalan/double booking).
  - Kalkulasi rinci harga secara otomatis: Subtotal malam, Biaya Layanan (*Service Fee* 10%), Pajak (*Tax* 11%), dan Total Harga.
  - Penjanaan Kode Booking unik otomatis (contoh: `BK-2026-X8Y1`).
  - Pengisian data pemesan & catatan khusus (*customer notes*).
- **Riwayat Pemesanan Saya (`GET /api/v1/bookings`)**: Daftar seluruh pemesanan pengguna dengan status transaksi (paginated).
- **Detail Bukti Pemesanan / E-Voucher (`GET /api/v1/bookings/:bookingCode`)**: Menampilkan rincian lengkap pesanan, tanggal menginap, rincian biaya, dan status pembayaran.
- **Pembatalan Pesanan (`PATCH /api/v1/bookings/:id/cancel`)**: Tamu dapat membatalkan pesanan berkategori *pending* atau *confirmed*, yang akan secara otomatis melepaskan (*unblock*) tanggal pada kalender.

### Fitur Host Dashboard
- **Manajemen Pemesanan Properti Host (`GET /api/v1/bookings/host/bookings`)**: Melihat daftar semua reservasi yang masuk khusus untuk villa-villa milik Host tersebut.
- **Konfirmasi Pemesanan Manual (`PATCH /api/v1/bookings/host/bookings/:id/confirm`)**: Host dapat mengonfirmasi pemesanan berstatus *pending* dan secara otomatis mengunci tanggal pada kalender ketersediaan.

### Fitur Admin Dashboard
- **Manajemen Seluruh Pemesanan Sistem (`GET /api/v1/bookings/admin/bookings`)**: Admin dapat melihat dan mengawasi seluruh riwayat reservasi di seluruh platform.

---

## 💳 5. Pembayaran & Integrasi Gateway (Payments & Webhook)

### Fitur Pembayaran Online (Powered by Xendit API)
- **Inisiasi Pembayaran (`POST /api/v1/payments/initiate`)**:
  - Integrasi Xendit Invoice Hosted Checkout Page.
  - Mendukung pilihan metode pembayaran:
    - **Virtual Account / Bank Transfer**: BCA, BNI, BRI, Mandiri, Permata.
    - **E-Wallet**: OVO, DANA, LinkAja, ShopeePay, QRIS.
    - **Kartu Kredit / Debit**.
  - Mengembalikan URL Invoice Pembayaran & Nomor Virtual Account.
- **Pemeriksaan Status Pembayaran (`GET /api/v1/payments/:paymentCode`)**: Mengecek status pembayaran real-time (`pending`, `completed`, `failed`, `refunded`).
- **Webhook Integrasi Xendit Otomatis (`POST /api/v1/payments/webhook`)**:
  - Verifikasi keamanan token callback (`x-callback-token`).
  - Pembaruan status pembayaran otomatis saat transaksi berhasil/gagal.
  - Pembaruan status pemesanan menjadi `paid`.
  - **Penguncian Otomatis Kalender Ketersediaan**: Tanggal check-in s/d check-out otomatis terkunci (`booked`) begitu pembayaran terkonfirmasi.
- **Notifikasi Email Konfirmasi Otomatis (Email Confirmation via Resend API)**:
  - Pengiriman e-mail bukti konfirmasi pemesanan secara *asynchronous* / non-blocking kepada tamu segera setelah pembayaran sukses.
  - Rincian email mencakup: Nama Villa, Alamat, Tanggal Check-in/Check-out, Jumlah Malam, Jumlah Tamu, Rincian Biaya (Subtotal, Biaya Layanan, Pajak, Total), Metode Pembayaran, dan Kode Pemesanan.

---

## ⭐️ 6. Ulasan & Rating (Reviews & Feedback)

### Fitur Tamu (Guest)
- **Kirim Ulasan & Rating (`POST /api/v1/reviews`)**: Tamu yang telah menyelesaikan masa menginap (*status completed*) dapat memberikan rating (skala 1.0 - 5.0) dan komentar ulasan.
- **Hapus Ulasan (`DELETE /api/v1/reviews/:id`)**: Tamu dapat menghapus ulasan yang pernah mereka buat.
- **Lihat Ulasan Per Villa (`GET /api/v1/villas/:villaId/reviews`)**: Pengunjung dapat melihat daftar ulasan dan rating pada setiap halaman detail villa.

### Fitur Host & Admin
- **Balas Ulasan Guest (`PATCH /api/v1/reviews/:id/reply`)**: Host atau Admin dapat memberikan tanggapan/balasan resmi atas ulasan meeka.

---

## ❤️ 7. Wishlist & Favorit (Wishlists)

### Fitur Tamu (Guest)
- **Simpan ke Wishlist (`POST /api/v1/wishlists/:villaId`)**: Menambahkan villa favorit ke daftar simpanan pribadi pengguna.
- **Hapus dari Wishlist (`DELETE /api/v1/wishlists/:villaId`)**: Menghapus villa dari daftar favorit.
- **Daftar Wishlist Saya (`GET /api/v1/wishlists`)**: Menampilkan seluruh villa yang disukai oleh pengguna lengkap dengan nama, slug, dan harga per malam.

---

## 📊 Summary Ringkasan Arsitektur & Teknologi Backend

| Komponen | Teknologi / Library |
| :--- | :--- |
| **Framework** | Express.js (TypeScript) |
| **Database & ORM** | PostgreSQL (Supabase) + Drizzle ORM |
| **Authentication** | Supabase Auth (Email/Password & Google OAuth) |
| **Payment Gateway** | Xendit Node SDK / Invoice API |
| **Email Delivery** | Resend API |
| **Security & Middleware** | Helmet, CORS, Morgan, Express Rate Limit, Zod Schema Validation |
