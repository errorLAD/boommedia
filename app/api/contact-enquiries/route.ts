import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/db/mongoose'
import LeadInquiry from '@/lib/db/models/LeadInquiry'
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit'

const enquirySchema = z.object({
  companyName: z.string().trim().min(2, 'Enter your company name.').max(120),
  contactName: z.string().trim().min(2, 'Enter your name.').max(100),
  email: z.string().trim().email('Enter a valid email address.').max(120),
  phone: z
    .string()
    .trim()
    .optional()
    .default('')
    .refine((value) => {
      const digits = value.replace(/\D/g, '')
      return digits.length === 0 || (digits.length >= 10 && digits.length <= 15)
    }, 'Enter a valid phone number.'),
  service: z.enum(['INFLUENCER', 'VEHICLE', 'BOTH', 'influencer', 'vehicle', 'both']),
  message: z.string().trim().max(5000, 'Your message is too long.').optional().default(''),
  city: z.string().trim().optional().default(''),
  state: z.string().trim().optional().default(''),
  budget: z.string().trim().optional().default(''),
  source: z.string().trim().optional().default('landing_page'),
})

function sanitize(value: string) {
  return value.replace(/<[^>]*>?/gm, '').trim()
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rateCheck = checkRateLimit(`contact:${ip}`, 5, 300)
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many submissions. Please wait a few minutes before trying again.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parsed = enquirySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid input.' },
        { status: 400 }
      )
    }

    const data = parsed.data
    await connectDB()
    const service = data.service.toLowerCase() as 'influencer' | 'vehicle' | 'both'

    await LeadInquiry.create({
      companyName: sanitize(data.companyName),
      contactPersonName: sanitize(data.contactName),
      email: data.email.toLowerCase(),
      phone: data.phone.replace(/[^\d+]/g, ''),
      service,
      city: sanitize(data.city),
      state: sanitize(data.state),
      budget: sanitize(data.budget),
      source: sanitize(data.source || (service === 'influencer' ? 'influencer_page' : 'landing_page')),
      message: sanitize(data.message),
      status: 'new',
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Contact enquiry submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Unable to send your request. Please try again.' },
      { status: 500 }
    )
  }
}
