import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ICampaignApplication extends Document {
  campaignId: mongoose.Types.ObjectId
  applicantId: mongoose.Types.ObjectId
  applicantType: 'INFLUENCER' | 'VEHICLE_PARTNER'
  vehicleId?: mongoose.Types.ObjectId
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
  message?: string
  proposedPrice?: number
  agreedPrice?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const CampaignApplicationSchema = new Schema<ICampaignApplication>(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign ID is required'],
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant ID is required'],
    },
    applicantType: {
      type: String,
      enum: ['INFLUENCER', 'VEHICLE_PARTNER'],
      required: [true, 'Applicant type is required'],
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'],
      default: 'PENDING',
    },
    message: {
      type: String,
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    proposedPrice: {
      type: Number,
      min: 0,
    },
    agreedPrice: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Compound unique index — one application per user per campaign
CampaignApplicationSchema.index(
  { campaignId: 1, applicantId: 1 },
  { unique: true }
)
CampaignApplicationSchema.index({ campaignId: 1, status: 1 })
CampaignApplicationSchema.index({ applicantId: 1, status: 1 })
CampaignApplicationSchema.index({ applicantType: 1 })

const CampaignApplication: Model<ICampaignApplication> =
  mongoose.models.CampaignApplication ||
  mongoose.model<ICampaignApplication>(
    'CampaignApplication',
    CampaignApplicationSchema
  )

export default CampaignApplication
