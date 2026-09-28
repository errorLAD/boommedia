import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import ContactEnquiry from '@/lib/db/models/ContactEnquiry'
import { escapeRegex } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim() || ''
    const query: Record<string, unknown> = {}
    if (search) {
      const pattern = { $regex: escapeRegex(search), $options: 'i' }
      query.$or = [{ companyName: pattern }, { contactName: pattern }, { email: pattern }, { phone: pattern }]
    }

    await connectDB()
    const enquiries = await ContactEnquiry.find(query).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: enquiries })
  } catch (error) {
    console.error('Admin contact enquiries error:', error)
    return NextResponse.json({ error: 'Failed to fetch contact enquiries' }, { status: 500 })
  }
}
