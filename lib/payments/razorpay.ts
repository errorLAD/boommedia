import Razorpay from 'razorpay'
import crypto from 'crypto'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function createOrder(
  amount: number,
  currency = 'INR',
  notes?: Record<string, string>
) {
  const order = await razorpay.orders.create({
    amount: amount * 100, // convert to paise
    currency,
    notes,
  })
  return order
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = `${orderId}|${paymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')
  return expectedSignature === signature
}

export function calculateBreakdown(
  totalAmount: number,
  influencerAmount = 0,
  vehicleAmount = 0
) {
  const platformFeePercent = 10
  const platformFee = Math.round((totalAmount * platformFeePercent) / 100)
  const gst = Math.round(platformFee * 18 / 100)
  return {
    influencerAmount,
    vehicleAmount,
    platformFee,
    gst,
    total: totalAmount,
  }
}
