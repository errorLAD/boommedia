export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Payout from '@/lib/db/models/Payout'
import VehiclePartnerProfile from '@/lib/db/models/VehiclePartnerProfile'
import ActivityLog from '@/lib/db/models/ActivityLog'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const partnerId = session.user.id

  const [payouts, profile] = await Promise.all([
    Payout.find({
      recipientId: partnerId,
      recipientRole: 'VEHICLE_PARTNER',
    })
      .sort({ createdAt: -1 })
      .lean(),
    VehiclePartnerProfile.findOne({ userId: partnerId }).lean(),
  ])

  let pendingPayout = 0
  let paidAmount = 0

  for (const p of payouts) {
    if (p.status === 'COMPLETED') {
      paidAmount += p.amount || 0
    } else if (p.status === 'PENDING' || p.status === 'PROCESSING') {
      pendingPayout += p.amount || 0
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      availablePayout: profile?.availableBalance || 0,
      pendingPayout,
      paidAmount,
      history: payouts,
    },
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { amount } = await req.json()
    const numAmount = Number(amount)
    if (!numAmount || numAmount <= 0) {
      return NextResponse.json({ error: 'Please enter a valid payout amount' }, { status: 400 })
    }

    await connectDB()
    const partnerId = session.user.id
    const profile = await VehiclePartnerProfile.findOne({ userId: partnerId })

    if (!profile) {
      return NextResponse.json({ error: 'Partner profile not found' }, { status: 404 })
    }

    if ((profile.availableBalance || 0) < numAmount) {
      return NextResponse.json({ error: 'Insufficient available balance' }, { status: 400 })
    }

    if (!profile.bankDetails?.accountNumber && !profile.bankDetails?.upiId) {
      return NextResponse.json(
        { error: 'Please configure your bank details or UPI ID in settings before requesting payout' },
        { status: 400 }
      )
    }

    // Deduct available balance
    profile.availableBalance -= numAmount
    profile.pendingEarnings += numAmount
    await profile.save()

    const payout = await Payout.create({
      recipientId: partnerId,
      recipientRole: 'VEHICLE_PARTNER',
      amount: numAmount,
      currency: 'INR',
      status: 'PENDING',
      bankAccount: profile.bankDetails
        ? {
            accountNumber: profile.bankDetails.accountNumber,
            ifscCode: profile.bankDetails.ifscCode,
            accountHolderName: profile.bankDetails.accountHolderName,
          }
        : undefined,
      upiId: profile.bankDetails?.upiId,
    })

    await ActivityLog.create({
      userId: partnerId,
      userName: session.user.name || 'Vehicle Partner',
      userRole: 'VEHICLE_PARTNER',
      action: 'PAYOUT_REQUESTED',
      targetType: 'PAYOUT',
      targetId: payout._id,
      targetName: `₹${numAmount} Payout`,
      details: `Vehicle partner requested payout of ₹${numAmount}.`,
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      message: 'Payout request submitted successfully. Processing within 24-48 business hours.',
      data: payout,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
