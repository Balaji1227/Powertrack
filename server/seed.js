require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const EnergyReading = require('./models/EnergyReading');

const connectDB = require('./config/db');

const regions = ['North', 'South', 'East', 'West', 'Central'];
const meterTypes = ['residential', 'commercial', 'industrial'];

const randomBetween = (min, max) => Math.random() * (max - min) + min;

async function seedUsers() {
  await User.deleteMany({});
  await User.create([
    { name: 'Admin User', email: 'admin@powertrack.com', password: 'Admin@123', role: 'Admin', region: 'Central' },
    { name: 'Analyst User', email: 'analyst@powertrack.com', password: 'Analyst@123', role: 'Analyst', region: 'North' },
    { name: 'Viewer User', email: 'viewer@powertrack.com', password: 'Viewer@123', role: 'Viewer', region: 'South' },
  ]);
  console.log('✅ Users seeded (3 accounts)');
}

async function seedEnergyReadings() {
  await EnergyReading.deleteMany({});

  const readings = [];
  const now = new Date();

  // Generate 10,000 readings over the past 90 days
  for (let i = 0; i < 10000; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(timestamp.getHours() - hoursAgo);

    const meterType = meterTypes[Math.floor(Math.random() * meterTypes.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];

    // Realistic consumption values by type
    const consumptionBase = meterType === 'industrial' ? 500 : meterType === 'commercial' ? 100 : 20;
    const consumption = parseFloat(randomBetween(consumptionBase * 0.7, consumptionBase * 1.3).toFixed(2));
    const peakDemand = parseFloat((consumption * randomBetween(0.4, 0.7)).toFixed(2));
    const cost = parseFloat((consumption * 0.12).toFixed(2)); // $0.12 per kWh
    const carbonEmission = parseFloat((consumption * 0.45).toFixed(2)); // 0.45 kg CO2 per kWh

    readings.push({
      meterId: `MTR-${String(Math.floor(Math.random() * 20) + 1).padStart(4, '0')}`,
      meterType,
      region,
      consumption,
      peakDemand,
      cost,
      timestamp,
      carbonEmission,
    });
  }

  await EnergyReading.insertMany(readings);
  console.log(`✅ Energy readings seeded (${readings.length} records)`);
}

async function seed() {
  await connectDB();
  await seedUsers();
  await seedEnergyReadings();
  console.log('🌱 Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
