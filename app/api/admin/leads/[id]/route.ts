import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import LeadInquiry from '@/lib/db/models/LeadInquiry'

const updateSchema = z.object({ status: z.enum(['new', 'contacted', 'in-progress', 'converted', 'closed']).optional(), adminNotes: z.string().max(5000).optional() })
const clean = (value: string) => value.replace(/<[^>]*>?/gm, '').trim()

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  await connectDB()
  const lead = await LeadInquiry.findById(params.id).lean()
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: lead })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const parsed = updateSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'Invalid update.' }, { status: 400 })
  await connectDB()
  const update: Record<string, string> = {}
  if (parsed.data.status) update.status = parsed.data.status
  if (parsed.data.adminNotes !== undefined) update.adminNotes = clean(parsed.data.adminNotes)
  const lead = await LeadInquiry.findByIdAndUpdate(params.id, update, { new: true }).lean()
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: lead })
}
