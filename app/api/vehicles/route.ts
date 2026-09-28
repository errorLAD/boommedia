import connectDB from '@/lib/db/mongoose'
import VehiclePartnerProfile from '@/lib/db/models/VehiclePartnerProfile'
import { NextRequest, NextResponse } from 'next/server'
import { escapeRegex } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50)
    const city = searchParams.get('city') || ''
    const state = searchParams.get('state') || ''
    const vehicleType = searchParams.get('vehicleType') || ''
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const available = searchParams.get('available')
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1
    const search = searchParams.get('search') || ''

    // Build query
    const query: Record<string, unknown> = { isPublic: true }

    if (city) query.city = { $regex: escapeRegex(city), $options: 'i' }
    if (state) query.state = state
    if (vehicleType) query['vehicles.type'] = { $regex: escapeRegex(vehicleType), $options: 'i' }
    if (available === 'true') query.isAvailable = true
    if (available === 'false') query.isAvailable = false
    if (verifiedOnly) query.verificationStatus = 'VERIFIED'

    if (minPrice) {
      query['vehicles.dailyRate'] = {
        ...((query['vehicles.dailyRate'] as object) || {}),
        $gte: parseInt(minPrice),
      }
    }
    if (maxPrice) {
      query['vehicles.dailyRate'] = {
        ...((query['vehicles.dailyRate'] as object) || {}),
        $lte: parseInt(maxPrice),
      }
    }

    if (search) {
      const escaped = escapeRegex(search)
      query.$or = [
        { companyName: { $regex: escaped, $options: 'i' } },
        { 'vehicles.brand': { $regex: escaped, $options: 'i' } },
        { 'vehicles.model': { $regex: escaped, $options: 'i' } },
        { city: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
      ]
    }

    const sortMap: Record<string, string> = {
      price: 'vehicles.dailyRate',
      fleet: 'fleetSize',
      newest: 'createdAt',
      relevance: 'createdAt',
    }
    const sortField: Record<string, number> = {}
    sortField[sortMap[sortBy] || 'createdAt'] = sortOrder

    const skip = (page - 1) * limit

    const [profiles, total] = await Promise.all([
      VehiclePartnerProfile.find(query)
        .populate('userId', 'name email status avatar')
        .sort(sortField as any)
        .skip(skip)
        .limit(limit)
        .lean(),
      VehiclePartnerProfile.countDocuments(query),
    ])

    // Filter out suspended/banned users
    const filtered = profiles.filter(
      (p) => (p.userId as any)?.status === 'ACTIVE'
    )

    return NextResponse.json({
      success: true,
      data: filtered,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: skip + limit < total,
      hasPrev: page > 1,
    })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicle partners' },
      { status: 500 }
    )
  }
}
