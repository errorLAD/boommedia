export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import User from '@/lib/db/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, newPassword } = body

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    if (newPassword.length > 128) {
      return NextResponse.json(
        { success: false, error: 'Password must not exceed 128 characters' },
        { status: 400 }
      )
    }

    await connectDB()

    // Fetch all users who have a non-expired reset token
    // We can't query by token directly since it's hashed — we search by expiry instead
    const users = await User.find({
      passwordResetExpiry: { $gt: new Date() },
      passwordResetToken: { $exists: true, $ne: null },
    }).select('+passwordResetToken +passwordResetExpiry')

    // Find the user whose hashed token matches the provided plain token
    let matchedUser = null
    for (const user of users) {
      if (!user.passwordResetToken) continue
      const isMatch = await bcrypt.compare(token, user.passwordResetToken)
      if (isMatch) {
        matchedUser = user
        break
      }
    }

    if (!matchedUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token. Please request a new password reset.' },
        { status: 400 }
      )
    }

    // Check if account is in good standing
    if (matchedUser.status === 'BANNED') {
      return NextResponse.json(
        { success: false, error: 'This account has been suspended. Please contact support.' },
        { status: 403 }
      )
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12)

    // Update password and clear reset token fields
    await User.findByIdAndUpdate(matchedUser._id, {
      passwordHash: newPasswordHash,
      passwordResetToken: null,
      passwordResetExpiry: null,
      // Invalidate all active sessions by updating a session version
      sessionVersion: Date.now(),
    })

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset password. Please try again.' },
      { status: 500 }
    )
  }
}
