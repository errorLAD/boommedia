import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Campaign from '@/lib/db/models/Campaign'
import BrandProfile from '@/lib/db/models/BrandProfile'
import ActivityLog from '@/lib/db/models/ActivityLog'
import { escapeRegex } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || ((session.user as any).role !== 'BRAND' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const brandId = session.user.id
    const { searchParams } = new URL(req.url)

    const service = searchParams.get('service')?.toUpperCase()
    const status = searchParams.get('status')?.toUpperCase()
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const query: Record<string, any> = {
      brandId,
      isDeleted: { $ne: true },
    }

    if (service) {
      if (service === 'INFLUENCER') {
        query.serviceType = { $in: ['INFLUENCER', 'BOTH', 'COMBINED'] }
      } else if (service === 'VEHICLE') {
        query.serviceType = { $in: ['VEHICLE', 'BOTH', 'COMBINED'] }
      } else {
        query.serviceType = service
      }
    }

    if (status && status !== 'ALL') {
      query.status = status
    }

    if (search) {
      const escaped = escapeRegex(search)
      query.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { product: { $regex: escaped, $options: 'i' } },
        { goal: { $regex: escaped, $options: 'i' } },
        { 'targetLocations.city': { $regex: escaped, $options: 'i' } },
      ]
    }

    const [campaigns, total] = await Promise.all([
      Campaign.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Campaign.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: campaigns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching brand campaigns:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || ((session.user as any).role !== 'BRAND' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const brandId = session.user.id
    const body = await req.json()

    const {
      name,
      serviceType = 'INFLUENCER',
      product,
      goal,
      targetLocations = [],
      targetAudience = {},
      languages = [],
      influencerRequirements,
      vehicleRequirements,
      budget,
      files = [],
      isDraft = false,
    } = body

    if (!name && !isDraft) {
      return NextResponse.json({ error: 'Campaign name is required' }, { status: 400 })
    }

    // Lookup brand profile if exists
    const brandProfile = await BrandProfile.findOne({ userId: brandId }).lean()

    // Determine normalized cities and states for indexing
    const cities: string[] = []
    const states: string[] = []
    if (Array.isArray(targetLocations)) {
      targetLocations.forEach((loc: any) => {
        if (loc?.city && !cities.includes(loc.city)) cities.push(loc.city)
        if (loc?.state && !states.includes(loc.state)) states.push(loc.state)
      })
    }

    const totalBudget =
      budget?.total ||
      (budget?.type === 'RANGE' ? budget?.max : budget?.min) ||
      0

    const campaignStatus = isDraft ? 'DRAFT' : 'SUBMITTED'

    const campaign = await Campaign.create({
      brandId,
      brandProfileId: brandProfile?._id,
      name: name || 'Untitled Draft Campaign',
      serviceType,
      type: serviceType,
      product: product || '',
      goal: goal || '',
      targetLocations,
      targetAudience,
      languages,
      influencerRequirements: serviceType === 'INFLUENCER' || serviceType === 'BOTH' || serviceType === 'COMBINED'
        ? influencerRequirements
        : undefined,
      vehicleRequirements: serviceType === 'VEHICLE' || serviceType === 'BOTH' || serviceType === 'COMBINED'
        ? vehicleRequirements
        : undefined,
      budget: {
        total: totalBudget,
        type: budget?.type || 'EXACT',
        min: budget?.min,
        max: budget?.max,
        influencer: budget?.influencer || 0,
        vehicle: budget?.vehicle || 0,
        currency: 'INR',
      },
      budgetAmount: totalBudget,
      budgetType: budget?.type || 'EXACT',
      budgetMin: budget?.min,
      budgetMax: budget?.max,
      files,
      cities,
      states,
      status: campaignStatus,
      isPaid: false,
      paidAmount: 0,
    })

    // Log activity
    await ActivityLog.create({
      userId: brandId,
      userName: session.user.name || 'Brand Partner',
      userRole: 'BRAND',
      action: isDraft ? 'CAMPAIGN_DRAFT_CREATED' : 'CAMPAIGN_SUBMITTED',
      targetType: 'CAMPAIGN',
      targetId: campaign._id,
      targetName: campaign.name,
      details: isDraft
        ? `Brand created draft campaign "${campaign.name}"`
        : `Brand submitted new ${serviceType} campaign "${campaign.name}" for review`,
    }).catch((err) => console.error('Activity log error:', err))

    return NextResponse.json({
      success: true,
      data: campaign,
    })
  } catch (error: any) {
    console.error('Error creating campaign:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
