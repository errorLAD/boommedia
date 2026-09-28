export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Verification from '@/lib/db/models/Verification'
import InfluencerProfile from '@/lib/db/models/InfluencerProfile'
import VehiclePartnerProfile from '@/lib/db/models/VehiclePartnerProfile'
import Vehicle from '@/lib/db/models/Vehicle'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const verifications = await Verification.find()
      .populate('userId', 'name email role phone')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ success: true, verifications })
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

    const { verificationId, status, adminNotes, rejectionReason } = await req.json()
    if (!verificationId || !status) {
      return NextResponse.json({ error: 'verificationId and status required' }, { status: 400 })
    }

    await connectDB()
    const record = await Verification.findById(verificationId)
    if (!record) {
      return NextResponse.json({ error: 'Verification record not found' }, { status: 404 })
    }

    record.status = status
    record.reviewedAt = new Date()
    record.reviewedBy = session.user.id as any
    if (adminNotes) record.adminNotes = adminNotes
    if (rejectionReason) record.rejectionReason = rejectionReason
    await record.save()

    // Sync profile verification status
    if (status === 'VERIFIED' || status === 'REJECTED') {
      if (record.role === 'INFLUENCER') {
        await InfluencerProfile.findOneAndUpdate(
          { userId: record.userId },
          { verificationStatus: status }
        )
      } else if (record.role === 'VEHICLE_PARTNER') {
        await VehiclePartnerProfile.findOneAndUpdate(
          { userId: record.userId },
          { verificationStatus: status }
        )
        await Vehicle.updateMany(
          { partnerId: record.userId },
          { verificationStatus: status }
        )
      }
    }

    return NextResponse.json({ success: true, verification: record })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
