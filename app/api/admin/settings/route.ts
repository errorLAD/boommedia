export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import PlatformSettings from '@/lib/db/models/PlatformSettings'
import ActivityLog from '@/lib/db/models/ActivityLog'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()
    let settings: any = await PlatformSettings.findOne().lean()

    if (!settings) {
      const created = await PlatformSettings.create({
        companyName: 'BoomMedia India',
        contactEmail: 'support@boommedia.in',
        contactPhone: '+91 98765 43210',
        platformCommissionPercent: 10,
        defaultCampaignDurationDays: 30,
        autoApproveVehicles: false,
        maintenanceMode: false,
      })
      settings = created.toObject()
    }

    return NextResponse.json({ success: true, data: settings })
  } catch (error: any) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()
    const body = await req.json()

    let settings = await PlatformSettings.findOne()
    if (!settings) {
      settings = new PlatformSettings()
    }

    if (body.companyName !== undefined) settings.companyName = body.companyName
    if (body.contactEmail !== undefined) settings.contactEmail = body.contactEmail
    if (body.contactPhone !== undefined) settings.contactPhone = body.contactPhone
    if (body.platformCommissionPercent !== undefined)
      settings.platformCommissionPercent = Number(body.platformCommissionPercent)
    if (body.defaultCampaignDurationDays !== undefined)
      settings.defaultCampaignDurationDays = Number(body.defaultCampaignDurationDays)
    if (body.autoApproveVehicles !== undefined)
      settings.autoApproveVehicles = Boolean(body.autoApproveVehicles)
    if (body.maintenanceMode !== undefined)
      settings.maintenanceMode = Boolean(body.maintenanceMode)

    await settings.save()

    await ActivityLog.create({
      userId: session.user.id,
      userName: session.user.name || 'Admin',
      userRole: 'ADMIN',
      action: 'PLATFORM_SETTINGS_UPDATED',
      targetType: 'PLATFORM',
      targetId: settings._id,
      targetName: 'Platform Settings',
      details: 'Admin updated platform settings configuration',
    }).catch((err) => console.error(err))

    return NextResponse.json({ success: true, data: settings })
  } catch (error: any) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
