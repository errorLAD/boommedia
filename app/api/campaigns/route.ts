import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Campaign from '@/lib/db/models/Campaign'
import { auth } from '@/auth'
import { z } from 'zod'
import { escapeRegex } from '@/lib/utils'

// ─── Zod Validation Schema ────────────────────────────────────────────────────
const CreateCampaignSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
  objectives: z.string().min(10, 'Objectives must be at least 10 characters').max(2000),
  category: z.string().min(1, 'Category is required'),
  budget: z.object({
    total: z.number().min(1000, 'Minimum budget is ₹1000'),
    currency: z.string().default('INR'),
    breakdown: z.object({
      influencer: z.number().min(0).default(0),
      vehicle: z.number().min(0).default(0),
      platform: z.number().min(0).default(0),
    }).optional(),
  }),
  targetAudience: z.object({
    ageRange: z.object({
      min: z.number().min(13).max(65),
      max: z.number().min(13).max(100),
    }).optional(),
    gender: z.enum(['ALL', 'MALE', 'FEMALE', 'OTHER']).default('ALL'),
    locations: z.array(z.string()).default([]),
    interests: z.array(z.string()).default([]),
  }).optional(),
  requirements: z.object({
    minFollowers: z.number().min(0).default(0),
    platforms: z.array(z.string()).default([]),
    contentTypes: z.array(z.string()).default([]),
    deliverables: z.string().optional(),
  }).optional(),
  timeline: z.object({
    applicationDeadline: z.string().datetime({ offset: true }).optional(),
    startDate: z.string().datetime({ offset: true }).optional(),
    endDate: z.string().datetime({ offset: true }).optional(),
  }).optional(),
  needsInfluencer: z.boolean().default(true),
  needsVehicle: z.boolean().default(false),
  maxInfluencers: z.number().min(1).max(500).default(1),
  maxVehicles: z.number().min(0).max(200).default(0),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().url().optional(),
})

// ─── GET: List campaigns (public, filterable) ─────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || 'ACTIVE'
    const needsInfluencer = searchParams.get('needsInfluencer')
    const needsVehicle = searchParams.get('needsVehicle')
    const minBudget = searchParams.get('minBudget')
    const maxBudget = searchParams.get('maxBudget')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1

    const query: Record<string, unknown> = {}

    // Only show ACTIVE campaigns publicly unless specific status requested
    if (status) query.status = status.toUpperCase()

    if (category) query.category = { $regex: escapeRegex(category), $options: 'i' }
    if (needsInfluencer === 'true') query.needsInfluencer = true
    if (needsVehicle === 'true') query.needsVehicle = true

    if (minBudget) {
      query['budget.total'] = {
        ...((query['budget.total'] as object) || {}),
        $gte: parseInt(minBudget),
      }
    }
    if (maxBudget) {
      query['budget.total'] = {
        ...((query['budget.total'] as object) || {}),
        $lte: parseInt(maxBudget),
      }
    }

    if (search) {
      const escaped = escapeRegex(search)
      query.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
        { category: { $regex: escaped, $options: 'i' } },
        { tags: { $in: [new RegExp(escaped, 'i')] } },
      ]
    }

    const sortMap: Record<string, string> = {
      budget: 'budget.total',
      newest: 'createdAt',
      deadline: 'timeline.applicationDeadline',
      relevance: 'createdAt',
    }
    const sortField: Record<string, number> = {}
    sortField[sortMap[sortBy] || 'createdAt'] = sortOrder

    const skip = (page - 1) * limit

    const [campaigns, total] = await Promise.all([
      Campaign.find(query)
        .populate('brandId', 'name avatar')
        .sort(sortField as any)
        .skip(skip)
        .limit(limit)
        .lean(),
      Campaign.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: campaigns,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: skip + limit < total,
      hasPrev: page > 1,
    })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

// ─── POST: Create campaign (BRAND only) ──────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    if ((session.user as any).role !== 'BRAND') {
      return NextResponse.json(
        { success: false, error: 'Only brands can create campaigns' },
        { status: 403 }
      )
    }

    const body = await req.json()

    // Validate with Zod
    const parseResult = CreateCampaignSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 422 }
      )
    }

    const data = parseResult.data

    await connectDB()

    // Parse date strings to Date objects
    const timeline = data.timeline
      ? {
          applicationDeadline: data.timeline.applicationDeadline
            ? new Date(data.timeline.applicationDeadline)
            : undefined,
          startDate: data.timeline.startDate
            ? new Date(data.timeline.startDate)
            : undefined,
          endDate: data.timeline.endDate
            ? new Date(data.timeline.endDate)
            : undefined,
        }
      : undefined

    // Validate dates
    if (timeline?.applicationDeadline && timeline.applicationDeadline < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Application deadline cannot be in the past' },
        { status: 422 }
      )
    }

    const campaign = await Campaign.create({
      brandId: session.user.id,
      ...data,
      timeline,
      status: 'DRAFT',
      applicationCount: 0,
      acceptedInfluencers: [],
      acceptedVehicles: [],
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Campaign created successfully',
        data: campaign,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating campaign:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}
