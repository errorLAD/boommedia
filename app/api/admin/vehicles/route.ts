import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Vehicle from '@/lib/db/models/Vehicle'
import User from '@/lib/db/models/User'
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
    const vehicleType = searchParams.get('vehicleType') || 'ALL'
    const verificationStatus = searchParams.get('verificationStatus') || 'ALL'
    const city = searchParams.get('city') || 'ALL'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const query: Record<string, any> = {
      isDeleted: { $ne: true },
    }

    if (vehicleType !== 'ALL') query.vehicleType = vehicleType
    if (verificationStatus !== 'ALL') query.verificationStatus = verificationStatus
    if (city !== 'ALL') query.city = { $regex: escapeRegex(city), $options: 'i' }

    if (search) {
      const escaped = escapeRegex(search)
      query.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { registrationNumber: { $regex: escaped, $options: 'i' } },
        { city: { $regex: escaped, $options: 'i' } },
      ]
    }

    const [vehicles, total] = await Promise.all([
      Vehicle.find(query)
        .populate('partnerId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Vehicle.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: vehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching admin vehicles:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
