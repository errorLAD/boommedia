import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import LeadInquiry from '@/lib/db/models/LeadInquiry'
import { escapeRegex } from '@/lib/utils'

function isAdmin(session: any) { return !!session?.user && session.user.role === 'ADMIN' }

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim() || ''
    const service = searchParams.get('service') || 'all'
    const status = searchParams.get('status') || 'all'
    const query: Record<string, any> = {}
    if (service === 'influencer' || service === 'vehicle') query.service = { $in: [service, 'both'] }
    else if (service === 'both') query.service = 'both'
    if (status !== 'all') query.status = status
    if (search) {
      const pattern = { $regex: escapeRegex(search), $options: 'i' }
      query.$or = [{ companyName: pattern }, { contactPersonName: pattern }, { email: pattern }, { phone: pattern }]
    }
    await connectDB()
    const data = await LeadInquiry.find(query).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data })
  } catch (error) { console.error('Lead listing error:', error); return NextResponse.json({ error: 'Unable to load leads.' }, { status: 500 }) }
}
