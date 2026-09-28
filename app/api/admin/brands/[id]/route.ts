export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import User from '@/lib/db/models/User'
import BrandProfile from '@/lib/db/models/BrandProfile'
import Campaign from '@/lib/db/models/Campaign'
import Payment from '@/lib/db/models/Payment'
import CampaignDocument from '@/lib/db/models/CampaignDocument'
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
    const { id } = params

    const user = await User.findById(id).lean()
    if (!user || user.isDeleted) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    const [profile, campaigns, payments, documents] = await Promise.all([
      BrandProfile.findOne({ userId: id }).lean(),
      Campaign.find({ brandId: id, isDeleted: { $ne: true } }).sort({ createdAt: -1 }).lean(),
      Payment.find({ brandId: id }).sort({ createdAt: -1 }).lean(),
      CampaignDocument.find({ brandId: id }).sort({ createdAt: -1 }).lean(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        user,
        profile,
        campaigns,
        payments,
        documents,
      },
    })
  } catch (error: any) {
    console.error('Error fetching admin brand detail:', error)
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

    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    // Toggle suspend/activate
    if (body.isActive !== undefined) {
      user.isActive = body.isActive
      await user.save()

      await ActivityLog.create({
        userId: session.user.id,
        userName: session.user.name || 'Admin',
        userRole: 'ADMIN',
        action: user.isActive ? 'BRAND_ACTIVATED' : 'BRAND_SUSPENDED',
        targetType: 'BRAND',
        targetId: user._id,
        targetName: user.name,
        details: `Brand was ${user.isActive ? 'activated' : 'suspended'} by admin`,
      }).catch((err) => console.error(err))
    }

    // Toggle verification
    if (body.isVerified !== undefined) {
      user.isVerified = body.isVerified
      await user.save()
      await BrandProfile.findOneAndUpdate({ userId: id }, { isVerified: body.isVerified })

      await ActivityLog.create({
        userId: session.user.id,
        userName: session.user.name || 'Admin',
        userRole: 'ADMIN',
        action: user.isVerified ? 'BRAND_VERIFIED' : 'BRAND_UNVERIFIED',
        targetType: 'BRAND',
        targetId: user._id,
        targetName: user.name,
        details: `Brand verification status changed to ${user.isVerified ? 'verified' : 'unverified'}`,
      }).catch((err) => console.error(err))
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error: any) {
    console.error('Error updating brand:', error)
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
    const { id } = params

    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    // Soft delete
    user.isDeleted = true
    user.deletedAt = new Date()
    await user.save()

    await BrandProfile.findOneAndUpdate({ userId: id }, { isDeleted: true })

    await ActivityLog.create({
      userId: session.user.id,
      userName: session.user.name || 'Admin',
      userRole: 'ADMIN',
      action: 'BRAND_DELETED',
      targetType: 'BRAND',
      targetId: user._id,
      targetName: user.name,
      details: `Brand "${user.name}" was soft deleted by admin`,
    }).catch((err) => console.error(err))

    return NextResponse.json({ success: true, message: 'Brand soft deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting brand:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
