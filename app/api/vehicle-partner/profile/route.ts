export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import VehiclePartnerProfile from '@/lib/db/models/VehiclePartnerProfile'
import User from '@/lib/db/models/User'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const partnerId = session.user.id
  const [profile, user] = await Promise.all([
    VehiclePartnerProfile.findOne({ userId: partnerId }).lean(),
    User.findById(partnerId).select('name email phone status').lean(),
  ])

  return NextResponse.json({
    success: true,
    data: {
      ...profile,
      user,
    },
  })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    await connectDB()
    const partnerId = session.user.id

    const profile = await VehiclePartnerProfile.findOne({ userId: partnerId })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Allowed profile fields
    const fields = [
      'companyName',
      'businessType',
      'contactPerson',
      'phone',
      'address',
      'bio',
      'city',
      'state',
      'operatingCities',
      'fleetTypes',
      'fleetSize',
      'profileImage',
      'documents',
    ]

    for (const f of fields) {
      if (body[f] !== undefined) {
        ;(profile as any)[f] = body[f]
      }
    }

    if (body.name || body.phone) {
      await User.findByIdAndUpdate(partnerId, {
        name: body.name || undefined,
        phone: body.phone || undefined,
      })
    }

    await profile.save()
    return NextResponse.json({ success: true, data: profile })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
