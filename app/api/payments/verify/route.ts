export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Payment from '@/lib/db/models/Payment'
import Campaign from '@/lib/db/models/Campaign'
import Transaction from '@/lib/db/models/Transaction'
import { verifyPaymentSignature } from '@/lib/payments/razorpay'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json()

    await connectDB()

    const payment = await Payment.findOne({ razorpayOrderId })
    if (!payment) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 })
    }

    // Verify signature (or accept mock in test dev mode)
    const isMock = razorpayOrderId.startsWith('order_mock_')
    let isValid = false

    if (isMock) {
      isValid = true
    } else {
      isValid = verifyPaymentSignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      )
    }

    if (!isValid) {
      payment.status = 'FAILED'
      await payment.save()
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    payment.status = 'CAPTURED'
    payment.razorpayPaymentId = razorpayPaymentId
    payment.razorpaySignature = razorpaySignature
    await payment.save()

    // Mark campaign as paid
    await Campaign.findByIdAndUpdate(payment.campaignId, {
      isPaid: true,
      status: 'PUBLISHED',
      paymentId: payment._id,
    })

    // Create transaction log
    await Transaction.create({
      paymentId: payment._id,
      campaignId: payment.campaignId,
      fromUserId: session.user.id,
      type: 'BRAND_PAYMENT',
      amount: payment.amount / 100,
      currency: payment.currency,
      status: 'COMPLETED',
      reference: razorpayPaymentId,
      description: 'Campaign funding payment received',
    })

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully and campaign funded.',
    })
  } catch (error: any) {
    console.error('Payment verify error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
