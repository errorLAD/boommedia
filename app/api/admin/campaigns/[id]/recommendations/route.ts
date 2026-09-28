export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Campaign from '@/lib/db/models/Campaign'
import CampaignRecommendation from '@/lib/db/models/CampaignRecommendation'
import User from '@/lib/db/models/User'
import Vehicle from '@/lib/db/models/Vehicle'
import ActivityLog from '@/lib/db/models/ActivityLog'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()
    const { id: campaignId } = params
    const body = await req.json()

    const {
      type,
      influencerId,
      influencerDetails,
      vehicleId,
      vehicleDetails,
      proposedFee,
      deliverables,
      adminNotes,
    } = body

    if (!type || !proposedFee || !deliverables) {
      return NextResponse.json({ error: 'type, proposedFee, and deliverables are required' }, { status: 400 })
    }

    const campaign = await Campaign.findById(campaignId)
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    const rec = await CampaignRecommendation.create({
      campaignId,
      type,
      influencerId: influencerId || undefined,
      influencerDetails: type === 'INFLUENCER' ? influencerDetails : undefined,
      vehicleId: vehicleId || undefined,
      vehicleDetails: type === 'VEHICLE' ? vehicleDetails : undefined,
      proposedFee,
      deliverables,
      adminNotes,
      status: 'PENDING',
    })

    // Advance campaign status to OPTIONS_READY if currently SUBMITTED or UNDER_REVIEW
    if (campaign.status === 'SUBMITTED' || campaign.status === 'UNDER_REVIEW') {
      campaign.status = 'OPTIONS_READY'
      await campaign.save()
    }

    await ActivityLog.create({
      userId: session.user.id,
      userName: session.user.name || 'Admin',
      userRole: 'ADMIN',
      action: 'RECOMMENDATION_CREATED',
      targetType: 'CAMPAIGN',
      targetId: campaign._id,
      targetName: campaign.name,
      details: `Admin proposed ${type.toLowerCase()} recommendation (Fee: ₹${proposedFee}) for campaign "${campaign.name}"`,
    }).catch((err) => console.error(err))

    return NextResponse.json({ success: true, data: rec })
  } catch (error: any) {
    console.error('Error creating recommendation:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
