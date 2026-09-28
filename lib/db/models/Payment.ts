import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IPaymentBreakdown {
  influencerAmount?: number
  vehicleAmount?: number
  platformFee?: number
  gst?: number
}

export interface IPayment extends Document {
  brandId: mongoose.Types.ObjectId
  campaignId: mongoose.Types.ObjectId
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  amount: number
  currency: string
  status: 'CREATED' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED'
  breakdown: IPaymentBreakdown
  notes?: string
  refundId?: string
  refundAmount?: number
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Brand ID is required'],
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign ID is required'],
    },
    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED'],
      default: 'CREATED',
    },
    breakdown: {
      influencerAmount: { type: Number, min: 0 },
      vehicleAmount: { type: Number, min: 0 },
      platformFee: { type: Number, min: 0 },
      gst: { type: Number, min: 0 },
    },
    notes: {
      type: String,
      trim: true,
    },
    refundId: {
      type: String,
    },
    refundAmount: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
PaymentSchema.index({ brandId: 1 })
PaymentSchema.index({ campaignId: 1 })
PaymentSchema.index({ status: 1 })
PaymentSchema.index({ brandId: 1, status: 1 })
PaymentSchema.index({ createdAt: -1 })

const Payment: Model<IPayment> =
  mongoose.models.Payment ||
  mongoose.model<IPayment>('Payment', PaymentSchema)

export default Payment
