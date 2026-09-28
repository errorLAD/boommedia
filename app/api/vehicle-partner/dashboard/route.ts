export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Vehicle from '@/lib/db/models/Vehicle'
import VehicleCampaign from '@/lib/db/models/VehicleCampaign'
import VehiclePartnerProfile from '@/lib/db/models/VehiclePartnerProfile'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || ((session.user as any).role !== 'VEHICLE_PARTNER' && (session.user as any).role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  await connectDB()
  const partnerId = session.user.id

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [
    totalVehicles,
    availableVehicles,
    activeCampaigns,
    newRequests,
    thisMonthCampaigns,
    profile,
  ] = await Promise.all([
    Vehicle.countDocuments({ partnerId, isDeleted: { $ne: true } }),
    Vehicle.countDocuments({
      partnerId,
      availabilityStatus: 'AVAILABLE',
      isAvailable: true,
      isActive: true,
      isDeleted: { $ne: true },
    }),
    VehicleCampaign.countDocuments({
      partnerId,
      status: 'ACTIVE',
    }),
    VehicleCampaign.countDocuments({
      partnerId,
      status: 'REQUEST_RECEIVED',
    }),
    VehicleCampaign.find({
      partnerId,
      status: { $in: ['ACTIVE', 'COMPLETED'] },
      createdAt: { $gte: startOfMonth },
    }).select('partnerEarnings').lean(),
    VehiclePartnerProfile.findOne({ userId: partnerId }).lean(),
  ])

  const thisMonthEarnings = thisMonthCampaigns.reduce(
    (acc, c) => acc + (c.partnerEarnings || 0),
    0
  )

  return NextResponse.json({
    success: true,
    data: {
      vehicles: totalVehicles,
      available: availableVehicles,
      activeCampaigns,
      requests: newRequests,
      thisMonthEarnings,
      totalEarnings: profile?.totalEarnings || 0,
      pendingEarnings: profile?.pendingEarnings || 0,
      availableBalance: profile?.availableBalance || 0,
    },
  })
}
