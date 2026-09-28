export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import VehicleCampaign from '@/lib/db/models/VehicleCampaign'
import VehiclePartnerProfile from '@/lib/db/models/VehiclePartnerProfile'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const partnerId = session.user.id

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [campaigns, profile] = await Promise.all([
    VehicleCampaign.find({
      partnerId,
      status: { $in: ['ACCEPTED', 'SCHEDULED', 'ACTIVE', 'COMPLETED'] },
    })
      .populate('vehicleId', 'title vehicleType registrationNumber')
      .sort({ createdAt: -1 })
      .lean(),
    VehiclePartnerProfile.findOne({ userId: partnerId }).lean(),
  ])

  // Calculate real metrics
  let totalEarnings = 0
  let thisMonthEarnings = 0
  let pendingEarnings = 0
  let paidEarnings = 0

  for (const c of campaigns) {
    const earning = c.partnerEarnings || 0
    totalEarnings += earning

    if (new Date(c.createdAt) >= startOfMonth) {
      thisMonthEarnings += earning
    }

    if (c.paymentStatus === 'PAID') {
      paidEarnings += earning
    } else {
      pendingEarnings += earning
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      metrics: {
        totalEarnings,
        thisMonth: thisMonthEarnings,
        pendingEarnings,
        paid: paidEarnings,
        availableBalance: profile?.availableBalance || 0,
      },
      history: campaigns,
    },
  })
}
