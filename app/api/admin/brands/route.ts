import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import User from '@/lib/db/models/User'
import BrandProfile from '@/lib/db/models/BrandProfile'
import Campaign from '@/lib/db/models/Campaign'
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
      role: 'BRAND',
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

    // Fetch corresponding brand profiles and campaign counts
    const [profiles, campaignCounts] = await Promise.all([
      BrandProfile.find({ userId: { $in: userIds } }).lean(),
      Campaign.aggregate([
        { $match: { brandId: { $in: userIds }, isDeleted: { $ne: true } } },
        { $group: { _id: '$brandId', count: { $sum: 1 } } },
      ]),
    ])

    const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]))
    const countMap = new Map(campaignCounts.map((c) => [c._id.toString(), c.count]))

    const brands = users.map((user) => {
      const p = profileMap.get(user._id.toString())
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive !== false,
        isVerified: user.isVerified || p?.isVerified || false,
        createdAt: user.createdAt,
        companyName: p?.companyName || user.name,
        contactPerson: p?.contactPerson || user.name,
        city: p?.city || '',
        state: p?.state || '',
        industry: p?.industry || 'Consumer',
        totalCampaigns: countMap.get(user._id.toString()) || 0,
      }
    })

    return NextResponse.json({
      success: true,
      data: brands,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching admin brands:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
