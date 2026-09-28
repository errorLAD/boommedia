export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Vehicle from '@/lib/db/models/Vehicle'
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
    const vehicle = await Vehicle.findById(params.id)
      .populate('partnerId', 'name email phone')
      .lean()

    if (!vehicle || vehicle.isDeleted) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: vehicle })
  } catch (error: any) {
    console.error('Error fetching admin vehicle:', error)
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
    const { action, rejectionReason, availabilityStatus } = body

    const vehicle = await Vehicle.findById(id)
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    if (action === 'APPROVE') {
      vehicle.verificationStatus = 'VERIFIED'
      vehicle.rejectionReason = undefined
    } else if (action === 'REJECT') {
      vehicle.verificationStatus = 'REJECTED'
      vehicle.rejectionReason = rejectionReason || 'Does not meet platform quality criteria'
    } else if (action === 'SUSPEND') {
      vehicle.verificationStatus = 'SUSPENDED'
    }

    if (availabilityStatus) {
      vehicle.availabilityStatus = availabilityStatus
    }

    await vehicle.save()

    await ActivityLog.create({
      userId: session.user.id,
      userName: session.user.name || 'Admin',
      userRole: 'ADMIN',
      action: `VEHICLE_${action || 'UPDATED'}`,
      targetType: 'VEHICLE',
      targetId: vehicle._id,
      targetName: vehicle.title || vehicle.registrationNumber,
      details: `Vehicle was marked as ${vehicle.verificationStatus}${rejectionReason ? `: ${rejectionReason}` : ''}`,
    }).catch((err) => console.error(err))

    return NextResponse.json({ success: true, data: vehicle })
  } catch (error: any) {
    console.error('Error updating vehicle:', error)
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
    const vehicle = await Vehicle.findById(params.id)
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    vehicle.isDeleted = true
    await vehicle.save()

    await ActivityLog.create({
      userId: session.user.id,
      userName: session.user.name || 'Admin',
      userRole: 'ADMIN',
      action: 'VEHICLE_DELETED',
      targetType: 'VEHICLE',
      targetId: vehicle._id,
      targetName: vehicle.title || vehicle.registrationNumber,
      details: `Vehicle was soft-deleted by admin`,
    }).catch((err) => console.error(err))

    return NextResponse.json({ success: true, message: 'Vehicle deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
