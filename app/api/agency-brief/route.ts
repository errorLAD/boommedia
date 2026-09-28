import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Campaign from '@/lib/db/models/Campaign'
import BrandProfile from '@/lib/db/models/BrandProfile'
import User from '@/lib/db/models/User'
import { auth } from '@/auth'
import bcrypt from 'bcryptjs'
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit'

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rateCheck = checkRateLimit(`agency-brief:${ip}`, 5, 300)
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a few minutes before submitting another brief.' },
        { status: 429 }
      )
    }

    await connectDB()
    const session = await auth()
    const body = await req.json()

    const {
      brandName,
      contactEmail,
      contactPhone,
      password,
      projectName,
      category,
      cities = [],
      budget,
      targetAudience,
      deliverables = [],
      niches = [],
      platforms = ['INSTAGRAM'],
      requirements,
      timeline,
    } = body
    const requestedBudget = Number(budget)
    const totalBudget = Number.isFinite(requestedBudget) && requestedBudget > 0 ? requestedBudget : 0

    if (!projectName || !brandName) {
      return NextResponse.json(
        { success: false, error: 'Brand name and project name are required.' },
        { status: 400 }
      )
    }

    let brandUserId: any = null
    let brandProfileId: any = null
    let autoCreatedAccount = false

    // 1. If user is already logged in as BRAND
    if (session?.user && (session.user as any).role === 'BRAND') {
      brandUserId = (session.user as any).id
      const profile = await BrandProfile.findOne({ userId: brandUserId })
      if (profile) brandProfileId = profile._id
    } else if (contactEmail) {
      const emailClean = contactEmail.toLowerCase().trim()
      let existingUser = await User.findOne({ email: emailClean })

      if (existingUser) {
        brandUserId = existingUser._id
        const profile = await BrandProfile.findOne({ userId: brandUserId })
        if (profile) brandProfileId = profile._id
      } else {
        // 2. Automatically create Brand User + Profile so brand has an instant dashboard account
        const userPassword = password && password.length >= 6 ? password : 'Password@123'
        const passwordHash = await bcrypt.hash(userPassword, 12)

        const newUser = await User.create({
          name: brandName?.trim() || 'Brand Partner',
          email: emailClean,
          passwordHash,
          phone: contactPhone || '9876543210',
          role: 'BRAND',
          status: 'ACTIVE',
          emailVerified: true,
        })
        brandUserId = newUser._id

        const newProfile = await BrandProfile.create({
          userId: newUser._id,
          companyName: brandName?.trim() || 'Brand Partner',
          contactPerson: brandName?.trim() || 'Marketing Lead',
          industry: category || 'General',
          isVerified: true,
        })
        brandProfileId = newProfile._id
        autoCreatedAccount = true
      }
    }

    // Fallback to default seed brand if somehow still null
    if (!brandUserId) {
      const defaultBrand = await User.findOne({ role: 'BRAND' })
      if (defaultBrand) {
        brandUserId = defaultBrand._id
        const profile = await BrandProfile.findOne({ userId: brandUserId })
        if (profile) brandProfileId = profile._id
      }
    }

    // Generate unique slug
    const cleanSlug = `${projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`

    // Parse deliverables
    const formattedDeliverables = (
      Array.isArray(deliverables) && deliverables.length > 0
        ? deliverables
        : ['Instagram Reels (30-60s)']
    ).map((del: string) => ({
      type: del,
      quantity: 3,
      description: `High-impact ${del} created by agency-vetted creators.`,
    }))

    const newCampaign = await Campaign.create({
      brandId: brandUserId,
      brandProfileId,
      name: projectName,
      slug: cleanSlug,
      type: 'INFLUENCER',
      status: 'PUBLISHED', // Ready for agency matching
      objective: `Agency Managed Campaign: ${brandName || 'Brand'} targeting ${
        cities.join(', ') || 'India'
      } in ${category || 'General'}.`,
      description:
        requirements ||
        `Influencer marketing project managed end-to-end by BoomMedia Agency for ${
          brandName || 'Client'
        }.`,
      category: category || 'General',
      tags: [...niches, ...(cities || [])],
      budget: {
        total: totalBudget,
        influencer: totalBudget,
        platformFee: 0,
        currency: 'INR',
      },
      cities: Array.isArray(cities) && cities.length > 0 ? cities : ['PAN-India'],
      states: [],
      requirements: `Agency Project Brief:\nBrand: ${brandName || 'N/A'}\nContact: ${
        contactEmail || 'N/A'
      } / ${contactPhone || 'N/A'}\nTarget Audience: ${
        targetAudience || 'General'
      }\nDeliverables: ${deliverables.join(', ')}\nTimeline: ${
        timeline || 'Flexible'
      }\nNotes: ${requirements || 'Standard agency curation requested.'}`,
      deliverables: formattedDeliverables,
      influencerCriteria: {
        niches: niches.length > 0 ? niches : [category || 'Lifestyle'],
        platforms: platforms.length > 0 ? platforms : ['INSTAGRAM'],
      },
      selectedInfluencers: [],
      selectedVehicles: [],
    })

    return NextResponse.json({
      success: true,
      message: 'Campaign brief submitted to BoomMedia Agency successfully.',
      campaignId: newCampaign._id,
      slug: newCampaign.slug,
      accountCreated: autoCreatedAccount,
      email: contactEmail,
    })
  } catch (err: any) {
    console.error('Agency brief submission error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to submit campaign brief' },
      { status: 500 }
    )
  }
}
