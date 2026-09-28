export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/db/mongoose'
import VehicleAdvertisingEnquiry from '@/lib/db/models/VehicleAdvertisingEnquiry'
import LeadInquiry from '@/lib/db/models/LeadInquiry'

// In-memory rate limiting map: ip -> { count, expiresAt }
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>()

function checkRateLimit(ip: string, limit = 6, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) {
    return false
  }

  entry.count += 1
  return true
}

// Strip basic HTML/script tags to prevent XSS
function sanitizeText(str: string): string {
  return str.replace(/<[^>]*>?/gm, '').trim()
}

// Indian mobile number validator: 10 digits starting with 6-9, allowing optional +91 or 0 prefix
const indianMobileRegex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6-9]\d{9}$/

const enquirySchema = z.object({
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(120, 'Company name cannot exceed 120 characters'),
  contactPersonName: z
    .string()
    .min(2, 'Contact person name must be at least 2 characters')
    .max(100, 'Contact person name cannot exceed 100 characters'),
  email: z
    .string()
    .email('Please enter a valid business email address')
    .max(120, 'Email cannot exceed 120 characters'),
  mobile: z
    .string()
    .refine((val) => indianMobileRegex.test(val.replace(/[\s-]/g, '')), {
      message: 'Please enter a valid 10-digit Indian mobile number',
    }),
  city: z
    .string()
    .min(2, 'City is required')
    .max(80, 'City name cannot exceed 80 characters'),
  state: z.string().max(80).optional().default('Bihar'),
  area: z.string().max(100).optional().default(''),
  vehicleTypes: z
    .array(z.string())
    .min(1, 'Please select at least one vehicle category'),
  campaignStartDate: z.string().optional().nullable(),
  campaignEndDate: z.string().optional().nullable(),
  budget: z.string().max(100).optional().default(''),
  vehicleCount: z.union([z.string(), z.number()]).optional().default('1-5'),
  advertisingFormat: z.string().max(120).optional().default('Flexible / Need Recommendation'),
  campaignDescription: z
    .string()
    .min(10, 'Please describe your campaign requirement (at least 10 characters)')
    .max(2500, 'Campaign description cannot exceed 2500 characters'),
  // Honeypot field for bot spam detection
  hpWebsite: z.string().optional().default(''),
})

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown-ip'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please wait a few minutes before submitting again.',
        },
        { status: 429 }
      )
    }

    const body = await req.json()

    // 2. Honeypot check (anti-bot)
    if (body.hpWebsite && body.hpWebsite.length > 0) {
      // Silently accept bots without storing to protect database
      return NextResponse.json({
        success: true,
        message: 'Thanks! Our vehicle advertising team will review your requirement and contact you shortly.',
      })
    }

    // 3. Zod Validation
    const parsed = enquirySchema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Invalid input'
      const errors = parsed.error.format()
      return NextResponse.json(
        {
          success: false,
          error: firstError,
          details: errors,
        },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Date validation
    let startDate: Date | undefined
    let endDate: Date | undefined
    if (data.campaignStartDate) {
      startDate = new Date(data.campaignStartDate)
      if (isNaN(startDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid campaign start date' },
          { status: 400 }
        )
      }
    }
    if (data.campaignEndDate) {
      endDate = new Date(data.campaignEndDate)
      if (isNaN(endDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid campaign end date' },
          { status: 400 }
        )
      }
      if (startDate && endDate < startDate) {
        return NextResponse.json(
          { success: false, error: 'Campaign end date cannot be earlier than start date' },
          { status: 400 }
        )
      }
    }

    await connectDB()

    // 4. Duplicate check (prevent accidental double submission within 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const existing = await VehicleAdvertisingEnquiry.findOne({
      email: data.email.toLowerCase().trim(),
      companyName: sanitizeText(data.companyName),
      createdAt: { $gte: fiveMinutesAgo },
    })

    if (existing) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        enquiryId: existing._id,
        message: 'Thanks! Our vehicle advertising team will review your requirement and contact you shortly.',
      })
    }

    // 5. Store Enquiry in MongoDB
    const cleanedMobile = data.mobile.replace(/[\s-]/g, '')

    const newEnquiry = await VehicleAdvertisingEnquiry.create({
      companyName: sanitizeText(data.companyName),
      contactPersonName: sanitizeText(data.contactPersonName),
      email: data.email.toLowerCase().trim(),
      mobile: cleanedMobile,
      city: sanitizeText(data.city),
      state: sanitizeText(data.state || 'Bihar'),
      area: sanitizeText(data.area || ''),
      vehicleTypes: data.vehicleTypes.map((t) => sanitizeText(t)),
      campaignStartDate: startDate,
      campaignEndDate: endDate,
      budget: sanitizeText(data.budget || ''),
      vehicleCount: data.vehicleCount,
      advertisingFormat: sanitizeText(data.advertisingFormat || 'Flexible / Need Recommendation'),
      campaignDescription: sanitizeText(data.campaignDescription),
      status: 'New',
      priority: 'Medium',
      source: 'web_enquiry',
    })

    // Also persist in central LeadInquiry so it connects with Admin Leads, Vehicle Requests, and KPI metrics
    await LeadInquiry.create({
      companyName: sanitizeText(data.companyName),
      contactPersonName: sanitizeText(data.contactPersonName),
      email: data.email.toLowerCase().trim(),
      phone: cleanedMobile,
      service: 'vehicle',
      city: sanitizeText(data.city),
      state: sanitizeText(data.state || 'Bihar'),
      vehicleTypes: data.vehicleTypes.map((t) => sanitizeText(t)),
      budget: sanitizeText(data.budget || ''),
      source: 'vehicle_ads_page',
      message: `[Vehicle Ads] City: ${sanitizeText(data.city)} | Formats: ${sanitizeText(data.advertisingFormat || 'Flexible')} | Vehicles: ${data.vehicleCount || '1-5'} | Types: ${data.vehicleTypes.join(', ')}\n${sanitizeText(data.campaignDescription)}`,
      status: 'new',
    }).catch((err) => console.error('Error syncing vehicle enquiry to LeadInquiry:', err))

    return NextResponse.json(
      {
        success: true,
        enquiryId: newEnquiry._id,
        message: 'Thanks! Our vehicle advertising team will review your requirement and contact you shortly.',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Enquiry submission error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to submit enquiry at this time. Please try again later.',
      },
      { status: 500 }
    )
  }
}
