export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import CampaignDocument from '@/lib/db/models/CampaignDocument'
import Campaign from '@/lib/db/models/Campaign'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || ((session.user as any).role !== 'BRAND' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const brandId = session.user.id
    const isAdmin = (session.user as any).role === 'ADMIN'
    const { searchParams } = new URL(req.url)

    const type = searchParams.get('type')?.toUpperCase()
    const campaignId = searchParams.get('campaignId')

    const query: Record<string, any> = { status: 'ACTIVE' }
    if (!isAdmin) {
      query.brandId = brandId
    }
    if (type && type !== 'ALL') {
      query.type = type
    }
    if (campaignId) {
      query.campaignId = campaignId
    }

    const documents = await CampaignDocument.find(query)
      .populate('campaignId', 'name serviceType status')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      data: documents,
    })
  } catch (error: any) {
    console.error('Error fetching brand documents:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || ((session.user as any).role !== 'BRAND' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const brandId = session.user.id
    const body = await req.json()

    const { campaignId, title, type = 'OTHER', fileUrl, fileSize, mimeType } = body
    if (!title || !fileUrl) {
      return NextResponse.json({ error: 'Title and fileUrl are required' }, { status: 400 })
    }

    const doc = await CampaignDocument.create({
      brandId,
      campaignId: campaignId || undefined,
      title,
      type,
      fileUrl,
      fileSize: fileSize || 0,
      mimeType: mimeType || 'application/pdf',
      status: 'ACTIVE',
    })

    return NextResponse.json({
      success: true,
      data: doc,
    })
  } catch (error: any) {
    console.error('Error uploading document:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
