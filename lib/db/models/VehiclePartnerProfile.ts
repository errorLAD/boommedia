import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IVehiclePartnerProfile extends Document {
  userId: mongoose.Types.ObjectId
  companyName?: string
  businessType?: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  bio?: string
  profileImage?: string
  city: string
  state: string
  operatingCities: string[]
  fleetTypes: string[]
  fleetSize: number
  totalVehicles: number
  activeVehicles: number
  totalEarnings: number
  pendingEarnings: number
  availableBalance: number
  completedCampaigns: number
  rating: number
  reviewCount: number
  bankDetails: {
    accountNumber?: string
    ifscCode?: string
    bankName?: string
    accountHolderName?: string
    upiId?: string
  }
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED'
  isVerified?: boolean
  documents: Array<{
    type: string
    url: string
    name?: string
    status?: string
    uploadedAt: Date
  }>
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

const BankDetailsSchema = new Schema(
  {
    accountNumber: { type: String, trim: true },
    ifscCode: { type: String, trim: true, uppercase: true },
    bankName: { type: String, trim: true },
    accountHolderName: { type: String, trim: true },
    upiId: { type: String, trim: true },
  },
  { _id: false }
)

const DocumentSchema = new Schema(
  {
    type: { type: String, required: true },
    url: { type: String, required: true },
    name: { type: String },
    status: { type: String, default: 'PENDING' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
)

const VehiclePartnerProfileSchema = new Schema<IVehiclePartnerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    companyName: { type: String, trim: true },
    businessType: { type: String, trim: true },
    contactPerson: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    profileImage: { type: String },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    operatingCities: {
      type: [String],
      default: [],
    },
    fleetTypes: {
      type: [String],
      default: [],
    },
    fleetSize: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalVehicles: {
      type: Number,
      default: 0,
    },
    activeVehicles: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    pendingEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedCampaigns: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    bankDetails: {
      type: BankDetailsSchema,
      default: {},
    },
    verificationStatus: {
      type: String,
      enum: ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'],
      default: 'UNVERIFIED',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    documents: {
      type: [DocumentSchema],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

VehiclePartnerProfileSchema.index({ userId: 1 }, { unique: true })
VehiclePartnerProfileSchema.index({ city: 1 })
VehiclePartnerProfileSchema.index({ state: 1 })
VehiclePartnerProfileSchema.index({ verificationStatus: 1 })
VehiclePartnerProfileSchema.index({ isDeleted: 1 })

const VehiclePartnerProfile: Model<IVehiclePartnerProfile> =
  mongoose.models.VehiclePartnerProfile ||
  mongoose.model<IVehiclePartnerProfile>(
    'VehiclePartnerProfile',
    VehiclePartnerProfileSchema
  )

export default VehiclePartnerProfile
