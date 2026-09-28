export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Campaign from '@/lib/db/models/Campaign'
import CampaignRecommendation from '@/lib/db/models/CampaignRecommendation'
import ActivityLog from '@/lib/db/models/ActivityLog'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || ((session.user as any).role !== 'BRAND' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const brandId = session.user.id
    const isAdmin = (session.user as any).role === 'ADMIN'
    const { searchParams } = new URL(req.url)

    const campaignId = searchParams.get('campaignId')
    const type = searchParams.get('type')?.toUpperCase()
    const status = searchParams.get('status')?.toUpperCase()

    // Find campaigns belonging to this brand
    let campaignIds: any[] = []
    if (isAdmin && !campaignId) {
      // Admin sees all
    } else if (campaignId) {
      const camp = await Campaign.findOne({ _id: campaignId, ...(isAdmin ? {} : { brandId }) }).lean()
      if (!camp) {
        return NextResponse.json({ success: true, data: [] })
      }
      campaignIds = [camp._id]
    } else {
      const brandCampaigns = await Campaign.find({ brandId, isDeleted: { $ne: true } }).select('_id').lean()
      campaignIds = brandCampaigns.map((c) => c._id)
    }

    const query: Record<string, any> = {}
    if (campaignIds.length > 0) {
      query.campaignId = { $in: campaignIds }
    } else if (!isAdmin) {
      return NextResponse.json({ success: true, data: [] })
    }

    if (type) query.type = type
    if (status && status !== 'ALL') query.status = status

    const recommendations = await CampaignRecommendation.find(query)
      .populate('campaignId', 'name serviceType status')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      data: recommendations,
    })
  } catch (error: any) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || ((session.user as any).role !== 'BRAND' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const brandId = session.user.id
    const isAdmin = (session.user as any).role === 'ADMIN'
    const body = await req.json()

    const { recommendationId, action, notes } = body
    if (!recommendationId || !action) {
      return NextResponse.json({ error: 'recommendationId and action are required' }, { status: 400 })
    }

    const recommendation = await CampaignRecommendation.findById(recommendationId)
    if (!recommendation) {
      return NextResponse.json({ error: 'Recommendation not found' }, { status: 404 })
    }

    // Verify campaign ownership
    const campaign = await Campaign.findOne({
      _id: recommendation.campaignId,
      ...(isAdmin ? {} : { brandId }),
    })
    if (!campaign) {
      return NextResponse.json({ error: 'Unauthorized for this campaign' }, { status: 403 })
    }

    // Process action
    if (action === 'APPROVE') {
      recommendation.status = 'APPROVED'
    } else if (action === 'REJECT') {
      recommendation.status = 'REJECTED'
      if (notes) recommendation.changeRequestNotes = notes
    } else if (action === 'CHANGE_REQUESTED') {
      recommendation.status = 'CHANGE_REQUESTED'
      recommendation.changeRequestNotes = notes || 'Changes requested by brand'
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    await recommendation.save()

    // Activity log
    await ActivityLog.create({
      userId: brandId,
      userName: session.user.name || 'Brand Partner',
      userRole: isAdmin ? 'ADMIN' : 'BRAND',
      action: `RECOMMENDATION_${action}`,
      targetType: 'CAMPAIGN',
      targetId: campaign._id,
      targetName: campaign.name,
      details: `Recommendation for ${recommendation.type.toLowerCase()} was marked as ${recommendation.status}${notes ? `: ${notes}` : ''}`,
    }).catch((err) => console.error('Activity log error:', err))

    return NextResponse.json({
      success: true,
      data: recommendation,
    })
  } catch (error: any) {
    console.error('Error updating recommendation:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
