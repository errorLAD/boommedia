export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import VehicleAdvertisingEnquiry from '@/lib/db/models/VehicleAdvertisingEnquiry'

interface RouteParams {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()

    const enquiry = await VehicleAdvertisingEnquiry.findById(params.id)
      .populate('assignedAdmin', 'name email role')
      .lean()

    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: enquiry })
  } catch (error: any) {
    console.error('Admin get enquiry by ID error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()

    const body = await req.json()
    const enquiry = await VehicleAdvertisingEnquiry.findById(params.id)

    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 })
    }

    // 1. Update status
    if (body.status) {
      const allowedStatuses = [
        'New',
        'Contacted',
        'Requirement Confirmed',
        'Proposal Sent',
        'Negotiation',
        'Approved',
        'Campaign Active',
        'Completed',
        'Cancelled',
      ]
      if (allowedStatuses.includes(body.status)) {
        enquiry.status = body.status
      }
    }

    // 2. Update priority
    if (body.priority) {
      const allowedPriorities = ['Low', 'Medium', 'High', 'Urgent']
      if (allowedPriorities.includes(body.priority)) {
        enquiry.priority = body.priority
      }
    }

    // 3. Assign Admin
    if (body.assignedAdmin !== undefined) {
      enquiry.assignedAdmin = body.assignedAdmin || null
    }

    // 4. Append Admin Internal Note
    if (body.newAdminNote && typeof body.newAdminNote === 'string') {
      const trimmedNote = body.newAdminNote.trim()
      if (trimmedNote) {
        enquiry.adminNotes.push({
          note: trimmedNote,
          authorName: session.user.name || 'Admin',
          authorId: (session.user as any).id,
          createdAt: new Date(),
        })
      }
    }

    // 5. Update editable campaign fields if provided
    if (body.budget !== undefined) enquiry.budget = body.budget
    if (body.vehicleCount !== undefined) enquiry.vehicleCount = body.vehicleCount
    if (body.advertisingFormat !== undefined) enquiry.advertisingFormat = body.advertisingFormat
    if (body.campaignStartDate !== undefined) enquiry.campaignStartDate = body.campaignStartDate ? new Date(body.campaignStartDate) : undefined
    if (body.campaignEndDate !== undefined) enquiry.campaignEndDate = body.campaignEndDate ? new Date(body.campaignEndDate) : undefined

    await enquiry.save()

    const updated = await VehicleAdvertisingEnquiry.findById(params.id)
      .populate('assignedAdmin', 'name email role')
      .lean()

    return NextResponse.json({
      success: true,
      message: 'Enquiry updated successfully',
      data: updated,
    })
  } catch (error: any) {
    console.error('Admin update enquiry error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()

    const enquiry = await VehicleAdvertisingEnquiry.findByIdAndDelete(params.id)
    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry deleted successfully',
    })
  } catch (error: any) {
    console.error('Admin delete enquiry error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
