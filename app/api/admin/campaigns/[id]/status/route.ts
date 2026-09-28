export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Campaign from '@/lib/db/models/Campaign'
import ActivityLog from '@/lib/db/models/ActivityLog'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()
    const { id } = params
    const body = await req.json()
    const { status, note } = body

    const campaign = await Campaign.findById(id)
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    const previousStatus = campaign.status
    if (status) {
      campaign.status = status
    }

    if (note) {
      if (!campaign.internalAdminNotes) {
        campaign.internalAdminNotes = []
      }
      campaign.internalAdminNotes.push({
        note,
        authorName: session.user.name || 'Admin',
        authorId: session.user.id as any,
        createdAt: new Date(),
      })
    }

    await campaign.save()

    await ActivityLog.create({
      userId: session.user.id,
      userName: session.user.name || 'Admin',
      userRole: 'ADMIN',
      action: 'CAMPAIGN_STATUS_CHANGED',
      targetType: 'CAMPAIGN',
      targetId: campaign._id,
      targetName: campaign.name,
      details: `Campaign status changed from ${previousStatus} to ${campaign.status}${note ? ` (Note: ${note})` : ''}`,
    }).catch((err) => console.error(err))

    return NextResponse.json({ success: true, data: campaign })
  } catch (error: any) {
    console.error('Error updating campaign status:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
