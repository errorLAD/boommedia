import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IBrandProfile extends Document {
  userId: mongoose.Types.ObjectId
  companyName: string
  contactPerson: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  industry: string
  website?: string
  description?: string
  logo?: string
  gstNumber?: string
  socialLinks?: {
    instagram?: string
    facebook?: string
    youtube?: string
    linkedin?: string
  }
  teamMembers: Array<{
    userId: mongoose.Types.ObjectId
    role: string
    addedAt: Date
  }>
  totalCampaigns: number
  totalSpend: number
  rating: number
  reviewCount: number
  isVerified: boolean
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

const TeamMemberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      default: 'MEMBER',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
)

const SocialLinksSchema = new Schema(
  {
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    youtube: { type: String, trim: true },
    linkedin: { type: String, trim: true },
  },
  { _id: false }
)

const BrandProfileSchema = new Schema<IBrandProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: 'India',
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    socialLinks: {
      type: SocialLinksSchema,
      default: {},
    },
    teamMembers: {
      type: [TeamMemberSchema],
      default: [],
    },
    totalCampaigns: {
      type: Number,
      default: 0,
    },
    totalSpend: {
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
    isVerified: {
      type: Boolean,
      default: false,
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

// Indexes
BrandProfileSchema.index({ userId: 1 }, { unique: true })
BrandProfileSchema.index({ industry: 1 })
BrandProfileSchema.index({ isVerified: 1 })
BrandProfileSchema.index({ state: 1, city: 1 })
BrandProfileSchema.index({ isDeleted: 1 })
BrandProfileSchema.index({ companyName: 'text', description: 'text' })

const BrandProfile: Model<IBrandProfile> =
  mongoose.models.BrandProfile ||
  mongoose.model<IBrandProfile>('BrandProfile', BrandProfileSchema)

export default BrandProfile
