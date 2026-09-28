import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ITransaction extends Document {
  paymentId?: mongoose.Types.ObjectId
  campaignId?: mongoose.Types.ObjectId
  fromUserId?: mongoose.Types.ObjectId
  toUserId?: mongoose.Types.ObjectId
  type: 'BRAND_PAYMENT' | 'PLATFORM_FEE' | 'INFLUENCER_PAYOUT' | 'VEHICLE_PAYOUT' | 'REFUND'
  amount: number
  currency: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  reference?: string
  description?: string
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema = new Schema<ITransaction>(
  {
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
    },
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'BRAND_PAYMENT',
        'PLATFORM_FEE',
        'INFLUENCER_PAYOUT',
        'VEHICLE_PAYOUT',
        'REFUND',
      ],
      required: [true, 'Transaction type is required'],
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
      enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
      required: [true, 'Status is required'],
      default: 'PENDING',
    },
    reference: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
TransactionSchema.index({ paymentId: 1 })
TransactionSchema.index({ campaignId: 1 })
TransactionSchema.index({ fromUserId: 1 })
TransactionSchema.index({ toUserId: 1 })
TransactionSchema.index({ type: 1 })
TransactionSchema.index({ status: 1 })
TransactionSchema.index({ createdAt: -1 })

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema)

export default Transaction
