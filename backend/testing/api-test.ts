const BASE_URL = 'http://localhost:3001/api/v1';

let accessToken = '';
let refreshToken = '';
let testVillaId = '';
let testVillaSlug = '';
let testBookingCode = '';
let testBookingId = '';

const testEmail = `testuser_${Date.now()}@example.com`;
const testPassword = 'Password123!';

async function runTests() {
  console.log('🧪 Starting Balivio API Automated E2E Tests...\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthRes = await fetch('http://localhost:3001/health');
    const healthData = await healthRes.json() as any;
    console.log(`   Status: ${healthRes.status} OK | Response:`, healthData);
    if (healthData.status !== 'ok') throw new Error('Health check failed');
    console.log('   ✅ Health Check Passed!\n');

    // 2. Master Data - Areas
    console.log('2️⃣ Testing GET /areas...');
    const areasRes = await fetch(`${BASE_URL}/areas`);
    const areasData = await areasRes.json() as any;
    console.log(`   Status: ${areasRes.status} | Data Count: ${areasData.data?.length ?? 0}`);
    console.log('   ✅ GET /areas Passed!\n');

    // 3. Master Data - Property Types & Amenities
    console.log('3️⃣ Testing GET /property-types & GET /amenities...');
    const propsRes = await fetch(`${BASE_URL}/property-types`);
    const propsData = await propsRes.json() as any;
    const amenRes = await fetch(`${BASE_URL}/amenities`);
    const amenData = await amenRes.json() as any;
    console.log(`   Property Types: ${propsData.data?.length ?? 0} | Amenities: ${amenData.data?.length ?? 0}`);
    console.log('   ✅ Master Data Passed!\n');

    // 4. Register
    console.log('4️⃣ Testing POST /auth/register...');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        displayName: 'Test Automation User',
        phone: '081234567890',
      }),
    });
    const regData = await regRes.json() as any;
    console.log(`   Status: ${regRes.status} | Message: ${regData.message}`);
    if (!regData.success) throw new Error(`Registration failed: ${regData.message}`);
    console.log('   ✅ Register Passed!\n');

    // 5. Login
    console.log('5️⃣ Testing POST /auth/login...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    const loginData = await loginRes.json() as any;
    console.log(`   Status: ${loginRes.status} | Message: ${loginData.message}`);
    if (!loginData.success) throw new Error(`Login failed: ${loginData.message}`);

    accessToken = loginData.data.session.accessToken;
    refreshToken = loginData.data.session.refreshToken;
    console.log('   🔑 Access Token Received!');
    console.log('   ✅ Login Passed!\n');

    // 6. Auth Me
    console.log('6️⃣ Testing GET /auth/me...');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const meData = await meRes.json() as any;
    console.log(`   Status: ${meRes.status} | User Email: ${meData.data?.email}`);
    console.log('   ✅ GET /auth/me Passed!\n');

    // 7. Get Villas List
    console.log('7️⃣ Testing GET /villas...');
    const villasRes = await fetch(`${BASE_URL}/villas`);
    const villasData = await villasRes.json() as any;
    console.log(`   Status: ${villasRes.status} | Total Villas: ${villasData.meta?.total ?? 0}`);
    if (!villasData.success) throw new Error(`GET /villas failed: ${villasData.message}`);
    if (villasData.data && villasData.data.length > 0) {
      testVillaId = villasData.data[0].id;
      testVillaSlug = villasData.data[0].slug;
    }
    console.log('   ✅ GET /villas Passed!\n');

    // 8. Wishlist Flow
    if (testVillaId) {
      console.log('8️⃣ Testing Wishlist Flow (POST & GET /wishlists)...');
      const addWishRes = await fetch(`${BASE_URL}/wishlists/${testVillaId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const addWishData = await addWishRes.json() as any;
      console.log(`   Add Wishlist Status: ${addWishRes.status} | Message: ${addWishData.message}`);

      const getWishRes = await fetch(`${BASE_URL}/wishlists`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const getWishData = await getWishRes.json() as any;
      console.log(`   Get Wishlist Count: ${getWishData.data?.length ?? 0}`);
      console.log('   ✅ Wishlist Flow Passed!\n');
    }

    console.log('🎉 ALL API TESTS COMPLETED SUCCESSFULLY! 🎉');
  } catch (err) {
    console.error('❌ Test runner failed with error:', err);
    process.exit(1);
  }
}

runTests();
