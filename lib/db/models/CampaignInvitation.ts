import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ICampaignInvitation extends Document {
  campaignId: mongoose.Types.ObjectId
  inviteeId: mongoose.Types.ObjectId
  inviteeType: 'INFLUENCER' | 'VEHICLE_PARTNER'
  vehicleId?: mongoose.Types.ObjectId
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
  message?: string
  proposedPrice?: number
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const CampaignInvitationSchema = new Schema<ICampaignInvitation>(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign ID is required'],
    },
    inviteeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Invitee ID is required'],
    },
    inviteeType: {
      type: String,
      enum: ['INFLUENCER', 'VEHICLE_PARTNER'],
      required: [true, 'Invitee type is required'],
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED'],
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
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Compound unique — one invitation per invitee per campaign
CampaignInvitationSchema.index(
  { campaignId: 1, inviteeId: 1 },
  { unique: true }
)
CampaignInvitationSchema.index({ inviteeId: 1, status: 1 })
CampaignInvitationSchema.index({ campaignId: 1, status: 1 })
CampaignInvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL when expired

const CampaignInvitation: Model<ICampaignInvitation> =
  mongoose.models.CampaignInvitation ||
  mongoose.model<ICampaignInvitation>(
    'CampaignInvitation',
    CampaignInvitationSchema
  )

export default CampaignInvitation
