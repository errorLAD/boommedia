import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import User from '@/lib/db/models/User'
import { escapeRegex } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()
    const { searchParams } = new URL(req.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const query: any = {}
    if (role && role !== 'ALL') query.role = role
    if (status && status !== 'ALL') query.status = status
    if (search) {
      const escaped = escapeRegex(search)
      query.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
      ]
    }

    const skip = (page - 1) * limit
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-passwordHash -twoFactorSecret')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error: any) {
    console.error('Admin users GET error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const { userId, status } = await req.json()
    if (!userId || !status) {
      return NextResponse.json({ error: 'userId and status required' }, { status: 400 })
    }

    await connectDB()
    const updated = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-passwordHash')

    return NextResponse.json({ success: true, user: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
