export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Notification from '@/lib/db/models/Notification'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ notifications: [], unreadCount: 0 })
    }

    await connectDB()
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      Notification.countDocuments({ userId: session.user.id, isRead: false }),
    ])

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    })
  } catch (error: any) {
    console.error('Fetch notifications error:', error)
    return NextResponse.json(
      { notifications: [], unreadCount: 0 },
      { status: 200 }
    )
  }
}

export async function PATCH() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    await Notification.updateMany(
      { userId: session.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: 500 }
    )
  }
}
