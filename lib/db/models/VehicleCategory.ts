import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IVehicleCategory extends Document {
  key: string
  name: string
  tagline: string
  shortDescription: string
  advertisingLocations: string[]
  exampleUseCase: string
  imageUrl: string
  ctaLabel: string
  displayOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const VehicleCategorySchema = new Schema<IVehicleCategory>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    advertisingLocations: {
      type: [String],
      default: [],
    },
    exampleUseCase: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    ctaLabel: {
      type: String,
      default: 'Request This Vehicle',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

VehicleCategorySchema.index({ displayOrder: 1, isActive: 1 })

export { DEFAULT_VEHICLE_CATEGORIES } from '@/lib/types/vehicleAds'

const VehicleCategory: Model<IVehicleCategory> =
  mongoose.models.VehicleCategory ||
  mongoose.model<IVehicleCategory>('VehicleCategory', VehicleCategorySchema)

export default VehicleCategory
