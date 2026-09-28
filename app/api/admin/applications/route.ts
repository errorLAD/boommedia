export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import CampaignApplication from '@/lib/db/models/CampaignApplication'
import ActivityLog from '@/lib/db/models/ActivityLog'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')?.toUpperCase()
    const status = searchParams.get('status')?.toUpperCase()

    const query: Record<string, any> = {}
    if (type && type !== 'ALL') query.applicantType = type
    if (status && status !== 'ALL') query.status = status

    const applications = await CampaignApplication.find(query)
      .populate('applicantId', 'name email phone')
      .populate('campaignId', 'name serviceType budget')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ success: true, data: applications })
  } catch (error: any) {
    console.error('Error fetching admin applications:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()
    const body = await req.json()
    const { applicationId, status } = body

    if (!applicationId || !status) {
      return NextResponse.json({ error: 'applicationId and status are required' }, { status: 400 })
    }

    const app = await CampaignApplication.findById(applicationId)
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    app.status = status
    await app.save()

    return NextResponse.json({ success: true, data: app })
  } catch (error: any) {
    console.error('Error updating application:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
