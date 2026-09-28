export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import User from '@/lib/db/models/User'
import InfluencerProfile from '@/lib/db/models/InfluencerProfile'
import ActivityLog from '@/lib/db/models/ActivityLog'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const user = await User.findById(params.id).lean()
    if (!user || user.isDeleted) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
    }

    const profile = await InfluencerProfile.findOne({ userId: params.id }).lean()

    return NextResponse.json({
      success: true,
      data: {
        user,
        profile,
      },
    })
  } catch (error: any) {
    console.error('Error fetching creator detail:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const { id } = params
    const body = await req.json()
    const { isActive, verificationStatus } = body

    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
    }

    if (isActive !== undefined) user.isActive = isActive
    if (verificationStatus) {
      user.isVerified = verificationStatus === 'VERIFIED'
      await InfluencerProfile.findOneAndUpdate(
        { userId: id },
        { verificationStatus }
      )
    }

    await user.save()

    await ActivityLog.create({
      userId: session.user.id,
      userName: session.user.name || 'Admin',
      userRole: 'ADMIN',
      action: 'INFLUENCER_STATUS_UPDATED',
      targetType: 'INFLUENCER',
      targetId: user._id,
      targetName: user.name,
      details: `Creator status updated (Active: ${user.isActive}, Verification: ${verificationStatus || user.isVerified})`,
    }).catch((err) => console.error(err))

    return NextResponse.json({ success: true, data: user })
  } catch (error: any) {
    console.error('Error updating creator:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const user = await User.findById(params.id)
    if (!user) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
    }

    user.isDeleted = true
    user.deletedAt = new Date()
    await user.save()

    await ActivityLog.create({
      userId: session.user.id,
      userName: session.user.name || 'Admin',
      userRole: 'ADMIN',
      action: 'INFLUENCER_DELETED',
      targetType: 'INFLUENCER',
      targetId: user._id,
      targetName: user.name,
      details: `Creator was soft deleted by admin`,
    }).catch((err) => console.error(err))

    return NextResponse.json({ success: true, message: 'Creator deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting creator:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
