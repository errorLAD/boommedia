export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Vehicle from '@/lib/db/models/Vehicle'
import VehiclePartnerProfile from '@/lib/db/models/VehiclePartnerProfile'
import ActivityLog from '@/lib/db/models/ActivityLog'

interface RouteParams {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const vehicle = await Vehicle.findOne({
    _id: params.id,
    partnerId: session.user.id,
    isDeleted: { $ne: true },
  }).lean()

  if (!vehicle) {
    return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: vehicle })
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    await connectDB()

    const vehicle = await Vehicle.findOne({
      _id: params.id,
      partnerId: session.user.id,
      isDeleted: { $ne: true },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found or unauthorized' }, { status: 404 })
    }

    // Update allowed fields
    const allowedFields = [
      'title',
      'vehicleType',
      'vehicleNumber',
      'registrationNumber',
      'make',
      'model',
      'year',
      'color',
      'fuelType',
      'images',
      'advertisingAreas',
      'advertisingFormats',
      'price',
      'priceType',
      'minimumCampaignDuration',
      'securityDeposit',
      'isNegotiable',
      'state',
      'city',
      'areas',
      'routes',
      'operatingDays',
      'operatingHours',
      'availabilityStatus',
      'availableFrom',
      'availableUntil',
      'description',
    ]

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        ;(vehicle as any)[field] = body[field]
      }
    }

    if (body.images) {
      vehicle.photos = body.images.map((img: any) => ({
        url: img.url,
        caption: img.caption || img.tag,
        isPrimary: img.isPrimary,
      }))
    }

    if (body.price) {
      vehicle.pricing = { ...vehicle.pricing, perMonth: Number(body.price) }
    }

    await vehicle.save()

    return NextResponse.json({ success: true, data: vehicle })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update vehicle' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { isAvailable, availabilityStatus } = await req.json()
    await connectDB()

    const vehicle = await Vehicle.findOne({
      _id: params.id,
      partnerId: session.user.id,
      isDeleted: { $ne: true },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    if (isAvailable !== undefined) vehicle.isAvailable = Boolean(isAvailable)
    if (availabilityStatus) vehicle.availabilityStatus = availabilityStatus

    await vehicle.save()
    return NextResponse.json({ success: true, data: vehicle })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update status' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const vehicle = await Vehicle.findOne({
      _id: params.id,
      partnerId: session.user.id,
      isDeleted: { $ne: true },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Soft delete
    vehicle.isDeleted = true
    await vehicle.save()

    // Decrement partner vehicle count
    await VehiclePartnerProfile.findOneAndUpdate(
      { userId: session.user.id },
      { $inc: { totalVehicles: -1 } }
    )

    await ActivityLog.create({
      userId: session.user.id,
      userName: session.user.name || 'Vehicle Partner',
      userRole: 'VEHICLE_PARTNER',
      action: 'VEHICLE_DELETED',
      targetType: 'VEHICLE',
      targetId: vehicle._id,
      targetName: vehicle.title,
      details: `Vehicle "${vehicle.title}" deleted by partner.`,
    }).catch(() => {})

    return NextResponse.json({ success: true, message: 'Vehicle deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete vehicle' }, { status: 500 })
  }
}
