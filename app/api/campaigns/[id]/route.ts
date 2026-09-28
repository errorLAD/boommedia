export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Campaign from '@/lib/db/models/Campaign'
import { auth } from '@/auth'
import mongoose from 'mongoose'
import { z } from 'zod'

const UpdateCampaignSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  description: z.string().min(20).max(5000).optional(),
  objectives: z.string().min(10).max(2000).optional(),
  category: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED']).optional(),
  budget: z.object({
    total: z.number().min(1000),
    currency: z.string().default('INR'),
    breakdown: z.object({
      influencer: z.number().min(0).default(0),
      vehicle: z.number().min(0).default(0),
      platform: z.number().min(0).default(0),
    }).optional(),
  }).optional(),
  targetAudience: z.object({
    ageRange: z.object({ min: z.number(), max: z.number() }).optional(),
    gender: z.enum(['ALL', 'MALE', 'FEMALE', 'OTHER']).optional(),
    locations: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
  }).optional(),
  requirements: z.object({
    minFollowers: z.number().min(0).optional(),
    platforms: z.array(z.string()).optional(),
    contentTypes: z.array(z.string()).optional(),
    deliverables: z.string().optional(),
  }).optional(),
  timeline: z.object({
    applicationDeadline: z.string().datetime({ offset: true }).optional(),
    startDate: z.string().datetime({ offset: true }).optional(),
    endDate: z.string().datetime({ offset: true }).optional(),
  }).optional(),
  needsInfluencer: z.boolean().optional(),
  needsVehicle: z.boolean().optional(),
  maxInfluencers: z.number().min(1).max(500).optional(),
  maxVehicles: z.number().min(0).max(200).optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().url().optional(),
})

// ─── GET: Single campaign ─────────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid campaign ID' },
        { status: 400 }
      )
    }

    const campaign = await Campaign.findById(id)
      .populate('brandId', 'name avatar email')
      .lean()

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Non-public campaigns only visible to owner or admin
    const session = await auth()
    if (campaign.status === 'DRAFT') {
      const isOwner = session?.user?.id === (campaign.brandId as any)?._id?.toString()
      const isAdmin = (session?.user as any)?.role === 'ADMIN'
      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { success: false, error: 'Campaign not found or not accessible' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json({ success: true, data: campaign })
  } catch (error) {
    console.error('Error fetching campaign:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaign' },
      { status: 500 }
    )
  }
}

// ─── PATCH: Update campaign (BRAND owner only) ────────────────────────────────
export async function PATCH(
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

    // Only brand owner or admin can update
    const isOwner = session.user.id === campaign.brandId?.toString()
    const isAdmin = (session.user as any).role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to update this campaign' },
        { status: 403 }
      )
    }

    // Cannot update a completed/cancelled campaign
    if (['COMPLETED', 'CANCELLED'].includes(campaign.status) && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Cannot update a completed or cancelled campaign' },
        { status: 422 }
      )
    }

    const body = await req.json()
    const parseResult = UpdateCampaignSchema.safeParse(body)
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

    const updateData = parseResult.data

    // Parse timeline dates if provided
    if (updateData.timeline) {
      const timeline: Record<string, Date | undefined> = {}
      if (updateData.timeline.applicationDeadline) {
        timeline.applicationDeadline = new Date(updateData.timeline.applicationDeadline)
      }
      if (updateData.timeline.startDate) {
        timeline.startDate = new Date(updateData.timeline.startDate)
      }
      if (updateData.timeline.endDate) {
        timeline.endDate = new Date(updateData.timeline.endDate)
      }
      ;(updateData as any).timeline = timeline
    }

    const updated = await Campaign.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('brandId', 'name avatar')

    return NextResponse.json({
      success: true,
      message: 'Campaign updated successfully',
      data: updated,
    })
  } catch (error: any) {
    console.error('Error updating campaign:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update campaign' },
      { status: 500 }
    )
  }
}

// ─── DELETE: Soft delete campaign (BRAND owner or ADMIN) ─────────────────────
export async function DELETE(
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

    const isOwner = session.user.id === campaign.brandId?.toString()
    const isAdmin = (session.user as any).role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to delete this campaign' },
        { status: 403 }
      )
    }

    // Soft delete: set status to CANCELLED and mark deletedAt
    await Campaign.findByIdAndUpdate(id, {
      status: 'CANCELLED',
      deletedAt: new Date(),
      deletedBy: session.user.id,
    })

    return NextResponse.json({
      success: true,
      message: 'Campaign cancelled and removed successfully',
    })
  } catch (error) {
    console.error('Error deleting campaign:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete campaign' },
      { status: 500 }
    )
  }
}
