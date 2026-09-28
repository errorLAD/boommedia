import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
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

    const targetType = searchParams.get('targetType')?.toUpperCase()
    const userRole = searchParams.get('userRole')?.toUpperCase()
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '30')
    const skip = (page - 1) * limit

    const query: Record<string, any> = {}
    if (targetType && targetType !== 'ALL') query.targetType = targetType
    if (userRole && userRole !== 'ALL') query.userRole = userRole

    if (search) {
      const escaped = escapeRegex(search)
      query.$or = [
        { userName: { $regex: escaped, $options: 'i' } },
        { action: { $regex: escaped, $options: 'i' } },
        { targetName: { $regex: escaped, $options: 'i' } },
        { details: { $regex: escaped, $options: 'i' } },
      ]
    }

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching activity logs:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
