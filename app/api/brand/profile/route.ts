export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import BrandProfile from '@/lib/db/models/BrandProfile'
import User from '@/lib/db/models/User'
import ActivityLog from '@/lib/db/models/ActivityLog'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id || ((session.user as any).role !== 'BRAND' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const userId = session.user.id

    const user = await User.findById(userId).select('name email phone role').lean()
    let profile: any = await BrandProfile.findOne({ userId, isDeleted: { $ne: true } }).lean()

    if (!profile) {
      // Auto-initialize profile from User if first time
      const created = await BrandProfile.create({
        userId,
        companyName: user?.name || 'My Company',
        contactPerson: user?.name || 'Contact Person',
        email: user?.email,
        phone: user?.phone,
        industry: 'General Business',
      })
      profile = created.toObject()
    }

    return NextResponse.json({
      success: true,
      data: {
        ...profile,
        user,
      },
    })
  } catch (error: any) {
    console.error('Error fetching brand profile:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || ((session.user as any).role !== 'BRAND' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const userId = session.user.id
    const body = await req.json()

    const {
      companyName,
      contactPerson,
      email,
      phone,
      address,
      city,
      state,
      country,
      industry,
      website,
      description,
      logo,
      gstNumber,
      socialLinks,
    } = body

    let profile = await BrandProfile.findOne({ userId })
    if (!profile) {
      profile = new BrandProfile({
        userId,
        companyName: companyName || session.user.name || 'Company Name',
        contactPerson: contactPerson || session.user.name || 'Contact Person',
        industry: industry || 'General',
      })
    }

    if (companyName) profile.companyName = companyName
    if (contactPerson) profile.contactPerson = contactPerson
    if (email) profile.email = email
    if (phone) profile.phone = phone
    if (address !== undefined) profile.address = address
    if (city !== undefined) profile.city = city
    if (state !== undefined) profile.state = state
    if (country !== undefined) profile.country = country
    if (industry) profile.industry = industry
    if (website !== undefined) profile.website = website
    if (description !== undefined) profile.description = description
    if (logo !== undefined) profile.logo = logo
    if (gstNumber !== undefined) profile.gstNumber = gstNumber
    if (socialLinks !== undefined) profile.socialLinks = socialLinks

    await profile.save()

    // Also update User record's name and phone if provided
    if (companyName || phone) {
      await User.findByIdAndUpdate(userId, {
        ...(companyName ? { name: companyName } : {}),
        ...(phone ? { phone } : {}),
      })
    }

    await ActivityLog.create({
      userId,
      userName: companyName || session.user.name || 'Brand Partner',
      userRole: 'BRAND',
      action: 'BRAND_PROFILE_UPDATED',
      targetType: 'BRAND',
      targetId: profile._id,
      targetName: profile.companyName,
      details: 'Brand profile details were updated',
    }).catch((err) => console.error('Activity log error:', err))

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error: any) {
    console.error('Error updating brand profile:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
