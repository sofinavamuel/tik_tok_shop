/**
 * Seed script for Strapi CMS
 * Run this after Strapi is running to populate initial data.
 *
 * Usage:
 *   node seed.js
 *
 * Requires:
 *   - Strapi to be running at http://localhost:1337
 *   - Admin credentials set via ADMIN_EMAIL and ADMIN_PASSWORD env vars
 *     (defaults: admin@espacioeme.com / Admin12345!)
 */

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@espacioeme.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin12345!';

async function login() {
  const res = await fetch(`${BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Login failed: ${data.error?.message || res.status}`);
  return data.data.token;
}

async function createMarkets(token) {
  const markets = [
    { name: 'UK', currency: 'GBP', language: 'en', tiktok_shop_active: true, gmv_total: 1500000, growth_rate: 12.5, saturation_score: 7.8 },
    { name: 'US', currency: 'USD', language: 'en', tiktok_shop_active: true, gmv_total: 5000000, growth_rate: 18.3, saturation_score: 6.5 },
    { name: 'Mexico', currency: 'MXN', language: 'es', tiktok_shop_active: true, gmv_total: 800000, growth_rate: 25.1, saturation_score: 4.2 },
  ];

  for (const market of markets) {
    const res = await fetch(`${BASE_URL}/api/markets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ data: market }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Created market: ${market.name}`);
    } else {
      console.error(`❌ Failed to create market ${market.name}:`, data.error?.message);
    }
  }
}

async function main() {
  try {
    console.log('🔑 Logging in...');
    const token = await login();
    console.log('✅ Logged in successfully');

    console.log('\n🌍 Creating markets...');
    await createMarkets(token);

    console.log('\n✅ Seed complete!');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

main();
