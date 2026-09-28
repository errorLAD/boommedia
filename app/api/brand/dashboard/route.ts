export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Campaign from '@/lib/db/models/Campaign'
import CampaignRecommendation from '@/lib/db/models/CampaignRecommendation'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || ((session.user as any).role !== 'BRAND' && (session.user as any).role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  await connectDB()
  const brandId = session.user.id

  const [
    activeCampaigns,
    upcomingCampaigns,
    pendingRequests,
    completedCampaigns,
    unpaidCampaigns,
    recentCampaigns,
    latestDraft,
  ] = await Promise.all([
    Campaign.countDocuments({
      brandId,
      status: { $in: ['IN_PROGRESS', 'PUBLISHED'] },
      isDeleted: { $ne: true },
    }),
    Campaign.countDocuments({
      brandId,
      status: { $in: ['APPROVED', 'OPTIONS_READY'] },
      isDeleted: { $ne: true },
    }),
    Campaign.countDocuments({
      brandId,
      status: { $in: ['SUBMITTED', 'UNDER_REVIEW', 'WAITING_APPROVAL'] },
      isDeleted: { $ne: true },
    }),
    Campaign.countDocuments({
      brandId,
      status: 'COMPLETED',
      isDeleted: { $ne: true },
    }),
    Campaign.find({
      brandId,
      isPaid: false,
      status: { $nin: ['DRAFT', 'CANCELLED'] },
      isDeleted: { $ne: true },
    })
      .select('budget budgetAmount')
      .lean(),
    Campaign.find({
      brandId,
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Campaign.findOne({
      brandId,
      status: 'DRAFT',
      isDeleted: { $ne: true },
    })
      .sort({ updatedAt: -1 })
      .lean(),
  ])

  // Get campaign IDs to check pending recommendations
  const allBrandCampaigns = await Campaign.find({ brandId, isDeleted: { $ne: true } }).select('_id').lean()
  const campaignIds = allBrandCampaigns.map((c) => c._id)

  const pendingRecommendationsCount = campaignIds.length > 0
    ? await CampaignRecommendation.countDocuments({
        campaignId: { $in: campaignIds },
        status: 'PENDING',
      })
    : 0

  // Calculate actual pending payments and total budget
  const pendingPayments = unpaidCampaigns.reduce(
    (acc, c) => acc + (c.budgetAmount || c.budget?.total || 0),
    0
  )

  const totalBudget = recentCampaigns.reduce(
    (acc, c) => acc + (c.budgetAmount || c.budget?.total || 0),
    0
  )

  return NextResponse.json({
    success: true,
    data: {
      activeCampaigns,
      upcomingCampaigns,
      pendingRequests,
      completedCampaigns,
      pendingPayments,
      totalBudget,
      recentCampaigns,
      pendingRecommendationsCount,
      latestDraft,
    },
  })
}
