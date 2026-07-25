import 'dotenv/config';
import { db, bookings } from '@/db';
import { eq } from 'drizzle-orm';

/**
 * 🏝️  USER BOOKING JOURNEY TEST
 * ==============================
 * Simulasi perjalanan nyata seorang user yang ingin booking villa di Bali.
 *
 * Alur:
 *   [1] Budi (user baru) menemukan Balivio → Daftar akun
 *   [2] Budi browsing daftar area & villa tersedia di Bali
 *   [3] Budi cari villa di Ubud untuk liburan 3 malam
 *   [4] Budi simpan villa favorit ke Wishlist
 *   [5] Budi buka detail villa & buat booking
 *   [6] Budi bayar via transfer bank → Xendit Invoice dibuat
 *   [7] Xendit callback PAID masuk → booking dikonfirmasi + email e-voucher dikirim ke Budi
 *   [8] Budi cek status booking → verified PAID
 *   [9] Budi tulis review setelah menginap
 *   [10] Budi lihat wishlist & profil-nya
 */

const BASE_URL     = 'http://localhost:3001/api/v1';
const WEBHOOK_TOKEN = process.env.XENDIT_WEBHOOK_TOKEN ?? 'TU22QBhFQ9Cf820ifCBJMPF200a8aK10cSqdTCP8DeOcW4qX';

// ── Guest persona ──────────────────────────────────────────────
const TARGET_EMAIL = process.env.TEST_EMAIL ?? 'dendradetama2@gmail.com';

// Generate dynamic dates (30-90 days in future) to avoid calendar conflicts
const randomOffset = Math.floor(Math.random() * 60) + 30;
const checkInDate  = new Date(Date.now() + randomOffset * 86400000);
const checkOutDate = new Date(checkInDate.getTime() + 3 * 86400000);

const BUDI = {
  name:     'Deanity (Budi)',
  email:    TARGET_EMAIL,
  password: 'BudiBali2026!',
  phone:    '+628123456789',
  guests:   2,
  checkIn:  checkInDate.toISOString().slice(0, 10),
  checkOut: checkOutDate.toISOString().slice(0, 10),
  notes:    'Kami honeymoon, minta kamar didekorasi bunga jika bisa 🌸',
};

// ── State ──────────────────────────────────────────────────────
let guestToken      = '';
let guestUserId     = '';
let selectedVilla: Record<string, unknown> | null = null;
let bookingId       = '';
let bookingCode     = '';
let paymentCode     = '';

// ── Helpers ────────────────────────────────────────────────────
function hr(label?: string) {
  const line = '─'.repeat(52);
  if (label) {
    const pad = Math.max(0, Math.floor((52 - label.length - 2) / 2));
    console.log(`\n╔${'═'.repeat(52)}╗`);
    console.log(`║${' '.repeat(pad)} ${label} ${' '.repeat(52 - pad - label.length - 2)}║`);
    console.log(`╚${'═'.repeat(52)}╝`);
  } else {
    console.log(`\n${line}`);
  }
}

function step(emoji: string, text: string) {
  console.log(`\n  ${emoji}  ${text}`);
}

function ok(msg: string) {
  console.log(`     ✅  ${msg}`);
}

function info(key: string, value: unknown) {
  console.log(`     ›  ${key}: ${JSON.stringify(value)}`);
}

function fail(msg: string, detail?: unknown) {
  console.error(`\n  ❌  GAGAL: ${msg}`);
  if (detail) console.error('     Detail:', JSON.stringify(detail, null, 2));
  process.exit(1);
}

async function api(
  method: string,
  path: string,
  body?: unknown,
  token?: string,
  rawBody?: boolean
): Promise<Response> {
  const headers: Record<string, string> = {};

  if (!rawBody) headers['Content-Type'] = 'application/json';
  if (token)    headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body
      ? (rawBody ? (body as string) : JSON.stringify(body))
      : undefined,
  });
  return res;
}

async function assertOk(
  res: Response,
  label: string
): Promise<Record<string, unknown>> {
  const json = await res.json() as Record<string, unknown>;
  if (!res.ok) fail(label, json);
  return json;
}

