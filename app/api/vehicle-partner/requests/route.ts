export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import VehicleCampaign from '@/lib/db/models/VehicleCampaign'
import Vehicle from '@/lib/db/models/Vehicle'
import ActivityLog from '@/lib/db/models/ActivityLog'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const requests = await VehicleCampaign.find({
    partnerId: session.user.id,
    status: { $in: ['REQUEST_RECEIVED', 'UNDER_REVIEW'] },
  })
    .populate('vehicleId', 'title vehicleType registrationNumber images photos city')
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({ success: true, data: requests })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { requestId, action, notes } = await req.json()
    if (!requestId || !['ACCEPT', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Valid requestId and action required' }, { status: 400 })
    }

    await connectDB()
    const request = await VehicleCampaign.findOne({
      _id: requestId,
      partnerId: session.user.id,
    })

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    if (action === 'ACCEPT') {
      request.status = 'ACCEPTED'
      if (notes) request.notes = notes

      // Mark vehicle as booked for the duration
      await Vehicle.findByIdAndUpdate(request.vehicleId, {
        campaignStatus: 'ACCEPTED',
        availabilityStatus: 'BOOKED',
      })

      await ActivityLog.create({
        userId: session.user.id,
        userName: session.user.name || 'Vehicle Partner',
        userRole: 'VEHICLE_PARTNER',
        action: 'VEHICLE_REQUEST_ACCEPTED',
        targetType: 'CAMPAIGN',
        targetId: request._id,
        targetName: request.campaignName,
        details: `Advertising request accepted for "${request.campaignName}".`,
      }).catch(() => {})
    } else {
      request.status = 'CANCELLED'
      if (notes) request.notes = notes

      await ActivityLog.create({
        userId: session.user.id,
        userName: session.user.name || 'Vehicle Partner',
        userRole: 'VEHICLE_PARTNER',
        action: 'VEHICLE_REQUEST_REJECTED',
        targetType: 'CAMPAIGN',
        targetId: request._id,
        targetName: request.campaignName,
        details: `Advertising request rejected for "${request.campaignName}".`,
      }).catch(() => {})
    }

    await request.save()
    return NextResponse.json({ success: true, data: request })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
