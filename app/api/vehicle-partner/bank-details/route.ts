export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import VehiclePartnerProfile from '@/lib/db/models/VehiclePartnerProfile'

function maskAccountNumber(acc?: string): string {
  if (!acc || acc.length < 4) return 'XXXX'
  const lastFour = acc.slice(-4)
  return `XXXX XXXX ${lastFour}`
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const profile = await VehiclePartnerProfile.findOne({ userId: session.user.id })
    .select('bankDetails')
    .lean()

  const bank = profile?.bankDetails || {}

  return NextResponse.json({
    success: true,
    data: {
      accountHolderName: bank.accountHolderName || '',
      maskedAccountNumber: maskAccountNumber(bank.accountNumber),
      hasAccountNumber: Boolean(bank.accountNumber),
      ifscCode: bank.ifscCode || '',
      bankName: bank.bankName || '',
      upiId: bank.upiId || '',
    },
  })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { accountHolderName, accountNumber, ifscCode, bankName, upiId } = await req.json()
    await connectDB()

    const profile = await VehiclePartnerProfile.findOne({ userId: session.user.id })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (!profile.bankDetails) {
      profile.bankDetails = {}
    }

    if (accountHolderName !== undefined) profile.bankDetails.accountHolderName = accountHolderName.trim()
    if (accountNumber !== undefined && accountNumber.trim() && !accountNumber.includes('XXXX')) {
      profile.bankDetails.accountNumber = accountNumber.trim()
    }
    if (ifscCode !== undefined) profile.bankDetails.ifscCode = ifscCode.trim().toUpperCase()
    if (bankName !== undefined) profile.bankDetails.bankName = bankName.trim()
    if (upiId !== undefined) profile.bankDetails.upiId = upiId.trim()

    await profile.save()

    return NextResponse.json({
      success: true,
      message: 'Payout details updated securely.',
      data: {
        accountHolderName: profile.bankDetails.accountHolderName || '',
        maskedAccountNumber: maskAccountNumber(profile.bankDetails.accountNumber),
        hasAccountNumber: Boolean(profile.bankDetails.accountNumber),
        ifscCode: profile.bankDetails.ifscCode || '',
        bankName: profile.bankDetails.bankName || '',
        upiId: profile.bankDetails.upiId || '',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
