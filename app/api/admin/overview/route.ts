export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import User from '@/lib/db/models/User'
import Vehicle from '@/lib/db/models/Vehicle'
import Campaign from '@/lib/db/models/Campaign'
import Payment from '@/lib/db/models/Payment'
import Payout from '@/lib/db/models/Payout'
import ActivityLog from '@/lib/db/models/ActivityLog'
import LeadInquiry from '@/lib/db/models/LeadInquiry'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()

    const [
      totalBrands,
      totalInfluencers,
      totalVehiclePartners,
      totalVehicles,
      activeCampaigns,
      newEnquiries,
      pendingVehicleApprovals,
      pendingInfluencerApprovals,
      unpaidCampaigns,
      pendingPayouts,
      recentActivities,
    ] = await Promise.all([
      User.countDocuments({ role: 'BRAND', isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'INFLUENCER', isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'VEHICLE_PARTNER', isDeleted: { $ne: true } }),
      Vehicle.countDocuments({ isDeleted: { $ne: true } }),
      Campaign.countDocuments({ status: { $in: ['PUBLISHED', 'IN_PROGRESS'] }, isDeleted: { $ne: true } }),
      LeadInquiry.countDocuments({ status: { $in: ['new', 'New'] } }).catch(() => 0),
      Vehicle.countDocuments({ verificationStatus: 'PENDING', isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'INFLUENCER', isVerified: false, isDeleted: { $ne: true } }),
      Campaign.find({ isPaid: false, status: { $nin: ['DRAFT', 'CANCELLED'] }, isDeleted: { $ne: true } })
        .select('budget budgetAmount')
        .lean(),
      Payout.countDocuments({ status: 'PENDING' }).catch(() => 0),
      ActivityLog.find().sort({ createdAt: -1 }).limit(10).lean().catch(() => []),
    ])

    const pendingApprovals = pendingVehicleApprovals + pendingInfluencerApprovals
    const pendingPaymentsAmount = unpaidCampaigns.reduce(
      (acc: number, c: any) => acc + (c.budgetAmount || c.budget?.total || 0),
      0
    )

    return NextResponse.json({
      success: true,
      data: {
        totalBrands,
        totalInfluencers,
        totalVehiclePartners,
        totalVehicles,
        activeCampaigns,
        newEnquiries,
        pendingApprovals,
        pendingVehicleApprovals,
        pendingInfluencerApprovals,
        pendingPayments: pendingPaymentsAmount,
        pendingPayouts,
        recentActivities,
      },
    })
  } catch (error: any) {
    console.error('Admin overview error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
