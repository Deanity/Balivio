import 'dotenv/config';
import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env');
  process.exit(1);
}

const client = postgres(DATABASE_URL);

async function applySchema() {
  console.log('📦 Executing SCHEMA_DB.sql to Supabase PostgreSQL...');

  const schemaPath = path.resolve(__dirname, '../../../SCHEMA_DB.sql');
  const sqlContent = fs.readFileSync(schemaPath, 'utf8');

  try {
    await client.unsafe(sqlContent);
    console.log('✅ All database tables, functions, and triggers successfully created in Supabase!');
  } catch (err) {
    console.error('❌ Failed to execute schema SQL:', err);
  } finally {
    await client.end();
  }
}

applySchema();
