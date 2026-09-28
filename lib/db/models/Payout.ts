import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IBankAccount {
  accountNumber?: string
  ifscCode?: string
  accountHolderName?: string
}

export interface IPayout extends Document {
  recipientId: mongoose.Types.ObjectId
  recipientRole: 'INFLUENCER' | 'VEHICLE_PARTNER'
  campaignId?: mongoose.Types.ObjectId
  transactionId?: mongoose.Types.ObjectId
  amount: number
  currency: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  razorpayPayoutId?: string
  bankAccount?: IBankAccount
  upiId?: string
  failureReason?: string
  processedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const BankAccountSchema = new Schema<IBankAccount>(
  {
    accountNumber: { type: String, trim: true },
    ifscCode: { type: String, trim: true, uppercase: true },
    accountHolderName: { type: String, trim: true },
  },
  { _id: false }
)

const PayoutSchema = new Schema<IPayout>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient ID is required'],
    },
    recipientRole: {
      type: String,
      enum: ['INFLUENCER', 'VEHICLE_PARTNER'],
      required: [true, 'Recipient role is required'],
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least 1'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
      default: 'PENDING',
    },
    razorpayPayoutId: {
      type: String,
    },
    bankAccount: {
      type: BankAccountSchema,
    },
    upiId: {
      type: String,
      trim: true,
    },
    failureReason: {
      type: String,
      trim: true,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
PayoutSchema.index({ recipientId: 1 })
PayoutSchema.index({ status: 1 })
PayoutSchema.index({ campaignId: 1 })
PayoutSchema.index({ recipientId: 1, status: 1 })
PayoutSchema.index({ createdAt: -1 })

const Payout: Model<IPayout> =
  mongoose.models.Payout ||
  mongoose.model<IPayout>('Payout', PayoutSchema)

export default Payout
