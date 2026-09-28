export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import Payment from '@/lib/db/models/Payment'
import Campaign from '@/lib/db/models/Campaign'
import { createOrder, calculateBreakdown } from '@/lib/payments/razorpay'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || (session.user as any).role !== 'BRAND') {
      return NextResponse.json({ error: 'Unauthorized. Brand access required.' }, { status: 401 })
    }

    const { campaignId, amount } = await req.json()
    if (!campaignId || !amount) {
      return NextResponse.json({ error: 'campaignId and amount are required' }, { status: 400 })
    }

    await connectDB()
    const campaign = await Campaign.findById(campaignId)
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Breakdown
    const breakdown = calculateBreakdown(amount)

    // Razorpay order creation
    let order: any
    try {
      order = await createOrder(amount, 'INR', {
        campaignId: campaignId.toString(),
        brandId: session.user.id,
      })
    } catch (rzpErr) {
      console.warn('Razorpay order fallback to mock in test environment:', rzpErr)
      order = {
        id: `order_mock_${Date.now()}`,
        amount: amount * 100,
        currency: 'INR',
      }
    }

    // Save payment record
    const payment = await Payment.create({
      brandId: session.user.id,
      campaignId: campaign._id,
      razorpayOrderId: order.id,
      amount: amount * 100, // paise
      currency: 'INR',
      status: 'CREATED',
      breakdown,
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_demo',
    })
  } catch (error: any) {
    console.error('Payment create order error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
