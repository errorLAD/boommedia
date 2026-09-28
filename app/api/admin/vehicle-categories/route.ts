export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import VehicleCategory, { DEFAULT_VEHICLE_CATEGORIES } from '@/lib/db/models/VehicleCategory'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()

    let categories = await VehicleCategory.find().sort({ displayOrder: 1, createdAt: 1 }).lean()
    if (!categories || categories.length === 0) {
      await VehicleCategory.insertMany(DEFAULT_VEHICLE_CATEGORIES)
      categories = await VehicleCategory.find().sort({ displayOrder: 1, createdAt: 1 }).lean()
    }

    return NextResponse.json({ success: true, data: categories })
  } catch (error: any) {
    console.error('Admin get categories error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await connectDB()
    const body = await req.json()

    if (!body.name || !body.imageUrl || !body.shortDescription) {
      return NextResponse.json(
        { error: 'Name, short description, and image URL are required' },
        { status: 400 }
      )
    }

    const key = (body.key || body.name.toUpperCase().replace(/[^A-Z0-9]/g, '_')).trim()

    const created = await VehicleCategory.create({
      key,
      name: body.name.trim(),
      tagline: body.tagline?.trim() || '',
      shortDescription: body.shortDescription.trim(),
      advertisingLocations: Array.isArray(body.advertisingLocations)
        ? body.advertisingLocations
        : (body.advertisingLocations || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      exampleUseCase: body.exampleUseCase?.trim() || '',
      imageUrl: body.imageUrl.trim(),
      ctaLabel: body.ctaLabel?.trim() || `Request ${body.name} Ads →`,
      displayOrder: parseInt(body.displayOrder || '99'),
      isActive: body.isActive !== false,
    })

    return NextResponse.json({ success: true, data: created })
  } catch (error: any) {
    console.error('Admin create category error:', error)
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

    if (!body._id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const category = await VehicleCategory.findById(body._id)
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    if (body.name !== undefined) category.name = body.name.trim()
    if (body.tagline !== undefined) category.tagline = body.tagline.trim()
    if (body.shortDescription !== undefined) category.shortDescription = body.shortDescription.trim()
    if (body.imageUrl !== undefined) category.imageUrl = body.imageUrl.trim()
    if (body.ctaLabel !== undefined) category.ctaLabel = body.ctaLabel.trim()
    if (body.exampleUseCase !== undefined) category.exampleUseCase = body.exampleUseCase.trim()
    if (body.displayOrder !== undefined) category.displayOrder = parseInt(body.displayOrder)
    if (body.isActive !== undefined) category.isActive = !!body.isActive
    if (body.advertisingLocations !== undefined) {
      category.advertisingLocations = Array.isArray(body.advertisingLocations)
        ? body.advertisingLocations
        : (body.advertisingLocations || '').split(',').map((s: string) => s.trim()).filter(Boolean)
    }

    await category.save()

    return NextResponse.json({ success: true, data: category })
  } catch (error: any) {
    console.error('Admin update category error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
