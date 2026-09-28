import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import User from '@/lib/db/models/User'
import VehiclePartnerProfile from '@/lib/db/models/VehiclePartnerProfile'
import Vehicle from '@/lib/db/models/Vehicle'
import ActivityLog from '@/lib/db/models/ActivityLog'
import { escapeRegex } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()
    const { searchParams } = new URL(req.url)

    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'ALL'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const userQuery: Record<string, any> = {
      role: 'VEHICLE_PARTNER',
      isDeleted: { $ne: true },
    }

    if (status === 'ACTIVE') userQuery.isActive = true
    if (status === 'SUSPENDED') userQuery.isActive = false

    if (search) {
      const escaped = escapeRegex(search)
      userQuery.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
        { phone: { $regex: escaped, $options: 'i' } },
      ]
    }

    const [users, total] = await Promise.all([
      User.find(userQuery).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(userQuery),
    ])

    const userIds = users.map((u) => u._id)

    const [profiles, vehicleCounts] = await Promise.all([
      VehiclePartnerProfile.find({ userId: { $in: userIds } }).lean(),
      Vehicle.aggregate([
        { $match: { partnerId: { $in: userIds }, isDeleted: { $ne: true } } },
        { $group: { _id: '$partnerId', count: { $sum: 1 } } },
      ]),
    ])

    const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]))
    const vehicleCountMap = new Map(vehicleCounts.map((v) => [v._id.toString(), v.count]))

    const partners = users.map((u) => {
      const p = profileMap.get(u._id.toString())
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        isActive: u.isActive !== false,
        isVerified: u.isVerified || p?.isVerified || false,
        companyName: p?.companyName || u.name,
        businessType: p?.businessType || 'Fleet Owner',
        city: p?.city || '',
        state: p?.state || '',
        fleetSize: p?.fleetSize || vehicleCountMap.get(u._id.toString()) || 0,
        createdAt: u.createdAt,
      }
    })

    return NextResponse.json({
      success: true,
      data: partners,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching admin vehicle partners:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()
    const body = await req.json()
    const { partnerId, isActive, isVerified } = body

    if (!partnerId) {
      return NextResponse.json({ error: 'partnerId is required' }, { status: 400 })
    }

    const user = await User.findById(partnerId)
    if (!user) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    if (isActive !== undefined) user.isActive = isActive
    if (isVerified !== undefined) {
      user.isVerified = isVerified
      await VehiclePartnerProfile.findOneAndUpdate({ userId: partnerId }, { isVerified })
    }

    await user.save()

    await ActivityLog.create({
      userId: session.user.id,
      userName: session.user.name || 'Admin',
      userRole: 'ADMIN',
      action: 'VEHICLE_PARTNER_UPDATED',
      targetType: 'VEHICLE_PARTNER',
      targetId: user._id,
      targetName: user.name,
      details: `Vehicle partner was updated (Active: ${user.isActive}, Verified: ${user.isVerified})`,
    }).catch((err) => console.error(err))

    return NextResponse.json({ success: true, data: user })
  } catch (error: any) {
    console.error('Error updating vehicle partner:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
