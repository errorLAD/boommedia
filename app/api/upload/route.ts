import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { auth } from '@/auth'
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit'

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
])

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in to upload files.' },
        { status: 401 }
      )
    }

    const ip = getClientIp(req)
    const rateCheck = checkRateLimit(`upload:${session.user.id || ip}`, 30, 60)
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Upload rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const rawFolder = (formData.get('folder') as string) || 'general'
    const folder = rawFolder.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50) || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // MIME type whitelist check
    if (!file.type || !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed formats: JPEG, PNG, WebP, GIF, PDF.' },
        { status: 400 }
      )
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // If Cloudinary credentials are mock or not set, create a base64 data URI fallback for development
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === 'demo'
    ) {
      const base64 = buffer.toString('base64')
      const dataUri = `data:${file.type};base64,${base64}`
      return NextResponse.json({
        success: true,
        url: dataUri,
        publicId: `dev_${Date.now()}`,
      })
    }

    return new Promise<NextResponse>((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `boommedia/${folder}/${session?.user?.id || 'public'}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error || !result) {
            console.error('Cloudinary upload error:', error)
            resolve(
              NextResponse.json({ error: 'Upload failed' }, { status: 500 })
            )
          } else {
            resolve(
              NextResponse.json({
                success: true,
                url: result.secure_url,
                publicId: result.public_id,
              })
            )
          }
        }
      )
      uploadStream.end(buffer)
    })
  } catch (error: any) {
    console.error('Upload handler error:', error)
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}
