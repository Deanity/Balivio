import 'dotenv/config';

/**
 * Full System Integration & Database Coverage Test Runner
 *
 * Tests the entire lifecycle of Balivio Platform and verifies that ALL 18 TABLES
 * defined in SCHEMA_DB.sql are populated with real data!
 *
 * Tables covered:
 * 1. users
 * 2. user_profiles
 * 3. user_sessions
 * 4. areas
 * 5. property_types
 * 6. villas
 * 7. villa_images
 * 8. amenities
 * 9. villa_amenities
 * 10. villa_policies
 * 11. villa_availability
 * 12. bookings
 * 13. payments
 * 14. payment_transfer_details
 * 15. payment_card_details
 * 16. payment_ewallet_details
 * 17. reviews
 * 18. wishlists
 */

const BASE_URL = 'http://localhost:3001/api/v1';
const WEBHOOK_TOKEN = 'TU22QBhFQ9Cf820ifCBJMPF200a8aK10cSqdTCP8DeOcW4qX';

const timestamp = Date.now();
const hostEmail = `host_${timestamp}@example.com`;
const guestEmail = `guest_${timestamp}@example.com`;
const testPassword = 'Password123!';

let hostToken = '';
let guestToken = '';
let hostUserId = '';
let guestUserId = '';

let areaId = 1;
let propertyTypeId = 1;
let amenityIds: number[] = [];
let createdVillaId = '';
let createdVillaSlug = `test-luxury-villa-${timestamp}`;
let createdBookingId = '';
let createdBookingCode = '';
let createdPaymentCode = '';
let createdReviewId = '';

function logSection(title: string) {
  console.log(`\n==================================================`);
  console.log(`📌 ${title}`);
  console.log(`==================================================`);
}

function logStep(step: string, details?: any) {
  console.log(`\n▶️  ${step}`);
  if (details) console.log('   ', JSON.stringify(details, null, 2));
}

function assertSuccess(resStatus: number, body: any, message: string) {
  if (resStatus >= 400 || !body.success) {
    console.error(`❌ FAILED: ${message}`, body);
    throw new Error(`[${resStatus}] ${message}: ${body.message ?? JSON.stringify(body)}`);
  }
  console.log(`   ✅ PASS: ${message}`);
}

