import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IEvidence {
  url: string
  description?: string
}

export interface IDispute extends Document {
  campaignId: mongoose.Types.ObjectId
  raisedById: mongoose.Types.ObjectId
  raisedByRole: string
  againstId: mongoose.Types.ObjectId
  againstRole: string
  type: 'PAYMENT' | 'CONTENT' | 'DELIVERABLE' | 'CONDUCT' | 'OTHER'
  title: string
  description: string
  evidence: IEvidence[]
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED' | 'ESCALATED'
  resolution?: string
  resolvedBy?: mongoose.Types.ObjectId
  resolvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const EvidenceSchema = new Schema<IEvidence>(
  {
    url: { type: String, required: true },
    description: { type: String, trim: true },
  },
  { _id: false }
)

const DisputeSchema = new Schema<IDispute>(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign ID is required'],
    },
    raisedById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Raised by ID is required'],
    },
    raisedByRole: {
      type: String,
      required: [true, 'Raised by role is required'],
    },
    againstId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Against ID is required'],
    },
    againstRole: {
      type: String,
      required: [true, 'Against role is required'],
    },
    type: {
      type: String,
      enum: ['PAYMENT', 'CONTENT', 'DELIVERABLE', 'CONDUCT', 'OTHER'],
      required: [true, 'Dispute type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    evidence: {
      type: [EvidenceSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED', 'ESCALATED'],
      default: 'OPEN',
    },
    resolution: {
      type: String,
      trim: true,
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
DisputeSchema.index({ campaignId: 1 })
DisputeSchema.index({ raisedById: 1 })
DisputeSchema.index({ status: 1 })
DisputeSchema.index({ type: 1, status: 1 })
DisputeSchema.index({ campaignId: 1, status: 1 })

const Dispute: Model<IDispute> =
  mongoose.models.Dispute ||
  mongoose.model<IDispute>('Dispute', DisputeSchema)

export default Dispute
