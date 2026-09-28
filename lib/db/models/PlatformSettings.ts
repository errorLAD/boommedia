import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IPlatformSettings extends Document {
  companyName: string
  logo?: string
  contactEmail: string
  contactPhone: string
  platformCommissionPercent: number
  defaultCampaignDurationDays: number
  autoApproveVehicles: boolean
  maintenanceMode: boolean
  updatedBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const PlatformSettingsSchema = new Schema<IPlatformSettings>(
  {
    companyName: { type: String, default: 'BoomMedia Platforms' },
    logo: { type: String },
    contactEmail: { type: String, default: 'admin@boommedia.in' },
    contactPhone: { type: String, default: '+91 98765 43210' },
    platformCommissionPercent: { type: Number, default: 10, min: 0, max: 50 },
    defaultCampaignDurationDays: { type: Number, default: 30, min: 1 },
    autoApproveVehicles: { type: Boolean, default: false },
    maintenanceMode: { type: Boolean, default: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
)

const PlatformSettings: Model<IPlatformSettings> =
  mongoose.models.PlatformSettings || mongoose.model<IPlatformSettings>('PlatformSettings', PlatformSettingsSchema)

export default PlatformSettings
