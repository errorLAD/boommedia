export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import VehicleCategory, { DEFAULT_VEHICLE_CATEGORIES } from '@/lib/db/models/VehicleCategory'

// Categories that have been retired from the platform. Any previously
// seeded entries are deactivated so they no longer appear to brands.
const RETIRED_VEHICLE_CATEGORY_KEYS = [
  'TRUCK',
  'DELIVERY_VEHICLE',
  'TAXI_CAB',
  'OTHER_COMMERCIAL',
]

export async function GET() {
  try {
    await connectDB()

    // Deactivate any retired categories that may still exist in the database
    await VehicleCategory.updateMany(
      { key: { $in: RETIRED_VEHICLE_CATEGORY_KEYS }, isActive: true },
      { $set: { isActive: false } }
    )

    let categories = await VehicleCategory.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean()

    // If no categories in DB yet, auto-seed defaults so system works out-of-the-box
    if (!categories || categories.length === 0) {
      try {
        await VehicleCategory.insertMany(DEFAULT_VEHICLE_CATEGORIES)
        categories = await VehicleCategory.find({ isActive: true })
          .sort({ displayOrder: 1, createdAt: 1 })
          .lean()
      } catch (seedErr) {
        console.warn('Auto-seed category fallback to defaults:', seedErr)
        return NextResponse.json({
          success: true,
          data: DEFAULT_VEHICLE_CATEGORIES,
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error: any) {
    console.error('Fetch vehicle categories error:', error)
    // Fallback to static defaults so the frontend never crashes
    return NextResponse.json({
      success: true,
      data: DEFAULT_VEHICLE_CATEGORIES,
    })
  }
}
