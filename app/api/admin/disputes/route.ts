export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Dispute from '@/lib/db/models/Dispute'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const disputes = await Dispute.find()
      .populate('campaignId', 'name type budget')
      .populate('raisedById', 'name email role')
      .populate('againstId', 'name email role')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ success: true, disputes })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { disputeId, status, resolution } = await req.json()
    if (!disputeId || !status) {
      return NextResponse.json({ error: 'disputeId and status required' }, { status: 400 })
    }

    await connectDB()
    const dispute = await Dispute.findByIdAndUpdate(
      disputeId,
      {
        status,
        resolution: resolution || undefined,
        resolvedBy: session.user.id,
        resolvedAt: status === 'RESOLVED' ? new Date() : undefined,
      },
      { new: true }
    )

    return NextResponse.json({ success: true, dispute })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
