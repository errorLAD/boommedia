export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import User from '@/lib/db/models/User'
import BrandProfile from '@/lib/db/models/BrandProfile'
import InfluencerProfile from '@/lib/db/models/InfluencerProfile'
import VehiclePartnerProfile from '@/lib/db/models/VehiclePartnerProfile'
import ActivityLog from '@/lib/db/models/ActivityLog'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { nanoid } from 'nanoid'
import { sendVerificationEmail } from '@/lib/email/resend'
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit'

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rateCheck = checkRateLimit(`register:${ip}`, 5, 900) // 5 per 15 minutes
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many registration requests from this network. Please wait a few minutes.' },
        { status: 429 }
      )
    }

    const body = await req.json()

    const {
      name,
      email,
      password,
      phone,
      role,
      city,
      state,
      // Brand-specific
      companyName,
      contactPerson,
      brandName,
      brandWebsite,
      brandCategory,
      industry,
      gstNumber,
      // Influencer-specific
      niche,
      bio,
      // Vehicle Partner-specific
      fleetSize,
    } = body

    // Normalize role string
    const normalizedRole = role ? role.toUpperCase().replace('-', '_') : ''

    // Validate required fields
    if (!name || !email || !password || !phone || !normalizedRole) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, email, password, phone, role' },
        { status: 400 }
      )
    }

    // Prevent ADMIN self-registration
    if (normalizedRole === 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin accounts cannot be self-registered' },
        { status: 403 }
      )
    }

    // Validate role
    const validRoles = ['BRAND', 'INFLUENCER', 'VEHICLE_PARTNER']
    if (!validRoles.includes(normalizedRole)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role. Must be BRAND, INFLUENCER, or VEHICLE_PARTNER' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if email is already registered
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password (cost 10 gives high security with sub-100ms hashing time)
    const passwordHash = await bcrypt.hash(password, 10)

    // Generate email verification token (using fast cryptographic SHA-256)
    const verificationToken = nanoid(64)
    const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex')

    // Create user document
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      phone: phone.trim(),
      role: normalizedRole,
      status: 'ACTIVE',
      emailVerified: false,
      emailVerificationToken: verificationTokenHash,
      emailVerificationExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    })

    // Create role-specific profile
    let profile = null

    if (normalizedRole === 'BRAND') {
      profile = await BrandProfile.create({
        userId: user._id,
        companyName: companyName || brandName || name,
        contactPerson: contactPerson || name,
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        city: city || '',
        state: state || '',
        industry: brandCategory || industry || 'General',
        website: brandWebsite || '',
        gstNumber: gstNumber || '',
        isVerified: false,
      })

      await ActivityLog.create({
        userId: user._id,
        userName: user.name,
        userRole: 'BRAND',
        action: 'BRAND_REGISTERED',
        targetType: 'BRAND',
        targetId: user._id,
        targetName: companyName || name,
        details: `Brand "${companyName || name}" registered in ${city || 'India'}.`,
      }).catch(() => {})
    } else if (normalizedRole === 'INFLUENCER') {
      profile = await InfluencerProfile.create({
        userId: user._id,
        niche: niche || '',
        city: city || '',
        state: state || '',
        bio: bio || '',
        socialAccounts: [],
        totalFollowers: 0,
        avgEngagementRate: 0,
        pricing: { post: 0, story: 0, reel: 0, video: 0 },
        verificationStatus: 'UNVERIFIED',
        isPublic: false,
      })

      await ActivityLog.create({
        userId: user._id,
        userName: user.name,
        userRole: 'INFLUENCER',
        action: 'INFLUENCER_REGISTERED',
        targetType: 'INFLUENCER',
        targetId: user._id,
        targetName: user.name,
        details: `Creator "${user.name}" registered in ${city || 'India'}.`,
      }).catch(() => {})
    } else if (normalizedRole === 'VEHICLE_PARTNER') {
      profile = await VehiclePartnerProfile.create({
        userId: user._id,
        companyName: companyName || name,
        contactPerson: name,
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        fleetSize: fleetSize || 1,
        city: city || '',
        state: state || '',
        verificationStatus: 'PENDING',
      })

      await ActivityLog.create({
        userId: user._id,
        userName: user.name,
        userRole: 'VEHICLE_PARTNER',
        action: 'VEHICLE_PARTNER_REGISTERED',
        targetType: 'VEHICLE_PARTNER',
        targetId: user._id,
        targetName: companyName || name,
        details: `Vehicle partner "${companyName || name}" registered with fleet size ${fleetSize || 1}.`,
      }).catch(() => {})
    }

    // Send verification email in the background without blocking registration response
    if (process.env.RESEND_API_KEY) {
      sendVerificationEmail(user.email, user.name, verificationToken).catch((emailError) => {
        console.error('Failed to send verification email in background:', emailError)
      })
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully.',
        data: {
          userId: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          profileId: profile?._id?.toString(),
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
