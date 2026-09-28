import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import User from '@/lib/db/models/User'
import InfluencerProfile from '@/lib/db/models/InfluencerProfile'
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
    const verificationStatus = searchParams.get('verificationStatus') || 'ALL'
    const category = searchParams.get('category') || 'ALL'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const userQuery: Record<string, any> = {
      role: 'INFLUENCER',
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
    const profiles = await InfluencerProfile.find({ userId: { $in: userIds } }).lean()
    const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]))

    let creators = users.map((u) => {
      const p = profileMap.get(u._id.toString())
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        isActive: u.isActive !== false,
        isVerified: u.isVerified || p?.verificationStatus === 'VERIFIED',
        verificationStatus: p?.verificationStatus || (u.isVerified ? 'VERIFIED' : 'UNVERIFIED'),
        city: p?.city || '',
        state: p?.state || '',
        category: p?.niche || (p?.categories && p.categories[0]) || 'General',
        categories: p?.categories || [],
        languages: p?.languages || ['Hindi'],
        totalFollowers: p?.totalFollowers || 0,
        socialAccounts: p?.socialAccounts || [],
        rating: p?.rating || 0,
        completedCampaigns: p?.completedCampaigns || 0,
        createdAt: u.createdAt,
      }
    })

    if (verificationStatus !== 'ALL') {
      creators = creators.filter((c) => c.verificationStatus === verificationStatus)
    }

    if (category !== 'ALL') {
      creators = creators.filter((c) =>
        c.category?.toLowerCase().includes(category.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      data: creators,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching admin influencers:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
