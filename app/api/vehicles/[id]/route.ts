export const dynamic = 'force-dynamic'
import connectDB from '@/lib/db/mongoose'
import VehiclePartnerProfile from '@/lib/db/models/VehiclePartnerProfile'
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Profile ID is required' },
        { status: 400 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    let profile = null

    // Try by profile _id first, then by userId
    profile = await VehiclePartnerProfile.findById(id)
      .populate('userId', 'name email status avatar createdAt')
      .lean()

    if (!profile) {
      profile = await VehiclePartnerProfile.findOne({ userId: id })
        .populate('userId', 'name email status avatar createdAt')
        .lean()
    }

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Vehicle partner profile not found' },
        { status: 404 }
      )
    }

    // Check profile is public
    if ((profile as any).isPublic === false) {
      return NextResponse.json(
        { success: false, error: 'This profile is not publicly available' },
        { status: 403 }
      )
    }

    // Check user is active
    const user = profile.userId as any
    if (user?.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'This vehicle partner profile is currently unavailable' },
        { status: 403 }
      )
    }

    // Increment profile views (fire-and-forget)
    VehiclePartnerProfile.findByIdAndUpdate(profile._id, {
      $inc: { profileViews: 1 },
    }).exec().catch(console.error)

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error('Error fetching vehicle partner profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicle partner profile' },
      { status: 500 }
    )
  }
}
