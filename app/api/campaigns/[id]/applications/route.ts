export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Campaign from '@/lib/db/models/Campaign'
import CampaignApplication from '@/lib/db/models/CampaignApplication'
import { auth } from '@/auth'
import mongoose from 'mongoose'
import { z } from 'zod'

const ApplicationSchema = z.object({
  coverLetter: z
    .string()
    .min(10, 'Cover letter must be at least 10 characters')
    .max(3000, 'Cover letter must not exceed 3000 characters'),
  proposedPrice: z.number().min(0).optional(),
  vehicleId: z.string().optional(),
  portfolio: z.array(z.string().url()).optional(),
  availableFrom: z.string().datetime({ offset: true }).optional(),
  additionalNotes: z.string().max(1000).optional(),
})

// ─── GET: List applications for a campaign (BRAND owner or ADMIN only) ────────
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid campaign ID' },
        { status: 400 }
      )
    }

    await connectDB()

    const campaign = await Campaign.findById(id)
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Only brand owner or admin can see applications
    const isOwner = session.user.id === campaign.brandId?.toString()
    const isAdmin = (session.user as any).role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to view applications for this campaign' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const statusFilter = searchParams.get('status') || ''
    const roleFilter = searchParams.get('role') || ''
    const skip = (page - 1) * limit

    const query: Record<string, unknown> = { campaignId: new mongoose.Types.ObjectId(id) }
    if (statusFilter) query.status = statusFilter.toUpperCase()
    if (roleFilter) query.applicantType = roleFilter.toUpperCase()

    const [applications, total] = await Promise.all([
      CampaignApplication.find(query)
        .populate('applicantId', 'name email avatar role status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CampaignApplication.countDocuments(query),
    ])

    // Status summary for quick stats
    const [pending, accepted, rejected] = await Promise.all([
      CampaignApplication.countDocuments({ campaignId: id, status: 'PENDING' }),
      CampaignApplication.countDocuments({ campaignId: id, status: 'ACCEPTED' }),
      CampaignApplication.countDocuments({ campaignId: id, status: 'REJECTED' }),
    ])

    return NextResponse.json({
      success: true,
      data: applications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: skip + limit < total,
      hasPrev: page > 1,
      summary: { pending, accepted, rejected, total },
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

// ─── POST: Apply to a campaign (INFLUENCER or VEHICLE_PARTNER only) ───────────
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const role = (session.user as any).role
    const allowedRoles = ['INFLUENCER', 'VEHICLE_PARTNER']
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Only influencers and vehicle partners can apply to campaigns' },
        { status: 403 }
      )
    }

    const { id } = params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid campaign ID' },
        { status: 400 }
      )
    }

    await connectDB()

    const campaign = await Campaign.findById(id)
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Check campaign is accepting applications
    if (campaign.status !== 'PUBLISHED' && campaign.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { success: false, error: 'This campaign is not currently accepting applications' },
        { status: 422 }
      )
    }

    // Check application deadline
    if (campaign.endDate && new Date() > new Date(campaign.endDate)) {
      return NextResponse.json(
        { success: false, error: 'The application deadline for this campaign has passed' },
        { status: 422 }
      )
    }

    // Validate role-campaign type match
    if (role === 'INFLUENCER' && campaign.type === 'VEHICLE') {
      return NextResponse.json(
        { success: false, error: 'This campaign only accepts vehicle advertising partners' },
        { status: 422 }
      )
    }
    if (role === 'VEHICLE_PARTNER' && campaign.type === 'INFLUENCER') {
      return NextResponse.json(
        { success: false, error: 'This campaign only accepts influencers' },
        { status: 422 }
      )
    }

    // Check for duplicate application
    const existingApplication = await CampaignApplication.findOne({
      campaignId: id,
      applicantId: session.user.id,
    })
    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'You have already applied to this campaign' },
        { status: 409 }
      )
    }

    // Validate request body
    const body = await req.json()
    const parseResult = ApplicationSchema.safeParse(body)
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

    // Create application
    const application = await CampaignApplication.create({
      campaignId: id,
      applicantId: session.user.id,
      applicantType: role as 'INFLUENCER' | 'VEHICLE_PARTNER',
      vehicleId: data.vehicleId ? new mongoose.Types.ObjectId(data.vehicleId) : undefined,
      message: data.coverLetter,
      proposedPrice: data.proposedPrice,
      notes: data.additionalNotes,
      status: 'PENDING',
    })

    // Increment application count on campaign
    await Campaign.findByIdAndUpdate(id, {
      $inc: { applicationCount: 1 },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        data: { applicationId: application._id.toString() },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}
