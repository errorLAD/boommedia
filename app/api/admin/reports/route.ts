export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import User from '@/lib/db/models/User'
import Campaign from '@/lib/db/models/Campaign'
import Vehicle from '@/lib/db/models/Vehicle'
import Payment from '@/lib/db/models/Payment'
import Payout from '@/lib/db/models/Payout'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()

    const [
      totalBrands,
      activeBrands,
      totalCampaigns,
      completedCampaigns,
      totalInfluencers,
      verifiedInfluencers,
      totalVehiclePartners,
      verifiedVehicles,
      totalVehicles,
      vehicleTypes,
      payments,
      payouts,
    ] = await Promise.all([
      User.countDocuments({ role: 'BRAND', isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'BRAND', isActive: true, isDeleted: { $ne: true } }),
      Campaign.countDocuments({ isDeleted: { $ne: true } }),
      Campaign.countDocuments({ status: 'COMPLETED', isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'INFLUENCER', isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'INFLUENCER', isVerified: true, isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'VEHICLE_PARTNER', isDeleted: { $ne: true } }),
      Vehicle.countDocuments({ verificationStatus: 'VERIFIED', isDeleted: { $ne: true } }),
      Vehicle.countDocuments({ isDeleted: { $ne: true } }),
      Vehicle.aggregate([
        { $match: { isDeleted: { $ne: true } } },
        { $group: { _id: '$vehicleType', count: { $sum: 1 } } },
      ]),
      Payment.find({ status: 'CAPTURED' }).select('amount breakdown').lean(),
      Payout.find({ status: 'COMPLETED' }).select('amount recipientRole').lean(),
    ])

    const grossGMV = payments.reduce((acc, p) => acc + (p.amount || 0), 0)
    const platformRevenue = payments.reduce(
      (acc, p) => acc + (p.breakdown?.platformFee || Math.round((p.amount || 0) * 0.1)),
      0
    )
    const creatorPayouts = payouts
      .filter((p) => p.recipientRole === 'INFLUENCER')
      .reduce((acc, p) => acc + (p.amount || 0), 0)
    const vehiclePayouts = payouts
      .filter((p) => p.recipientRole === 'VEHICLE_PARTNER')
      .reduce((acc, p) => acc + (p.amount || 0), 0)

    return NextResponse.json({
      success: true,
      data: {
        brandReport: {
          totalBrands,
          activeBrands,
          totalCampaigns,
          completedCampaigns,
          campaignCompletionRate: totalCampaigns > 0 ? Math.round((completedCampaigns / totalCampaigns) * 100) : 0,
        },
        influencerReport: {
          totalInfluencers,
          verifiedInfluencers,
          verificationRate: totalInfluencers > 0 ? Math.round((verifiedInfluencers / totalInfluencers) * 100) : 0,
        },
        vehicleReport: {
          totalVehiclePartners,
          totalVehicles,
          verifiedVehicles,
          vehicleTypes: vehicleTypes.map((vt) => ({ type: vt._id || 'Unknown', count: vt.count })),
        },
        financialReport: {
          grossGMV,
          platformRevenue,
          creatorPayouts,
          vehiclePayouts,
          totalDisbursed: creatorPayouts + vehiclePayouts,
        },
      },
    })
  } catch (error: any) {
    console.error('Error generating admin reports:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