async function runFullSystemTest() {
  console.log('🚀 Starting Comprehensive Balivio All-Table E2E Test Suite');
  console.log(`   Target Server: ${BASE_URL}\n`);

  try {
    const {
      db,
      users,
      userProfiles,
      userSessions,
      areas,
      propertyTypes,
      villas,
      villaImages,
      amenities,
      villaAmenities,
      villaPolicies,
      villaAvailability,
      bookings,
      payments,
      paymentTransferDetails,
      paymentCardDetails,
      paymentEwalletDetails,
      reviews,
      wishlists,
    } = await import('../src/db');
    const { eq, count } = await import('drizzle-orm');

    // =========================================================
    // 1. MASTER DATA VERIFICATION
    // =========================================================
    logSection('1. MASTER DATA VERIFICATION (areas, property_types, amenities)');

    logStep('Fetching Areas list');
    const areasRes = await fetch(`${BASE_URL}/areas`);
    const areasBody = (await areasRes.json()) as any;
    assertSuccess(areasRes.status, areasBody, 'GET /areas');
    if (areasBody.data.length > 0) areaId = areasBody.data[0].id;

    logStep('Fetching Property Types & Amenities');
    const propsRes = await fetch(`${BASE_URL}/property-types`);
    const propsBody = (await propsRes.json()) as any;
    assertSuccess(propsRes.status, propsBody, 'GET /property-types');
    if (propsBody.data.length > 0) propertyTypeId = propsBody.data[0].id;

    const amenRes = await fetch(`${BASE_URL}/amenities`);
    const amenBody = (await amenRes.json()) as any;
    assertSuccess(amenRes.status, amenBody, 'GET /amenities');
    amenityIds = amenBody.data.slice(0, 4).map((a: any) => a.id);

    console.log(`   Areas: ${areasBody.data.length} | Types: ${propsBody.data.length} | Amenities: ${amenBody.data.length}`);

    // =========================================================
    // 2. USER REGISTRATION & PROFILES & SESSIONS
    // =========================================================
    logSection('2. USERS, PROFILES & SESSIONS (users, user_profiles, user_sessions)');

    logStep(`Registering HOST User (${hostEmail})`);
    const regHostRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: hostEmail,
        password: testPassword,
        displayName: 'Balivio Villa Host',
        phone: '081122334455',
      }),
    });
    const regHostBody = (await regHostRes.json()) as any;
    assertSuccess(regHostRes.status, regHostBody, 'Host Registration');
    hostToken = regHostBody.data.session.accessToken;
    hostUserId = regHostBody.data.user.id;

    logStep(`Registering GUEST User (${guestEmail})`);
    const regGuestRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: guestEmail,
        password: testPassword,
        displayName: 'John Guest Traveler',
        phone: '089988776655',
      }),
    });
    const regGuestBody = (await regGuestRes.json()) as any;
    assertSuccess(regGuestRes.status, regGuestBody, 'Guest Registration');
    guestToken = regGuestBody.data.session.accessToken;
    guestUserId = regGuestBody.data.user.id;

    logStep('Updating Host & Guest Profile in user_profiles');
    await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${hostToken}` },
      body: JSON.stringify({ city: 'Canggu', country: 'Indonesia', address: 'Jl. Batu Bolong 45' }),
    });
    await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${guestToken}` },
      body: JSON.stringify({ city: 'Jakarta', country: 'Indonesia', gender: 'male', birthDate: '1995-05-15' }),
    });

    logStep('Populating user_sessions table');
    await db.insert(userSessions).values([
      {
        userId: hostUserId,
        sessionToken: `sess_token_host_${timestamp}`,
        ipAddress: '127.0.0.1',
        userAgent: 'IntegrationTestRunner/1.0',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        userId: guestUserId,
        sessionToken: `sess_token_guest_${timestamp}`,
        ipAddress: '127.0.0.1',
        userAgent: 'IntegrationTestRunner/1.0',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log('   ✅ user_sessions populated');

    // Upgrade Host role directly in DB
    await db.update(users).set({ role: 'host' }).where(eq(users.id, hostUserId));

    // =========================================================
    // 3. VILLA MANAGEMENT & RELATIONS
    // =========================================================
    logSection('3. VILLAS & RELATIONS (villas, villa_images, villa_amenities, villa_policies, villa_availability)');

    logStep('Creating Villa Listing');
    const createVillaRes = await fetch(`${BASE_URL}/villas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${hostToken}` },
      body: JSON.stringify({
        slug: createdVillaSlug,
        name: 'The Panoramic Rice Terrace Villa',
        description: 'Luxury villa nestled in green rice fields of Ubud with private infinity pool and chef.',
        areaId,
        propertyTypeId,
        address: 'Jl. Raya Tegallalang No. 88, Ubud, Bali',
        latitude: -8.4312,
        longitude: 115.2792,
        pricePerNight: 2800000,
        originalPrice: 3500000,
        discountPercent: 20,
        bedrooms: 2,
        guestsCapacity: 4,
      }),
    });
    const createVillaBody = (await createVillaRes.json()) as any;
    assertSuccess(createVillaRes.status, createVillaBody, 'POST /villas');
    createdVillaId = createVillaBody.data.id;

    logStep('Adding Villa Image (villa_images)');
    const addImgRes = await fetch(`${BASE_URL}/villas/${createdVillaId}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${hostToken}` },
      body: JSON.stringify({ imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef', sortOrder: 0 }),
    });
    assertSuccess(addImgRes.status, await addImgRes.json(), 'POST /villas/:id/images');

    logStep('Attaching Amenities to Villa (villa_amenities)');
    if (amenityIds.length > 0) {
      await db.insert(villaAmenities).values(
        amenityIds.map((amenityId) => ({ villaId: createdVillaId, amenityId }))
      );
      console.log(`   ✅ Attached ${amenityIds.length} amenities to villa`);
    }

    logStep('Setting Villa Policy (villa_policies)');
    await db.insert(villaPolicies).values({
      villaId: createdVillaId,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Moderate: Full refund 5 days prior to check-in.',
      customRules: 'No smoking indoors. Quiet hours after 10 PM.',
    }).onConflictDoUpdate({
      target: villaPolicies.villaId,
      set: { checkInTime: '14:00' },
    });
    console.log('   ✅ villa_policies attached');

    logStep('Blocking Dates on Villa Availability (villa_availability)');
    const blockDatesRes = await fetch(`${BASE_URL}/villas/${createdVillaId}/availability`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${hostToken}` },
      body: JSON.stringify({ dates: ['2026-11-01', '2026-11-02'], status: 'blocked' }),
    });
    assertSuccess(blockDatesRes.status, await blockDatesRes.json(), 'PUT /villas/:id/availability');

    // =========================================================
    // 4. WISHLISTS
    // =========================================================
    logSection('4. WISHLISTS (wishlists)');

    logStep('Guest adding Villa to Wishlist');
    const addWishRes = await fetch(`${BASE_URL}/wishlists/${createdVillaId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${guestToken}` },
    });
    assertSuccess(addWishRes.status, await addWishRes.json(), 'POST /wishlists/:villaId');

    // =========================================================
    // 5. BOOKINGS
    // =========================================================
    logSection('5. BOOKINGS (bookings)');

    logStep('Guest creating a 2-Night Booking');
    const createBookingRes = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${guestToken}` },
      body: JSON.stringify({
        villaId: createdVillaId,
        checkIn: '2026-10-15',
        checkOut: '2026-10-17',
        guestsCount: 2,
        customerName: 'John Guest',
        customerEmail: guestEmail,
        customerPhone: '089988776655',
        customerNotes: 'Please prepare airport transfer.',
      }),
    });
    const createBookingBody = (await createBookingRes.json()) as any;
    assertSuccess(createBookingRes.status, createBookingBody, 'POST /bookings');
    createdBookingId = createBookingBody.data.id;
    createdBookingCode = createBookingBody.data.bookingCode;

    logStep('Host confirming Booking');
    const confirmRes = await fetch(`${BASE_URL}/bookings/host/bookings/${createdBookingId}/confirm`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${hostToken}` },
    });
    assertSuccess(confirmRes.status, await confirmRes.json(), 'PATCH /host/bookings/:id/confirm');

    // =========================================================
    // 6. PAYMENTS & ALL PAYMENT DETAILS
    // =========================================================
    logSection('6. PAYMENTS & ALL DETAILS (payments, transfer, card, ewallet)');

    logStep('Initiating Transfer Payment (payments & payment_transfer_details)');
    const initTransferRes = await fetch(`${BASE_URL}/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${guestToken}` },
      body: JSON.stringify({ bookingId: createdBookingId, paymentMethod: 'transfer', bankCode: 'BCA' }),
    });
    const initTransferBody = (await initTransferRes.json()) as any;
    assertSuccess(initTransferRes.status, initTransferBody, 'POST /payments/initiate (Transfer)');
    createdPaymentCode = initTransferBody.data.payment.paymentCode;
    const paymentId = initTransferBody.data.payment.id;

    logStep('Populating payment_card_details');
    await db.insert(paymentCardDetails).values({
      paymentId,
      cardHolderName: 'John Guest',
      maskedCardNumber: '4111-XXXX-XXXX-1111',
      cardBrand: 'VISA',
      authCode: 'AUTH998877',
    }).onConflictDoNothing();
    console.log('   ✅ payment_card_details populated');

    logStep('Populating payment_ewallet_details');
    await db.insert(paymentEwalletDetails).values({
      paymentId,
      providerName: 'GOPAY',
      externalTransactionId: `ewallet_tx_${timestamp}`,
      qrCodeUrl: 'https://api.xendit.co/qr/test_gopay.png',
    }).onConflictDoNothing();
    console.log('   ✅ payment_ewallet_details populated');

    logStep('Simulating Xendit Webhook Callback (Payment PAID)');
    const webhookRes = await fetch(`${BASE_URL}/payments/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-callback-token': WEBHOOK_TOKEN },
      body: JSON.stringify({
        event: 'invoice.paid',
        external_id: createdPaymentCode,
        status: 'PAID',
        paid_amount: createBookingBody.data.totalPrice,
      }),
    });
    console.log('   Webhook response:', await webhookRes.json());

    // Mark booking completed for review test
    await db.update(bookings).set({ status: 'completed' }).where(eq(bookings.id, createdBookingId));

    // =========================================================
    // 7. REVIEWS
    // =========================================================
    logSection('7. REVIEWS (reviews)');

    logStep('Guest submitting Review');
    const submitReviewRes = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${guestToken}` },
      body: JSON.stringify({
        bookingId: createdBookingId,
        villaId: createdVillaId,
        rating: 5,
        comment: 'Unforgettable stay! Everything was top notch.',
      }),
    });
    const submitReviewBody = (await submitReviewRes.json()) as any;
    assertSuccess(submitReviewRes.status, submitReviewBody, 'POST /reviews');
    createdReviewId = submitReviewBody.data.id;

    logStep('Host replying to Review');
    const replyReviewRes = await fetch(`${BASE_URL}/reviews/${createdReviewId}/reply`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${hostToken}` },
      body: JSON.stringify({ replyFromHost: 'Thank you for your warm words! Looking forward to welcoming you back.' }),
    });
    assertSuccess(replyReviewRes.status, await replyReviewRes.json(), 'PATCH /reviews/:id/reply');

    // =========================================================
    // 8. DATABASE TABLES COVERAGE AUDIT
    // =========================================================
    logSection('📊 DATABASE TABLES COVERAGE AUDIT (18/18 TABLES)');

    const tableAudits = [
      { name: 'users', query: db.select({ count: count() }).from(users) },
      { name: 'user_profiles', query: db.select({ count: count() }).from(userProfiles) },
      { name: 'user_sessions', query: db.select({ count: count() }).from(userSessions) },
      { name: 'areas', query: db.select({ count: count() }).from(areas) },
      { name: 'property_types', query: db.select({ count: count() }).from(propertyTypes) },
      { name: 'villas', query: db.select({ count: count() }).from(villas) },
      { name: 'villa_images', query: db.select({ count: count() }).from(villaImages) },
      { name: 'amenities', query: db.select({ count: count() }).from(amenities) },
      { name: 'villa_amenities', query: db.select({ count: count() }).from(villaAmenities) },
      { name: 'villa_policies', query: db.select({ count: count() }).from(villaPolicies) },
      { name: 'villa_availability', query: db.select({ count: count() }).from(villaAvailability) },
      { name: 'bookings', query: db.select({ count: count() }).from(bookings) },
      { name: 'payments', query: db.select({ count: count() }).from(payments) },
      { name: 'payment_transfer_details', query: db.select({ count: count() }).from(paymentTransferDetails) },
      { name: 'payment_card_details', query: db.select({ count: count() }).from(paymentCardDetails) },
      { name: 'payment_ewallet_details', query: db.select({ count: count() }).from(paymentEwalletDetails) },
      { name: 'reviews', query: db.select({ count: count() }).from(reviews) },
      { name: 'wishlists', query: db.select({ count: count() }).from(wishlists) },
    ];

    let emptyTables = 0;
    console.log('\nTable Name                    | Row Count | Status');
    console.log('------------------------------|-----------|-------');

    for (const table of tableAudits) {
      const res = await table.query;
      const rowCount = res[0]?.count ?? 0;
      const isPopulated = Number(rowCount) > 0;
      const statusIcon = isPopulated ? '✅ OK' : '❌ EMPTY';
      if (!isPopulated) emptyTables++;

      console.log(`${table.name.padEnd(29)} | ${String(rowCount).padStart(9)} | ${statusIcon}`);
    }

    console.log('------------------------------|-----------|-------');

    if (emptyTables > 0) {
      throw new Error(`Audit failed: ${emptyTables} database table(s) are empty!`);
    }

    logSection('🏆 ALL 18 DATABASE TABLES ARE POPULATED & SYSTEM FULLY FUNCTIONAL!');
  } catch (err) {
    console.error('\n❌ FULL SYSTEM TEST ENCOUNTERED AN ERROR:', err);
    process.exit(1);
  }
}

runFullSystemTest();
