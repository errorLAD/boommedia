export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Vehicle from '@/lib/db/models/Vehicle'
import VehiclePartnerProfile from '@/lib/db/models/VehiclePartnerProfile'
import ActivityLog from '@/lib/db/models/ActivityLog'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || ((session.user as any).role !== 'VEHICLE_PARTNER' && (session.user as any).role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  await connectDB()
  const data = await Vehicle.find({
    partnerId: session.user.id,
    isDeleted: { $ne: true },
  })
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || ((session.user as any).role !== 'VEHICLE_PARTNER' && (session.user as any).role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const body = await request.json()

    const {
      title,
      vehicleType,
      vehicleNumber,
      registrationNumber,
      make,
      model,
      year,
      color,
      fuelType,
      images,
      advertisingAreas,
      advertisingFormats,
      price,
      priceType,
      minimumCampaignDuration,
      securityDeposit,
      isNegotiable,
      state,
      city,
      areas,
      routes,
      operatingDays,
      operatingHours,
      availabilityStatus,
      availableFrom,
      availableUntil,
      description,
      isDraft,
    } = body

    if (!title || !vehicleType || !city || !state) {
      return NextResponse.json(
        { error: 'Vehicle title, type, city, and state are required' },
        { status: 400 }
      )
    }

    await connectDB()

    const partnerId = session.user.id
    const profile = await VehiclePartnerProfile.findOne({ userId: partnerId })

    const regNum = (vehicleNumber || registrationNumber || '').trim().toUpperCase()

    // Create the vehicle
    const vehicle = await Vehicle.create({
      partnerId,
      partnerProfileId: profile?._id,
      title: title.trim(),
      vehicleType,
      vehicleNumber: regNum || undefined,
      registrationNumber: regNum || undefined,
      make: make?.trim() || '',
      model: model?.trim() || '',
      year: year ? Number(year) : undefined,
      color: color?.trim() || '',
      fuelType: fuelType || 'OTHER',
      images: images || [],
      photos: (images || []).map((img: any) => ({
        url: img.url,
        caption: img.caption || img.tag,
        isPrimary: img.isPrimary,
      })),
      advertisingAreas: advertisingAreas || ['LEFT_SIDE', 'RIGHT_SIDE'],
      advertisingFormats: advertisingFormats || ['VINYL'],
      price: Number(price) || 0,
      priceType: priceType || 'PER_MONTH',
      pricing: {
        perMonth: Number(price) || 0,
      },
      minimumCampaignDuration: minimumCampaignDuration || '1_MONTH',
      securityDeposit: securityDeposit ? Number(securityDeposit) : undefined,
      isNegotiable: Boolean(isNegotiable),
      state: state.trim(),
      city: city.trim(),
      areas: areas || [],
      operatingAreas: areas || [],
      routes: routes || [],
      operatingDays: operatingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      operatingHours: operatingHours || '',
      availabilityStatus: availabilityStatus || 'AVAILABLE',
      availableFrom: availableFrom ? new Date(availableFrom) : undefined,
      availableUntil: availableUntil ? new Date(availableUntil) : undefined,
      description: description?.trim() || '',
      verificationStatus: isDraft ? 'UNVERIFIED' : 'PENDING',
      campaignStatus: 'AVAILABLE',
      isAvailable: true,
      isActive: true,
      isDeleted: false,
    })

    // Increment partner totalVehicles
    if (profile) {
      profile.totalVehicles = (profile.totalVehicles || 0) + 1
      await profile.save()
    }

    await ActivityLog.create({
      userId: partnerId,
      userName: session.user.name || 'Vehicle Partner',
      userRole: 'VEHICLE_PARTNER',
      action: 'VEHICLE_ADDED',
      targetType: 'VEHICLE',
      targetId: vehicle._id,
      targetName: vehicle.title,
      details: `New vehicle "${vehicle.title}" (${vehicle.vehicleType}) submitted for verification.`,
    }).catch(() => {})

    return NextResponse.json({ success: true, data: vehicle }, { status: 201 })
  } catch (error: any) {
    console.error('Add vehicle error:', error)
    return NextResponse.json(
      { error: error.message || 'Unable to add vehicle' },
      { status: 500 }
    )
  }
}
