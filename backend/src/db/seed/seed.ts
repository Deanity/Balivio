/**
 * Seed script — populates master data tables:
 * - areas (5 Bali regions)
 * - property_types (4 types)
 * - amenities (common villa amenities)
 *
 * Run: npm run db:seed
 */

import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env');
  process.exit(1);
}

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function seed(): Promise<void> {
  console.log('🌱 Seeding master data...');

  // ---- AREAS ----
  await client`
    INSERT INTO areas (name, region, description) VALUES
      ('Canggu',    'Bali', 'Trendy coastal village known for surf and cafes'),
      ('Ubud',      'Bali', 'Cultural heart of Bali with rice terraces and yoga retreats'),
      ('Uluwatu',   'Bali', 'Cliff-top area famous for temples and surf breaks'),
      ('Seminyak',  'Bali', 'Upscale beach resort area with fine dining'),
      ('Nusa Dua',  'Bali', 'Luxury resort enclave with calm beaches')
    ON CONFLICT (name) DO NOTHING
  `;
  console.log('  ✅ Areas seeded');

  // ---- PROPERTY TYPES ----
  await client`
    INSERT INTO property_types (name, description) VALUES
      ('Private Villa',   'Fully private villa with dedicated pool and staff'),
      ('Boutique Villa',  'Charming smaller villa with unique character'),
      ('Family Villa',    'Spacious villa designed for family stays'),
      ('Luxury Villa',    'Premium villa with top-tier amenities and service')
    ON CONFLICT (name) DO NOTHING
  `;
  console.log('  ✅ Property types seeded');

  // ---- AMENITIES ----
  await client`
    INSERT INTO amenities (key, label, icon_name, category) VALUES
      ('wifi',        'WiFi',             'Wifi',         'General'),
      ('pool',        'Private Pool',     'Waves',        'General'),
      ('ac',          'Air Conditioning', 'Wind',         'General'),
      ('kitchen',     'Full Kitchen',     'UtensilsCrossed', 'General'),
      ('breakfast',   'Breakfast',        'Coffee',       'General'),
      ('parking',     'Free Parking',     'Car',          'General'),
      ('beach',       'Beach Access',     'Palmtree',     'General'),
      ('gym',         'Gym / Fitness',    'Dumbbell',     'Entertainment'),
      ('tv',          'Smart TV',         'Tv',           'Entertainment'),
      ('bbq',         'BBQ Grill',        'Flame',        'Entertainment'),
      ('smoke_detector', 'Smoke Detector','ShieldCheck',  'Safety'),
      ('first_aid',   'First Aid Kit',    'HeartPulse',   'Safety'),
      ('cctv',        'CCTV',             'Camera',       'Safety'),
      ('laundry',     'Laundry',          'WashingMachine','General'),
      ('spa',         'Spa / Jacuzzi',    'Sparkles',     'Entertainment')
    ON CONFLICT (key) DO NOTHING
  `;
  console.log('  ✅ Amenities seeded');

  console.log('🎉 Seeding complete!');
  await client.end();
}

seed().catch((err: unknown) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
