export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import User from '@/lib/db/models/User'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { sendPasswordResetEmail } from '@/lib/email/resend'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    await connectDB()

    // Always return success to prevent email enumeration attacks
    const successResponse = NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link shortly.',
    })

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      // Return generic success even if user not found (prevent enumeration)
      return successResponse
    }

    // Check account status
    if (user.status === 'BANNED') {
      return successResponse // Still return success to not reveal account existence
    }

    // Generate secure reset token using nanoid (URL-safe)
    const resetToken = nanoid(64)

    // Hash the token before storing (security best practice)
    const resetTokenHash = await bcrypt.hash(resetToken, 10)

    // Store hashed token and 1-hour expiry
    await User.findByIdAndUpdate(user._id, {
      passwordResetToken: resetTokenHash,
      passwordResetExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    })

    // Send reset email (non-blocking, don't expose errors to client)
    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // Clear the token if email failed so user can retry
      await User.findByIdAndUpdate(user._id, {
        passwordResetToken: null,
        passwordResetExpiry: null,
      })
    }

    return successResponse
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}
