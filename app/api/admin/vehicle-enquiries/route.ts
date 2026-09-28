import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import VehicleAdvertisingEnquiry from '@/lib/db/models/VehicleAdvertisingEnquiry'
import { escapeRegex } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '15')))
    const search = searchParams.get('search')?.trim() || ''
    const status = searchParams.get('status')?.trim() || ''
    const vehicleType = searchParams.get('vehicleType')?.trim() || ''
    const priority = searchParams.get('priority')?.trim() || ''
    const city = searchParams.get('city')?.trim() || ''
    const startDate = searchParams.get('startDate')?.trim() || ''
    const endDate = searchParams.get('endDate')?.trim() || ''

    const query: Record<string, any> = {}

    if (status && status !== 'ALL') {
      query.status = status
    }

    if (priority && priority !== 'ALL') {
      query.priority = priority
    }

    if (city && city !== 'ALL') {
      query.city = { $regex: new RegExp(`^${escapeRegex(city)}$`, 'i') }
    }

    if (vehicleType && vehicleType !== 'ALL') {
      query.vehicleTypes = vehicleType
    }

    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) {
        const e = new Date(endDate)
        e.setHours(23, 59, 59, 999)
        query.createdAt.$lte = e
      }
    }

    if (search) {
      const searchRegex = { $regex: escapeRegex(search), $options: 'i' }
      query.$or = [
        { companyName: searchRegex },
        { contactPersonName: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
      ]
    }

    const skip = (page - 1) * limit

    const [enquiries, total] = await Promise.all([
      VehicleAdvertisingEnquiry.find(query)
        .populate('assignedAdmin', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      VehicleAdvertisingEnquiry.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: enquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    })
  } catch (error: any) {
    console.error('Admin get vehicle enquiries error:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch enquiries' }, { status: 500 })
  }
}
