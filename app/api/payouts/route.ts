export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Payout from '@/lib/db/models/Payout'
import InfluencerProfile from '@/lib/db/models/InfluencerProfile'
import VehiclePartnerProfile from '@/lib/db/models/VehiclePartnerProfile'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const payouts = await Payout.find({ recipientId: session.user.id })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ success: true, payouts })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, bankAccount, upiId } = await req.json()
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid payout amount required' }, { status: 400 })
    }

    await connectDB()
    const role = (session.user as any).role

    // Check available balance
    let profile: any
    if (role === 'INFLUENCER') {
      profile = await InfluencerProfile.findOne({ userId: session.user.id })
    } else if (role === 'VEHICLE_PARTNER') {
      profile = await VehiclePartnerProfile.findOne({ userId: session.user.id })
    }

    if (!profile) {
      return NextResponse.json({ error: 'Partner profile not found' }, { status: 404 })
    }

    if ((profile.availableBalance || 0) < amount) {
      return NextResponse.json({ error: 'Insufficient available balance' }, { status: 400 })
    }

    // Deduct available balance and add to pending
    profile.availableBalance -= amount
    profile.pendingEarnings += amount
    await profile.save()

    const payout = await Payout.create({
      recipientId: session.user.id,
      recipientRole: role,
      amount,
      currency: 'INR',
      status: 'PENDING',
      bankAccount,
      upiId,
    })

    return NextResponse.json({
      success: true,
      message: 'Payout request submitted successfully. Processing within 24-48 hours.',
      payout,
    })
  } catch (error: any) {
    console.error('Payout request error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
