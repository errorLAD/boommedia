export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Campaign from '@/lib/db/models/Campaign'
import CampaignRecommendation from '@/lib/db/models/CampaignRecommendation'
import CampaignDocument from '@/lib/db/models/CampaignDocument'
import ActivityLog from '@/lib/db/models/ActivityLog'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || ((session.user as any).role !== 'BRAND' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const { id } = params
    const brandId = session.user.id
    const isAdmin = (session.user as any).role === 'ADMIN'

    const query: Record<string, any> = { _id: id, isDeleted: { $ne: true } }
    if (!isAdmin) {
      query.brandId = brandId
    }

    const campaign = await Campaign.findOne(query).lean()
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Fetch recommendations and documents linked to this campaign
    const [recommendations, documents] = await Promise.all([
      CampaignRecommendation.find({ campaignId: id }).sort({ createdAt: -1 }).lean(),
      CampaignDocument.find({ campaignId: id, status: 'ACTIVE' }).sort({ createdAt: -1 }).lean(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        ...campaign,
        recommendations,
        documents,
      },
    })
  } catch (error: any) {
    console.error('Error fetching campaign detail:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || ((session.user as any).role !== 'BRAND' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const { id } = params
    const brandId = session.user.id
    const isAdmin = (session.user as any).role === 'ADMIN'

    const query: Record<string, any> = { _id: id, isDeleted: { $ne: true } }
    if (!isAdmin) {
      query.brandId = brandId
    }

    const campaign = await Campaign.findOne(query)
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    const body = await req.json()

    // Brand can update details, or submit draft
    if (body.name !== undefined) campaign.name = body.name
    if (body.product !== undefined) campaign.product = body.product
    if (body.goal !== undefined) campaign.goal = body.goal
    if (body.targetLocations !== undefined) campaign.targetLocations = body.targetLocations
    if (body.targetAudience !== undefined) campaign.targetAudience = body.targetAudience
    if (body.languages !== undefined) campaign.languages = body.languages
    if (body.influencerRequirements !== undefined) campaign.influencerRequirements = body.influencerRequirements
    if (body.vehicleRequirements !== undefined) campaign.vehicleRequirements = body.vehicleRequirements
    if (body.budget !== undefined) {
      campaign.budget = {
        ...campaign.budget,
        ...body.budget,
      }
      campaign.budgetAmount = body.budget?.total || campaign.budgetAmount
    }
    if (body.files !== undefined) campaign.files = body.files

    // Handle publishing a draft
    if (body.submitDraft && campaign.status === 'DRAFT') {
      campaign.status = 'SUBMITTED'
    }

    await campaign.save()

    return NextResponse.json({
      success: true,
      data: campaign,
    })
  } catch (error: any) {
    console.error('Error updating campaign:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || ((session.user as any).role !== 'BRAND' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const { id } = params
    const brandId = session.user.id
    const isAdmin = (session.user as any).role === 'ADMIN'

    const query: Record<string, any> = { _id: id }
    if (!isAdmin) {
      query.brandId = brandId
    }

    const campaign = await Campaign.findOne(query)
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Soft delete
    campaign.isDeleted = true
    await campaign.save()

    await ActivityLog.create({
      userId: brandId,
      userName: session.user.name || 'Brand Partner',
      userRole: isAdmin ? 'ADMIN' : 'BRAND',
      action: 'CAMPAIGN_CANCELLED',
      targetType: 'CAMPAIGN',
      targetId: campaign._id,
      targetName: campaign.name,
      details: `Campaign "${campaign.name}" was soft deleted`,
    }).catch((err) => console.error('Activity log error:', err))

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting campaign:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
