export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import VehicleAdvertisingEnquiry from '@/lib/db/models/VehicleAdvertisingEnquiry'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const [
      totalEnquiries,
      newEnquiries,
      contactedEnquiries,
      activeCampaigns,
      completedCampaigns,
      enquiriesThisMonth,
      vehicleTypeAgg,
      cityAgg,
    ] = await Promise.all([
      VehicleAdvertisingEnquiry.countDocuments(),
      VehicleAdvertisingEnquiry.countDocuments({ status: 'New' }),
      VehicleAdvertisingEnquiry.countDocuments({ status: { $in: ['Contacted', 'Requirement Confirmed', 'Proposal Sent', 'Negotiation'] } }),
      VehicleAdvertisingEnquiry.countDocuments({ status: 'Campaign Active' }),
      VehicleAdvertisingEnquiry.countDocuments({ status: 'Completed' }),
      VehicleAdvertisingEnquiry.countDocuments({ createdAt: { $gte: startOfMonth } }),
      // Most requested vehicle type aggregation
      VehicleAdvertisingEnquiry.aggregate([
        { $unwind: '$vehicleTypes' },
        { $group: { _id: '$vehicleTypes', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      // Enquiries by city aggregation
      VehicleAdvertisingEnquiry.aggregate([
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
    ])

    const mostRequestedVehicle =
      vehicleTypeAgg && vehicleTypeAgg.length > 0
        ? { type: vehicleTypeAgg[0]._id, count: vehicleTypeAgg[0].count }
        : null

    return NextResponse.json({
      success: true,
      data: {
        totalEnquiries,
        newEnquiries,
        contacted: contactedEnquiries,
        activeCampaigns,
        completedCampaigns,
        enquiriesThisMonth,
        mostRequestedVehicle,
        vehicleTypeDistribution: vehicleTypeAgg.map((v) => ({ type: v._id, count: v.count })),
        cityDistribution: cityAgg.map((c) => ({ city: c._id, count: c.count })),
      },
    })
  } catch (error: any) {
    console.error('Vehicle enquiries analytics error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
