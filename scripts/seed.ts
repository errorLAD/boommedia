import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

// Load .env.local if present
try {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n')
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
      if (match) {
        const key = match[1]
        let value = (match[2] || '').trim()
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
        if (!process.env[key]) process.env[key] = value
      }
    }
  }
} catch (e) {}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boommedia'

async function seed() {
  console.log('Connecting to MongoDB:', MONGODB_URI)
  await mongoose.connect(MONGODB_URI)

  const db = mongoose.connection.db
  if (!db) {
    console.error('No database handle')
    process.exit(1)
  }

  console.log('Clearing existing demo collections...')
  await Promise.all([
    db.collection('users').deleteMany({}),
    db.collection('brandprofiles').deleteMany({}),
    db.collection('influencerprofiles').deleteMany({}),
    db.collection('vehiclepartnerprofiles').deleteMany({}),
    db.collection('vehicles').deleteMany({}),
    db.collection('campaigns').deleteMany({}),
  ])

  const passwordHash = await bcrypt.hash('Password@123', 10)

  // 1. Create Admin
  const adminUser = await db.collection('users').insertOne({
    name: 'Admin Commander',
    email: 'admin@boommedia.in',
    passwordHash,
    role: 'ADMIN',
    status: 'ACTIVE',
    emailVerified: true,
    twoFactorEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // 2. Create Brand User & Profile
  const brandUser = await db.collection('users').insertOne({
    name: 'Mithila Handloom Co.',
    email: 'brand@mithilahandloom.com',
    phone: '+919876543210',
    passwordHash,
    role: 'BRAND',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  await db.collection('brandprofiles').insertOne({
    userId: brandUser.insertedId,
    companyName: 'Mithila Handloom Co.',
    contactPerson: 'Aditya Jha',
    industry: 'Fashion & Apparel',
    website: 'https://mithilahandloom.com',
    description: 'Authentic handcrafted Madhubani printed textiles and modern ethnic wear.',
    city: 'Darbhanga',
    state: 'Bihar',
    totalCampaigns: 2,
    totalSpend: 45000,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // 3. Create Influencer User & Profile
  const creatorUser = await db.collection('users').insertOne({
    name: 'Priya Sharma',
    email: 'priya@creator.com',
    phone: '+919876543211',
    passwordHash,
    role: 'INFLUENCER',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  await db.collection('influencerprofiles').insertOne({
    userId: creatorUser.insertedId,
    bio: 'Regional culture, authentic Bihar food explorations, and modern ethnic handloom fashion creator.',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    city: 'Darbhanga',
    state: 'Bihar',
    niche: 'Fashion & Lifestyle',
    categories: ['Fashion', 'Food', 'Culture', 'Lifestyle'],
    languages: ['Hindi', 'English', 'Maithili'],
    socialAccounts: [
      { platform: 'INSTAGRAM', handle: '@priya_mithila', followers: 28500, isVerified: true },
      { platform: 'YOUTUBE', handle: 'Priya Exploring Bihar', followers: 14200 },
    ],
    totalFollowers: 42700,
    avgEngagementRate: 4.8,
    pricing: { reel: 3500, post: 2500, story: 1200, youtubeVideo: 7500 },
    completedCampaigns: 12,
    rating: 4.9,
    reviewCount: 18,
    totalEarnings: 42500,
    availableBalance: 28500,
    verificationStatus: 'VERIFIED',
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // 4. Create Vehicle Partner User & Fleet
  const vehicleUser = await db.collection('users').insertOne({
    name: 'Ramesh Kumar Fleet',
    email: 'ramesh@fleet.com',
    phone: '+919876543212',
    passwordHash,
    role: 'VEHICLE_PARTNER',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const vehicleProfile = await db.collection('vehiclepartnerprofiles').insertOne({
    userId: vehicleUser.insertedId,
    city: 'Darbhanga',
    state: 'Bihar',
    totalVehicles: 3,
    activeVehicles: 2,
    totalEarnings: 36000,
    availableBalance: 24000,
    verificationStatus: 'VERIFIED',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  await db.collection('vehicles').insertOne({
    partnerId: vehicleUser.insertedId,
    partnerProfileId: vehicleProfile.insertedId,
    vehicleType: 'E_RICKSHAW',
    registrationNumber: 'BR-07-EA-4521',
    make: 'Mahindra',
    model: 'Treo',
    year: 2024,
    photos: [
      { url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1000&auto=format&fit=crop&q=80', isPrimary: true },
    ],
    city: 'Darbhanga',
    state: 'Bihar',
    operatingAreas: ['Tower Chowk', 'Station Road', 'DMCH', 'Laheriasarai'],
    routes: [
      { name: 'Station to Tower Chowk', from: 'Darbhanga Jn', to: 'Tower Chowk', distance: 4.5 },
    ],
    adPositions: [
      { position: 'BACK', size: { width: 36, height: 24, unit: 'inches' }, description: 'Full rear eye-level panel' },
      { position: 'LEFT', size: { width: 48, height: 18, unit: 'inches' }, description: 'Passenger side banner' },
    ],
    pricing: { perDay: 600, perWeek: 3500, perMonth: 12000 },
    estimatedDailyExposure: 18000,
    isAvailable: true,
    verificationStatus: 'VERIFIED',
    rating: 4.8,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // 5. Create Sample Combined Campaign
  await db.collection('campaigns').insertOne({
    brandId: brandUser.insertedId,
    name: 'Festive Handloom Launch — Darbhanga',
    slug: 'festive-handloom-launch-darbhanga',
    type: 'COMBINED',
    status: 'PUBLISHED',
    objective: 'Promote our Diwali ethnic saree collection with local creator unboxings and e-rickshaw street wraps.',
    description: 'Looking for 3 micro-influencers in Darbhanga/Patna for Instagram reels, and 5 e-rickshaws operating along the Station-to-Market corridor.',
    category: 'Fashion',
    cities: ['Darbhanga', 'Patna'],
    states: ['Bihar'],
    budget: {
      total: 27500,
      influencer: 15000,
      vehicle: 10000,
      platformFee: 2500,
      currency: 'INR',
    },
    deliverables: [
      { type: 'Instagram Reel', quantity: 3, description: 'Saree styling reel' },
      { type: 'Vehicle Wrap Banner', quantity: 5, description: 'E-Rickshaw full rear wraps for 30 days' },
    ],
    isPaid: true,
    applicationCount: 3,
    viewCount: 240,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  console.log('Seed completed successfully!')
  console.log('--- TEST ACCOUNTS ---')
  console.log('Admin: admin@boommedia.in / Password@123')
  console.log('Brand: brand@mithilahandloom.com / Password@123')
  console.log('Influencer: priya@creator.com / Password@123')
  console.log('Vehicle Partner: ramesh@fleet.com / Password@123')

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
