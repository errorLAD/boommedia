export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Payment from '@/lib/db/models/Payment'
import Campaign from '@/lib/db/models/Campaign'

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

    const status = searchParams.get('status')?.toUpperCase()

    const query: Record<string, any> = {}
    if (!isAdmin) {
      query.brandId = brandId
    }
    if (status && status !== 'ALL') {
      query.status = status
    }

    const [payments, unpaidCampaigns] = await Promise.all([
      Payment.find(query)
        .populate('campaignId', 'name serviceType budgetAmount budget')
        .sort({ createdAt: -1 })
        .lean(),
      Campaign.find({
        ...(isAdmin ? {} : { brandId }),
        isPaid: false,
        status: { $nin: ['DRAFT', 'CANCELLED'] },
        isDeleted: { $ne: true },
      })
        .select('name serviceType budget budgetAmount status createdAt')
        .lean(),
    ])

    const totalPaid = payments
      .filter((p) => p.status === 'CAPTURED')
      .reduce((acc, p) => acc + (p.amount || 0), 0)

    const pendingPayments = unpaidCampaigns.reduce(
      (acc, c) => acc + (c.budgetAmount || c.budget?.total || 0),
      0
    )

    return NextResponse.json({
      success: true,
      data: {
        payments,
        unpaidCampaigns,
        totalPaid,
        pendingPayments,
      },
    })
  } catch (error: any) {
    console.error('Error fetching brand payments:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
