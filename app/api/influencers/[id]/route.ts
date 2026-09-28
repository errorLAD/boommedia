export const dynamic = 'force-dynamic'
import connectDB from '@/lib/db/mongoose'
import InfluencerProfile from '@/lib/db/models/InfluencerProfile'
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

    let profile = null

    // Try to find by profile _id first
    if (mongoose.Types.ObjectId.isValid(id)) {
      profile = await InfluencerProfile.findById(id)
        .populate('userId', 'name email status avatar createdAt')
        .lean()

      // If not found by profile ID, try finding by userId
      if (!profile) {
        profile = await InfluencerProfile.findOne({ userId: id })
          .populate('userId', 'name email status avatar createdAt')
          .lean()
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Influencer profile not found' },
        { status: 404 }
      )
    }

    // Check profile is public
    if (!profile.isPublic) {
      return NextResponse.json(
        { success: false, error: 'This profile is not publicly available' },
        { status: 403 }
      )
    }

    // Check user is active
    const user = profile.userId as any
    if (user?.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'This influencer profile is currently unavailable' },
        { status: 403 }
      )
    }

    // Increment profile views (fire-and-forget)
    InfluencerProfile.findByIdAndUpdate(profile._id, {
      $inc: { profileViews: 1 },
    }).exec().catch(console.error)

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error('Error fetching influencer profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch influencer profile' },
      { status: 500 }
    )
  }
}
