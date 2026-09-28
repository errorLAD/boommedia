import connectDB from '@/lib/db/mongoose'
import InfluencerProfile from '@/lib/db/models/InfluencerProfile'
import { NextRequest, NextResponse } from 'next/server'
import { escapeRegex } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50) // cap at 50
    const search = searchParams.get('search') || ''
    const city = searchParams.get('city') || ''
    const state = searchParams.get('state') || ''
    const niche = searchParams.get('niche') || ''
    const platform = searchParams.get('platform') || ''
    const minFollowers = searchParams.get('minFollowers')
    const maxFollowers = searchParams.get('maxFollowers')
    const minEngagement = searchParams.get('minEngagement')
    const maxPrice = searchParams.get('maxPrice')
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1

    // Build query
    const query: Record<string, unknown> = { isPublic: true }

    if (city) query.city = { $regex: escapeRegex(city), $options: 'i' }
    if (state) query.state = state
    if (niche) query.niche = { $regex: escapeRegex(niche), $options: 'i' }

    if (minFollowers) {
      query.totalFollowers = {
        ...((query.totalFollowers as object) || {}),
        $gte: parseInt(minFollowers),
      }
    }
    if (maxFollowers) {
      query.totalFollowers = {
        ...((query.totalFollowers as object) || {}),
        $lte: parseInt(maxFollowers),
      }
    }
    if (minEngagement) {
      query.avgEngagementRate = { $gte: parseFloat(minEngagement) }
    }
    if (maxPrice) {
      query['pricing.post'] = { $lte: parseInt(maxPrice) }
    }
    if (verifiedOnly) {
      query.verificationStatus = 'VERIFIED'
    }
    if (platform) {
      query['socialAccounts.platform'] = platform.toUpperCase()
    }
    if (search) {
      const escaped = escapeRegex(search)
      query.$or = [
        { niche: { $regex: escaped, $options: 'i' } },
        { bio: { $regex: escaped, $options: 'i' } },
        { city: { $regex: escaped, $options: 'i' } },
      ]
    }

    const sortMap: Record<string, string> = {
      followers: 'totalFollowers',
      engagement: 'avgEngagementRate',
      price: 'pricing.post',
      newest: 'createdAt',
      relevance: 'createdAt',
    }
    const sortField: Record<string, number> = {}
    sortField[sortMap[sortBy] || 'createdAt'] = sortOrder

    const skip = (page - 1) * limit

    const [profiles, total] = await Promise.all([
      InfluencerProfile.find(query)
        .populate('userId', 'name email status avatar')
        .sort(sortField as any)
        .skip(skip)
        .limit(limit)
        .lean(),
      InfluencerProfile.countDocuments(query),
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
    console.error('Error fetching influencers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch influencers' },
      { status: 500 }
    )
  }
}
