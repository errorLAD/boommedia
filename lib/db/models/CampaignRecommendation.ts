import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ICampaignRecommendation extends Document {
  campaignId: mongoose.Types.ObjectId
  type: 'INFLUENCER' | 'VEHICLE'
  influencerId?: mongoose.Types.ObjectId
  influencerDetails?: {
    name: string
    city: string
    category: string
    language: string
    socialProfile: string
    avatar?: string
    followers?: number
  }
  vehicleId?: mongoose.Types.ObjectId
  vehicleDetails?: {
    vehicleType: string
    image: string
    city: string
    operatingArea: string
    route: string
    advertisingArea: string
    advertisingType: string
    price: number
  }
  contentType?: string
  proposedFee: number
  deliverables: string
  status: 'PENDING' | 'APPROVED' | 'CHANGE_REQUESTED' | 'REJECTED'
  changeRequestNotes?: string
  adminNotes?: string
  createdAt: Date
  updatedAt: Date
}

const CampaignRecommendationSchema = new Schema<ICampaignRecommendation>(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign ID is required'],
    },
    type: {
      type: String,
      enum: ['INFLUENCER', 'VEHICLE'],
      required: [true, 'Recommendation type is required'],
    },
    influencerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    influencerDetails: {
      name: { type: String, trim: true },
      city: { type: String, trim: true },
      category: { type: String, trim: true },
      language: { type: String, trim: true },
      socialProfile: { type: String, trim: true },
      avatar: { type: String },
      followers: { type: Number, default: 0 },
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    vehicleDetails: {
      vehicleType: { type: String, trim: true },
      image: { type: String },
      city: { type: String, trim: true },
      operatingArea: { type: String, trim: true },
      route: { type: String, trim: true },
      advertisingArea: { type: String, trim: true },
      advertisingType: { type: String, trim: true },
      price: { type: Number, default: 0 },
    },
    contentType: { type: String, trim: true },
    proposedFee: { type: Number, required: true, min: 0 },
    deliverables: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'CHANGE_REQUESTED', 'REJECTED'],
      default: 'PENDING',
    },
    changeRequestNotes: { type: String, trim: true },
    adminNotes: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
)

CampaignRecommendationSchema.index({ campaignId: 1, type: 1 })
CampaignRecommendationSchema.index({ status: 1 })

const CampaignRecommendation: Model<ICampaignRecommendation> =
  mongoose.models.CampaignRecommendation ||
  mongoose.model<ICampaignRecommendation>('CampaignRecommendation', CampaignRecommendationSchema)

export default CampaignRecommendation