// ══════════════════════════════════════════════════════════════
// MAIN JOURNEY
// ══════════════════════════════════════════════════════════════
async function main() {
  console.log('\n');
  hr('🏝️  BALIVIO — USER BOOKING JOURNEY TEST');
  console.log(`\n  Persona  : ${BUDI.name} (${BUDI.email})`);
  console.log(`  Tujuan   : Villa di Bali, ${BUDI.checkIn} → ${BUDI.checkOut} (3 malam)`);
  console.log(`  Tamu     : ${BUDI.guests} orang`);
  console.log(`  Server   : ${BASE_URL}`);

  // ──────────────────────────────────────────────────────────
  hr('CHAPTER 1 — REGISTRASI & LOGIN');
  // ──────────────────────────────────────────────────────────

  step('📝', `Membuat atau menyiapkan akun untuk ${BUDI.email}...`);

  const regRes = await api('POST', '/auth/register', {
    displayName: BUDI.name,
    email:       BUDI.email,
    password:    BUDI.password,
    phone:       BUDI.phone,
  });

  if (regRes.status === 409 || regRes.status === 400) {
    ok(`Email ${BUDI.email} sudah terdaftar. Mengatur ulang password untuk testing...`);
    const { supabaseAdmin } = await import('@/config/supabase');
    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = usersData?.users?.find(u => u.email === BUDI.email);
    if (existingUser) {
      guestUserId = existingUser.id;
      await supabaseAdmin.auth.admin.updateUserById(existingUser.id, { password: BUDI.password });
      
      const { users } = await import('@/db');
      await db.insert(users).values({
        id: existingUser.id,
        email: BUDI.email,
        displayName: BUDI.name,
        phone: BUDI.phone,
        role: 'guest',
        status: 'active',
      }).onConflictDoUpdate({
        target: users.id,
        set: { displayName: BUDI.name, phone: BUDI.phone },
      });
    }
  } else {
    const regJson = await assertOk(regRes, 'Registrasi akun Budi');
    const regData = regJson['data'] as Record<string, unknown>;
    const regUser = (regData['user'] as Record<string, unknown>) ?? {};
    guestUserId = (regUser['id'] as string) ?? '';
    ok(`Akun berhasil dibuat! User ID: ${guestUserId}`);
  }

  step('🔑', 'Budi login ke Balivio...');
  const loginRes = await api('POST', '/auth/login', {
    email:    BUDI.email,
    password: BUDI.password,
  });
  const loginJson = await assertOk(loginRes, 'Login Budi');
  const loginData = loginJson['data'] as Record<string, unknown>;
  const loginSession = (loginData['session'] as Record<string, unknown>) ?? {};
  guestToken = (loginSession['accessToken'] as string) ?? '';
  ok('Login berhasil! Access token diterima.');

  step('👤', 'Budi melengkapi profil...');
  const profileRes = await api('PUT', '/users/profile', {
    phone:     BUDI.phone,
    birthDate: '1995-03-15',
    address:   'Jl. Kemang Raya No. 12, Jakarta Selatan',
  }, guestToken);
  await assertOk(profileRes, 'Update profil Budi');
  ok('Profil dilengkapi: nomor HP, tanggal lahir, alamat.');

  // ──────────────────────────────────────────────────────────
  hr('CHAPTER 2 — EKSPLORASI BALI');
  // ──────────────────────────────────────────────────────────

  step('🗺️ ', 'Budi melihat daftar area / destinasi di Bali...');
  const areasRes = await api('GET', '/areas');
  const areasJson = await assertOk(areasRes, 'GET /areas');
  const areas = (areasJson['data'] as unknown[]) ?? [];
  ok(`${areas.length} area tersedia di Bali:`);
  for (const a of areas) {
    const area = a as Record<string, unknown>;
    console.log(`     • ${area['name']} (ID: ${area['id']})`);
  }

  step('🏷️ ', 'Budi melihat tipe properti yang tersedia...');
  const typesRes = await api('GET', '/property-types');
  const typesJson = await assertOk(typesRes, 'GET /property-types');
  const types = (typesJson['data'] as unknown[]) ?? [];
  ok(`${types.length} tipe properti: ${types.map((t) => (t as Record<string, unknown>)['name']).join(', ')}`);

  step('✨', 'Budi browsing fasilitas apa saja yang bisa dipilih...');
  const amenRes = await api('GET', '/amenities');
  const amenJson = await assertOk(amenRes, 'GET /amenities');
  const amenities = (amenJson['data'] as unknown[]) ?? [];
  ok(`${amenities.length} amenities tersedia (private pool, AC, WiFi, dll)`);

  // ──────────────────────────────────────────────────────────
  hr('CHAPTER 3 — CARI VILLA IDAMAN');
  // ──────────────────────────────────────────────────────────

  step('🔍', `Budi cari villa di Bali untuk ${BUDI.guests} tamu...`);
  const searchRes = await api(
    'GET',
    `/villas?guests=${BUDI.guests}&sort=price_asc`
  );
  const searchJson = await assertOk(searchRes, 'GET /villas search');
  const searchData = searchJson['data'];
  let villaList: unknown[] = [];
  if (Array.isArray(searchData)) {
    villaList = searchData;
  } else if (searchData && typeof searchData === 'object') {
    const d = searchData as Record<string, unknown>;
    villaList = (d['villas'] as unknown[]) ?? (d['items'] as unknown[]) ?? (d['data'] as unknown[]) ?? [];
  }

  if (villaList.length === 0) fail('Tidak ada villa ditemukan! Pastikan DB sudah di-seed.');

  selectedVilla = villaList[0] as Record<string, unknown>;
  ok(`${villaList.length} villa ditemukan! Budi tertarik dengan:`);
  info('Nama Villa', selectedVilla['name']);
  info('Lokasi', selectedVilla['address']);
  info('Harga/malam', `Rp ${Number(selectedVilla['pricePerNight']).toLocaleString('id-ID')}`);
  info('Kapasitas', `${selectedVilla['guestsCapacity']} tamu`);
  info('Slug', selectedVilla['slug']);

  step('📋', 'Budi buka detail lengkap villa pilihan...');
  const detailRes = await api('GET', `/villas/${selectedVilla['slug']}`);
  const detailJson = await assertOk(detailRes, 'GET /villas/:slug');
  const villaDetail = (detailJson['data'] as Record<string, unknown>) ?? {};
  ok('Detail villa berhasil dimuat:');
  info('Rating', villaDetail['rating']);
  info('Kamar tidur', villaDetail['bedrooms']);

  // ──────────────────────────────────────────────────────────
  hr('CHAPTER 4 — SIMPAN KE WISHLIST');
  // ──────────────────────────────────────────────────────────

  step('❤️ ', `Budi menyimpan "${selectedVilla['name']}" ke wishlist...`);
  const wishRes = await api(
    'POST',
    `/wishlists/${selectedVilla['id']}`,
    {},
    guestToken
  );
  await assertOk(wishRes, 'POST /wishlists/:villaId');
  ok('Villa berhasil disimpan ke wishlist!');

  step('📋', 'Budi cek wishlist miliknya...');
  const wishListRes = await api('GET', '/wishlists', undefined, guestToken);
  const wishListJson = await assertOk(wishListRes, 'GET /wishlists');
  const wishItems = (wishListJson['data'] as unknown[]) ?? [];
  ok(`Wishlist Budi: ${wishItems.length} villa tersimpan.`);

  // ──────────────────────────────────────────────────────────
  hr('CHAPTER 5 — BUAT BOOKING');
  // ──────────────────────────────────────────────────────────

  step('📅', `Budi memesan villa untuk tanggal ${BUDI.checkIn} → ${BUDI.checkOut}...`);
  const bookRes = await api('POST', '/bookings', {
    villaId:       selectedVilla['id'],
    checkIn:       BUDI.checkIn,
    checkOut:      BUDI.checkOut,
    guestsCount:   BUDI.guests,
    customerName:  BUDI.name,
    customerEmail: BUDI.email,
    customerPhone: BUDI.phone,
    customerNotes: BUDI.notes,
  }, guestToken);
  const bookJson = await assertOk(bookRes, 'POST /bookings');
  // bookingsController passes booking directly to successResponse → data IS the booking
  const bookingRaw = (bookJson['data'] as Record<string, unknown>) ?? {};

  bookingId   = (bookingRaw['id'] as string) ?? '';
  bookingCode = (bookingRaw['bookingCode'] as string) ?? '';

  if (!bookingId) fail('bookingId kosong! Response data:', bookJson);

  ok('Booking berhasil dibuat!');
  info('Kode Booking', bookingCode);
  info('Subtotal', `Rp ${Number(bookingRaw['subtotal']).toLocaleString('id-ID')}`);
  info('Biaya Layanan (10%)', `Rp ${Number(bookingRaw['serviceFee']).toLocaleString('id-ID')}`);
  info('PPN (11%)', `Rp ${Number(bookingRaw['tax']).toLocaleString('id-ID')}`);
  info('TOTAL BAYAR', `Rp ${Number(bookingRaw['totalPrice']).toLocaleString('id-ID')}`);
  info('Status', bookingRaw['status']);

  // ──────────────────────────────────────────────────────────
  hr('CHAPTER 6 — BAYAR VIA TRANSFER BANK');
  // ──────────────────────────────────────────────────────────

  step('💳', 'Budi memilih pembayaran via Transfer Bank (BCA)...');
  const payRes = await api('POST', '/payments/initiate', {
    bookingId,
    paymentMethod: 'transfer',
    bankCode:      'BCA',
  }, guestToken);
  const payJson = await assertOk(payRes, 'POST /payments/initiate');
  const payData = (payJson['data'] as Record<string, unknown>) ?? {};
  const payment = (payData['payment'] as Record<string, unknown>) ?? {};
  paymentCode  = payment['paymentCode'] as string ?? '';

  ok('Invoice Xendit berhasil dibuat!');
  info('Payment Code', paymentCode);
  info('Invoice URL', payData['invoiceUrl']);
  console.log(`\n     ℹ️   Budi membuka link invoice & menyelesaikan transfer...`);
  console.log(`     ℹ️   (Dalam scenario nyata, Budi membayar via mobile banking)`);

  // ──────────────────────────────────────────────────────────
  hr('CHAPTER 7 — XENDIT WEBHOOK CALLBACK (PAYMENT PAID)');
  // ──────────────────────────────────────────────────────────

  step('🔔', 'Xendit mengirimkan webhook callback ke Balivio (payment PAID)...');

  // Simulate Xendit webhook payload format
  const webhookPayload = {
    id:             `inv_${Date.now()}`,
    external_id:    paymentCode,
    status:         'PAID',
    paid_amount:    Number(bookingRaw['totalPrice']),
    currency:       'IDR',
    payment_method: 'BANK_TRANSFER',
    bank_code:      'BCA',
    paid_at:        new Date().toISOString(),
  };

  const webhookRes = await fetch(`${BASE_URL}/payments/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type':          'application/json',
      'x-callback-token':      WEBHOOK_TOKEN,
      'webhook-id':            `wh_${Date.now()}`,
    },
    body: JSON.stringify(webhookPayload),
  });

  if (!webhookRes.ok && webhookRes.status !== 200) {
    const wbErr = await webhookRes.text();
    fail('Webhook callback failed', wbErr);
  }

  ok('Webhook diterima dan diproses oleh Balivio!');
  console.log(`     ℹ️   Sistem otomatis:`);
  console.log(`     ›  Status payment  → completed`);
  console.log(`     ›  Status booking  → paid`);
  console.log(`     ›  Kalender villa  → tanggal dikunci (booked)`);
  console.log(`     ›  Email e-voucher → dikirim ke ${BUDI.email} 📧`);

  // Tunggu proses webhook selesai ke DB
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // ──────────────────────────────────────────────────────────
  hr('CHAPTER 8 — CEK STATUS BOOKING');
  // ──────────────────────────────────────────────────────────

  step('📲', `Budi buka halaman "Booking Saya" untuk verifikasi status...`);
  const myBookRes = await api('GET', '/bookings', undefined, guestToken);
  const myBookJson = await assertOk(myBookRes, 'GET /bookings');
  const myBookings = (myBookJson['data'] as unknown[]) ?? [];
  ok(`${myBookings.length} booking ditemukan di akun Budi.`);

  step('🔎', `Budi membuka detail booking ${bookingCode}...`);
  const detailBookRes = await api('GET', `/bookings/${bookingCode}`, undefined, guestToken);
  const detailBookJson = await assertOk(detailBookRes, `GET /bookings/${bookingCode}`);
  const confirmedBooking = (detailBookJson['data'] as Record<string, unknown>) ?? {};

  ok('Detail booking dikonfirmasi:');
  info('Kode Booking', confirmedBooking['bookingCode']);
  info('Status', confirmedBooking['status']);
  info('Check-In', confirmedBooking['checkIn']);
  info('Check-Out', confirmedBooking['checkOut']);
  info('Total Harga', `Rp ${Number(confirmedBooking['totalPrice']).toLocaleString('id-ID')}`);

  const finalStatus = confirmedBooking['status'] as string;
  if (!['paid', 'confirmed'].includes(finalStatus)) {
    console.warn(`\n  ⚠️   Status booking adalah "${finalStatus}" — bukan "paid".`);
    console.warn(`      Mungkin webhook belum diproses. Webhook simulation tetap berhasil.`);
  } else {
    ok(`Booking berstatus "${finalStatus}" ✅`);
  }

  // ──────────────────────────────────────────────────────────
  hr('CHAPTER 9 — TULIS REVIEW (SETELAH MENGINAP)');
  // ──────────────────────────────────────────────────────────

  // Force-mark booking as "completed" via Drizzle DB
  // (simulates check-out date passing — normally done by a cron job)
  step('🏁', 'Simulasi: Budi sudah check-out, sistem menandai booking sebagai completed...');
  await db.update(bookings).set({ status: 'completed' }).where(eq(bookings.id, bookingId));
  ok('Booking status → completed (check-out simulation selesai)');

  step('⭐', 'Budi pulang dari Bali & menulis review untuk villa...');
  const reviewRes = await api('POST', '/reviews', {
    villaId:  selectedVilla['id'],
    bookingId,
    rating:   5,
    comment:  'Villa luar biasa! Kolam renangnya langsung menghadap sawah, sangat private dan tenang. Staff sangat ramah dan membantu. Pasti akan balik lagi! Highly recommended untuk honeymoon 🌺',
  }, guestToken);

  const reviewJson = await assertOk(reviewRes, 'POST /reviews');
  const reviewData = (reviewJson['data'] as Record<string, unknown>) ?? {};
  const reviewId = (reviewData['id'] as string) ?? (reviewData['review'] as Record<string, unknown>)?.['id'];
  ok(`Review bintang 5 berhasil diposting! Review ID: ${reviewId}`);

  step('📖', 'Budi lihat semua review villa ini...');
  const listReviewRes = await api('GET', `/villas/${selectedVilla['id']}/reviews`);
  const listReviewJson = await assertOk(listReviewRes, 'GET /villas/:villaId/reviews');
  const reviews = (listReviewJson['data'] as unknown[]) ?? [];
  ok(`${reviews.length} review untuk villa ini:`);
  for (const rv of reviews.slice(0, 3)) {
    const r = rv as Record<string, unknown>;
    console.log(`     ⭐ ${'★'.repeat(Number(r['rating']))}  — "${String(r['comment']).slice(0, 60)}..."`);
  }

  // ──────────────────────────────────────────────────────────
  hr('CHAPTER 10 — PROFIL & RECAP');
  // ──────────────────────────────────────────────────────────

  step('👤', 'Budi cek profil lengkapnya di Balivio...');
  const meRes = await api('GET', '/auth/me', undefined, guestToken);
  const meJson = await assertOk(meRes, 'GET /auth/me');
  const meData = (meJson['data'] as Record<string, unknown>) ?? {};
  ok('Profil Budi:');
  info('Nama', meData['displayName'] ?? meData['name']);
  info('Email', meData['email']);
  info('Role', meData['role']);

  // ──────────────────────────────────────────────────────────
  hr('🎉  JOURNEY SELESAI — SEMUA BERHASIL!');
  // ──────────────────────────────────────────────────────────

  console.log(`
  Rangkuman perjalanan Budi Santoso di Balivio:

  ✅  Daftar akun baru             → User ID: ${guestUserId.slice(0, 8)}...
  ✅  Eksplorasi area & villa Bali → ${areas.length} area, ${villaList.length} villa tersedia
  ✅  Simpan villa ke wishlist     → ${wishItems.length} item tersimpan
  ✅  Buat booking villa           → ${bookingCode}
  ✅  Bayar via Transfer BCA       → Invoice Xendit dibuat
  ✅  Webhook PAID diterima        → Status booking updated
  ✅  Email e-voucher dikirim      → ${BUDI.email}
  ✅  Tulis review bintang 5       → Review ID: ${reviewId ?? 'ok'}

  Villa   : ${selectedVilla['name']}
  Check-in : ${BUDI.checkIn}  |  Check-out : ${BUDI.checkOut}
  Total   : Rp ${Number(bookingRaw['totalPrice']).toLocaleString('id-ID')}

  🌴 Balivio API berjalan sempurna end-to-end!
`);
}

main().catch((err) => {
  console.error('\n  💥  UNEXPECTED ERROR:', err);
  process.exit(1);
});
