import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IVehicleCampaign extends Document {
  partnerId: mongoose.Types.ObjectId
  vehicleId: mongoose.Types.ObjectId
  brandId?: mongoose.Types.ObjectId
  brandName: string
  campaignName: string
  vehicleType: string
  location: string
  requiredVehicles: number
  startDate: Date
  endDate: Date
  advertisingType: string
  budget: number
  platformFee: number
  partnerEarnings: number
  message?: string
  notes?: string
  proofImages?: Array<{ url: string; uploadedAt: Date; caption?: string }>
  status:
    | 'REQUEST_RECEIVED'
    | 'UNDER_REVIEW'
    | 'ACCEPTED'
    | 'SCHEDULED'
    | 'ACTIVE'
    | 'COMPLETED'
    | 'CANCELLED'
  paymentStatus: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED'
  paymentDate?: Date
  createdAt: Date
  updatedAt: Date
}

const VehicleCampaignSchema = new Schema<IVehicleCampaign>(
  {
    partnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Partner ID is required'],
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle ID is required'],
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    brandName: { type: String, required: true, trim: true },
    campaignName: { type: String, required: true, trim: true },
    vehicleType: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    requiredVehicles: { type: Number, default: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    advertisingType: { type: String, required: true, trim: true },
    budget: { type: Number, required: true, min: 0 },
    platformFee: { type: Number, default: 0, min: 0 },
    partnerEarnings: { type: Number, required: true, min: 0 },
    message: { type: String, trim: true },
    notes: { type: String, trim: true },
    proofImages: [
      {
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        caption: { type: String },
      },
    ],
    status: {
      type: String,
      enum: [
        'REQUEST_RECEIVED',
        'UNDER_REVIEW',
        'ACCEPTED',
        'SCHEDULED',
        'ACTIVE',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'REQUEST_RECEIVED',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'PAID', 'FAILED'],
      default: 'PENDING',
    },
    paymentDate: { type: Date },
  },
  {
    timestamps: true,
  }
)

VehicleCampaignSchema.index({ partnerId: 1, status: 1 })
VehicleCampaignSchema.index({ vehicleId: 1 })
VehicleCampaignSchema.index({ status: 1 })
VehicleCampaignSchema.index({ createdAt: -1 })

const VehicleCampaign: Model<IVehicleCampaign> =
  mongoose.models.VehicleCampaign ||
  mongoose.model<IVehicleCampaign>('VehicleCampaign', VehicleCampaignSchema)

export default VehicleCampaign
