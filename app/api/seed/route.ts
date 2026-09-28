import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

export async function POST(req: NextRequest) {
  // Prevent destructive wipe in production unless explicitly permitted with secret
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DANGEROUS_SEED !== 'true') {
    return NextResponse.json(
      { error: 'Database seeding is forbidden in production environments.' },
      { status: 403 }
    )
  }

  const seedSecret = req.headers.get('x-seed-secret') || req.headers.get('authorization')?.replace('Bearer ', '')
  const validSecret = process.env.ADMIN_SETUP_SECRET || process.env.NEXTAUTH_SECRET
  if (validSecret && seedSecret !== validSecret) {
    return NextResponse.json(
      { error: 'Unauthorized: valid seed secret required.' },
      { status: 401 }
    )
  }

  try {
    await connectDB()
    const db = mongoose.connection.db
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })

    await Promise.all([
      db.collection('users').deleteMany({}),
      db.collection('brandprofiles').deleteMany({}),
      db.collection('influencerprofiles').deleteMany({}),
      db.collection('vehiclepartnerprofiles').deleteMany({}),
      db.collection('vehicles').deleteMany({}),
      db.collection('campaigns').deleteMany({}),
    ])

    const passwordHash = await bcrypt.hash('Password@123', 10)

    // Admin
    await db.collection('users').insertOne({
      name: 'Platform Administrator',
      email: 'admin@boommedia.in',
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Brand
    const brand = await db.collection('users').insertOne({
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
      userId: brand.insertedId,
      companyName: 'Mithila Handloom Co.',
      contactPerson: 'Aditya Jha',
      industry: 'Fashion & Apparel',
      website: 'https://mithilahandloom.com',
      city: 'Darbhanga',
      state: 'Bihar',
      totalCampaigns: 2,
      totalSpend: 45000,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Influencer
    const creator = await db.collection('users').insertOne({
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
      userId: creator.insertedId,
      bio: 'Fashion & regional lifestyle creator in Bihar.',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      city: 'Darbhanga',
      state: 'Bihar',
      niche: 'Fashion',
      categories: ['Fashion', 'Culture'],
      languages: ['Hindi', 'Maithili'],
      socialAccounts: [{ platform: 'INSTAGRAM', handle: '@priya_mithila', followers: 28500 }],
      totalFollowers: 28500,
      avgEngagementRate: 4.8,
      pricing: { reel: 3500, post: 2500, story: 1200 },
      verificationStatus: 'VERIFIED',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Vehicle Partner
    const vehicle = await db.collection('users').insertOne({
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

    const vProfile = await db.collection('vehiclepartnerprofiles').insertOne({
      userId: vehicle.insertedId,
      city: 'Darbhanga',
      state: 'Bihar',
      totalVehicles: 2,
      verificationStatus: 'VERIFIED',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await db.collection('vehicles').insertOne({
      partnerId: vehicle.insertedId,
      partnerProfileId: vProfile.insertedId,
      vehicleType: 'E_RICKSHAW',
      registrationNumber: 'BR-07-EA-4521',
      make: 'Mahindra',
      model: 'Treo',
      year: 2024,
      photos: [{ url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80', isPrimary: true }],
      city: 'Darbhanga',
      state: 'Bihar',
      operatingAreas: ['Station Road', 'Tower Chowk'],
      pricing: { perWeek: 3500, perMonth: 12000 },
      estimatedDailyExposure: 18000,
      isAvailable: true,
      verificationStatus: 'VERIFIED',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Campaign
    await db.collection('campaigns').insertOne({
      brandId: brand.insertedId,
      name: 'Festive Handloom Launch — Darbhanga',
      slug: 'festive-handloom-launch-darbhanga',
      type: 'COMBINED',
      status: 'PUBLISHED',
      objective: 'Launch festive handloom saree collection with creators and e-rickshaws.',
      description: 'Synchronized digital reels with 5 e-rickshaws across Darbhanga commercial hubs.',
      category: 'Fashion',
      cities: ['Darbhanga', 'Patna'],
      states: ['Bihar'],
      budget: { total: 27500, influencer: 15000, vehicle: 10000, platformFee: 2500, currency: 'INR' },
      isPaid: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: 'Demo seed data created successfully',
      accounts: {
        admin: 'admin@boommedia.in / Password@123',
        brand: 'brand@mithilahandloom.com / Password@123',
        influencer: 'priya@creator.com / Password@123',
        vehicle: 'ramesh@fleet.com / Password@123',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Seed error' }, { status: 500 })
  }
}
