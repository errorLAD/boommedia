export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import LeadInquiry from '@/lib/db/models/LeadInquiry'

export async function GET() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  await connectDB()
  const [total, newLeads, influencer, vehicle, both] = await Promise.all([
    LeadInquiry.countDocuments(), LeadInquiry.countDocuments({ status: 'new' }), LeadInquiry.countDocuments({ service: 'influencer' }), LeadInquiry.countDocuments({ service: 'vehicle' }), LeadInquiry.countDocuments({ service: 'both' }),
  ])
  return NextResponse.json({ success: true, data: { total, newLeads, influencer, vehicle, both } })
}
