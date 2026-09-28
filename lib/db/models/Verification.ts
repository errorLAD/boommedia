import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IVerificationDocument {
  documentType: string
  url: string
  uploadedAt: Date
  verifiedAt?: Date
  status: string
}

export interface IVerification extends Document {
  userId: mongoose.Types.ObjectId
  role: string
  documents: IVerificationDocument[]
  status: 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED'
  submittedAt?: Date
  reviewedAt?: Date
  reviewedBy?: mongoose.Types.ObjectId
  adminNotes?: string
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
}

const VerificationDocumentSchema = new Schema<IVerificationDocument>(
  {
    documentType: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  { _id: true }
)

const VerificationSchema = new Schema<IVerification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
    },
    documents: {
      type: [VerificationDocumentSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_REVIEW', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
    submittedAt: {
      type: Date,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
VerificationSchema.index({ status: 1 })
VerificationSchema.index({ role: 1, status: 1 })

const Verification: Model<IVerification> =
  mongoose.models.Verification ||
  mongoose.model<IVerification>('Verification', VerificationSchema)

export default Verification
