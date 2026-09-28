export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Payout from '@/lib/db/models/Payout'
import User from '@/lib/db/models/User'
import ActivityLog from '@/lib/db/models/ActivityLog'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()
    const { searchParams } = new URL(req.url)

    const role = searchParams.get('role')?.toUpperCase()
    const status = searchParams.get('status')?.toUpperCase()

    const query: Record<string, any> = {}
    if (role && role !== 'ALL') query.recipientRole = role
    if (status && status !== 'ALL') {
      if (status === 'PAID') query.status = 'COMPLETED'
      else query.status = status
    }

    const payouts = await Payout.find(query)
      .populate('recipientId', 'name email phone')
      .populate('campaignId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    const totalPending = payouts
      .filter((p) => p.status === 'PENDING')
      .reduce((acc, p) => acc + (p.amount || 0), 0)

    const totalPaid = payouts
      .filter((p) => p.status === 'COMPLETED')
      .reduce((acc, p) => acc + (p.amount || 0), 0)

    return NextResponse.json({
      success: true,
      data: {
        payouts,
        totalPending,
        totalPaid,
      },
    })
  } catch (error: any) {
    console.error('Error fetching admin payouts:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()
    const body = await req.json()
    const { payoutId, action, transactionRef, failureReason } = body

    if (!payoutId || !action) {
      return NextResponse.json({ error: 'payoutId and action are required' }, { status: 400 })
    }

    const payout = await Payout.findById(payoutId).populate('recipientId', 'name email')
    if (!payout) {
      return NextResponse.json({ error: 'Payout request not found' }, { status: 404 })
    }

    if (action === 'PROCESSING') {
      payout.status = 'PROCESSING'
    } else if (action === 'CONFIRM_PAID' || action === 'COMPLETED') {
      payout.status = 'COMPLETED'
      payout.processedAt = new Date()
      if (transactionRef) payout.razorpayPayoutId = transactionRef
    } else if (action === 'REJECT') {
      payout.status = 'FAILED'
      payout.failureReason = failureReason || 'Payout rejected by admin'
    }

    await payout.save()

    await ActivityLog.create({
      userId: session.user.id,
      userName: session.user.name || 'Admin',
      userRole: 'ADMIN',
      action: `PAYOUT_${action}`,
      targetType: 'PAYOUT',
      targetId: payout._id,
      targetName: (payout.recipientId as any)?.name || 'Recipient',
      details: `Payout of ₹${payout.amount} for ${payout.recipientRole} marked as ${payout.status}${transactionRef ? ` (Ref: ${transactionRef})` : ''}`,
    }).catch((err) => console.error(err))

    return NextResponse.json({ success: true, data: payout })
  } catch (error: any) {
    console.error('Error updating payout:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
