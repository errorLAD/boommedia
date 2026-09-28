export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import VehicleCampaign from '@/lib/db/models/VehicleCampaign'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const { searchParams } = new URL(req.url)
  const tab = searchParams.get('tab') || 'ALL'

  const query: any = { partnerId: session.user.id }

  if (tab === 'UPCOMING') {
    query.status = { $in: ['ACCEPTED', 'SCHEDULED'] }
  } else if (tab === 'ACTIVE') {
    query.status = 'ACTIVE'
  } else if (tab === 'COMPLETED') {
    query.status = 'COMPLETED'
  } else if (tab !== 'ALL') {
    query.status = tab
  }

  const campaigns = await VehicleCampaign.find(query)
    .populate('vehicleId', 'title vehicleType registrationNumber images photos city')
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({ success: true, data: campaigns })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { campaignId, proofUrl, caption } = await req.json()
    if (!campaignId || !proofUrl) {
      return NextResponse.json({ error: 'campaignId and proofUrl are required' }, { status: 400 })
    }

    await connectDB()
    const campaign = await VehicleCampaign.findOne({
      _id: campaignId,
      partnerId: session.user.id,
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    if (!campaign.proofImages) campaign.proofImages = []
    campaign.proofImages.push({
      url: proofUrl,
      uploadedAt: new Date(),
      caption: caption || 'Wrap Installation Verification',
    })

    await campaign.save()

    return NextResponse.json({ success: true, data: campaign })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
